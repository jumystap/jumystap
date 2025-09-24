@extends('admin.layouts.app')
@php
    $title = 'Отклики';
    $count = $responses->count();
    $page = request('page') ?? 1;
    $perPage = $responses->perPage();
    $total = $responses->total();
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
                        <!-- /.card-header -->
                        <div class="card-body">
                            <form action="{{ route('admin.responses.index') }}" method="get">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="start_date">{{ __('Дата c') }}</label>
                                        <input type="text" id="start_date" class="form-control" name="search[start_date]"
                                               value="{{ $search['start_date'] ?? '' }}" autocomplete="off">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="end_date">{{ __('Дата по') }}</label>
                                        <input type="text" id="end_date" class="form-control" name="search[end_date]"
                                               value="{{ $search['end_date'] ?? '' }}" autocomplete="off">
                                    </div>
                                    <div class="col-md-12 mt-4">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-search fa-fw"></i>
                                            {{ __('Поиск') }}
                                        </button>
                                        <a type="button" href="{{ route('admin.responses.index') }}"
                                           class="btn btn-outline-secondary">
                                            {{ __('Сбросить') }}
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="card-body">
                            <small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $responses->total() }}.</small>

                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Соискатель</th>
                                    <th>Вакансия</th>
                                    <th>Работодатель</th>
                                    <th>Создано</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($responses as $response)
                                    <tr>
                                        <td>{{ $response->id }}</td>
                                        <td>{{ $response->user->name }}</td>
                                        <td>
                                            {{ $response->announcement->title }}
                                            <span class="badge badge-{{ $response->announcement->status->getClass() }}">
                                            {{ $response->announcement->status->getLabel() }}
                                            </span>
                                        </td>
                                        </td>
                                        <td>{{ $response->announcement->user->name }}</td>
                                        <td>{{ \Carbon\Carbon::parse($response->created_at)->format('d.m.Y H:i:s') }}</td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer clearfix">
                            @if ($responses->hasPages())
                                {{ $responses->links() }}
                            @endif
                        </div>
                    </div>
                </div>
                <!-- /.card -->
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
