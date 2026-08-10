@extends('admin.layouts.app')
@php
    $title = 'О платформе';
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
                            <a href="{{ route('admin.faqs.create') }}" class="btn btn-info">+ Добавить вопрос</a>
                        </div>
                        <div class="card-body">
                            @include('admin.partials.errors')
                            @include('admin.faqs._table')
                        </div>
                        <div class="card-footer clearfix">
                            @if ($faqs->hasPages())
                                {{ $faqs->links() }}
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
