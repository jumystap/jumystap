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
                    <canvas id="myChartSpecializations"></canvas>
                    <canvas id="myChartCities"></canvas>
                    <canvas id="myChartCosts"></canvas>
                </div>
                <div class="card-footer clearfix">
                </div>

            </div>
        </div>
    </section>
@endsection
@push('scripts')

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
    <script>
        const xValues = {!! json_encode($data['announcementsBySpecializations']['name']) !!};
        const yValues = {!! json_encode($data['announcementsBySpecializations']['total']) !!};
        const barColors = xValues.map((_, i) =>
            ['red', 'green', 'blue', 'orange', 'brown', 'purple', 'cyan', 'magenta', 'yellow', 'teal'][i % 10]
        );

        new Chart("myChartSpecializations", {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: "Объявления по категориям специализации"
                    }
                }
            }
        });

        const xValues2 = {!! json_encode($data['announcementsByCities']['name']) !!};
        const yValues2 = {!! json_encode($data['announcementsByCities']['total']) !!};
        new Chart("myChartCities", {
            type: "bar",
            data: {
                labels: xValues2,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: "Объявления по городам"
                    }
                }
            }
        });

        const xValues3 = {!! json_encode($data['costAverages']['name']) !!};
        const yValues3 = {!! json_encode($data['costAverages']['total']) !!};
        new Chart("myChartCosts", {
            type: "bar",
            data: {
                labels: xValues3,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: "Средняя зарплата по категориям специализации"
                    }
                }
            }
        });
    </script>
@endpush

@push('stylesheets')
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endpush
