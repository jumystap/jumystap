@php
    $answersRu = old('answer_ru', isset($faq) ? $faq->answer_ru : ['']);
    $answersKz = old('answer_kz', isset($faq) ? $faq->answer_kz : ['']);
    $answersRu = empty($answersRu) ? [''] : $answersRu;
    $answersKz = empty($answersKz) ? [''] : $answersKz;
@endphp

<div class="card-body">
    <div class="row">
        <div class="col-md-6 form-group">
            <label for="question_ru">{{ __('Вопрос (рус)') }}</label>
            <input type="text" name="question_ru" id="question_ru"
                   class="form-control @error('question_ru') is-invalid @enderror"
                   value="{{ old('question_ru', $faq->question_ru ?? '') }}">
            @error('question_ru')<span class="invalid-feedback">{{ $message }}</span>@enderror
        </div>
        <div class="col-md-6 form-group">
            <label for="question_kz">{{ __('Вопрос (каз)') }}</label>
            <input type="text" name="question_kz" id="question_kz"
                   class="form-control @error('question_kz') is-invalid @enderror"
                   value="{{ old('question_kz', $faq->question_kz ?? '') }}">
            @error('question_kz')<span class="invalid-feedback">{{ $message }}</span>@enderror
        </div>
    </div>

    <div class="row mt-2">
        <div class="col-md-6">
            <label>{{ __('Ответы (рус)') }}</label>
            <small class="form-text text-muted mb-2">{{ __('Каждый пункт — отдельный абзац. Допускается HTML (<b>, <u>, <br>).') }}</small>
            <div class="answers-list" data-answers="ru">
                @foreach($answersRu as $answer)
                    <div class="input-group mb-2 answer-row">
                        <textarea name="answer_ru[]" rows="2" class="form-control">{{ $answer }}</textarea>
                        <div class="input-group-append">
                            <button type="button" class="btn btn-outline-danger remove-answer"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                @endforeach
            </div>
            <button type="button" class="btn btn-outline-secondary btn-sm add-answer" data-target="ru">
                <i class="fas fa-plus"></i> {{ __('Добавить ответ') }}
            </button>
            @error('answer_ru')<div class="text-danger mt-1">{{ $message }}</div>@enderror
        </div>
        <div class="col-md-6">
            <label>{{ __('Ответы (каз)') }}</label>
            <small class="form-text text-muted mb-2">{{ __('Каждый пункт — отдельный абзац. Допускается HTML (<b>, <u>, <br>).') }}</small>
            <div class="answers-list" data-answers="kz">
                @foreach($answersKz as $answer)
                    <div class="input-group mb-2 answer-row">
                        <textarea name="answer_kz[]" rows="2" class="form-control">{{ $answer }}</textarea>
                        <div class="input-group-append">
                            <button type="button" class="btn btn-outline-danger remove-answer"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                @endforeach
            </div>
            <button type="button" class="btn btn-outline-secondary btn-sm add-answer" data-target="kz">
                <i class="fas fa-plus"></i> {{ __('Добавить ответ') }}
            </button>
            @error('answer_kz')<div class="text-danger mt-1">{{ $message }}</div>@enderror
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-md-4 form-group">
            <label for="sort_order">{{ __('Порядок') }}</label>
            <input type="number" name="sort_order" id="sort_order" min="0"
                   class="form-control @error('sort_order') is-invalid @enderror"
                   value="{{ old('sort_order', $faq->sort_order ?? 0) }}">
            @error('sort_order')<span class="invalid-feedback">{{ $message }}</span>@enderror
        </div>
        <div class="col-md-4 form-group">
            <label>{{ __('Статус') }}</label>
            <input type="hidden" name="is_active" value="0">
            <div class="custom-control custom-switch mt-2">
                <input type="checkbox" class="custom-control-input" id="is_active" name="is_active" value="1"
                       {{ old('is_active', $faq->is_active ?? true) ? 'checked' : '' }}>
                <label class="custom-control-label" for="is_active">{{ __('Показывать на сайте') }}</label>
            </div>
        </div>
    </div>
</div>
<div class="card-footer">
    <button type="submit" class="btn btn-success font-weight-bold float-right">
        <i class="fas fa-check-circle fa-fw"></i>
        {{ __('Сохранить') }}
    </button>
</div>

@push('scripts')
    <script>
        document.addEventListener('click', function (e) {
            var addBtn = e.target.closest('.add-answer');
            if (addBtn) {
                var lang = addBtn.dataset.target;
                var list = document.querySelector('.answers-list[data-answers="' + lang + '"]');
                var row = document.createElement('div');
                row.className = 'input-group mb-2 answer-row';
                row.innerHTML = '<textarea name="answer_' + lang + '[]" rows="2" class="form-control"></textarea>' +
                    '<div class="input-group-append">' +
                    '<button type="button" class="btn btn-outline-danger remove-answer"><i class="fas fa-times"></i></button>' +
                    '</div>';
                list.appendChild(row);
                return;
            }

            var removeBtn = e.target.closest('.remove-answer');
            if (removeBtn) {
                var currentRow = removeBtn.closest('.answer-row');
                var parent = currentRow.parentNode;
                if (parent.querySelectorAll('.answer-row').length > 1) {
                    currentRow.remove();
                }
            }
        });
    </script>
@endpush
