<div class="card-body">
    <div class="form-group">
        <label for="title">{{ __('Наименование') }}</label>
        <input name="title" id="title" type="text"
               class="form-control @error('title') is-invalid @enderror"
               value="{{ old('title', $announcement->title ?? null) }}"
        >
        @error('title')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="status">{{ __('Статус') }}</label>
        <select name="status" id="status"
                class="form-control @error('status') is-invalid @enderror">
            <option value>{{ __('Выберите') }}</option>

            @foreach ($statuses as $key => $value)
                <option
                    value="{{ $key }}"
                    @if(old('status') == $key || isset($announcement) && $announcement->status == $key) selected="selected" @endif
                >
                    {{ $value }}
                </option>
            @endforeach
        </select>

        @error('status')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
</div>
<div class="card-footer">
    <button type="submit" class="btn btn-success font-weight-bold float-right">
        <i class="fas fa-check-circle fa-fw"></i>
        {{ __('Сохранить') }}
    </button>
</div>
