@extends('admin.layouts.app')
@php
    $title = 'Создание объявления';
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
                                'first' => 'Объявления',
                                'first_link' => route('admin.ads.index'),
                                'second' => $title,
                                'active' => 2
                            ])
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    @include('admin.partials.errors')
                    <form action="{{ route('admin.ads.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        @include('admin.ads._form')
                    </form>
                </div>
            </div>
        </div>
    </section>

@stop

