@extends('admin.layouts.app')
@php
    $title = 'Объявления';
    $count = $ads->count();
    $page = request('page') ?? 1;
    $perPage = $ads->perPage();
    $total = $ads->total();
    $from = ($perPage * ($page - 1)) + 1;
    $to = $from + $count - 1;
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
                                                    'first' => $title,
                                                    'active' => 1
                                                ])
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">

        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <a href="{{ route('admin.ads.create') }}" class="btn btn-info">+ Добавить</a>
                        </div>

                        {{-- Фильтры --}}
                        <div class="card-body">
                            <form method="GET" class="row g-3 mb-3">
                                <div class="col-md-3">
                                    <input type="text"
                                           name="search"
                                           class="form-control"
                                           placeholder="Поиск по ID, названию, автору..."
                                           value="{{ request('search') }}">
                                </div>

                                <div class="col-md-2">
                                    <select name="status" class="form-control">
                                        <option value="">Все статусы</option>
                                        @foreach($statuses as $status)
                                            <option value="{{ $status->value }}" {{ request('status') == $status->value ? 'selected' : '' }}>
                                                {{ $status->label() }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-md-2">
                                    <select name="type" class="form-control">
                                        <option value="">Все типы</option>
                                        @foreach($types as $type)
                                            <option value="{{ $type->value }}" {{ request('type') == $type->value ? 'selected' : '' }}>
                                                {{ $type->label() }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-md-2">
                                    <select name="category_id" class="form-control">
                                        <option value="">Все категории</option>
                                        @foreach($categories as $category)
                                            <option value="{{ $category->id }}" {{ request('category_id') == $category->id ? 'selected' : '' }}>
                                                {{ $category->name_ru }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-md-2">
                                    <select name="city_id" class="form-control">
                                        <option value="">Все города</option>
                                        @foreach($cities as $city)
                                            <option value="{{ $city->id }}" {{ request('city_id') == $city->id ? 'selected' : '' }}>
                                                {{ $city->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-md-1">
                                    <button type="submit" class="btn btn-primary btn-block">
                                        <i class="fas fa-search"></i>
                                    </button>
                                    <a href="{{ route('admin.ads.index') }}" class="btn btn-secondary btn-block mt-1">
                                        <i class="fas fa-times"></i>
                                    </a>
                                </div>
                            </form>

                            {{-- Массовые действия --}}
                            <form method="POST" action="{{ route('admin.ads.bulk-action') }}" id="bulkForm">
                                @csrf
                                <div class="btn-toolbar mb-3" role="toolbar">
                                    <div class="btn-group mr-2" role="group">
                                        <button type="button" class="btn btn-success" onclick="bulkAction('approve')">
                                            <i class="fas fa-check"></i> Одобрить
                                        </button>
                                        <button type="button" class="btn btn-warning" onclick="bulkAction('reject')">
                                            <i class="fas fa-times"></i> Отклонить
                                        </button>
                                        <button type="button" class="btn btn-danger" onclick="bulkAction('delete')">
                                            <i class="fas fa-trash"></i> Удалить
                                        </button>
                                    </div>
                                    <div class="ml-auto">
                                        <span class="badge badge-info">Всего: {{ $ads->total() }}</span>
                                    </div>
                                </div>

                                {{-- Таблица --}}
                                <small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $ads->total() }}.</small>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                        <tr>
                                            <th width="30">
                                                <input type="checkbox" id="selectAll">
                                            </th>
                                            <th width="60">ID</th>
                                            <th width="80">Фото</th>
                                            <th>Название</th>
                                            <th>Автор</th>
                                            <th>Тип</th>
                                            <th>Категория</th>
                                            <th>Город</th>
                                            <th>Цена</th>
                                            <th>Статус</th>
                                            <th>Просмотры</th>
                                            <th>Дата</th>
                                            <th width="150">Действия</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        @forelse($ads as $ad)
                                            <tr>
                                                <td>
                                                    <input type="checkbox" name="ads[]" value="{{ $ad->id }}" class="ad-checkbox">
                                                </td>
                                                <td>{{ $ad->id }}</td>
                                                <td>
                                                    @if($ad->photos->first())
                                                        <img src="{{ $ad->photos->first()->thumbnail_url }}"
                                                             alt=""
                                                             style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
                                                             onclick="viewImage('{{ $ad->photos->first()->url }}')">
                                                    @else
                                                        <div class="bg-light d-flex align-items-center justify-content-center"
                                                             style="width: 60px; height: 60px;">
                                                            <i class="fas fa-image text-muted"></i>
                                                        </div>
                                                    @endif
                                                </td>
                                                <td>
                                                    <a href="{{ route('admin.ads.show', $ad) }}" class="font-weight-bold">
                                                        {{ Str::limit($ad->title, 40) }}
                                                    </a>
                                                    @if($ad->photos_count > 0)
                                                        <span class="badge badge-light">
                                                            <i class="fas fa-camera"></i> {{ $ad->photos_count }}
                                                        </span>
                                                    @endif
                                                </td>
                                                <td>
                                                    <div>{{ $ad->user->name }}</div>
                                                    <small class="text-muted">+{{ $ad->user->phone }}</small>
                                                </td>
                                                <td>
                                        <span class="badge badge-secondary">
                                            <i class="fas fa-{{ $ad->type->icon() }}"></i>
                                            {{ $ad->type->label() }}
                                        </span>
                                                </td>
                                                <td>{{ $ad->category->name_ru }}</td>
                                                <td>{{ $ad->city->title }}</td>
                                                <td><small>{{ $ad->formatted_price }}</small></td>
                                                <td>
                                        <span class="badge badge-{{ $ad->status->color() }}">
                                            {{ $ad->status->label() }}
                                        </span>
                                                </td>
                                                <td>
                                                    <i class="fas fa-eye"></i> {{ $ad->views_count }}<br>
                                                    <i class="fas fa-phone"></i> {{ $ad->contacts_shown_count }}
                                                </td>
                                                <td>
                                                    <div>{{ $ad->created_at->format('d.m.Y') }}</div>
                                                    <small class="text-muted">{{ $ad->created_at->format('H:i') }}</small>
                                                </td>
                                                <td>
                                                    <div class="btn-group btn-group-sm" role="group">
                                                        <a href="{{ route('admin.ads.show', $ad) }}"
                                                           class="btn btn-info"
                                                           title="Просмотр">
                                                            <i class="fas fa-eye"></i>
                                                        </a>
                                                        <a href="{{ route('admin.ads.edit', $ad) }}"
                                                           class="btn btn-primary"
                                                           title="Редактировать">
                                                            <i class="fas fa-edit"></i>
                                                        </a>
                                                        <button type="button"
                                                                class="btn btn-danger"
                                                                onclick="deleteAd({{ $ad->id }})"
                                                                title="Удалить">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        @empty
                                            <tr>
                                                <td colspan="13" class="text-center text-muted py-4">
                                                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                                                    Объявления не найдены
                                                </td>
                                            </tr>
                                        @endforelse
                                        </tbody>
                                    </table>
                                </div>
                            </form>

                            {{-- Пагинация --}}
                            <div class="mt-3">
                                {{ $ads->appends(request()->query())->links() }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    {{-- Модальное окно для просмотра фото --}}
    <div class="modal fade" id="imageModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-body p-0">
                    <img src="" id="modalImage" class="img-fluid w-100">
                </div>
            </div>
        </div>
    </div>
@stop

@push('scripts')
    <script>
        // Выбрать все
        $('#selectAll').on('change', function() {
            $('.ad-checkbox').prop('checked', $(this).prop('checked'));
        });

        // Массовые действия
        function bulkAction(action) {
            const selected = $('.ad-checkbox:checked').length;

            if (selected === 0) {
                Swal.fire('Внимание', 'Выберите хотя бы одно объявление', 'warning');
                return;
            }

            const messages = {
                approve: 'одобрить',
                reject: 'отклонить',
                delete: 'удалить'
            };

            Swal.fire({
                title: 'Вы уверены?',
                text: `Вы действительно хотите ${messages[action]} ${selected} объявлений?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Да, продолжить',
                cancelButtonText: 'Отмена'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('<input>').attr({type: 'hidden', name: 'action', value: action}).appendTo('#bulkForm');
                    $('#bulkForm').submit();
                }
            });
        }

        // Удаление одного объявления
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

        // Просмотр фото
        function viewImage(url) {
            $('#modalImage').attr('src', url);
            $('#imageModal').modal('show');
        }
    </script>
@endpush




