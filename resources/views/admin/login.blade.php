@extends('admin.layouts.login')

@section('content')
    <div class="card card-outline card-primary">
        <div class="card-header text-center">
            <a href="" class="h1">{{ config('app.name', 'Laravel') }}</a>
        </div>
        <div class="card-body">
            <p class="login-box-msg">Введите логин и пароль для входа</p>

            <form method="POST" action="{{ route('admin.login') }}">
                @csrf

                <div class="input-group mb-3">
                    <input id="email" type="text" class="form-control @error('email') is-invalid @enderror"
                           name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-envelope"></span>
                        </div>
                    </div>
                    @error('email')
                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                    @enderror
                </div>
                <div class="input-group mb-3">
                    <input id="password" type="password"
                           class="form-control @error('password') is-invalid @enderror" name="password" required
                           autocomplete="current-password">

                    @error('password')
                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                    @enderror
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-8">
                        <div class="icheck-primary">
                            <input type="checkbox" name="remember"
                                   id="remember" {{ old('remember') ? 'checked' : '' }}>
                            <label for="remember">
                                Запомнить меня
                            </label>
                        </div>
                    </div>
                    <!-- /.col -->
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary btn-block">Войти</button>
                    </div>
                    <!-- /.col -->
                </div>
            </form>
        </div>
        <!-- /.card-body -->
    </div>

@endsection
