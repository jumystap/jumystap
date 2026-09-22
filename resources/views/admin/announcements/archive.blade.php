@extends('admin.layouts.app')
@php
    $title = 'Архив вакансий';
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
                        'active' => 1,
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
                    <div class="card">
                        <div class="card-header"></div>
                        <div class="card-body">
                            <form action="{{ route('admin.announcements.archive') }}" method="get">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="company_name">{{ __('Работодатель') }}</label>
                                        <input type="text" id="company_name" class="form-control" name="search[company_name]"
                                               value="{{ $search['company_name'] ?? '' }}">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="title">{{ __('Вакансия') }}</label>
                                        <input type="text" id="title" class="form-control" name="search[title]"
                                               value="{{ $search['title'] ?? '' }}">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="archive_reason">{{ __('Причина архивации') }}</label>
                                        <select name="search[archive_reason]" id="archive_reason" class="form-control">
                                            <option value>{{ __('Все') }}</option>
                                            @foreach ($reasons as $key => $value)
                                                <option value="{{ $key }}"
                                                        @if (isset($search['archive_reason']) && (string) $search['archive_reason'] === (string) $key) selected="selected" @endif>
                                                    {{ $value }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-12 mt-4">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-search fa-fw"></i>
                                            {{ __('Поиск') }}
                                        </button>
                                        <a type="button" href="{{ route('admin.announcements.archive') }}"
                                           class="btn btn-outline-secondary">
                                            {{ __('Сбросить') }}
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="card-body">
                            @include('admin.partials.errors')

                            @php
                                $count = $announcements->count();
                                $page = request('page') ?? 1;
                                $perPage = $announcements->perPage();
                                $from = ($perPage * ($page - 1)) + 1;
                                $to = $from + $count - 1;
                            @endphp
                            <small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $announcements->total() }}.</small>

                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th class="text-center" style="width: 80px;">#</th>
                                    <th>Работодатель</th>
                                    <th>Вакансия</th>
                                    <th>Кол-во откликов</th>
                                    <th>Дата архивации</th>
                                    <th>Ответ</th>
                                    <th style="width: 10%;">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                @forelse($announcements as $announcement)
                                    <tr id="{{ $announcement->id }}">
                                        <td>{{ $announcement->id }}</td>
                                        <td>{{ $announcement->user->name ?? '—' }}</td>
                                        <td>{{ $announcement->title }}</td>
                                        <td>{{ $announcement->responses_count }}</td>
                                        <td>
                                            @if($announcement->archived_at)
                                                {{ \Carbon\Carbon::parse($announcement->archived_at)->format('d.m.Y H:i') }}
                                            @else
                                                {{ \Carbon\Carbon::parse($announcement->updated_at)->format('d.m.Y H:i') }}
                                            @endif
                                        </td>
                                        <td>{{ $announcement->archive_reason?->getLabel() ?? '—' }}</td>
                                        <td>
                                            <a href="../announcement/{{ $announcement->id }}" target="_blank" class='btn btn-outline-info'>
                                                <i class="fas fa-eye"></i>
                                            </a>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="7" class="text-center">Архивных вакансий не найдено.</td>
                                    </tr>
                                @endforelse
                                </tbody>
                            </table>
                        </div>
                        <div class="card-footer clearfix">
                            @if ($announcements->hasPages())
                                {{ $announcements->links() }}
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
