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
                @if($data)
                    @foreach($data as $item)
                        <div class="col-md-4 col-sm-6 col-12">
                            <a href="{{ $item['link'] }}" style="color: #000;">
                                <div class="info-box">
                                    <span class="info-box-icon {{ $item['bg'] }}"><i class="{{ $item['icon'] }}"></i></span>

                                    <div class="info-box-content">
                                        <span class="info-box-text">{{ $item['title'] }}</span>
                                        <span class="info-box-number">{{ $item['count'] }}</span>
                                    </div>
                                    <!-- /.info-box-content -->
                                </div>
                            </a>
                            <!-- /.info-box -->
                        </div>
                        <!-- /.col -->
                    @endforeach
                @endif
            </div>
        </div>

    </section>
@endsection
