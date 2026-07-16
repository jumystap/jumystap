@php
    $count = $codes->count();
    $page = request('page') ?? 1;
    $perPage = $codes->perPage();
    $from = ($perPage * ($page - 1)) + 1;
    $to = $from + $count - 1;
@endphp
<small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $codes->total() }}
    .</small>

<table class="table table-bordered">
    <thead>
    <tr>
        <th class="text-center" style="width: 80px;">#</th>
        <th>Канал</th>
        <th>Получатель</th>
        <th>Код</th>
        <th>Тип</th>
        <th>Дата создания</th>
    </tr>
    </thead>
    <tbody>
    @forelse($codes as $code)
        <tr id="{{ $code->id }}" data-index="{{ $loop->index }}">
            <td>{{ $code->id }}</td>
            <td>{{ $code->channel }}</td>
            <td>{{ $code->receiver }}</td>
            <td>{{ $code->code }}</td>
            <td>{{ $code->type }}</td>
            <td>{{ \Carbon\Carbon::parse($code->created_at)->format('d.m.Y H:i:s') }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="6" class="text-center">Ничего не найдено</td>
        </tr>
    @endforelse
    </tbody>
</table>
