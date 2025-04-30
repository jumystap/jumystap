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
        <th>Тип</th>
        <th>Bitrix ID</th>
        <th>Профессия</th>
        <th>фИО</th>
        <th>Телефон</th>
        <th>Номер сертификата</th>
        <th>Создано</th>
        <th>Обновлено</th>
    </tr>
    </thead>
    <tbody>
    @foreach($certificates as $certificate)
        <tr id="{{ $certificate->id }}" data-index="{{ $loop->index }}">
            <td>{{ $certificate->id }}</td>
            <td>{{ $certificate->type }}</td>
            <td>{{ $certificate->bitrix_id }}</td>
            <td>{{ $certificate->profession->name_ru }}</td>
            <td>
                {{ $certificate->user->name }}
                @if($certificate->user->is_graduate)
                    <span class="badge badge-success">✓</span>
                @endif
            </td>
            <td>{{ $certificate->user->phone }}</td>
            <td>
                <a href="{{ $certificate->certificate_link }}" target="_blank">{{ $certificate->certificate_number }}</a>
            </td>
            <td>{{ \Carbon\Carbon::parse($certificate->created_at)->format('d.m.Y H:i:s') }}</td>
            <td>{{ \Carbon\Carbon::parse($certificate->updated_at)->format('d.m.Y H:i:s') }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
