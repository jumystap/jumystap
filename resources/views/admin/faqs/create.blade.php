@extends('admin.layouts.app')
@php
    $title = 'Добавить вопрос';
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
                        'first' => 'О платформе',
                        'first_link' => route('admin.faqs.index'),
                        'second' => $title,
                        'active' => 2
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
                        <div class="card-body">
                            @include('admin.partials.errors')
                            <form action="{{ route('admin.faqs.store') }}" method="post">
                                @csrf
                                @include('admin.faqs._form')
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
