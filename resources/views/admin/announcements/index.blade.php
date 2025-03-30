@extends('admin.layouts.app')
@php
    $title = 'Вакансии';
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
                            @include('admin.partials.errors')
                            @include('admin.announcements._table')
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer clearfix">
                            @if ($announcements->hasPages())
                                {{ $announcements->links() }}
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
