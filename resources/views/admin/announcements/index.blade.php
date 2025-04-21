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
                        <div class="card-body">
                            <form action="{{ route('admin.announcements.index') }}" method="get">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="specialization_category_id">{{ __('Профессия') }}</label>
                                        <select name="search[specialization_category_id]" id="specialization_category_id" class="form-control">
                                            <option value>{{ __('Выберите') }}</option>
                                            @if($specializationCategories)
                                                @foreach ($specializationCategories as $category)
                                                    <option value="{{ $category->id }}"
                                                            @if (isset($search['specialization_category_id']) && $search['specialization_category_id'] == $category->id && $search['specialization_category_id'] != null) selected="selected" @endif>
                                                        {{ $category->name_ru }}
                                                    </option>
                                                @endforeach
                                            @endif
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="city">{{ __('Город') }}</label>
                                        <select name="search[city]" id="city" class="form-control">
                                            <option value>{{ __('Выберите') }}</option>
                                            @if($cities)
                                                @foreach ($cities as $city)
                                                    <option value="{{ $city->title }}"
                                                            @if (isset($search['city']) && $search['city'] == $city->title && $search['city'] != null) selected="selected" @endif>
                                                        {{ $city->title }}
                                                    </option>
                                                @endforeach
                                            @endif
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="company_name">{{ __('Компания') }}</label>
                                        <input type="text" id="company_name" class="form-control" name="search[company_name]"
                                               value="@if(isset($search['company_name'])){{ $search['company_name'] }}@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="title">{{ __('Вакансия') }}</label>
                                        <input type="text" id="title" class="form-control" name="search[title]"
                                               value="@if(isset($search['title'])){{ $search['title'] }}@endif">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="type">{{ __('Тип') }}</label>
                                        <select name="search[type]" id="type" class="form-control">
                                            <option value>{{ __('Выберите') }}</option>
                                            @if($types)
                                                @foreach ($types as $type)
                                                    <option value="{{ $type }}"
                                                            @if (isset($search['type']) && $search['type'] == $type && $search['type'] != null) selected="selected" @endif>
                                                        {{ $type }}
                                                    </option>
                                                @endforeach
                                            @endif
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <br/>
                                        <label for="no_experience">{{ __('Без опыта работы') }}</label>
                                        @if (isset($search['no_experience']) && $search['no_experience'] == 'on')
                                            <input type="checkbox" name="search[no_experience]" checked>
                                        @else
                                            <input type="checkbox" name="search[no_experience]">
                                        @endif
                                    </div>
                                    <div class="col-md-3">
                                        <br/>
                                        <label for="with_salary">{{ __('Указан доход') }}</label>
                                        @if (isset($search['with_salary']) && $search['with_salary'] == 'on')
                                            <input type="checkbox" name="search[with_salary]" checked>
                                        @else
                                            <input type="checkbox" name="search[with_salary]">
                                        @endif
                                    </div>
                                    <div class="col-md-12 mt-4">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-search fa-fw"></i>
                                            {{ __('Поиск') }}
                                        </button>
                                        <a type="button" href="{{ route('admin.announcements.index') }}"
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
