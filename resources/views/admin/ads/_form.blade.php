@php

use App\Models\User;
use \App\Enums\PriceType;

@endphp

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Основная информация</h3>
            </div>
            <div class="card-body">
                {{-- Автор (с AJAX поиском через Select2) --}}
                <div class="form-group">
                    <label>Автор объявления <span class="text-danger">*</span></label>
                    <select name="user_id"
                            id="user_id"
                            class="js-select2 form-control @error('user_id') is-invalid @enderror"
                        {{ isset($ad) ? 'disabled' : 'required' }}>
                        @if(isset($ad))
                            <option value="{{ $ad->user_id }}" selected>
                                {{ $ad->user->name }} ({{ $ad->user->email }})
                            </option>
                        @elseif(old('user_id'))
                            @php
                                $selectedUser = User::query()->find(old('user_id'));
                            @endphp
                            @if($selectedUser)
                                <option value="{{ $selectedUser->id }}" selected>
                                    {{ $selectedUser->name }} ({{ $selectedUser->email }})
                                </option>
                            @endif
                        @else
                            <option value="">Начните вводить имя или email...</option>
                        @endif
                    </select>
                    @if(isset($ad))
                        <input type="hidden" name="user_id" value="{{ $ad->user_id }}">
                        <small class="form-text text-muted">
                            <i class="fas fa-info-circle"></i> Автора нельзя изменить после создания
                        </small>
                    @endif
                    @error('user_id')
                    <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Информация о выбранном пользователе --}}
                <div id="userInfo" class="alert alert-info" style="display: none;">
                    <h6><i class="fas fa-user"></i> Информация о пользователе</h6>
                    <dl class="row mb-0">
                        <dt class="col-sm-4">Имя:</dt>
                        <dd class="col-sm-8" id="userName">-</dd>

                        <dt class="col-sm-4">Email:</dt>
                        <dd class="col-sm-8" id="userEmail">-</dd>

                        <dt class="col-sm-4">Телефон:</dt>
                        <dd class="col-sm-8" id="userPhone">-</dd>

                    </dl>
                    <button type="button" class="btn btn-sm btn-primary" id="fillUserData">
                        <i class="fas fa-download"></i> Заполнить данные пользователя
                    </button>
                </div>

                <hr>

                {{-- Тип объявления --}}
{{--                @if(!isset($ad))--}}
                    <div class="form-group">
                        <label>Тип объявления <span class="text-danger">*</span></label>
                        <div class="row">
                            @foreach($types as $type)
                                <div class="col-md-6">
                                    <div class="custom-control custom-radio">
                                        <input type="radio"
                                               id="type_{{ $type->value }}"
                                               name="type"
                                               class="custom-control-input @error('type') is-invalid @enderror"
                                               value="{{ $type->value }}"
                                               {{ old('type', $ad->type->value ?? 'service') == $type->value ? 'checked' : '' }}
                                               required>
                                        <label class="custom-control-label" for="type_{{ $type->value }}">
                                            <i class="fas fa-{{ $type->icon() }}"></i>
                                            {{ $type->label() }}
                                        </label>
                                    </div>
                                </div>
                            @endforeach

                        </div>
                        @error('type')
                        <span class="invalid-feedback d-block">{{ $message }}</span>
                        @enderror
                    </div>
                    <hr>
{{--                @endif--}}

                {{-- Название --}}
                <div class="form-group">
                    <label>Название <span class="text-danger">*</span></label>
                    <input type="text"
                           name="title"
                           class="form-control @error('title') is-invalid @enderror"
                           value="{{ old('title', $ad->title ?? '') }}"
                           maxlength="80"
                           required
                           placeholder="Например: Снимаю Reels">
                    <small class="form-text text-muted">Максимум 80 символов</small>
                    @error('title')
                    <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Описание --}}
                <div class="form-group">
                    <label>Описание <span class="text-danger">*</span></label>
                    <textarea name="description"
                              id="description"
                              class="editor tinymce-editor form-control @error('description') is-invalid @enderror"
                              placeholder="Подробное описание вашего предложения...">{{ old('description', $ad->description ?? '') }}</textarea>
                    @error('description')
                    <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="row">
                    {{-- Категория --}}
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Категория <span class="text-danger">*</span></label>
                            <select name="category_id"
                                    id="category_id"
                                    class="form-control @error('category_id') is-invalid @enderror"
                                    required>
                                <option value="">Выберите категорию</option>
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}"
                                            data-children='@json($category->children)'
                                        {{ old('category_id', $ad->category_id ?? '') == $category->id ? 'selected' : '' }}>
                                        {{ $category->name_ru }}
                                    </option>
                                @endforeach
                            </select>
                            @error('category_id')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    {{-- Подкатегория --}}
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Подкатегория</label>
                            <select name="subcategory_id"
                                    id="subcategory_id"
                                    class="form-control @error('subcategory_id') is-invalid @enderror">
                                <option value="">Без подкатегории</option>
                            </select>
                            @error('subcategory_id')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="row">
                    {{-- Город --}}
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Город <span class="text-danger">*</span></label>
                            <select name="city_id"
                                    class="form-control js-select2 @error('city_id') is-invalid @enderror"
                                    data-placeholder="Выберите город"
                                    required>
                                <option value="">Выберите город</option>
                                @foreach($cities as $city)
                                    <option value="{{ $city->id }}"
                                        {{ old('city_id', $ad->city_id ?? '') == $city->id ? 'selected' : '' }}>
                                        {{ $city->title }}
                                    </option>
                                @endforeach
                            </select>
                            @error('city_id')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    {{-- Адрес --}}
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Адрес</label>
                            <input type="text"
                                   name="address"
                                   class="form-control @error('address') is-invalid @enderror"
                                   value="{{ old('address', $ad->address ?? '') }}"
                                   maxlength="255"
                                   placeholder="Улица, дом">
                            @error('address')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                </div>

                {{-- Удаленно --}}
                <div class="form-group" id="remote_block" style="{{ (old('type', $ad->type->value ?? 'service') === 'service') ? '' : 'display:none' }}">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox"
                               class="custom-control-input"
                               id="is_remote"
                               name="is_remote"
                               value="1"
                            {{ old('is_remote', $ad->is_remote ?? false) ? 'checked' : '' }}>
                        <label class="custom-control-label" for="is_remote">
                            Можно удаленно
                        </label>
                    </div>
                </div>

                <hr>

                {{-- Цена --}}
                <h5>Цена</h5>
                <div class="form-group">
                    <label>Тип цены <span class="text-danger">*</span></label>
                    <select name="price_type"
                            id="price_type"
                            class="form-control @error('price_type') is-invalid @enderror"
                            required>
                        @foreach(PriceType::cases() as $priceType)
                            <option value="{{ $priceType->value }}"
                                {{ old('price_type', $ad->price_type->value ?? 'exact') == $priceType->value ? 'selected' : '' }}>
                                {{ $priceType->label() }}
                            </option>
                        @endforeach
                    </select>
                    @error('price_type')
                    <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Точная цена --}}
                <div class="form-group" id="price_exact_block">
                    <label>Цена, ₸</label>
                    <input type="number"
                           name="price_exact"
                           class="form-control @error('price_exact') is-invalid @enderror"
                           value="{{ old('price_exact', $ad->price_exact ?? '') }}"
                           min="0"
                           step="0.01"
                           placeholder="10000">
                    @error('price_exact')
                    <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Диапазон цены --}}
                <div id="price_range_block" style="display: none;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Цена от, ₸</label>
                                <input type="number"
                                       name="price_from"
                                       class="form-control @error('price_from') is-invalid @enderror"
                                       value="{{ old('price_from', $ad->price_from ?? '') }}"
                                       min="0"
                                       step="0.01"
                                       placeholder="5000">
                                @error('price_from')
                                <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Цена до, ₸</label>
                                <input type="number"
                                       name="price_to"
                                       class="form-control @error('price_to') is-invalid @enderror"
                                       value="{{ old('price_to', $ad->price_to ?? '') }}"
                                       min="0"
                                       step="0.01"
                                       placeholder="15000">
                                @error('price_to')
                                <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>

                <hr>

                {{-- Контакты --}}
                <h5>Контактная информация</h5>

                <div class="form-group">
                    <div class="custom-control custom-checkbox">
                        @if (isset($ad) && $ad->use_profile_phone == 1)
                            <input type="checkbox" class="custom-control-input" id="use_profile_phone" name="use_profile_phone" checked="" value="1">
                        @else
                            <input type="checkbox" class="custom-control-input" id="use_profile_phone" name="use_profile_phone" {{ old('use_profile_phone') ? 'checked' : '' }} value="1">
                        @endif
                        <label class="custom-control-label" for="use_profile_phone">
                            Использовать профиль в Телефоне
                        </label>
                    </div>
                </div>
                <div id="phone_block" class="form-group">
                    <label>Контактный телефон <span class="text-danger">*</span></label>
                    <input type="text"
                           id="phone"
                           name="phone"
                           class="form-control @error('phone') is-invalid @enderror"
                           value="{{ old('phone', $ad->phone ?? '') }}"
                           maxlength="20"
                           placeholder="+7 (777) 123-45-67"
                           >
                    @error('phone')
                    <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Instagram</label>
                            <input type="text"
                                   name="instagram"
                                   class="form-control @error('instagram') is-invalid @enderror"
                                   value="{{ old('instagram', $ad->instagram ?? '') }}"
                                   maxlength="255"
                                   placeholder="Ссылка на Instagram">
                            @error('instagram')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>TikTok</label>
                            <input type="text"
                                   name="tiktok"
                                   class="form-control @error('tiktok') is-invalid @enderror"
                                   value="{{ old('tiktok', $ad->tiktok ?? '') }}"
                                   maxlength="255"
                                   placeholder="Ссылка на TikTok">
                            @error('tiktok')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>2GIS</label>
                            <input type="text"
                                   name="twogis"
                                   class="form-control @error('twogis') is-invalid @enderror"
                                   value="{{ old('twogis', $ad->twogis ?? '') }}"
                                   maxlength="255"
                                   placeholder="Ссылка на 2GIS">
                            @error('twogis')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Сайт</label>
                            <input type="text"
                                   name="site"
                                   class="form-control @error('site') is-invalid @enderror"
                                   value="{{ old('site', $ad->site ?? '') }}"
                                   maxlength="255"
                                   placeholder="Ссылка на сайт">
                            @error('site')
                            <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                </div>

