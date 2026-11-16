@extends('errors::minimal')

@section('title', __('Too Many Requests'))
@section('code', '429')
@section('message', $exception->getMessage() ?: __('Too Many Requests'))
