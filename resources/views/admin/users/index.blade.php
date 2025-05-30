@extends('admin.layouts.app')
@php
    $title = 'Пользователи';
@endphp
@section('title', $title)

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
                    <!-- Default box -->
                    <div class="card">
                        <div class="card-header">
                        </div>
                        <div class="card-body">
                            <form action="{{ route('admin.users.index') }}" method="get">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="name">{{ __('ФИО') }}</label>
                                        <input type="text" id="name" class="form-control" name="search[name]"
                                               value="@if(isset($search['name']))@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="phone">{{ __('Телефон') }}</label>
                                        <input type="text" id="phone" class="form-control" name="search[phone]"
                                               value="@if(isset($search['phone'])){{ $search['phone'] }}@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="email">{{ __('Email') }}</label>
                                        <input type="text" id="email" class="form-control" name="search[email]"
                                               value="@if(isset($search['email'])){{ $search['email'] }}@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="role_id">{{ __('Роль') }}</label>
                                        <select name="search[role_id]" id="role_id" class="form-control">
                                            <option value>{{ __('Выберите статус') }}</option>
                                            @if($roles)
                                                @foreach ($roles as $role)
                                                    <option value="{{ $role->id }}"
                                                            @if (isset($search['role_id']) && $search['role_id'] == $role->id && $search['role_id'] != null) selected="selected" @endif>
                                                        {{ $role->name_ru }}
                                                    </option>
                                                @endforeach
                                            @endif
                                        </select>
                                    </div>
{{--                                    <div class="col-md-3">--}}
{{--                                        <br/>--}}
{{--                                        <label for="is_graduate">{{ __('Выпускник') }}</label>--}}
{{--                                        @if (isset($search['is_graduate']) && $search['is_graduate'] == 'on')--}}
{{--                                            <input type="checkbox" name="search[is_graduate]" checked>--}}
{{--                                        @else--}}
{{--                                            <input type="checkbox" name="search[is_graduate]">--}}
{{--                                        @endif--}}
{{--                                    </div>--}}
                                    <div class="col-md-12 mt-4">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-search fa-fw"></i>
                                            {{ __('Поиск') }}
                                        </button>
                                        <a type="button" href="{{ route('admin.users.index') }}"
                                           class="btn btn-outline-secondary">
                                            {{ __('Сбросить') }}
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            @include('admin.partials.errors')
                            @include('admin.users._table')
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer clearfix">
                            @if ($users->hasPages())
                                {{ $users->links() }}
                            @endif
                        </div>
                    </div>
                </div>
                <!-- /.card -->
            </div>
        </div>
        </div>

    </section>

@endsection
