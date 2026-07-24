@extends('admin.layouts.app')
@php
    $title = 'Резюме';
    $count = $resumes->count();
    $page = request('page') ?? 1;
    $perPage = $resumes->perPage();
    $from = ($perPage * ($page - 1)) + 1;
    $to = $from + $count - 1;
@endphp
@section('title', $title)

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6"><h1>{{ $title }}</h1></div>
                <div class="col-sm-6">
                    @include('admin.partials.breadcrumbs', ['first' => $title, 'active' => 1])
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            {{-- Фильтры --}}
                            <form method="GET" class="row g-3 mb-3">
                                <div class="col-md-5">
                                    <input type="text" name="search" class="form-control"
                                           placeholder="Поиск по ID, должности, автору..."
                                           value="{{ request('search') }}">
                                </div>
                                <div class="col-md-3">
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
                                    <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-search"></i></button>
                                </div>
                                <div class="col-md-2">
                                    <a href="{{ route('admin.resumes.index') }}" class="btn btn-secondary btn-block"><i class="fas fa-times"></i> Сброс</a>
                                </div>
                            </form>

                            {{-- Массовые действия --}}
                            <form method="POST" action="{{ route('admin.resumes.bulk-action') }}" id="bulkForm">
                                @csrf
                                <div class="btn-toolbar mb-3">
                                    <div class="btn-group mr-2">
                                        <button type="button" class="btn btn-success" onclick="bulkAction('approve')"><i class="fas fa-check"></i> Одобрить</button>
                                        <button type="button" class="btn btn-warning" onclick="bulkAction('reject')"><i class="fas fa-times"></i> Отклонить</button>
                                        <button type="button" class="btn btn-danger" onclick="bulkAction('delete')"><i class="fas fa-trash"></i> Удалить</button>
                                    </div>
                                    <div class="ml-auto"><span class="badge badge-info">Всего: {{ $resumes->total() }}</span></div>
                                </div>

                                <small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $resumes->total() }}.</small>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                        <tr>
                                            <th width="30"><input type="checkbox" id="selectAll"></th>
                                            <th width="60">ID</th>
                                            <th>Кандидат</th>
                                            <th>Должность</th>
                                            <th>Город</th>
                                            <th>Зарплата</th>
                                            <th>Статус</th>
                                            <th>Дата</th>
                                            <th width="130">Действия</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        @forelse($resumes as $resume)
                                            <tr>
                                                <td><input type="checkbox" name="resumes[]" value="{{ $resume->id }}" class="resume-checkbox"></td>
                                                <td>{{ $resume->id }}</td>
                                                <td>
                                                    <div>{{ $resume->user->name ?? '—' }}</div>
                                                    <small class="text-muted">+{{ $resume->user->phone ?? '' }}</small>
                                                </td>
                                                <td>
                                                    <a href="{{ route('admin.resumes.show', $resume) }}" class="font-weight-bold">
                                                        {{ Str::limit($resume->position, 40) }}
                                                    </a>
                                                </td>
                                                <td>{{ $resume->city }}</td>
                                                <td><small>{{ $resume->formatted_salary ? $resume->formatted_salary.' ₸' : '—' }}</small></td>
                                                <td><span class="badge badge-{{ $resume->status->color() }}">{{ $resume->status->label() }}</span></td>
                                                <td>
                                                    <div>{{ $resume->created_at->format('d.m.Y') }}</div>
                                                    <small class="text-muted">{{ $resume->created_at->format('H:i') }}</small>
                                                </td>
                                                <td>
                                                    <div class="btn-group btn-group-sm">
                                                        <a href="{{ route('admin.resumes.show', $resume) }}" class="btn btn-info" title="Просмотр"><i class="fas fa-eye"></i></a>
                                                        <a href="{{ route('admin.resumes.edit', $resume) }}" class="btn btn-primary" title="Редактировать"><i class="fas fa-edit"></i></a>
                                                        <button type="button" class="btn btn-danger" onclick="deleteResume({{ $resume->id }})" title="Удалить"><i class="fas fa-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        @empty
                                            <tr>
                                                <td colspan="9" class="text-center text-muted py-4">
                                                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>Резюме не найдены
                                                </td>
                                            </tr>
                                        @endforelse
                                        </tbody>
                                    </table>
                                </div>
                            </form>

                            <div class="mt-3">{{ $resumes->appends(request()->query())->links() }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@stop

@push('scripts')
    <script>
        $('#selectAll').on('change', function () {
            $('.resume-checkbox').prop('checked', $(this).prop('checked'));
        });

        function bulkAction(action) {
            const selected = $('.resume-checkbox:checked').length;
            if (selected === 0) {
                Swal.fire('Внимание', 'Выберите хотя бы одно резюме', 'warning');
                return;
            }
            const messages = { approve: 'одобрить', reject: 'отклонить', delete: 'удалить' };
            Swal.fire({
                title: 'Вы уверены?',
                text: `Вы действительно хотите ${messages[action]} ${selected} резюме?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Да, продолжить',
                cancelButtonText: 'Отмена'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('<input>').attr({ type: 'hidden', name: 'action', value: action }).appendTo('#bulkForm');
                    $('#bulkForm').submit();
                }
            });
        }

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
