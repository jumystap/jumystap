@extends('admin.layouts.app')
@php
    $title = 'Просмотр объявления #' . $ad->id;
@endphp
@section('title', $title)

@section('content')
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>{{ $title }}</h1>
                </div>
                <div class="col-sm-6">
                    @include('admin.partials.breadcrumbs', [
                                'first' => 'Объявления',
                                'first_link' => route('admin.ads.index'),
                                'second' => $title,
                                'active' => 2
                            ])
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                {{-- Основная информация --}}
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3 class="card-title">Информация об объявлении</h3>
                            <div>
                        <span class="badge badge-{{ $ad->status->color() }} badge-lg">
                            {{ $ad->status->label() }}
                        </span>
                                <span class="badge badge-secondary badge-lg ml-2">
                            <i class="fas fa-{{ $ad->type->icon() }}"></i>
                            {{ $ad->type->label() }}
                        </span>
                            </div>
                        </div>
                        <div class="card-body">
                            <dl class="row">
                                <dt class="col-sm-3">Название:</dt>
                                <dd class="col-sm-9"><strong>{{ $ad->title }}</strong></dd>

                                <dt class="col-sm-3">Описание:</dt>
                                <dd class="col-sm-9">{!! $ad->description !!}</dd>

                                <dt class="col-sm-3">Категория:</dt>
                                <dd class="col-sm-9">
                                    {{ $ad->category->name_ru ?? '' }}
                                    @if($ad->subcategory)
                                        → {{ $ad->subcategory->name }}
                                    @endif
                                </dd>

                                <dt class="col-sm-3">Город:</dt>
                                <dd class="col-sm-9">{{ $ad->city->title }}</dd>

                                @if($ad->address)
                                    <dt class="col-sm-3">Адрес:</dt>
                                    <dd class="col-sm-9">{{ $ad->address }}</dd>
                                @endif

                                @if($ad->is_remote)
                                    <dt class="col-sm-3">Удаленно:</dt>
                                    <dd class="col-sm-9">
                                        <span class="badge badge-info">Да</span>
                                    </dd>
                                @endif

                                <dt class="col-sm-3">Цена:</dt>
                                <dd class="col-sm-9"><strong class="text-primary">{{ $ad->formatted_price }}</strong></dd>

                                <dt class="col-sm-3">Контактный телефон:</dt>
                                <dd class="col-sm-9">
                                    @if($ad->use_profile_phone)
                                        <a href="tel:{{ $ad->user->phone }}">+{{ $ad->user->phone }}</a>
                                    @else
                                        <a href="tel:{{ $ad->phone }}">+{{ $ad->phone }}</a>
                                    @endif

                                </dd>

                                @if($ad->user)
                                    <dt class="col-sm-3">Компания:</dt>
                                    <dd class="col-sm-9">{{ $ad->user->name }}</dd>
                                @endif

                                @if($ad->user)
                                    <dt class="col-sm-3">О компании:</dt>
                                    <dd class="col-sm-9">{{ $ad->user->description }}</dd>
                                @endif

                                @if($ad->businessType)
                                    <dt class="col-sm-3">Вид деятельности:</dt>
                                    <dd class="col-sm-9">{{ $ad->businessType->name }}</dd>
                                @endif

                                @if($ad->user->is_graduate)
                                    <dt class="col-sm-3">Статус:</dt>
                                    <dd class="col-sm-9">
                                        <span class="badge badge-success">
                                            <i class="fas fa-graduation-cap"></i> Выпускник JOLTAP
                                        </span>
                                    </dd>
                                @endif
                            </dl>

                            {{-- Фотографии --}}
                            @if($ad->photos->isNotEmpty())
                                <hr>
                                <h5 class="mb-3">Фотографии ({{ $ad->photos->count() }})</h5>
                                <div class="row">
                                    @foreach($ad->photos as $photo)
                                        <div class="col-md-4 mb-3">
                                            <div class="card">
                                                <img src="{{ $photo->url }}"
                                                     alt=""
                                                     class="card-img-top"
                                                     style="height: 200px; object-fit: cover; cursor: pointer;"
                                                     onclick="viewFullImage('{{ $photo->url }}')">
                                                @if($photo->is_primary)
                                                    <div class="card-img-overlay">
                                                        <span class="badge badge-success">Главное</span>
                                                    </div>
                                                @endif
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            @else
                                <hr>
                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle"></i> Фотографии не загружены
                                </div>
                            @endif
                        </div>
                        <div class="card-footer">
                            <div class="btn-group">
                                <a href="{{ route('admin.ads.edit', $ad) }}" class="btn btn-primary">
                                    <i class="fas fa-edit"></i> Редактировать
                                </a>

                                @if($ad->status === \App\Enums\AdStatus::MODERATION)
                                    <form action="{{ route('admin.ads.approve', $ad) }}" method="POST" class="d-inline">
                                        @csrf
                                        <button type="submit" class="btn btn-success">
                                            <i class="fas fa-check"></i> Одобрить
                                        </button>
                                    </form>

                                    <button type="button"
                                            class="btn btn-warning"
                                            data-toggle="modal"
                                            data-target="#rejectModal">
                                        <i class="fas fa-times"></i> Отклонить
                                    </button>
                                @endif

                                <button type="button"
                                        class="btn btn-danger"
                                        onclick="deleteAd({{ $ad->id }})">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                            </div>
                        </div>
                    </div>

                    {{-- История статусов --}}
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">История изменений статуса</h3>
                        </div>
                        <div class="card-body p-0">
                            <table class="table table-sm table-hover mb-0">
                                <thead>
                                <tr>
                                    <th>Дата и время</th>
                                    <th>Из статуса</th>
                                    <th>В статус</th>
                                    <th>Кем изменено</th>
                                    <th>Комментарий</th>
                                </tr>
                                </thead>
                                <tbody>
                                @forelse($ad->statusHistory as $history)
                                    <tr>
                                        <td>{{ $history->changed_at->format('d.m.Y H:i') }}</td>
                                        <td>
                                        <span class="badge badge-secondary">
                                            {{ \App\Enums\AdStatus::from($history->status_from)->label() }}
                                        </span>
                                        </td>
                                        <td>
                                        <span class="badge badge-{{ \App\Enums\AdStatus::from($history->status_to)->color() }}">
                                            {{ \App\Enums\AdStatus::from($history->status_to)->label() }}
                                        </span>
                                        </td>
                                        <td>{{ $history->changedBy->name ?? 'Система' }}</td>
                                        <td>{{ $history->comment }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="text-center text-muted">История отсутствует</td>
                                    </tr>
                                @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {{-- Боковая панель --}}
                <div class="col-md-4">
                    {{-- Автор --}}
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Автор объявления</h3>
                        </div>
                        <div class="card-body">
                            <dl class="mb-0">
                                <dt>Имя:</dt>
                                <dd>{{ $ad->user->name }}</dd>

                                <dt>Email:</dt>
                                <dd><a href="mailto:{{ $ad->user->email }}">{{ $ad->user->email }}</a></dd>

                                <dt>Телефон:</dt>
                                <dd>{{ $ad->user->phone ?? 'Не указан' }}</dd>

                                <dt>Дата регистрации:</dt>
                                <dd>{{ $ad->user->created_at->format('d.m.Y') }}</dd>

                                <dt>Всего объявлений:</dt>
                                <dd>
                                    <span class="badge badge-info">{{ $ad->user->ads()->count() }}</span>
                                </dd>
                            </dl>
                            <a href="{{ route('admin.ads.index', ['search' => $ad->user->phone]) }}"
                               class="btn btn-sm btn-primary btn-block mt-2">
                                <i class="fas fa-list"></i> Все объявления автора
                            </a>
                        </div>
                    </div>

                    {{-- Статистика --}}
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Статистика</h3>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6">
                                    <div class="small-box bg-info">
                                        <div class="inner">
                                            <h3>{{ $ad->views_count }}</h3>
                                            <p>Просмотров</p>
                                        </div>
                                        <div class="icon">
                                            <i class="fas fa-eye"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="small-box bg-success">
                                        <div class="inner">
                                            <h3>{{ $ad->contacts_shown_count }}</h3>
                                            <p>Контактов</p>
                                        </div>
                                        <div class="icon">
                                            <i class="fas fa-phone"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <dl class="mb-0">
                                <dt>ID объявления:</dt>
                                <dd><code>{{ $ad->id }}</code></dd>

                                <dt>Создано:</dt>
                                <dd>{{ $ad->created_at->format('d.m.Y H:i') }}</dd>

                                <dt>Обновлено:</dt>
                                <dd>{{ $ad->updated_at->format('d.m.Y H:i') }}</dd>

                                @if($ad->published_at)
                                    <dt>Опубликовано:</dt>
                                    <dd>{{ $ad->published_at->format('d.m.Y H:i') }}</dd>
                                @endif

                                @if($ad->expires_at)
                                    <dt>Истекает:</dt>
                                    <dd>{{ $ad->expires_at->format('d.m.Y H:i') }}</dd>
                                @endif
                            </dl>
                        </div>
                    </div>

                    {{-- Последние просмотры --}}
                    @if($ad->views->isNotEmpty())
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Последние просмотры</h3>
                            </div>
                            <div class="card-body p-0">
                                <ul class="list-group list-group-flush">
                                    @foreach($ad->views->take(10) as $view)
                                        <li class="list-group-item py-2">
                                            <small>
                                                <strong>{{ $view->viewed_at->format('d.m H:i') }}</strong><br>
                                                @if($view->user)
                                                    {{ $view->user->name }}
                                                @else
                                                    IP: {{ $view->ip_address }}
                                                @endif
                                            </small>
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </section>

    {{-- Модальное окно для отклонения --}}
    <div class="modal fade" id="rejectModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <form action="{{ route('admin.ads.reject', $ad) }}" method="POST">
                    @csrf
                    <div class="modal-header">
                        <h4 class="modal-title">Отклонить объявление</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Причина отклонения <span class="text-danger">*</span></label>
                            <textarea name="reason"
                                      class="form-control"
                                      rows="4"
                                      required
                                      placeholder="Укажите причину отклонения объявления"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                        <button type="submit" class="btn btn-warning">
                            <i class="fas fa-times"></i> Отклонить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- Модальное окно для просмотра фото --}}
    <div class="modal fade" id="imageModal">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body p-0">
                    <img src="" id="fullImage" class="img-fluid w-100">
                </div>
            </div>
        </div>
    </div>
@stop

@push('scripts')
    <script>
        function deleteAd(id) {
            Swal.fire({
                title: 'Вы уверены?',
                text: 'Это действие нельзя отменить. Все фотографии будут удалены.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Да, удалить',
                cancelButtonText: 'Отмена'
            }).then((result) => {
                if (result.isConfirmed) {
                    const form = $('<form>', {
                        method: 'POST',
                        action: `/admin/ads/${id}`
                    });

                    $('<input>').attr({type: 'hidden', name: '_token', value: '{{ csrf_token() }}'}).appendTo(form);
                    $('<input>').attr({type: 'hidden', name: '_method', value: 'DELETE'}).appendTo(form);
                    form.appendTo('body').submit();
                }
            });
        }

        function viewFullImage(url) {
            $('#fullImage').attr('src', url);
            $('#imageModal').modal('show');
        }
    </script>
@endpush