{{--                <div class="form-group">--}}
{{--                    <label>Вид деятельности</label>--}}
{{--                    <select name="business_type_id"--}}
{{--                            class="form-control @error('business_type_id') is-invalid @enderror"--}}
{{--                            data-placeholder="Выберите вид деятельности">--}}
{{--                        <option value="">Не выбрано</option>--}}
{{--                        @foreach($businessTypes as $type)--}}
{{--                            <option value="{{ $type->id }}"--}}
{{--                                {{ old('business_type_id', $ad->business_type_id ?? '') == $type->id ? 'selected' : '' }}>--}}
{{--                                {{ $type->name }}--}}
{{--                            </option>--}}
{{--                        @endforeach--}}
{{--                    </select>--}}
{{--                    @error('business_type_id')--}}
{{--                    <span class="invalid-feedback">{{ $message }}</span>--}}
{{--                    @enderror--}}
{{--                </div>--}}
            </div>
        </div>

        {{-- Фотографии --}}
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Фотографии</h3>
            </div>
            <div class="card-body">
                {{-- Существующие фото --}}
                @if(isset($ad) && $ad->photos->isNotEmpty())
                    <h5>Загруженные фотографии</h5>
                    <div class="row mb-3" id="existingPhotos">
                        @foreach($ad->photos as $photo)
                            <div class="col-md-4 mb-3" id="photo_{{ $photo->id }}">
                                <div class="card">
                                    <img src="{{ $photo->thumbnail_url }}"
                                         alt=""
                                         class="card-img-top"
                                         style="height: 200px; object-fit: cover; cursor: pointer;"
                                         onclick="viewImage('{{ $photo->url }}')">
                                    <div class="card-body p-2 text-center">
                                        <button type="button"
                                                class="btn btn-danger btn-sm btn-block"
                                                onclick="deleteExistingPhoto({{ $ad->id }}, {{ $photo->id }})">
                                            <i class="fas fa-trash"></i> Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    <hr>
                @endif

                <div class="form-group">
                    <label>
                        {{ isset($ad) && $ad->photos->isNotEmpty() ? 'Добавить новые фото' : 'Загрузить фото' }}
                        <span id="maxPhotosLabel">(максимум {{ 6 - (isset($ad) ? $ad->photos->count() : 0) }})</span>
                    </label>
                    <div class="custom-file" id="photoDropZone" style="cursor: pointer; border: 2px dashed #ccc; border-radius: 4px; padding: 20px; text-align: center; transition: all 0.3s ease; background-color: #f8f9fa;">
                        <input type="file"
                               class="custom-file-input @error('photos') is-invalid @enderror"
                               id="photos"
                               name="photos[]"
                               multiple
                               accept="image/jpeg,image/jpg,image/png,image/webp"
                               style="display: none;">
                        <label class="custom-file-label d-block mb-0" for="photos" style="cursor: pointer; user-select: none;">
                            <i class="fas fa-cloud-upload-alt fa-2x text-primary mb-2" style="display: block;"></i>
                            <span style="font-weight: 500;">Выберите файлы или перетащите их сюда</span><br>
                            <small class="text-muted">Форматы: JPEG, PNG, WEBP. Максимальный размер: 5 МБ</small>
                        </label>
                    </div>
                    @error('photos')
                    <span class="invalid-feedback d-block">{{ $message }}</span>
                    @enderror
                    @error('photos.*')
                    <span class="invalid-feedback d-block">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Превью новых фото --}}
                <div id="photoPreview" class="row mt-3"></div>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        {{-- Статус и управление --}}
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">{{ isset($ad) ? 'Управление' : 'Публикация' }}</h3>
            </div>
            <div class="card-body">
                @if(isset($ad))
                    {{-- Редактирование --}}
                    <div class="form-group">
                        <label>Статус <span class="text-danger">*</span></label>
                        <select name="status"
                                class="form-control @error('status') is-invalid @enderror"
                                required>
                            @foreach($statuses as $status)
                                <option value="{{ $status->value }}"
                                    {{ old('status', $ad->status->value) == $status->value ? 'selected' : '' }}>
                                    {{ $status->label() }}
                                </option>
                            @endforeach
                        </select>
                        @error('status')
                        <span class="invalid-feedback">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label>Комментарий к изменению статуса</label>
                        <textarea name="status_comment"
                                  class="form-control"
                                  rows="3"
                                  placeholder="Опционально">{{ old('status_comment') }}</textarea>
                    </div>

                    <hr>

                    <dl class="mb-0">
                        <dt>Тип:</dt>
                        <dd>
                            <span class="badge badge-secondary">
                                <i class="fas fa-{{ $ad->type->icon() }}"></i>
                                {{ $ad->type->label() }}
                            </span>
                        </dd>

                        <dt>Автор:</dt>
                        <dd>
                            {{ $ad->user->name }}<br>
                            <small class="text-muted">{{ $ad->user->email }}</small>
                        </dd>
                    </dl>
                @else
                    {{-- Создание --}}
                    <div class="form-group">
                        <label>Статус публикации</label>
                        <select name="status" class="form-control">
                            @foreach(\App\Enums\AdStatus::cases() as $status)
                                <option value="{{ $status->value }}"
                                    {{ old('status', 'moderation') == $status->value ? 'selected' : '' }}>
                                    {{ $status->label() }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="alert alert-info">
                        <i class="icon fas fa-info-circle"></i>
                        Вы создаете объявление от имени выбранного пользователя
                    </div>
                @endif
            </div>
            <div class="card-footer">
                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fas fa-save"></i> {{ isset($ad) ? 'Сохранить изменения' : 'Создать объявление' }}
                </button>
                <a href="{{ isset($ad) ? route('admin.ads.show', $ad) : route('admin.ads.index') }}"
                   class="btn btn-secondary btn-block">
                    <i class="fas fa-times"></i> Отмена
                </a>
            </div>
        </div>

        {{-- Подсказки --}}
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">💡 Подсказки</h3>
            </div>
            <div class="card-body">
                <ul class="pl-3 mb-0">
                    <li class="mb-2">Заголовок: макс. 80 символов</li>
                    <li class="mb-2">Описание: 100-1000 символов</li>
                    <li class="mb-2">Фотографии: до 3 штук, макс. 5 МБ</li>
                    <li>Форматы фото: JPEG, PNG, WEBP</li>
                </ul>
            </div>
        </div>
    </div>
</div>

{{-- Модальное окно для просмотра фото --}}
<div class="modal fade" id="imageModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body p-0">
                <img src="" id="modalImage" class="img-fluid w-100">
            </div>
        </div>
    </div>
</div>
@push('stylesheets')
    <link rel="stylesheet" href="{{ asset('admin/assets/js/plugins/select2/css/select2.min.css') }}">
@endpush
@push('scripts')
    <script src="{{ asset('admin/assets/js/plugins/select2/js/select2.full.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('admin/assets/js/plugins/inputmask/jquery.inputmask.min.js') }}"></script>
@endpush
@push('scripts')

    <script>
        $(document).ready(function() {
            $('#phone').inputmask({
                mask: '+9 (999) 999-99-99',
                placeholder: '_',
                showMaskOnHover: false,
                showMaskOnFocus: true,
                clearIncomplete: false,
                onBeforePaste: function (pastedValue) {
                    return pastedValue.replace(/[^0-9]/g, '');
                }
            });
            // ============================================
            // Инициализация Select2 для поиска пользователей (AJAX)
            // ============================================
            @if(!isset($ad))
            $('#user_id').select2({
                width: '100%',
                placeholder: 'Начните вводить имя или email...',
                allowClear: true,
                minimumInputLength: 2,
                ajax: {
                    url: '{{ route('admin.users.search') }}',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term,
                            page: params.page || 1
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: data.results,
                            pagination: data.pagination
                        };
                    },
                    cache: true
                },
                templateResult: formatUser,
                templateSelection: formatUserSelection,
                escapeMarkup: function(markup) { return markup; }
            });

            // Форматирование результата в выпадающем списке
            function formatUser(user) {
                if (user.loading) {
                    return 'Поиск...';
                }

                if (!user.id) {
                    return user.text;
                }

                return `
            <div class="select2-result-user">
                <div class="select2-result-user__avatar">
                    <i class="fas fa-user-circle fa-2x text-muted"></i>
                </div>
                <div class="select2-result-user__meta">
                    <div class="select2-result-user__title">${user.text}</div>
                    <div class="select2-result-user__description">
                        <i class="fas fa-phone"></i> ${user.phone || 'Телефон не указан'}
                    </div>
                </div>
            </div>
        `;
            }

            // Форматирование выбранного значения
            function formatUserSelection(user) {
                return user.text || user.name || 'Выберите пользователя';
            }

            // Загрузка информации о пользователе
            $('#user_id').on('select2:select', function(e) {
                const userId = e.params.data.id;

                if (userId) {
                    loadUserInfo(userId);
                }
            });

            // // Очистка информации при снятии выбора
            $('#user_id').on('select2:unselect', function() {
                $('#userInfo').slideUp();
            });

            // Функция загрузки данных пользователя
            function loadUserInfo(userId) {
                $.ajax({
                    url: `/admin/users/info/${userId}`,
                    method: 'GET',
                    success: function(data) {
                        // Обновляем информацию в карточке
                        $('#userName').text(data.name);
                        $('#userEmail').text(data.email);
                        $('#userPhone').text(data.phone || 'Не указан');

                        // Сохраняем данные для автозаполнения
                        $('#userInfo').data('userData', data).slideDown();
                    },
                    error: function() {
                        Swal.fire('Ошибка', 'Не удалось загрузить данные пользователя', 'error');
                    }
                });
            }

            // Автозаполнение данных пользователя
            $('#fillUserData').on('click', function() {
                const userData = $('#userInfo').data('userData');

                if (userData) {
                    // Заполняем контактный телефон
                    if (userData.phone) {
                        $('input[name="phone"]').val(userData.phone);
                    }

                    if (userData.business_type_id) {
                        $('select[name="business_type_id"]').val(userData.business_type_id).trigger('change');
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Данные заполнены',
                        text: 'Данные пользователя успешно подставлены в форму',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            });
            @endif

            // Подкатегории
            const categorySelect = $('#category_id');
            const subcategorySelect = $('#subcategory_id');
            const selectedSubcategory = '{{ old('subcategory_id', $ad->subcategory_id ?? '') }}';

            function loadSubcategories() {
                const selected = categorySelect.find(':selected');
                const children = selected.data('children');

                subcategorySelect.html('<option value="">Без подкатегории</option>');

                if (children && children.length) {
                    children.forEach(child => {
                        const option = $('<option>', {
                            value: child.id,
                            text: child.name,
                            selected: child.id == selectedSubcategory
                        });
                        subcategorySelect.append(option);
                    });
                    subcategorySelect.closest('.form-group').show();
                } else {
                    subcategorySelect.closest('.form-group').hide();
                }
            }

            categorySelect.on('change', loadSubcategories);
            if (categorySelect.val()) {
                loadSubcategories();
            }

            // Переключение типа цены
            const priceTypeSelect = $('#price_type');
            const priceExactBlock = $('#price_exact_block');
            const priceRangeBlock = $('#price_range_block');

            function togglePriceFields() {
                const type = priceTypeSelect.val();

                priceExactBlock.toggle(type === 'exact');
                priceRangeBlock.toggle(type === 'range');

                if (type === 'exact') {
                    $('input[name="price_exact"]').prop('required', true);
                    $('input[name="price_from"], input[name="price_to"]').prop('required', false);
                } else if (type === 'range') {
                    $('input[name="price_exact"]').prop('required', false);
                } else {
                    $('input[name="price_exact"], input[name="price_from"], input[name="price_to"]').prop('required', false);
                }
            }

            priceTypeSelect.on('change', togglePriceFields);
            togglePriceFields();

            const usePhoneChecked = $('#use_profile_phone');

            function useProfilePhone() {
                if (usePhoneChecked.is(':checked')) {
                    $('#phone_block').hide();
                } else {
                    $('#phone_block').show();
                }
            }

            usePhoneChecked.on('change', useProfilePhone);
            useProfilePhone();

            // Показ поля "Удаленно" только для услуг
            const typeInputs = $('input[name="type"]');
            const remoteBlock = $('#remote_block');

            function toggleRemoteField() {
                const selectedType = $('input[name="type"]:checked').val();
                remoteBlock.toggle(selectedType === 'service');
            }

            typeInputs.on('change', toggleRemoteField);
            toggleRemoteField();

            // Drag-and-drop для фотографий
            const dropZone = $('#photoDropZone');
            const photoInput = $('#photos');

            dropZone.on('click', function() {
                photoInput.click();
            });

            // Предотвращение стандартного поведения при drag-over
            dropZone.on('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.css({
                    backgroundColor: '#e8f4f8',
                    borderColor: '#007bff'
                });
            });

            dropZone.on('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.css({
                    backgroundColor: '#f8f9fa',
                    borderColor: '#ccc'
                });
            });

            dropZone.on('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.css({
                    backgroundColor: '#f8f9fa',
                    borderColor: '#ccc'
                });

                const files = e.originalEvent.dataTransfer.files;
                photoInput[0].files = files;
                photoInput.trigger('change');
            });

            // Превью фотографий
            let maxPhotosInitial = {{ 6 - (isset($ad) ? $ad->photos->count() : 0) }};
            let selectedFilesMap = new Map(); // Для отслеживания выбранных файлов

            function updatePhotoPreview() {
                const preview = $('#photoPreview');
                const totalSelected = selectedFilesMap.size;

                // Обновляем счётчик
                const remaining = maxPhotosInitial - totalSelected;
                const forms = remaining === 1 ? 'фотография' : remaining > 4 ? 'фотографий' : 'фотографии';
                $('#maxPhotosLabel').text(`(загружено: ${totalSelected}, осталось: ${remaining} ${forms})`);

                // Очищаем превью и перестраиваем его
                preview.empty();

                selectedFilesMap.forEach((fileData, fileIndex) => {
                    const col = $('<div>').addClass('col-md-4 mb-3').attr('data-file-index', fileIndex);
                    const card = $('<div>').addClass('card position-relative');
                    const img = $('<img>').attr('src', fileData.preview)
                        .addClass('card-img-top')
                        .css({height: '200px', objectFit: 'cover', cursor: 'pointer'})
                        .on('click', function() {
                            $('#modalImage').attr('src', fileData.preview);
                            $('#imageModal').modal('show');
                        });

                    const body = $('<div>').addClass('card-body p-2')
                        .append($('<small>').addClass('text-muted text-break').text(fileData.name));

                    const deleteBtn = $('<button>')
                        .attr('type', 'button')
                        .addClass('btn btn-danger btn-sm btn-block')
                        .html('<i class="fas fa-trash"></i> Удалить')
                        .on('click', function(e) {
                            e.preventDefault();
                            selectedFilesMap.delete(fileIndex);
                            updatePhotoPreview();
                            updateInputFiles();
                        });

                    card.append(img).append(body);
                    const footer = $('<div>').addClass('card-footer p-2').append(deleteBtn);
                    card.append(footer);
                    col.append(card);
                    preview.append(col);
                });
            }

            function updateInputFiles() {
                const photoInput = $('#photos')[0];
                const dataTransfer = new DataTransfer();

                selectedFilesMap.forEach((fileData) => {
                    dataTransfer.items.add(fileData.file);
                });

                photoInput.files = dataTransfer.files;
            }

            $('#photos').on('change', function() {
                const files = this.files;
                const newFilesCount = files.length;
                const currentCount = selectedFilesMap.size;

                // Проверяем лимит
                if (currentCount + newFilesCount > maxPhotosInitial) {
                    const remaining = maxPhotosInitial - currentCount;
                    const forms = remaining === 1 ? 'фотография' : remaining > 4 ? 'фотографий' : 'фотографии';
                    Swal.fire('Внимание', `Вы можете добавить еще только ${remaining} ${forms}`, 'warning');
                    this.value = '';
                    return;
                }

                // Добавляем новые файлы
                Array.from(files).forEach((file) => {
                    if (file.size > 5242880) { // 5MB
                        Swal.fire('Ошибка', `Файл "${file.name}" превышает максимальный размер 5 МБ`, 'error');
                        return;
                    }

                    if (!file.type.match('image.*')) {
                        Swal.fire('Ошибка', `Файл "${file.name}" не является изображением`, 'error');
                        return;
                    }

                    const fileIndex = Date.now() + Math.random(); // Уникальный ID для файла
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        selectedFilesMap.set(fileIndex, {
                            file: file,
                            name: file.name,
                            preview: e.target.result
                        });
                        updatePhotoPreview();
                        updateInputFiles();
                    };
                    reader.readAsDataURL(file);
                });

                // Очищаем input для возможности выбрать те же файлы еще раз
                this.value = '';
            });
        });

        // Удаление существующего фото
        function deleteExistingPhoto(adId, photoId) {
            Swal.fire({
                title: 'Удалить фото?',
                text: 'Это действие нельзя отменить',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Да, удалить',
                cancelButtonText: 'Отмена'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: `/admin/ads/${adId}/photos/${photoId}`,
                        method: 'DELETE',
                        data: {
                            _token: '{{ csrf_token() }}'
                        },
                        success: function(response) {
                            if (response.success) {
                                $(`#photo_${photoId}`).fadeOut(300, function() {
                                    $(this).remove();
                                    maxPhotos++;
                                    $('#maxPhotosLabel').text(`(максимум ${maxPhotos})`);
                                    Swal.fire('Удалено!', 'Фото успешно удалено', 'success');
                                });
                            }
                        },
                        error: function(xhr) {
                            Swal.fire('Ошибка!', 'Не удалось удалить фото', 'error');
                        }
                    });
                }
            });
        }

        // Просмотр фото
        function viewImage(url) {
            $('#modalImage').attr('src', url);
            $('#imageModal').modal('show');
        }
    </script>

    <style>
        .select2-container--default .select2-selection--single {
            padding: .15rem .5rem;
        }
    </style>
@endpush
@include('admin.partials.editor')
