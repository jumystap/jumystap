<div class="card-body">
    <div class="form-group">
        <label for="title">{{ __('Наименование') }}</label>
        <input name="title" id="title" type="text"
               class="form-control @error('title') is-invalid @enderror"
               value="{{ old('title', $announcement->title ?? null) }}"
        >
        @error('title')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="status">{{ __('Статус') }}</label>
        <select name="status" id="status"
                class="form-control @error('status') is-invalid @enderror">
            <option value>{{ __('Выберите') }}</option>

            @foreach ($statuses as $key => $value)
                <option
                    value="{{ $key }}"
                    @if(old('status') == $key || isset($announcement) && $announcement->status->value == $key) selected="selected" @endif
                >
                    {{ $value }}
                </option>
            @endforeach
        </select>

        @error('status')
        <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>
    <div class="form-group">
        <label for="publish">{{ __('Опубликовать снова') }}</label>
        <input type="checkbox" name="publish" {{ old('publish') ? 'checked' : '' }} value="1">
    </div>
    <div class="form-group">
        <label for="is_top">{{ __('Топ') }}</label>
        @if (isset($announcement) && $announcement->is_top === 1)
            <input type="checkbox" name="is_top" checked="" value="1">
        @else
            <input type="checkbox" name="is_top" {{ old('is_top') ? 'checked' : '' }} value="1">
        @endif
    </div>
    <div class="form-group">
        <label for="is_urgent">{{ __('Срочно') }}</label>
        @if (isset($announcement) && $announcement->is_urgent === 1)
            <input type="checkbox" name="is_urgent" checked="" value="1">
        @else
            <input type="checkbox" name="is_urgent" {{ old('is_urgent') ? 'checked' : '' }} value="1">
        @endif
    </div>
    @if(count($announcement->history))
        <table class="table table-bordered">
            <thead>
            <tr>
                <th>Статус</th>
                <th>Создано</th>
            </tr>
            </thead>
            <tbody>
            @foreach($announcement->history as $history)
                <tr>
                    <td>
                    <span class="badge badge-{{ $history->status->getClass() }}">
                    {{ $history->status->getLabel() }}
                    </span>
                    </td>
                    <td>{{ \Carbon\Carbon::parse($history->created_at)->format('d.m.Y H:i:s') }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @endif
</div>
<div class="card-footer">
    <button type="submit" class="btn btn-success font-weight-bold float-right">
        <i class="fas fa-check-circle fa-fw"></i>
        {{ __('Сохранить') }}
    </button>
</div>
