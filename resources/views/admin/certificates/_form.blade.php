<div class="card-body">
    <div class="form-group">
        <label for="profession_id">{{ __('Профессия') }}</label>
        <select name="profession_id" id="profession_id"
                class="form-control @error('profession_id') is-invalid @enderror">
            <option value>{{ __('Выберите') }}</option>

            @foreach ($professions as $value)
                <option
                    value="{{ $value->id }}"
                    @if(old('profession_id') == $value->id || isset($certifcate) && $certifcate->profession_id->id == $value->id) selected="selected" @endif
                >
                    {{ $value->name_ru }}
                </option>
            @endforeach
        </select>

        @error('profession_id')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="phone">{{ __('Телефон') }}</label>
        <input name="phone" id="phone" type="text"
               class="form-control @error('phone') is-invalid @enderror"
               value="{{ old('phone', $certifcate->name ?? null) }}"
               data-inputmask='"mask": "(999) 999-9999"' data-mask
        >
        @error('phone')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="certificate_number">{{ __('Номер сертификата') }}</label>
        <input name="certificate_number" id="certificate_number" type="text"
               class="form-control @error('certificate_number') is-invalid @enderror"
               value="{{ old('certificate_number', $certifcate->certificate_number ?? null) }}"
        >

        @error('phone')
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
