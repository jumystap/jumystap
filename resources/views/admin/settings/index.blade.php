@extends('admin.layouts.app')
@php
    $title = 'Настройки';
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
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">@lang('Баннеры сайта')</h5>
                        </div>
                        <div class="card-body">
                            @include('admin.partials.errors')

                            <form action="{{ route('admin.settings.update') }}" method="post">
                                @csrf
                                @method('PUT')

                                <input type="hidden" name="maintenance_banner" value="0">
                                <div class="form-group">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="maintenance_banner"
                                               name="maintenance_banner" value="1"
                                               {{ $maintenanceBanner ? 'checked' : '' }}>
                                        <label class="custom-control-label" for="maintenance_banner">
                                            {{ __('Показывать баннер «Технические работы»') }}
                                        </label>
                                    </div>
                                    <small class="form-text text-muted">
                                        {{ __('Баннер отображается на главной странице (десктоп и мобайл).') }}
                                    </small>
                                </div>

                                <button type="submit" class="btn btn-success font-weight-bold">
                                    <i class="fas fa-check-circle fa-fw"></i>
                                    {{ __('Сохранить') }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
