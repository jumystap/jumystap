@extends('admin.layouts.app')
@php
    $title = 'Коды';
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
                            <form action="{{ route('admin.codes.index') }}" method="get">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="receiver">{{ __('Получатель') }}</label>
                                        <input type="text" id="receiver" class="form-control" name="search[receiver]"
                                               value="@if(isset($search['receiver'])){{ $search['receiver'] }}@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="code">{{ __('Код') }}</label>
                                        <input type="text" id="code" class="form-control" name="search[code]"
                                               value="@if(isset($search['code'])){{ $search['code'] }}@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="type">{{ __('Тип') }}</label>
                                        <input type="text" id="type" class="form-control" name="search[type]"
                                               value="@if(isset($search['type'])){{ $search['type'] }}@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="channel">{{ __('Канал') }}</label>
                                        <input type="text" id="channel" class="form-control" name="search[channel]"
                                               value="@if(isset($search['channel'])){{ $search['channel'] }}@endif">
                                    </div>
                                    <div class="col-md-12 mt-4">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-search fa-fw"></i>
                                            {{ __('Поиск') }}
                                        </button>
                                        <a type="button" href="{{ route('admin.codes.index') }}"
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
                            @include('admin.codes._table')
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer clearfix">
                            @if ($codes->hasPages())
                                {{ $codes->links() }}
                            @endif
                        </div>
                    </div>
                </div>
                <!-- /.card -->
            </div>
        </div>
    </section>
@endsection
