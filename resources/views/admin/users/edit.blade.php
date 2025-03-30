@extends('admin.layouts.app')
@php
    $title = 'Изменить Пользователя';
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
                                'first' => 'Пользователи',
                                'first_link' => route('admin.users.index'),
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
                    <!-- Default box -->
                    <div class="card">
                        <div class="card-header">
                            <a href="{{ route('admin.users.create') }}" class="btn btn-info">+ Добавить</a>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            @include('admin.partials.errors')
                            <form action="{{ route('admin.users.update', $user) }}" method="post" enctype="multipart/form-data">
                                @csrf
                                @method('put')
                                @include('admin.users._form')

                            </form>
                        </div>
                    </div>
                </div>
                <!-- /.card -->
            </div>
        </div>

    </section>

@endsection

