<?php

namespace Tests\Unit\Controllers;

use App\Http\Controllers\UserController;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Mockery;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    /** @test */
    public function it_can_display_employees_and_professions()
    {
        $userService = Mockery::mock(UserService::class);
        $userService->shouldReceive('getEmployees')->once()->andReturn(['employee1', 'employee2']);
        $userService->shouldReceive('getAllProfessions')->once()->andReturn(['profession1', 'profession2']);

        Inertia::shouldReceive('render')->with('Employees', [
            'employees' => ['employee1', 'employee2'],
            'professions' => ['profession1', 'profession2']
        ])->once();

        $controller = new UserController($userService);
        $controller->index();
    }

    /** @test */
    public function it_redirects_if_user_is_already_logged_in()
    {
        Auth::shouldReceive('check')->once()->andReturn(true);
        $controller = new UserController(Mockery::mock(UserService::class));

        $response = $controller->login();

        $this->assertInstanceOf(RedirectResponse::class, $response);
    }

    /** @test */
    public function it_displays_login_if_user_is_not_logged_in()
    {
        Auth::shouldReceive('check')->once()->andReturn(false);
        Inertia::shouldReceive('render')->with('Login')->once();

        $controller = new UserController(Mockery::mock(UserService::class));
        $controller->login();
    }

    /** @test */
    public function it_can_authenticate_user_with_valid_credentials()
    {
        $request = Request::create('/auth', 'POST', [
            'phone' => '123456789',
            'password' => 'password'
        ]);

        Auth::shouldReceive('attempt')->with([
            'phone' => '123456789',
            'password' => 'password'
        ])->once()->andReturn(true);

        $controller = new UserController(Mockery::mock(UserService::class));
        $response = $controller->auth($request);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(302, $response->getStatusCode()); // Check redirection to profile
    }

    /** @test */
    public function it_redirects_back_to_login_if_credentials_are_invalid()
    {
        $request = Request::create('/auth', 'POST', [
            'phone' => 'invalid',
            'password' => 'invalid_password'
        ]);

        Auth::shouldReceive('attempt')->with([
            'phone' => 'invalid',
            'password' => 'invalid_password'
        ])->once()->andReturn(false);

        $controller = new UserController(Mockery::mock(UserService::class));
        $response = $controller->auth($request);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(302, $response->getStatusCode()); // Check redirection to login
    }

    /** @test */
    public function it_can_store_user_and_redirect_to_profile()
    {
        $userService = Mockery::mock(UserService::class);
        $request = Request::create('/store', 'POST', [
            'phone' => '123456789',
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'role' => 'employee',
        ]);

        $user = new User();
        Auth::shouldReceive('login')->once()->with($user);
        $userService->shouldReceive('storeUser')->once()->andReturn($user);

        $controller = new UserController($userService);
        $response = $controller->store($request);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(302, $response->getStatusCode());
    }

    /** @test */
    public function it_can_show_user_profile_with_professions_and_portfolio()
    {
        $userService = Mockery::mock(UserService::class);
        $userService->shouldReceive('getUserWithProfessionsAndPortfolio')->with(1)->once()->andReturn(['user']);
        $userService->shouldReceive('getUserProfessions')->with(1)->once()->andReturn(['profession']);
        $userService->shouldReceive('getUsersByProfessionIds')->once()->andReturn(['employee']);

        Inertia::shouldReceive('render')->with('User', [
            'user' => ['user'],
            'employees' => ['employee'],
            'userProfessions' => ['profession']
        ])->once();

        $controller = new UserController($userService);
        $controller->show(1);
    }

    /** @test */
    public function it_can_rate_a_user()
    {
        $userService = Mockery::mock(UserService::class);
        $userService->shouldReceive('rateUser')->with(1, 5)->once()->andReturn(true);

        $controller = new UserController($userService);
        $response = $controller->rate(1, 5);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(302, $response->getStatusCode());
    }
}

