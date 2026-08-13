@extends('admin.layouts.app')
@php
    $title = 'Редактирование резюме #' . $resume->id;
@endphp
@section('title', $title)

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6"><h1>{{ $title }}</h1></div>
                <div class="col-sm-6">
                    @include('admin.partials.breadcrumbs', [
                        'first' => 'Резюме',
                        'first_link' => route('admin.resumes.index'),
                        'second' => $title,
                        'active' => 2
                    ])
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('admin.resumes.update', $resume) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.resumes._form')
            </form>
        </div>
    </section>
@stop
