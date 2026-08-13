@extends('admin.layouts.app')
@php
    use App\Enums\ResumeStatus;
    $title = 'Просмотр резюме #' . $resume->id;
@endphp
@section('title', $title)

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6"><h1>{{ $title }}</h1></div>
                <div class="col-sm-6">
                    @include('admin.partials.breadcrumbs', [
                        'first' => 'Резюме',
                        'first_link' => route('admin.resumes.index'),
                        'second' => $title,
                        'active' => 2
                    ])
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-8">
                    @if($resume->status === ResumeStatus::REJECTED && $resume->reject_reason)
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>Причина отклонения:</strong> {{ $resume->reject_reason }}
                        </div>
                    @endif

                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h3 class="card-title">Информация о резюме</h3>
                            <span class="badge badge-{{ $resume->status->color() }} badge-lg">{{ $resume->status->label() }}</span>
                        </div>
                        <div class="card-body">
                            <dl class="row">
                                <dt class="col-sm-3">Должность:</dt>
                                <dd class="col-sm-9"><strong>{{ $resume->position }}</strong></dd>

                                <dt class="col-sm-3">Город:</dt>
                                <dd class="col-sm-9">{{ $resume->city }}{{ $resume->district ? ', '.$resume->district : '' }}</dd>

                                <dt class="col-sm-3">Зарплата:</dt>
                                <dd class="col-sm-9">{{ $resume->formatted_salary ? $resume->formatted_salary.' ₸' : '—' }}</dd>

                                <dt class="col-sm-3">Тип занятости:</dt>
                                <dd class="col-sm-9">{{ $resume->employment_type ?: '—' }}</dd>

                                <dt class="col-sm-3">График работы:</dt>
                                <dd class="col-sm-9">{{ $resume->work_schedule ?: '—' }}</dd>

                                <dt class="col-sm-3">Образование:</dt>
                                <dd class="col-sm-9">
                                    {{ $resume->education_level ?: '—' }}
                                    @if($resume->educational_institution) — {{ $resume->educational_institution }} @endif
                                    @if($resume->faculty) ({{ $resume->faculty }}) @endif
                                    @if($resume->graduation_year), {{ $resume->graduation_year }} @endif
                                </dd>

                                <dt class="col-sm-3">Наличие ИП:</dt>
                                <dd class="col-sm-9">{{ $resume->ip_status ? 'Присутствует' : 'Отсутствует' }}</dd>

                                <dt class="col-sm-3">Автомобиль:</dt>
                                <dd class="col-sm-9">{{ $resume->has_car ? 'Есть' : 'Нет' }}</dd>

                                @if($resume->driving_license_title)
                                    <dt class="col-sm-3">Водительские права:</dt>
                                    <dd class="col-sm-9">{{ $resume->driving_license_title }}</dd>
                                @endif

                                <dt class="col-sm-3">Контакты:</dt>
                                <dd class="col-sm-9">
                                    @if($resume->phone)<a href="tel:+{{ $resume->phone }}">+{{ $resume->phone }}</a>@endif
                                    @if($resume->email) &middot; <a href="mailto:{{ $resume->email }}">{{ $resume->email }}</a>@endif
                                </dd>

                                @if($resume->skills)
                                    <dt class="col-sm-3">Навыки:</dt>
                                    <dd class="col-sm-9">
                                        @foreach($resume->skills as $skill)
                                            <span class="badge badge-light">{{ $skill }}</span>
                                        @endforeach
                                    </dd>
                                @endif

                                <dt class="col-sm-3">О себе:</dt>
                                <dd class="col-sm-9">{!! nl2br(e($resume->about)) !!}</dd>
                            </dl>

                            @if($resume->organizations->isNotEmpty())
                                <hr>
                                <h5 class="mb-3">Опыт работы</h5>
                                @foreach($resume->organizations as $org)
                                    <div class="mb-2">
                                        <strong>{{ $org->position }}</strong> — {{ $org->organization }}
                                        <div class="text-muted"><small>{{ str_replace('until_now', 'по настоящее время', $org->period) }}</small></div>
                                        @if($org->responsibilities)<div>{{ $org->responsibilities }}</div>@endif
                                    </div>
                                @endforeach
                            @endif

                            @if($resume->languages->isNotEmpty())
                                <hr>
                                <h5 class="mb-2">Языки</h5>
                                @foreach($resume->languages as $lang)
                                    <span class="badge badge-light">{{ $lang->language }}</span>
                                @endforeach
                            @endif
                        </div>
                        <div class="card-footer">
                            <div class="btn-group">
                                <a href="{{ route('admin.resumes.edit', $resume) }}" class="btn btn-primary"><i class="fas fa-edit"></i> Редактировать</a>

                                @if($resume->status !== ResumeStatus::ACTIVE)
                                    <form action="{{ route('admin.resumes.approve', $resume) }}" method="POST" class="d-inline">
                                        @csrf
                                        <button type="submit" class="btn btn-success"><i class="fas fa-check"></i> Одобрить</button>
                                    </form>
                                @endif

                                @if($resume->status !== ResumeStatus::REJECTED)
                                    <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#rejectModal"><i class="fas fa-times"></i> Отклонить</button>
                                @endif

                                @if($resume->status === ResumeStatus::ACTIVE)
                                    <a href="{{ route('resumes.show', $resume->id) }}" target="_blank" class="btn btn-outline-info"><i class="fas fa-external-link-alt"></i> На сайте</a>
                                @endif

                                <button type="button" class="btn btn-danger" onclick="deleteResume({{ $resume->id }})"><i class="fas fa-trash"></i> Удалить</button>
                            </div>
                        </div>
                    </div>

                    {{-- История статусов --}}
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">История изменений статуса</h3></div>
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
                                @forelse($resume->statusHistory as $history)
                                    <tr>
                                        <td>{{ $history->changed_at->format('d.m.Y H:i') }}</td>
                                        <td>
                                            @if($history->status_from)
                                                <span class="badge badge-secondary">{{ ResumeStatus::from($history->status_from)->label() }}</span>
                                            @else
                                                <span class="text-muted">—</span>
                                            @endif
                                        </td>
                                        <td><span class="badge badge-{{ ResumeStatus::from($history->status_to)->color() }}">{{ ResumeStatus::from($history->status_to)->label() }}</span></td>
                                        <td>{{ $history->changedBy->name ?? 'Система' }}</td>
                                        <td>{{ $history->comment }}</td>
                                    </tr>
                                @empty
                                    <tr><td colspan="5" class="text-center text-muted">История отсутствует</td></tr>
                                @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {{-- Боковая панель --}}
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Кандидат</h3></div>
                        <div class="card-body">
                            <dl class="mb-0">
                                <dt>Имя:</dt><dd>{{ $resume->user->name ?? '—' }}</dd>
                                <dt>Телефон:</dt><dd>{{ $resume->user && $resume->user->phone ? '+'.$resume->user->phone : 'Не указан' }}</dd>
                                <dt>Email:</dt><dd>{{ $resume->user->email ?? '—' }}</dd>
                                @if($resume->user)
                                    <dt>Дата регистрации:</dt><dd>{{ $resume->user->created_at->format('d.m.Y') }}</dd>
                                @endif
                            </dl>
                            @if($resume->user)
                                <a href="{{ route('user', $resume->user->id) }}" target="_blank" class="btn btn-sm btn-primary btn-block mt-2">
                                    <i class="fas fa-user"></i> Профиль на сайте
                                </a>
                            @endif
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Служебное</h3></div>
                        <div class="card-body">
                            <dl class="mb-0">
                                <dt>ID резюме:</dt><dd><code>{{ $resume->id }}</code></dd>
                                <dt>Создано:</dt><dd>{{ $resume->created_at->format('d.m.Y H:i') }}</dd>
                                <dt>Обновлено:</dt><dd>{{ $resume->updated_at->format('d.m.Y H:i') }}</dd>
                                @if($resume->published_at)
                                    <dt>Опубликовано:</dt><dd>{{ $resume->published_at->format('d.m.Y H:i') }}</dd>
                                @endif
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- Модальное окно отклонения --}}
    <div class="modal fade" id="rejectModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <form action="{{ route('admin.resumes.reject', $resume) }}" method="POST">
                    @csrf
                    <div class="modal-header">
                        <h4 class="modal-title">Отклонить резюме</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Причина отклонения <span class="text-danger">*</span></label>
                            <textarea name="reason" class="form-control" rows="4" required
                                      placeholder="Причина будет показана соискателю в его профиле">{{ old('reason') }}</textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                        <button type="submit" class="btn btn-warning"><i class="fas fa-times"></i> Отклонить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop

@push('scripts')
    <script>
        function deleteResume(id) {
            Swal.fire({
                title: 'Вы уверены?',
                text: 'Это действие нельзя отменить.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Да, удалить',
                cancelButtonText: 'Отмена'
            }).then((result) => {
                if (result.isConfirmed) {
                    const form = $('<form>', { method: 'POST', action: `/admin/resumes/${id}` });
                    $('<input>').attr({ type: 'hidden', name: '_token', value: '{{ csrf_token() }}' }).appendTo(form);
                    $('<input>').attr({ type: 'hidden', name: '_method', value: 'DELETE' }).appendTo(form);
                    form.appendTo('body').submit();
                }
            });
        }
    </script>
@endpush
