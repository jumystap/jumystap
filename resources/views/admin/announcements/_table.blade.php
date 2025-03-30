<table class="table table-bordered">
    <thead>
    <tr>
        <th class="text-center" style="width: 80px;">#</th>
        <th>ФИО</th>
        <th>Наименование</th>
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
                <div class='btn-group'>
                    <form action="{{ route('admin.announcements.destroy', $announcement) }}" class="d-inline"
                          method="post">
                        @csrf
                        @method('delete')
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
