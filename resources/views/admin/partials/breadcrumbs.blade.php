<ol class="breadcrumb float-sm-right">
    <li class="breadcrumb-item"><a href="{{ route('admin.index') }}">Главная</a></li>
    @if(isset($first) && $first)
        @if($active == 1)
            <li class="breadcrumb-item active">
                {{ $first }}
            </li>
        @else
            <li class="breadcrumb-item">
                <a href="{{ $first_link }}">
                    {{ $first }}
                </a>
            </li>
        @endif
    @endif
    @if(isset($second) && $second)
        @if($active == 2)
            <li class="breadcrumb-item active">
                {{ $second }}
            </li>
        @else
            <li class="breadcrumb-item">
                <a href="{{ $second_link }}">
                    {{ $second }}
                </a>
            </li>
        @endif
    @endif
</ol>
