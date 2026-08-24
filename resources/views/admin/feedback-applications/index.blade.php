@extends('admin.layouts.app')

@php
    $title = 'Заявки с сайта';
@endphp

@section('title', $title)

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>{{ $title }}</h1>
                </div>
                <div class="col-sm-6">
                    @include('admin.partials.breadcrumbs', [
                        'first' => $title,
                        'active' => 1,
                    ])
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            @include('admin.partials.errors')
                            @include('admin.feedback-applications._table')
                        </div>

                        <div class="card-footer clearfix">
                            @if ($feedbackApplications->hasPages())
                                {{ $feedbackApplications->links() }}
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
