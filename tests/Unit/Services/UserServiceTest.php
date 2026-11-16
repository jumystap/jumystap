<?php

namespace Tests\Unit\Services;

use App\Enums\Roles;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    // storeUser ищет роль по имени прямо в БД.
    use RefreshDatabase;

    /** @test */
    public function it_can_get_all_employees()
    {
        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('getUsersByRoleName')
            ->with('employee', 10, [])
            ->once()
            ->andReturn(['employee1', 'employee2']);

        $service = new UserService($userRepository);
        $employees = $service->getEmployees();

        $this->assertCount(2, $employees);
    }

    /** @test */
    public function it_can_store_a_new_user()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'password' => 'password',
            'avatar' => null,
            'role' => 'employee',
        ];

        DB::table('roles')->updateOrInsert(
            ['id' => Roles::EMPLOYEE->value],
            ['name' => 'employee', 'name_kz' => 'employee', 'name_ru' => 'employee']
        );
        // После создания сервис ищет сертификаты в Bitrix — внешний вызов подменён.
        Http::fake();

        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('createUser')
            ->once()
            ->with(Mockery::on(fn (array $attributes) => $attributes['role_id'] === Roles::EMPLOYEE->value
                && Hash::check('password', $attributes['password'])))
            ->andReturn((new User)->forceFill(['id' => 1, 'phone' => '77001234567']));

        $service = new UserService($userRepository);
        $user = $service->storeUser($data);

        $this->assertInstanceOf(User::class, $user);
    }

    /** @test */
    public function it_can_update_a_user()
    {
        $user = (new User)->forceFill(['id' => 1, 'name' => 'John Doe']);

        // Сохраняет репозиторий; пустой пароль не должен затирать текущий.
        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('updateUser')->once()->with($user, ['name' => 'Updated Name'])->andReturn(true);

        $service = new UserService($userRepository);

        $updatedUser = $service->updateUser($user, ['name' => 'Updated Name', 'password' => '']);

        $this->assertSame($user, $updatedUser);
    }

    /** @test */
    public function it_can_determine_user_statuses()
    {
        $data = [
            'ipStatus1' => 'no',
            'ipStatus2' => 'yes',
            'ipStatus3' => 'no'
        ];

        $service = new UserService(Mockery::mock(UserRepository::class));
        $statuses = $service->determineUserStatuses($data);

        $this->assertEquals('Нет ИП', $statuses['ip']);
        $this->assertEquals('В активном поиске', $statuses['status']);
        $this->assertEquals('Ищет заказы', $statuses['work_status']);
    }

    /** @test */
    public function it_can_store_an_avatar_and_optimize_image()
    {
        // storeAvatar защищённый — проверяем через публичный updateUser.
        Storage::fake('public');
        Storage::disk('public')->put('avatars/old.png', 'old');
        $user = (new User)->forceFill(['id' => 1, 'image_url' => 'avatars/old.png']);

        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('updateUser')
            ->once()
            ->with($user, Mockery::on(fn (array $attributes) => str_starts_with($attributes['image_url'], 'avatars/')))
            ->andReturnUsing(function ($user, array $attributes) {
                Storage::disk('public')->assertExists($attributes['image_url']);

                return true;
            });

        $service = new UserService($userRepository);
        $service->updateUser($user, ['avatar' => UploadedFile::fake()->image('avatar.png')]);

        // Старый аватар удаляется.
        Storage::disk('public')->assertMissing('avatars/old.png');
    }

    /** @test */
    public function it_can_get_users_by_profession_ids()
    {
        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('findUsersByProfessionIds')
            ->with([1, 2])
            ->once()
            ->andReturn(['user1', 'user2']);

        $service = new UserService($userRepository);
        $users = $service->getUsersByProfessionIds([1, 2]);

        $this->assertCount(2, $users);
    }
}

