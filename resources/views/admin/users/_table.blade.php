@php
    use App\Enums\Roles;
    $count = $users->count();
    $page = request('page') ?? 1;
    $perPage = $users->perPage();
    $total = $users->total();
    $from = ($perPage * ($page - 1)) + 1;
    $to = $from + $count - 1;
@endphp
<small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $users->total() }}.</small>

<table class="table table-bordered">
    <thead>
    <tr>
        <th class="text-center" style="width: 80px;">#</th>
        <th>ФИО</th>
        <th>Email</th>
        <th>Телефон</th>
        <th>Роль</th>
        <th>Статус</th>
        <th style="width: 15%;">Действия</th>
    </tr>
    </thead>
    <tbody>
    @foreach($users as $user)
        <tr id="{{ $user->id }}" data-index="{{ $loop->index }}">
            <td>{{ $user->id }}</td>
            <td>
                {{ $user->name }}
                @if($user->is_blocked)
                    <span class="badge badge-danger">Заблокирован</span>
                @endif
            </td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->phone }}</td>
            <td>{{ $user->role->name_ru ?? '' }}
                @if(in_array($user->role->id, [Roles::EMPLOYER->value, Roles::CUSTOMER->value]))
                    ({{ count($user->announcement) }})
                @endif
            </td>
            <td>
                @if($user->role_id === Roles::GRADUATE->value)
                    @if($user->status === 'В активном поиске')
                        <span class="badge badge-primary">{{ $user->status }}</span>
                    @else
                        <span class="badge badge-light">{{ $user->status }}</span>
                    @endif

                    @if($responses = count($user->response))
                        <span class="badge badge-warning">Откликов: {{ $responses }}</span>
                    @endif
                @endif
            </td>
            <td>
                <div class='btn-group'>
                    <form action="{{ route('admin.users.destroy', $user) }}" class="d-inline"
                          method="post">
                        @csrf
                        @method('delete')
                        @if(in_array($user->role->id, [1, 3]) && count($user->announcement) > 0)
                            <a href="{{ route('admin.announcements.index', ['user_id' => $user->id]) }}" class='btn btn-outline-warning'><i class="fas fa-eye"></i></a>
                        @endif
                        <a href="{{ route('admin.users.edit', $user) }}" class='btn btn-outline-info'><i class="fas fa-pen"></i></a>
                        <button type="submit" class="btn btn-outline-danger"  onclick="return confirm('Вы действительно хотите удалить?')">
                            <i class="fas fa-trash fa-fw"></i>
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    @endforeach
    </tbody>
</table>
