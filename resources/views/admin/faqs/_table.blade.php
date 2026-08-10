<table class="table table-bordered">
    <thead>
    <tr>
        <th class="text-center" style="width: 80px;">#</th>
        <th style="width: 90px;">Порядок</th>
        <th>Вопрос (рус)</th>
        <th>Вопрос (каз)</th>
        <th style="width: 110px;">Ответов</th>
        <th style="width: 120px;">Статус</th>
        <th style="width: 15%;">Действия</th>
    </tr>
    </thead>
    <tbody>
    @forelse($faqs as $faq)
        <tr id="{{ $faq->id }}">
            <td>{{ $faq->id }}</td>
            <td>{{ $faq->sort_order }}</td>
            <td>{{ $faq->question_ru }}</td>
            <td>{{ $faq->question_kz }}</td>
            <td>{{ count($faq->answer_ru ?? []) }}</td>
            <td>
                @if($faq->is_active)
                    <span class="badge badge-success">Активен</span>
                @else
                    <span class="badge badge-secondary">Скрыт</span>
                @endif
            </td>
            <td>
                <div class="btn-group">
                    <form action="{{ route('admin.faqs.destroy', $faq) }}" class="d-inline" method="post">
                        @csrf
                        @method('delete')
                        <a href="{{ route('admin.faqs.edit', $faq) }}" class="btn btn-outline-info"><i class="fas fa-pen"></i></a>
                        <button type="submit" class="btn btn-outline-danger"
                                onclick="return confirm('Вы действительно хотите удалить?')">
                            <i class="fas fa-trash fa-fw"></i>
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="7" class="text-center">Вопросы отсутствуют</td>
        </tr>
    @endforelse
    </tbody>
</table>
