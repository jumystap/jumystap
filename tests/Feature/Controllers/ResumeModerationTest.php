<?php

use App\Enums\ResumeStatus;
use App\Enums\Roles;
use App\Models\User;
use App\Models\UserResume;
use Inertia\Testing\AssertableInertia as Assert;

test('guest cannot view a resume that is on moderation', function () {
    $resume = createUserResume(['status' => ResumeStatus::MODERATION]);

    $this->get("/resumes/{$resume->id}")
        ->assertInertia(fn (Assert $page) => $page->component('NotFound'));
});

test('guest cannot view a rejected resume', function () {
    $resume = createUserResume(['status' => ResumeStatus::REJECTED]);

    $this->get("/resumes/{$resume->id}")
        ->assertInertia(fn (Assert $page) => $page->component('NotFound'));
});

test('anyone can view an active resume', function () {
    $resume = createUserResume(['status' => ResumeStatus::ACTIVE]);

    $this->get("/resumes/{$resume->id}")
        ->assertInertia(fn (Assert $page) => $page->component('Resume'));
});

test('owner can view their own resume while on moderation', function () {
    $owner  = makeUser(Roles::EMPLOYEE->value);
    $resume = createUserResume(['user' => $owner, 'status' => ResumeStatus::MODERATION]);

    $this->actingAs($owner)
        ->get("/resumes/{$resume->id}")
        ->assertInertia(fn (Assert $page) => $page->component('Resume'));
});

test('creating a resume puts it on moderation', function () {
    $user = makeUser(Roles::EMPLOYEE->value);

    $this->actingAs($user)->post('/resumes/create', [
        'phone'              => '77001234567',
        'city'               => 'Астана',
        'position'           => 'PHP Developer',
        'education_level_id' => 4,
        'languages'          => [],
        'skills'             => [],
        'about'              => 'About me',
    ])->assertRedirect('/profile');

    $resume = UserResume::where('user_id', $user->id)->first();

    expect($resume)->not->toBeNull()
        ->and($resume->status)->toBe(ResumeStatus::MODERATION);
});

test('editing an active resume sends it back to moderation', function () {
    $owner  = makeUser(Roles::EMPLOYEE->value);
    $resume = createUserResume([
        'user'          => $owner,
        'status'        => ResumeStatus::ACTIVE,
        'reject_reason' => 'old reason',
    ]);

    $this->actingAs($owner)->put("/resumes/{$resume->id}", [
        'phone'              => '77001234567',
        'city'               => 'Алматы',
        'position'           => 'Senior Developer',
        'education_level_id' => 4,
        'organizations'      => [],
        'languages'          => [],
        'skills'             => [],
        'about'              => 'Updated',
    ])->assertRedirect('/profile');

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::MODERATION)
        ->and($resume->city)->toBe('Алматы')
        ->and($resume->reject_reason)->toBeNull();
});

test('admin can approve a resume', function () {
    $admin  = makeUser(Roles::ADMIN->value);
    $resume = createUserResume(['status' => ResumeStatus::MODERATION]);

    $this->actingAs($admin)
        ->post("/admin/resumes/{$resume->id}/approve")
        ->assertRedirect();

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::ACTIVE)
        ->and($resume->published_at)->not->toBeNull();

    $this->assertDatabaseHas('resume_status_histories', [
        'user_resume_id' => $resume->id,
        'status_to'      => 'active',
    ]);
});

test('admin can reject a resume with a reason', function () {
    $admin  = makeUser(Roles::ADMIN->value);
    $resume = createUserResume(['status' => ResumeStatus::MODERATION]);

    $this->actingAs($admin)
        ->post("/admin/resumes/{$resume->id}/reject", ['reason' => 'Недостаточно информации'])
        ->assertRedirect();

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::REJECTED)
        ->and($resume->reject_reason)->toBe('Недостаточно информации');
});

