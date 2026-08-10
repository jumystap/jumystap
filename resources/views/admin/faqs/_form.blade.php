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
        <div class="col-md-6 form-group">
            <label for="answer_ru">{{ __('Ответ (рус)') }}</label>
            <textarea name="answer_ru" id="answer_ru"
                      class="editor tinymce-editor form-control @error('answer_ru') is-invalid @enderror">{{ old('answer_ru', $faq->answer_ru ?? '') }}</textarea>
            @error('answer_ru')<span class="invalid-feedback">{{ $message }}</span>@enderror
        </div>
        <div class="col-md-6 form-group">
            <label for="answer_kz">{{ __('Ответ (каз)') }}</label>
            <textarea name="answer_kz" id="answer_kz"
                      class="editor tinymce-editor form-control @error('answer_kz') is-invalid @enderror">{{ old('answer_kz', $faq->answer_kz ?? '') }}</textarea>
            @error('answer_kz')<span class="invalid-feedback">{{ $message }}</span>@enderror
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

@include('admin.partials.editor')
