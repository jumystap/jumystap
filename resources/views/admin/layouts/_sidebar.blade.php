@php
    use App\Enums\Roles;
@endphp

<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="{{ route('admin.index') }}" class="brand-link text-center">
        <span class="brand-text text-bold">{{ config('app.name', 'Laravel') }}</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li class="nav-item">
                    <a href="{{ route('admin.index') }}" class="nav-link {{ route('admin.index') == request()->url() ? 'active' : '' }}">
                        <i class="nav-icon fas fa-tachometer-alt"></i>
                        <p>Главная</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('admin.users.index') }}" class="nav-link {{ request()->routeIs('admin.users.*') ? 'active' : '' }}">
                        <i class="nav-icon fas fa-users"></i>
                        <p>Пользователи</p>
                    </a>
                </li>
                @if(Auth::user()->hasRole(Roles::ADMIN))
                    <li class="nav-item">
                        <a href="{{ route('admin.announcements.index') }}" class="nav-link {{ request()->routeIs('admin.announcements.*') ? 'active' : '' }}">
                            <i class="nav-icon fas fa-star"></i>
                            <p>Вакансии</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{ route('admin.responses.index') }}" class="nav-link {{ request()->routeIs('admin.responses.*') ? 'active' : '' }}">
                            <i class="nav-icon fas fa-user-plus"></i>
                            <p>Отклики</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{ route('admin.certificates.index') }}" class="nav-link {{ request()->routeIs('admin.certificates.*') ? 'active' : '' }}">
                            <i class="nav-icon fas fa-file"></i>
                            <p>Сертификаты</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{ route('admin.analytics.clicks') }}" class="nav-link {{ request()->routeIs('admin.analytics.clicks.*') ? 'active' : '' }}">
                            <i class="nav-icon fas fa-box"></i>
                            <p>Аналитика по кликам</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{ route('admin.ads.index') }}" class="nav-link {{ request()->routeIs('admin.ads.*') ? 'active' : '' }}">
                            <i class="nav-icon fas fa-images"></i>
                            <p>Объявления</p>
                        </a>
                    </li>
                @endif
                <li class="nav-item">
                    <a href="{{ route('home') }}" class="nav-link" target="_blank">
                        <i class="nav-icon fas fa-home"></i>
                        <p>Перейти на сайт</p>
                    </a>
                </li>
            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>
