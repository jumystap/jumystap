<?php

namespace Tests\Unit\Repositories;

use App\Enums\Roles;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserRepositoryTest extends TestCase
{
    use RefreshDatabase;

    // Профессия ссылается на группу (FK), а репозиторий джойнит professions — нужна настоящая запись.
    private function makeProfession(): int
    {
        $groupId = DB::table('group_professions')->insertGetId(['name' => 'Группа']);

        return DB::table('professions')->insertGetId([
            'group_id' => $groupId, 'name_ru' => 'Бариста', 'name_kz' => 'Бариста',
            'release_count' => 0, 'icon_url' => '', 'video_url' => '', 'type' => 'work',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** @test */
    public function it_can_get_users_by_role_name()
    {
        $employee = User::factory()->role(Roles::EMPLOYEE)->create();
        User::factory()->role(Roles::EMPLOYER)->create();

        $repository = new UserRepository();
        $users = $repository->getUsersByRoleName('employee', 10);

        $this->assertCount(1, $users);
        $this->assertEquals($employee->id, $users->first()->id);
        $this->assertEquals('employee', $users->first()->role->name);
    }

    /** @test */
    public function it_can_get_user_with_professions()
    {
        $user = User::factory()->create();
        DB::table('user_professions')->insert([
            'user_id' => $user->id,
            'profession_id' => $this->makeProfession(),
            'certificate_number' => '12345'
        ]);

        $repository = new UserRepository();
        $professions = $repository->getUserWithProfessions($user->id);

        $this->assertCount(1, $professions);
        $this->assertEquals('12345', $professions->first()->certificate_number);
    }

    /** @test */
    public function it_can_create_a_user()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'password' => 'password',
            'phone' => '123456789',
            'role_id' => User::factory()->role(Roles::EMPLOYEE)->make()->role_id,
        ];

        $repository = new UserRepository();
        $user = $repository->createUser($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertDatabaseHas('users', ['email' => 'johndoe@example.com']);
    }

    /** @test */
    public function it_can_update_a_user()
    {
        $user = User::factory()->create();
        $repository = new UserRepository();

        $updatedData = ['name' => 'Updated Name'];
        $repository->updateUser($user, $updatedData);

        $this->assertEquals('Updated Name', $user->fresh()->name);
    }

    /** @test */
    public function it_can_add_user_profession()
    {
        $user = User::factory()->create();
        $repository = new UserRepository();

        $professionId = $this->makeProfession();
        $repository->addUserProfession($user->id, $professionId, '12345');
        $this->assertDatabaseHas('user_professions', ['user_id' => $user->id, 'profession_id' => $professionId]);
    }

    /** @test */
    public function it_can_delete_user_professions()
    {
        $user = User::factory()->create();
        DB::table('user_professions')->insert([
            'user_id' => $user->id,
            'profession_id' => $this->makeProfession(),
            'certificate_number' => '12345',
        ]);

        $repository = new UserRepository();
        $repository->deleteUserProfessions($user->id);

        $this->assertDatabaseMissing('user_professions', ['user_id' => $user->id]);
    }

    /** @test */
    public function it_can_find_users_by_profession_ids()
    {
        $user = User::factory()->create();
        $professionId = $this->makeProfession();
        DB::table('user_professions')->insert([
            'user_id' => $user->id,
            'profession_id' => $professionId,
            'certificate_number' => '12345',
        ]);

        $repository = new UserRepository();
        $users = $repository->findUsersByProfessionIds([$professionId]);

        $this->assertCount(1, $users);
        $this->assertEquals($user->id, $users->first()->id);
    }
}

