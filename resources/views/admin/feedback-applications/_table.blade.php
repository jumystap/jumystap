<small class="float-right">
    Отображено {{ $feedbackApplications->count() }} элементов
    с {{ $feedbackApplications->firstItem() ?? 0 }}
    по {{ $feedbackApplications->lastItem() ?? 0 }}
    из {{ $feedbackApplications->total() }}.
</small>

<div class="table-responsive">
    <table class="table table-bordered">
        <thead>
        <tr>
            <th class="text-center" style="width: 80px;">#</th>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Навыки</th>
            <th>Дата создания</th>
        </tr>
        </thead>
        <tbody>
        @forelse($feedbackApplications as $feedbackApplication)
            <tr>
                <td>{{ $feedbackApplication->id }}</td>
                <td>{{ $feedbackApplication->name }}</td>
                <td>{{ $feedbackApplication->phone }}</td>
                <td style="min-width: 320px; white-space: normal; word-break: break-word;">
                    {{ $feedbackApplication->skills }}
                </td>
                <td>{{ $feedbackApplication->created_at->format('d.m.Y H:i:s') }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="5" class="text-center">Заявок пока нет</td>
            </tr>
        @endforelse
        </tbody>
    </table>
</div>
