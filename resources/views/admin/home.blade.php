@extends('admin.layouts.app')
@php
    use App\Helpers\TextHelper;
    use App\Enums\Roles;
    use App\Enums\AnnouncementStatus;
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
            {{--            <div class="row">--}}
            {{--                <div class="col-12">--}}
            {{--                    <div class="callout callout-info">--}}
            {{--                        <h5>Добро пожаловать в Административную часть портала!</h5>--}}
            {{--                    </div>--}}
            {{--                </div>--}}
            {{--            </div>--}}
            <div class="card">
                <div class="card-header">
                    <form action="{{ route('admin.index') }}" method="get">
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
                                <a type="button" href="{{ route('admin.index') }}"
                                   class="btn btn-outline-secondary">
                                    {{ __('Сбросить') }}
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6">
                                    <a href="{{ route('admin.users.index', ['search' => ['start_date' => $search['start_date'], 'end_date' => $search['end_date']]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Количество пользователей</small>
                                                <h3>{{ TextHelper::numberFormat($data['usersCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-person-stalker"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-6">
                                    <a href="{{ route('admin.users.index', ['search' => ['start_date' => date('d.m.Y')]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Новые пользователи на сегодня</small>
                                                <h3>{{ TextHelper::numberFormat($data['registeredTodayCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-person-add"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-6">
                                    <a href="{{ route('admin.users.index', ['search' => ['roles_id' => [Roles::EMPLOYER, Roles::COMPANY], 'start_date' => $search['start_date'], 'end_date' => $search['end_date']]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Количество работодателей</small>
                                                <h3>{{ TextHelper::numberFormat($data['allEmployersCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-briefcase"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-6">
                                    <a href="{{ route('admin.announcements.index', ['search' => ['start_date' => $search['start_date'], 'end_date' => $search['end_date']]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Количество активных вакансий</small>
                                                <h3>{{ TextHelper::numberFormat($data['announcementsCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-star"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-6">
                                    <a href="{{ route('admin.users.index', ['search' => ['roles_id' => [Roles::EMPLOYEE], 'start_date' => $search['start_date'], 'end_date' => $search['end_date']]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Количество соискателей</small>
                                                <h3>{{ TextHelper::numberFormat($data['allEmployeesCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-person"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-6">
                                    <a href="{{ route('admin.users.index', ['search' => ['role_id' => Roles::EMPLOYEE->value, 'start_date' => $search['start_date'], 'end_date' => $search['end_date']]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Количество выпускников JOLTAP</small>
                                                <h3>{{ TextHelper::numberFormat($data['graduatesCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-university"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-6">
                                    <a href="{{ route('admin.responses.index', ['search' => ['start_date' => $search['start_date'], 'end_date' => $search['end_date']]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Количество откликов</small>
                                                <h3>{{ TextHelper::numberFormat($data['responsesCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-stats-bars"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-md-6">
                                    <a href="{{ route('admin.responses.index', ['search' => ['start_date' => $search['start_date']]]) }}">
                                        <div class="small-box">
                                            <div class="inner">
                                                <small>Сегодня откликнулись</small>
                                                <h3>{{ TextHelper::numberFormat($data['responsesTodayCount']) }}</h3>
                                            </div>
                                            <div class="icon">
                                                <i class="ion ion-arrow-graph-up-right"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="row">

                            </div>

                        </div>
                        <div class="col-md-6">
                            <p class="text-center text-bold">Количество вакансий по городам</p>
                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th class="text-center" style="width: 80px;">#</th>
                                    <th>Город</th>
                                    <th>Количество</th>
                                </tr>
                                </thead>
                                <tbody>
                                @php $i = 1; @endphp
                                @foreach($data['announcementsByCities'] as $item)
                                    <tr>
                                        <td>{{ $i++ }}</td>
                                        <td>{{ $item->city }}</td>
                                        <td>{{ $item->total }}</td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <p class="text-center text-bold"></p>
                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th class="text-center" style="width: 80px;">#</th>
                                    <th>Категория</th>
                                    <th>Количество вакансий, шт</th>
                                    <th>Средняя зарплата, тг</th>
                                </tr>
                                </thead>
                                <tbody>
                                @php $i = 1; @endphp
                                @foreach($data['combinedData'] as $item)
                                    <tr>
                                        <td>{{ $i++ }}</td>
                                        <td>{{ $item['name'] }}</td>
                                        <td>{{ $item['total'] }}</td>
                                        <td>{{ $item['average_salary'] }}</td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card-footer clearfix">
                </div>

            </div>
        </div>
    </section>
@endsection
@push('scripts')

    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
    <script>
        var startDate,
            endDate,
            updateStartDate = function () {
                startPicker.setStartRange(startDate);
                endPicker.setStartRange(startDate);
                endPicker.setMinDate(startDate);
            },
            updateEndDate = function () {
                startPicker.setEndRange(endDate);
                startPicker.setMaxDate(endDate);
                endPicker.setEndRange(endDate);
            },
            startPicker = new Pikaday({
                field: document.getElementById('start_date'),
                format: 'DD.MM.YYYY',
                onSelect: function () {
                    startDate = this.getDate();
                    updateStartDate();
                }
            }),
            endPicker = new Pikaday({
                field: document.getElementById('end_date'),
                format: 'DD.MM.YYYY',
                onSelect: function () {
                    endDate = this.getDate();
                    updateEndDate();
                }
            }),
            _startDate = startPicker.getDate(),
            _endDate = endPicker.getDate();

        if (_startDate) {
            startDate = _startDate;
            updateStartDate();
        }

        if (_endDate) {
            endDate = _endDate;
            updateEndDate();
        }
    </script>
@endpush

@push('stylesheets')
    <style>
        .table {
            font-size: 15px;
        }

        .table td, .table th {
            padding: 0 0.75rem;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endpush
