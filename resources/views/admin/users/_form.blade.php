<div class="card-body">
    <div class="form-group">
        <label for="name">{{ __('ФИО') }}</label>
        <input name="name" id="name" type="text"
               class="form-control @error('name') is-invalid @enderror"
               value="{{ old('name', $user->name ?? null) }}">

        @error('name')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="email">{{ __('Email') }}</label>
        <input name="email" id="email" type="text"
               class="form-control @error('email') is-invalid @enderror"
               value="{{ old('email', $user->email ?? null) }}">

        @error('name')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="role">{{ __('Роль') }}</label>
        <select name="role" id="role"
                class="form-control @error('role') is-invalid @enderror">
            <option value>{{ __('Выберите') }}</option>

            @foreach ($roles as $value)
                <option
                    value="{{ $value->id }}"
                    @if(old('role') == $value->id || isset($user) && $user->role->id == $value->id) selected="selected" @endif
                >
                    {{ $value->name_ru }}
                </option>
            @endforeach
        </select>

        @error('role')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="name">{{ __('Пароль') }}</label>
        <input name="password" id="password" type="password"
               class="form-control @error('password') is-invalid @enderror"
               value="{{ old('password') }}">

        @error('password')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="name">{{ __('Подтвердить пароль') }}</label>
        <input name="password_confirmation" id="password_confirmation" type="password"
               class="form-control @error('password_confirmation') is-invalid @enderror"
               value="{{ old('password_confirmation') }}">

        @error('password_confirmation')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>

    <div class="form-group">
        <label for="is_blocked">{{ __('Заблокирован') }}</label>
        @if (isset($user) && $user->is_blocked === 1)
            <input type="checkbox" name="is_blocked" checked="">
        @else
            <input type="checkbox" name="is_blocked" {{ old('is_blocked') ? 'checked' : '' }} >
        @endif

        @if($errors->has('is_blocked'))
            <div class="invalid-feedback">
                <strong>{{ $message }}</strong>
            </div>
        @endif
    </div>
</div>
<div class="card-footer">
    <button type="submit" class="btn btn-success font-weight-bold float-right">
        <i class="fas fa-check-circle fa-fw"></i>
        {{ __('Сохранить') }}
    </button>
</div>
