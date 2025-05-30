@extends('admin.layouts.app')
@php
    $title = 'Главная';
@endphp
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

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="callout callout-info">
                        <h5>Добро пожаловать в Административную часть портала!</h5>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-3">
                            <input type="text" id="start_date" class="form-control" name="search[start_date]"
                                   value="{{ $search['start_date'] ?? '' }}" autocomplete="off"
                                   placeholder="Дата c">
                        </div>
                        <div class="col-md-3">
                            <input type="text" id="end_date" class="form-control" name="search[end_date]"
                                   value="{{ $search['end_date'] ?? '' }}" autocomplete="off" placeholder="Дата по">
                        </div>
                        <div class="col-md-3">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search fa-fw"></i>
                                {{ __('Поиск') }}
                            </button>
                            <a type="button" href="{{ route('admin.certificates.index') }}"
                               class="btn btn-outline-secondary">
                                {{ __('Сбросить') }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество пользователей</small>
                                    <h3>{{ $data['usersCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-person-stalker"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество всех работодателей</small>
                                    <h3>{{ $data['allEmployersCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-briefcase"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество работодателей</small>
                                    <h3>{{ $data['employerCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-gear-b"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество заказчиков</small>
                                    <h3>{{ $data['companyCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-gear-a"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество соискателей</small>
                                    <h3>{{ $data['allEmployeesCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-person"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество выпускников</small>
                                    <h3>{{ $data['graduatesCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-university"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество не выпускников</small>
                                    <h3>{{ $data['nonGraduatesCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-man"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Новые пользователи на сегодня</small>
                                    <h3>{{ $data['registeredTodayCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-person-add"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество активных вакансий</small>
                                    <h3>{{ $data['announcementsCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-star"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Количество откликов</small>
                                    <h3>{{ $data['responsesCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-stats-bars"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="small-box">
                                <div class="inner">
                                    <small>Сегодня откликнулись</small>
                                    <h3>{{ $data['responsesTodayCount'] }}</h3>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-arrow-graph-up-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer clearfix">
                </div>

            </div>
        </div>
    </section>
@endsection
