<small class="float-right">
    Отображено {{ $surveys->count() }} элементов
    с {{ $surveys->firstItem() ?? 0 }}
    по {{ $surveys->lastItem() ?? 0 }}
    из {{ $surveys->total() }}.
</small>

<div class="table-responsive">
    <table class="table table-bordered">
        <thead>
        <tr>
            <th class="text-center" style="width: 80px;">#</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Позиция</th>
            <th>Курсы JOLTAP</th>
            <th>Согласие</th>
            <th>Дата создания</th>
        </tr>
        </thead>
        <tbody>
        @forelse($surveys as $survey)
            <tr>
                <td>{{ $survey->id }}</td>
                <td>{{ $survey->name }}</td>
                <td>{{ $survey->phone }}</td>
                <td style="min-width: 220px; white-space: normal; word-break: break-word;">
                    {{ $survey->position }}
                </td>
                <td>{{ $survey->is_graduate ? 'Да' : 'Нет' }}</td>
                <td>{{ $survey->consent ? 'Да' : 'Нет' }}</td>
                <td>{{ $survey->created_at->format('d.m.Y H:i:s') }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="7" class="text-center">Записей пока нет</td>
            </tr>
        @endforelse
        </tbody>
    </table>
</div>
