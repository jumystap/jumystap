@php
    $count = $announcements->count();
    $page = request('page') ?? 1;
    $perPage = $announcements->perPage();
    $total = $announcements->total();
    $from = ($perPage * ($page - 1)) + 1;
    $to = $from + $count - 1;
@endphp
<small class="float-right">Отображено {{ $count }} элементов с {{ $from }} по {{ $to }} из {{ $announcements->total() }}.</small>

<table class="table table-bordered">
    <thead>
    <tr>
        <th class="text-center" style="width: 80px;">#</th>
        <th>Компания</th>
        <th>Наименование</th>
        <th>Статус</th>
        <th>Создано</th>
        <th>Изменено</th>
        <th>Опубликовано</th>
        <th style="width: 15%;">Действия</th>
    </tr>
    </thead>
    <tbody>
    @foreach($announcements as $announcement)
        <tr id="{{ $announcement->id }}" data-index="{{ $loop->index }}">
            <td>{{ $announcement->id }}</td>
            <td>{{ $announcement->user->name }}</td>
            <td>{{ $announcement->title }}</td>
            <td>
                <span class="badge badge-{{ $announcement->status->getClass() }}">
                {{ $announcement->status->getLabel() }}
                </span>
            </td>
            <td>{{ $announcement->created_at }}</td>
            <td>{{ $announcement->updated_at }}</td>
            <td>{{ $announcement->published_at }}</td>
            <td>
                <div class='btn-group'>
                    <form action="{{ route('admin.announcements.destroy', $announcement) }}" class="d-inline"
                          method="post">
                        @csrf
                        @method('delete')
                        <a href="{{ route('admin.announcements.edit', $announcement) }}" class='btn btn-outline-info'><i class="fas fa-key"></i></a>
                        <a href="../announcement/{{$announcement->id}}" target="_blank" class='btn btn-outline-info'><i class="fas fa-eye"></i></a>
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
