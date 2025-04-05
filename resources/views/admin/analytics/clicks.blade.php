@extends('admin.layouts.app')
@php
    $title = 'Аналитика по кликам';
    $count = $clicks->count();
    $page = request('page') ?? 1;
    $perPage = $clicks->perPage();
    $total = $clicks->total();
    $from = ($perPage * ($page - 1)) + 1;
    $to = $from + $count - 1;
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
                            <form action="{{ route('admin.analytics.clicks') }}" method="get">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="parameter_id">{{ __('Профессия') }}</label>
                                        <select name="search[parameter_id]" id="parameter_id" class="form-control">
                                            <option value>{{ __('Выберите') }}</option>
                                            @if($parameters)
                                                @foreach ($parameters as $parameter)
                                                    <option value="{{ $parameter->id }}"
                                                            @if (isset($search['parameter_id']) && $search['parameter_id'] == $parameter->id && $search['parameter_id'] != null) selected="selected" @endif>
                                                        {{ $parameter->title }}
                                                    </option>
                                                @endforeach
                                            @endif
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="phone">{{ __('Телефон') }}</label>
                                        <input type="text" id="phone" class="form-control" name="search[phone]"
                                               value="@if(isset($search['phone'])){{ $search['phone'] }}@endif">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="click_number">{{ __('Номер сертификата') }}</label>
                                        <input type="text" id="click_number" class="form-control" name="search[click_number]"
                                               value="@if(isset($search['click_number'])){{ $search['click_number'] }}@endif">
                                    </div>

                                    <div class="col-md-4">
                                        <label for="start_date">{{ __('Дата c') }}</label>
                                        <input type="text" id="start_date" class="form-control" name="search[start_date]"
                                               value="{{ $search['start_date'] ?? '' }}" autocomplete="off">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="end_date">{{ __('Дата по') }}</label>
                                        <input type="text" id="end_date" class="form-control" name="search[end_date]"
                                               value="{{ $search['end_date'] ?? '' }}" autocomplete="off">
                                    </div>
                                    <div class="col-md-12 mt-4">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-search fa-fw"></i>
                                            {{ __('Поиск') }}
                                        </button>
                                        <a type="button" href="{{ route('admin.analytics.clicks') }}"
                                           class="btn btn-outline-secondary">
                                            {{ __('Сбросить') }}
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            <small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $clicks->total() }}.</small>

                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th class="text-center" style="width: 80px;">#</th>
                                    <th>Параметр</th>
                                    <th>Создано</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($clicks as $click)
                                    <tr id="{{ $click->id }}" data-index="{{ $loop->index }}">
                                        <td>{{ $click->id }}</td>
                                        <td>{{ $click->parameter->title }}</td>
                                        <td>{{ $click->created_at }}</td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer clearfix">
                            @if ($clicks->hasPages())
                                {{ $clicks->links() }}
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
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endpush
