<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header"><h3 class="card-title">Содержание резюме</h3></div>
            <div class="card-body">
                <div class="form-group">
                    <label>Должность <span class="text-danger">*</span></label>
                    <input type="text" name="position" class="form-control" value="{{ old('position', $resume->position) }}" maxlength="100" required>
                </div>

                <div class="row">
                    <div class="col-md-6 form-group">
                        <label>Телефон <span class="text-danger">*</span></label>
                        <input type="text" name="phone" class="form-control" value="{{ old('phone', $resume->phone) }}" maxlength="20" required>
                    </div>
                    <div class="col-md-6 form-group">
                        <label>Email</label>
                        <input type="email" name="email" class="form-control" value="{{ old('email', $resume->email) }}">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 form-group">
                        <label>Город <span class="text-danger">*</span></label>
                        <input type="text" name="city" class="form-control" value="{{ old('city', $resume->city) }}" required>
                    </div>
                    <div class="col-md-6 form-group">
                        <label>Район</label>
                        <input type="text" name="district" class="form-control" value="{{ old('district', $resume->district) }}">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 form-group">
                        <label>Зарплата (₸)</label>
                        <input type="number" name="salary" class="form-control" value="{{ old('salary', $resume->salary) }}" min="0">
                    </div>
                    <div class="col-md-4 form-group">
                        <label>Тип занятости</label>
                        <select name="employment_type_id" class="form-control">
                            <option value="">—</option>
                            @foreach($employmentTypes as $value => $label)
                                <option value="{{ $value }}" {{ (string) old('employment_type_id', $resume->employment_type_id) === (string) $value ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 form-group">
                        <label>График работы</label>
                        <select name="work_schedule_id" class="form-control">
                            <option value="">—</option>
                            @foreach($workSchedules as $value => $label)
                                <option value="{{ $value }}" {{ (string) old('work_schedule_id', $resume->work_schedule_id) === (string) $value ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 form-group">
                        <label>Уровень образования</label>
                        <select name="education_level_id" class="form-control">
                            <option value="">—</option>
                            @foreach($educationLevels as $value => $label)
                                <option value="{{ $value }}" {{ (string) old('education_level_id', $resume->education_level_id) === (string) $value ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 form-group">
                        <label>Учебное заведение</label>
                        <input type="text" name="educational_institution" class="form-control" value="{{ old('educational_institution', $resume->educational_institution) }}">
                    </div>
                    <div class="col-md-2 form-group">
                        <label>Факультет</label>
                        <input type="text" name="faculty" class="form-control" value="{{ old('faculty', $resume->faculty) }}">
                    </div>
                    <div class="col-md-2 form-group">
                        <label>Год выпуска</label>
                        <input type="number" name="graduation_year" class="form-control" value="{{ old('graduation_year', $resume->graduation_year) }}">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 form-group">
                        <label>Водительские права</label>
                        <select name="driving_license" class="form-control">
                            <option value="">—</option>
                            @foreach($drivingLicenses as $value => $label)
                                <option value="{{ $value }}" {{ (string) old('driving_license', $resume->driving_license) === (string) $value ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 form-group">
                        <label class="d-block">Наличие ИП</label>
                        <div class="custom-control custom-switch mt-2">
                            <input type="checkbox" class="custom-control-input" id="ip_status" name="ip_status" value="1" {{ old('ip_status', $resume->ip_status) ? 'checked' : '' }}>
                            <label class="custom-control-label" for="ip_status">Присутствует</label>
                        </div>
                    </div>
                    <div class="col-md-4 form-group">
                        <label class="d-block">Автомобиль</label>
                        <div class="custom-control custom-switch mt-2">
                            <input type="checkbox" class="custom-control-input" id="has_car" name="has_car" value="1" {{ old('has_car', $resume->has_car) ? 'checked' : '' }}>
                            <label class="custom-control-label" for="has_car">Есть</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Навыки</label>
                    <div id="skillsContainer">
                        @php $skillsList = old('skills', $resume->skills ?? []); @endphp
                        @forelse($skillsList as $skill)
                            <div class="input-group mb-2 skill-row">
                                <input type="text" name="skills[]" class="form-control" value="{{ $skill }}">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-danger remove-skill"><i class="fas fa-times"></i></button>
                                </div>
                            </div>
                        @empty
                            <div class="input-group mb-2 skill-row">
                                <input type="text" name="skills[]" class="form-control">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-danger remove-skill"><i class="fas fa-times"></i></button>
                                </div>
                            </div>
                        @endforelse
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-secondary" id="addSkill"><i class="fas fa-plus"></i> Добавить навык</button>
                </div>

                <div class="form-group">
                    <label>О себе <span class="text-danger">*</span></label>
                    <textarea name="about" class="form-control" rows="6" maxlength="10000" required>{{ old('about', $resume->about) }}</textarea>
                </div>
            </div>
        </div>

        @if($resume->organizations->isNotEmpty() || $resume->languages->isNotEmpty())
            <div class="card">
                <div class="card-header"><h3 class="card-title">Опыт и языки (только просмотр)</h3></div>
                <div class="card-body">
                    @if($resume->organizations->isNotEmpty())
                        <h6>Опыт работы</h6>
                        <ul>
                            @foreach($resume->organizations as $org)
                                <li>{{ $org->position }} — {{ $org->organization }}
                                    <small class="text-muted">({{ str_replace('until_now', 'по настоящее время', $org->period) }})</small></li>
                            @endforeach
                        </ul>
                    @endif
                    @if($resume->languages->isNotEmpty())
                        <h6>Языки</h6>
                        @foreach($resume->languages as $lang)<span class="badge badge-light">{{ $lang->language }}</span>@endforeach
                    @endif
                    <small class="text-muted d-block mt-2">Опыт работы и языки редактируются соискателем в личном кабинете.</small>
                </div>
            </div>
        @endif
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header"><h3 class="card-title">Модерация</h3></div>
            <div class="card-body">
                <div class="form-group">
                    <label>Статус <span class="text-danger">*</span></label>
                    <select name="status" class="form-control" required>
                        @foreach($statuses as $status)
                            <option value="{{ $status->value }}" {{ old('status', $resume->status->value) === $status->value ? 'selected' : '' }}>{{ $status->label() }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group">
                    <label>Комментарий к смене статуса</label>
                    <textarea name="status_comment" class="form-control" rows="3" maxlength="500" placeholder="Необязательно">{{ old('status_comment') }}</textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-save"></i> Сохранить</button>
                <a href="{{ route('admin.resumes.show', $resume) }}" class="btn btn-secondary btn-block">Отмена</a>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        (function () {
            const container = document.getElementById('skillsContainer');
            const rowHtml = '<div class="input-group mb-2 skill-row">' +
                '<input type="text" name="skills[]" class="form-control">' +
                '<div class="input-group-append"><button type="button" class="btn btn-outline-danger remove-skill"><i class="fas fa-times"></i></button></div>' +
                '</div>';
            document.getElementById('addSkill').addEventListener('click', function () {
                container.insertAdjacentHTML('beforeend', rowHtml);
            });
            container.addEventListener('click', function (e) {
                const btn = e.target.closest('.remove-skill');
                if (btn) { btn.closest('.skill-row').remove(); }
            });
        })();
    </script>
@endpush
