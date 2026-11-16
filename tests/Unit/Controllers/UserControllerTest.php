<?php

namespace Tests\Unit\Controllers;

use App\Http\Controllers\UserController;
use App\Models\User;
use App\Services\AnnouncementService;
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
        $userService->shouldReceive('getEmployees')->with(['search' => 'php'])->once()->andReturn(['employee1', 'employee2']);
        $userService->shouldReceive('getAllProfessions')->once()->andReturn(['profession1', 'profession2']);

        // professions и cities — ленивые пропсы (замыкания), Inertia вычисляет их при рендере.
        Inertia::shouldReceive('render')->with('Employees', Mockery::on(fn (array $props) => $props['employees'] === ['employee1', 'employee2']
            && $props['filters'] === ['search' => 'php']
            && ($props['professions'])() === ['profession1', 'profession2']
        ))->once();

        $controller = new UserController($userService, Mockery::mock(AnnouncementService::class));
        $controller->index(Request::create('/employees', 'GET', ['search' => 'php', 'unknown' => 'x']));
    }

    /** @test */
    public function it_redirects_if_user_is_already_logged_in()
    {
        Auth::shouldReceive('check')->once()->andReturn(true);
        $controller = new UserController(Mockery::mock(UserService::class), Mockery::mock(AnnouncementService::class));

        $response = $controller->login();

        $this->assertInstanceOf(RedirectResponse::class, $response);
    }

    /** @test */
    public function it_displays_login_if_user_is_not_logged_in()
    {
        Auth::shouldReceive('check')->once()->andReturn(false);
        Inertia::shouldReceive('render')->with('Login', ['redirect' => null])->once();

        $controller = new UserController(Mockery::mock(UserService::class), Mockery::mock(AnnouncementService::class));
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
        // После входа контроллер проверяет блокировку аккаунта.
        Auth::shouldReceive('user')->once()->andReturn((new User)->forceFill(['is_blocked' => false]));

        $controller = new UserController(Mockery::mock(UserService::class), Mockery::mock(AnnouncementService::class));
        $response = $controller->auth($request);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(302, $response->getStatusCode());
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

        $controller = new UserController(Mockery::mock(UserService::class), Mockery::mock(AnnouncementService::class));
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
        $userService->shouldReceive('determineUserStatuses')->once()->andReturn([]);
        $userService->shouldReceive('storeUser')->once()->andReturn($user);
        // Валидация unique:users обращается к БД — подменяем проверку присутствия.
        $verifier = Mockery::mock(\Illuminate\Validation\PresenceVerifierInterface::class);
        $verifier->shouldReceive('setConnection');
        $verifier->shouldReceive('getCount')->andReturn(0);
        app('validator')->setPresenceVerifier($verifier);

        $controller = new UserController($userService, Mockery::mock(AnnouncementService::class));
        $response = $controller->store($request);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertSame(url('/profile'), $response->getTargetUrl());
    }

    /** @test */
    public function it_can_rate_a_user()
    {
        $userService = Mockery::mock(UserService::class);
        $userService->shouldReceive('rateUser')->with(1, 5)->once()->andReturn(true);

        $controller = new UserController($userService, Mockery::mock(AnnouncementService::class));
        $response = $controller->rate(1, 5);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(302, $response->getStatusCode());
    }
}