test('admin can edit resume content and publish it', function () {
    $admin  = makeUser(Roles::ADMIN->value);
    $resume = createUserResume(['status' => ResumeStatus::MODERATION]);

    $this->actingAs($admin)->put("/admin/resumes/{$resume->id}", [
        'position' => 'Edited position',
        'phone'    => '77009998877',
        'city'     => 'Шымкент',
        'about'    => 'Edited about',
        'status'   => 'active',
        'skills'   => ['PHP', 'Laravel'],
    ])->assertRedirect();

    $resume->refresh();

    expect($resume->position)->toBe('Edited position')
        ->and($resume->status)->toBe(ResumeStatus::ACTIVE)
        ->and($resume->published_at)->not->toBeNull();
});

test('admin moderation pages render', function () {
    $admin  = makeUser(Roles::ADMIN->value);
    $resume = createUserResume(['status' => ResumeStatus::MODERATION]);

    $this->actingAs($admin)->get('/admin/resumes')->assertOk();
    $this->actingAs($admin)->get("/admin/resumes/{$resume->id}")->assertOk();
    $this->actingAs($admin)->get("/admin/resumes/{$resume->id}/edit")->assertOk();
});

test('editing a resume already on moderation does not duplicate history or notification', function () {
    $owner  = makeUser(Roles::EMPLOYEE->value);
    $resume = createUserResume(['user' => $owner, 'status' => ResumeStatus::MODERATION]);

    $this->actingAs($owner)->put("/resumes/{$resume->id}", [
        'phone'              => '77001234567',
        'city'               => 'Астана',
        'position'           => 'PHP Developer',
        'education_level_id' => 4,
        'organizations'      => [],
        'languages'          => [],
        'skills'             => [],
        'about'              => 'Updated while pending',
    ])->assertRedirect('/profile');

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::MODERATION)
        ->and($resume->about)->toBe('Updated while pending')
        ->and($resume->statusHistory()->count())->toBe(0);
});

test('admin rejecting via edit form stores the reason for the owner', function () {
    $admin  = makeUser(Roles::ADMIN->value);
    $resume = createUserResume(['status' => ResumeStatus::MODERATION]);

    $this->actingAs($admin)->put("/admin/resumes/{$resume->id}", [
        'position'       => 'PHP Developer',
        'phone'          => '77001234567',
        'city'           => 'Астана',
        'about'          => 'About',
        'status'         => 'rejected',
        'status_comment' => 'Некорректные данные',
    ])->assertRedirect();

    $resume->refresh();

    expect($resume->status)->toBe(ResumeStatus::REJECTED)
        ->and($resume->reject_reason)->toBe('Некорректные данные');
});

test('user cannot update someone elses resume', function () {
    $owner    = makeUser(Roles::EMPLOYEE->value);
    $stranger = makeUser(Roles::EMPLOYEE->value);
    $resume   = createUserResume(['user' => $owner, 'status' => ResumeStatus::ACTIVE]);

    $this->actingAs($stranger)->put("/resumes/{$resume->id}", [
        'phone'              => '77001234567',
        'city'               => 'Алматы',
        'position'           => 'Hacker',
        'education_level_id' => 4,
        'organizations'      => [],
        'languages'          => [],
        'skills'             => [],
        'about'              => 'x',
    ])->assertForbidden();

    expect($resume->refresh()->status)->toBe(ResumeStatus::ACTIVE);
});

test('user cannot delete someone elses resume', function () {
    $owner    = makeUser(Roles::EMPLOYEE->value);
    $stranger = makeUser(Roles::EMPLOYEE->value);
    $resume   = createUserResume(['user' => $owner]);

    $this->actingAs($stranger)->delete("/resumes/{$resume->id}")->assertForbidden();

    $this->assertDatabaseHas('user_resumes', ['id' => $resume->id]);
});

test('non admin cannot access resume moderation', function () {
    $user = makeUser(Roles::EMPLOYEE->value);

    $this->actingAs($user)
        ->get('/admin/resumes')
        ->assertRedirect(route('admin.login'));
});
