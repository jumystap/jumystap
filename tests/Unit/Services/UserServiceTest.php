<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\UserService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    /** @test */
    public function it_can_get_all_employees()
    {
        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('getUsersByRoleName')
            ->with('employee', 20)
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

        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('createUser')->once()->andReturn(new User(['id' => 1]));

        $service = new UserService($userRepository);
        $user = $service->storeUser($data);

        $this->assertInstanceOf(User::class, $user);
    }

    /** @test */
    public function it_can_update_a_user()
    {
        $user = new User(['id' => 1, 'name' => 'John Doe']);

        $userRepository = Mockery::mock(UserRepository::class);
        $userRepository->shouldReceive('updateUser')->once()->andReturn(true);

        $service = new UserService($userRepository);

        $updatedData = ['name' => 'Updated Name'];
        $updatedUser = $service->updateUser($user, $updatedData);

        $this->assertEquals('Updated Name', $updatedUser->name);
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
        $file = Mockery::mock(\Illuminate\Http\UploadedFile::class);
        $file->shouldReceive('store')->once()->andReturn('avatars/avatar.png');
        $file->shouldReceive('getClientOriginalExtension')->andReturn('png');

        Storage::shouldReceive('disk')->with('public')->andReturnSelf();
        Storage::shouldReceive('path')->once()->andReturn('/path/to/avatar.png');
        Storage::shouldReceive('put')->once();
        Storage::shouldReceive('delete')->once();

        $service = new UserService(Mockery::mock(UserRepository::class));
        $path = $service->storeAvatar($file);

        $this->assertEquals('avatars/avatar.png', $path);
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

