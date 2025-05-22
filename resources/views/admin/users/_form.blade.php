<div class="card-body">
    <div class="form-group">
        <label for="name">{{ __('ФИО') }}</label>
        <input name="name" id="name" type="text"
               class="form-control @error('name') is-invalid @enderror"
               value="{{ old('name', $user->name ?? null) }}" {{ $disabled }}>

        @error('name')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="phone">{{ __('Телефон') }}</label>
        <input name="phone" id="phone" type="text"
               class="form-control @error('phone') is-invalid @enderror"
               value="{{ old('phone', $user->phone ?? null) }}">

        @error('name')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="email">{{ __('Email') }}</label>
        <input name="email" id="email" type="text"
               class="form-control @error('email') is-invalid @enderror"
               value="{{ old('email', $user->email ?? null) }}" {{ $disabled }}>

        @error('name')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="role_id">{{ __('Роль') }}</label>
        <select name="role_id" id="role_id"
                class="form-control @error('role_id') is-invalid @enderror" disabled>
            <option value>{{ __('Выберите') }}</option>

            @foreach ($roles as $role)
                <option
                    value="{{ $role->id }}"
                    @if(old('role_id') == $role->id || isset($user) && $user->role->id == $role->id) selected="selected" @endif
                >
                    {{ $role->name_ru }}
                </option>
            @endforeach
        </select>

        @error('role_id')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    @if(in_array($user->role->id, [\App\Enums\Roles::EMPLOYER->value, \App\Enums\Roles::COMPANY->value]))
        <div class="form-group">
            <label for="description">{{ __('Описание') }}</label>
            <textarea name="description" id="description" rows="4"
                      class="form-control @error('description') is-invalid @enderror" {{ $disabled }}>{!! old('description', $user->description ?? null) !!}</textarea>

            @error('description')
            <span class="invalid-feedback">{{ $message }}</span>
            @enderror
        </div>
    @endif
    <div class="form-group">
        <label for="name">{{ __('Пароль') }}</label>
        <input name="password" id="password" type="password"
               class="form-control @error('password') is-invalid @enderror"
               value="{{ old('password') }}" {{ $disabled }}>

        @error('password')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="name">{{ __('Подтвердить пароль') }}</label>
        <input name="password_confirmation" id="password_confirmation" type="password"
               class="form-control @error('password_confirmation') is-invalid @enderror"
               value="{{ old('password_confirmation') }}" {{ $disabled }}>

        @error('password_confirmation')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>

    <div class="form-group">
        <label for="is_blocked">{{ __('Заблокирован') }}</label>
        @if (isset($user) && $user->is_blocked === 1)
            <input type="checkbox" name="is_blocked" checked="" {{ $disabled }}>
        @else
            <input type="checkbox" name="is_blocked" {{ old('is_blocked') ? 'checked' : '' }} {{ $disabled }}>
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
