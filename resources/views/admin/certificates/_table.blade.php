@php
    $count = $certificates->count();
    $page = request('page') ?? 1;
    $perPage = $certificates->perPage();
    $total = $certificates->total();
    $from = ($perPage * ($page - 1)) + 1;
    $to = $from + $count - 1;
@endphp
<small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $certificates->total() }}.</small>

<table class="table table-bordered">
    <thead>
    <tr>
        <th class="text-center" style="width: 80px;">#</th>
        <th>Профессия</th>
        <th>Телефон</th>
        <th>Номер сертификата</th>
        <th>Создано</th>
    </tr>
    </thead>
    <tbody>
    @foreach($certificates as $certificate)
        <tr id="{{ $certificate->id }}" data-index="{{ $loop->index }}">
            <td>{{ $certificate->id }}</td>
            <td>{{ $certificate->profession->name_ru }}</td>
            <td>{{ $certificate->phone }}</td>
            <td>{{ $certificate->certificate_number }}</td>
            <td>{{ $certificate->created_at }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
