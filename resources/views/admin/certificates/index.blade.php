@extends('admin.layouts.app')
@php
    $title = 'Сертификаты';
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
                            <form action="{{ route('admin.certificates.index') }}" method="get">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="profession_id">{{ __('Профессия') }}</label>
                                        <select name="search[profession_id]" id="profession_id" class="form-control">
                                            <option value>{{ __('Выберите') }}</option>
                                            @if($professions)
                                                @foreach ($professions as $profession)
                                                    <option value="{{ $profession->id }}"
                                                            @if (isset($search['profession_id']) && $search['profession_id'] == $profession->id && $search['profession_id'] != null) selected="selected" @endif>
                                                        {{ $profession->name_ru }}
                                                    </option>
                                                @endforeach
                                            @endif
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="name">{{ __('ФИО') }}</label>
                                        <input type="text" id="name" class="form-control" name="search[name]"
                                               value="@if(isset($search['name'])){{ $search['name'] }}@endif">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="phone">{{ __('Телефон') }}</label>
                                        <input type="text" id="phone" class="form-control" name="search[phone]"
                                               value="@if(isset($search['phone'])){{ $search['phone'] }}@endif">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="certificate_number">{{ __('Номер сертификата') }}</label>
                                        <input type="text" id="certificate_number" class="form-control" name="search[certificate_number]"
                                               value="@if(isset($search['certificate_number'])){{ $search['certificate_number'] }}@endif">
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
                                        <a type="button" href="{{ route('admin.certificates.index') }}"
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
                            @include('admin.certificates._table')
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer clearfix">
                            @if ($certificates->hasPages())
                                {{ $certificates->links() }}
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
