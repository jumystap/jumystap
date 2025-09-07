@extends('admin.layouts.app')
@php
    $title = 'Профиль';
@endphp
@section('title', trans('Профиль'))

@section('content')

    <!-- Content Header (Page header) -->
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>{{ $title }}</h1>
                </div>
                <div class="col-sm-6">
                    @include('admin.partials.breadcrumbs', [
                        'first' => $title,
                        'active' => 1
                    ])
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">

        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card card-statistics">
                        <div class="card-body p-0">
                            <div class="row no-gutters">

                                <div class="col-xl-3 pb-xl-0 pb-5 border-right">
                                    <div class="page-account-profil pt-5">
                                        <div class="profile-img text-center rounded-circle">
                                            <div class="pt-5">
                                                <div class="profile pt-4">
                                                    <h4 class="mb-1">
                                                        {{ \Auth::user()->name }}
                                                    </h4>
                                                    <p>
                                                        {{ \Auth::user()->email }}
                                                    </p>
                                                    <p>
                                                        {{ '+' .  \Auth::user()->phone }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div class="col-xl-9 col-md-6 col-12 border-t border-right">
                                    <div class="page-account-form">
                                        <div class="form-titel border-bottom p-3">
                                            <h5 class="mb-0 py-2">
                                                @lang('Измените свои личные настройки')
                                            </h5>
                                        </div>
                                        <div class="p-4">

                                            @include('admin.partials.errors')

                                            <form action="{{ route('admin.account.update') }}" method="post"
                                                  enctype="multipart/form-data">
                                                @csrf
                                                @method('PUT')

                                                <div class="card-body">
                                                    <div class="form-group">
                                                        <label for="name">{{ __('Имя') }}</label>
                                                        <input name="name" id="name" type="text"
                                                               class="form-control @error('name') is-invalid @enderror"
                                                               value="{{ old('name', \Auth::user()->name ?? null) }}">

                                                        @error('name')
                                                        <span class="invalid-feedback">{{ $message }}</span>
                                                        @enderror
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="name">{{ __('Пароль') }}</label>
                                                        <input name="password" id="password" type="password"
                                                               class="form-control @error('password') is-invalid @enderror"
                                                               value="{{ old('password') }}">

                                                        @error('password')
                                                        <span class="invalid-feedback">{{ $message }}</span>
                                                        @enderror
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="name">{{ __('Подтвердить пароль') }}</label>
                                                        <input name="password_confirmation" id="password_confirmation"
                                                               type="password"
                                                               class="form-control @error('password_confirmation') is-invalid @enderror"
                                                               value="{{ old('password_confirmation') }}">

                                                        @error('password_confirmation')
                                                        <span class="invalid-feedback">{{ $message }}</span>
                                                        @enderror
                                                    </div>
                                                </div>

                                                <div class="card-footer">
                                                    <button type="submit"
                                                            class="btn btn-success font-weight-bold float-right">
                                                        <i class="fas fa-check-circle fa-fw"></i>
                                                        {{ __('Сохранить') }}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
    <!-- /.content -->

@stop

