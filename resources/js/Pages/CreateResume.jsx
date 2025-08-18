import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {Form, Checkbox, Input, Select, DatePicker, Tag, Button, Space, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import GuestLayout from '@/Layouts/GuestLayout';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';

const { Option } = Select;
const { TextArea } = Input;

const kazakhstanCities = [
    'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз',
    'Павлодар', 'Усть-Каменогорск', 'Семей', 'Костанай', 'Петропавловск',
    'Кызылорда', 'Атырау', 'Актау', 'Уральск', 'Темиртау', 'Талдыкорган',
    'Экибастуз', 'Рудный', 'Жезказган',
];

const CreateUpdateResume = ({ user, drivingLicenses, employmentTypes, workSchedules, educationLevels }) => {
    const { t } = useTranslation('createResume');
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);
    const [editMode, setEditMode] = useState([true]);
    const gender = user.gender === 'м' ? t('male', { ns: 'createResume' }) : t('female', { ns: 'createResume' });

    const { data, setData, post, errors } = useForm({
        email: '',
        phone: '',
        city: '',
        district: '',
        position: '',
        salary: '',
        employment_type_id: '',
        work_schedule_id: '',
        organizations: [{
            organization: '',
            position: '',
            responsibilities: '',
            period: '',
            isCurrent: false,
            start_date: '',
            end_date: ''
        }],
        no_work_experience: false,
        education_level_id: '',
        faculty: '',
        educational_institution: '',
        graduation_year: null,
        languages: [],
        skills: [],
        newSkill: '',
        ip_status: '',
        driving_license: '',
        about: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleCityChange = (value) => {
        setData('city', value);
        setShowOtherCityInput(value === 'Другое');
    };

    const handleNoWorkExperienceChange = (e) => {
        const checked = e.target.checked;
        setData((prevData) => ({
            ...prevData,
            no_work_experience: checked,
            organizations: checked ? [] : [{
                organization: '',
                position: '',
                responsibilities: '',
                period: '',
                isCurrent: false,
                start_date: '',
                end_date: ''
            }],
        }));
        setEditMode(checked ? [] : [true]);
    };

    const addOrganization = () => {
        if (!data.no_work_experience) {
            setData('organizations', [
                ...data.organizations,
                {
                    organization: '',
                    position: '',
                    responsibilities: '',
                    period: '',
                    isCurrent: false,
                    start_date: '',
                    end_date: ''
                },
            ]);
            setEditMode([...editMode, true]);
        }
    };

    const updatePeriod = (index) => {
        const updatedOrganizations = [...data.organizations];
        const { start_date, end_date, isCurrent } = updatedOrganizations[index];

        let period = '';
        if (start_date) {
            try {
                period = `${format(new Date(start_date), 'd MMM yyyy', { locale: ru })} - `;
                period += isCurrent ? t('until_present') : (end_date ? format(new Date(end_date), 'd MMM yyyy', { locale: ru }) : '');
            } catch (error) {
                console.error('Invalid date format:', error);
            }
        }
        updatedOrganizations[index].period = period;
        setData('organizations', updatedOrganizations);
    };

    const handleDateChange = (index, field, value) => {
        const updatedOrganizations = [...data.organizations];
        updatedOrganizations[index][field] = value;
        updatePeriod(index);
        setData('organizations', updatedOrganizations);
    };

    const handleCheckboxChange = (index) => {
        const updatedOrganizations = [...data.organizations];
        updatedOrganizations[index].isCurrent = !updatedOrganizations[index].isCurrent;
        if (updatedOrganizations[index].isCurrent) {
            updatedOrganizations[index].end_date = '';
        }
        updatePeriod(index);
        setData('organizations', updatedOrganizations);
    };

    const removeOrganization = (index) => {
        const updatedOrganizations = data.organizations.filter((_, i) => i !== index);
        setData('organizations', updatedOrganizations);
        setEditMode(editMode.filter((_, i) => i !== index));
    };

    function isValidPhone(phone) {
        if (!phone) return false;

        const digits = phone.replace(/\D/g, '');
        if (digits.length !== 11) return false;

        const code = digits.substring(1, 4); // 2nd to 4th digits (index 1 to 3)
        const validCodes = ['700', '701', '702', '705', '706', '707', '708', '771', '775', '777', '778'];

        return validCodes.includes(code);
    }

    const handleSubmit = () => {
        const errors = {};

        if (data.phone && !isValidPhone(data.phone)) {
            errors.phone = t('invalid_phone_number');
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const submitAction = post;
        const url = '/resumes/create';
        submitAction(url, {
            ...data,
            onSuccess: () => message.success(t('successfully_saved')),
            onError: (err) => {
                message.error(t('failed_to_save'));
                console.error('Failed to save announcement:', err);
            }
        });
    };

    const handleInputChange = (field, value) => {
        setData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleNestedChange = (index, field, value) => {
        const updatedOrganizations = [...data.organizations];
        updatedOrganizations[index] = { ...updatedOrganizations[index], [field]: value };
        setData('organizations', updatedOrganizations);
    };

    const toggleEditMode = (index) => {
        setEditMode((prevEditMode) => {
            const newEditMode = [...prevEditMode];
            newEditMode[index] = !newEditMode[index];
            return newEditMode;
        });
    };

    const addSkill = () => {
        if (data.newSkill.trim() && !data.skills.includes(data.newSkill.trim())) {
            setData((prevData) => ({
                ...prevData,
                skills: [...prevData.skills, prevData.newSkill.trim()],
                newSkill: '',
            }));
        } else if (data.newSkill.trim()) {
            alert(t('skill_already_added'));
        }
    };

    const removeSkill = (removedSkill, e) => {
        e.preventDefault();
        setData('skills', data.skills.filter((skill) => skill !== removedSkill));
    };

    return (
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="col-span-5 p-5">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <div className="font-semibold text-2xl mb-4">{t('create_resume')}</div>
                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_1')}</div>
                        <Form.Item
                            name="full_name"
                            label={t('full_name')}
                        >
                            <Input
                                defaultValue={user.name}
                                disabled
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            name="date_of_birth"
                            label={t('date_of_birth')}
                        >
                            <Input
                                defaultValue={format(new Date(user.date_of_birth), 'dd.MM.yyyy')}
                                disabled
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            label={t('gender')}
                        >
                            <Input
                                defaultValue={gender}
                                disabled
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label={t('email')}
                            validateStatus={(validationErrors.email || errors.email) ? 'error' : ''}
                            help={validationErrors.email || errors.email}
                        >
                            <Input
                                value={data.email}
                                type="email"
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label={t('phone')}
                            rules={[
                                { required: true, message: t('enter_phone') },
                            ]}
                            validateStatus={(validationErrors.phone || errors.phone) ? 'error' : ''}
                            help={validationErrors.phone || errors.phone}
                        >
                            <PhoneInput
                                country={'kz'}
                                onlyCountries={['kz']}
                                value={data.phone}
                                onChange={(value) => setData('phone', value)}
                                specialLabel=""
                                inputClass="ant-input css-dev-only-do-not-override-qnu6hi ant-input-outlined text-sm rounded py-1 mt-[0px] border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('city')}
                            name="city"
                            className="mt-4"
                            rules={[{ required: true, message: t('select_city') }]}
                            validateStatus={(validationErrors.city || errors.city) ? 'error' : ''}
                            help={validationErrors.city || errors.city}
                        >
                            <Select value={data.city} onChange={handleCityChange}>
                                {kazakhstanCities.map((city) => (
                                    <Option key={city} value={city}>
                                        {city}
                                    </Option>
                                ))}
                                <Option value="Дистанционное">{t('remote')}</Option>
                                <Option value="Другое">{t('other')}</Option>
                            </Select>
                        </Form.Item>
                        {showOtherCityInput && (
                            <Form.Item
                                label={t('enter_other_city')}
                                name="city"
                                rules={[{ required: true, message: t('enter_city') }]}
                                validateStatus={(validationErrors.city || errors.city) ? 'error' : ''}
                                help={validationErrors.city || errors.city}
                            >
                                <Input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="text-sm rounded py-1 border border-gray-300"
                                />
                            </Form.Item>
                        )}
                        {data.city === 'Астана' && (
                            <Form.Item
                                label={t('residence_area')}
                                name="district"
                                rules={[{ required: true, message: t('select_residence_area') }]}
                                validateStatus={(validationErrors.district || errors.district) ? 'error' : ''}
                                help={validationErrors.district || errors.district}
                            >
                                <Select value={data.district} onChange={(value) => handleInputChange('district', value)}>
                                    <Option value="Есиль">Есиль</Option>
                                    <Option value="Алматы">Алматы</Option>
                                    <Option value="Нура">Нура</Option>
                                    <Option value="Сарыарка">Сарыарка</Option>
                                    <Option value="Байконур">Байконур</Option>
                                </Select>
                            </Form.Item>
                        )}

                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_2')}</div>
                        <Form.Item
                            name="position"
                            label={t('position')}
                            rules={[{ required: true, message: t('enter_position') }]}
                            validateStatus={(validationErrors.position || errors.position) ? 'error' : ''}
                            help={validationErrors.position || errors.position}
                        >
                            <Input
                                value={data.position}
                                onChange={(e) => handleInputChange('position', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            name="salary"
                            label={t('salary')}
                            validateStatus={(validationErrors.salary || errors.salary) ? 'error' : ''}
                            help={validationErrors.salary || errors.salary}
                        >
                            <Input
                                value={data.salary}
                                onChange={(e) => handleInputChange('salary', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('work_schedule')}
                            name="work_schedule_id"
                            className="mt-4"
                            validateStatus={(validationErrors.work_schedule_id || errors.work_schedule_id) ? 'error' : ''}
                            help={validationErrors.work_schedule_id || errors.work_schedule_id}
                        >
                            <Select value={data.work_schedule_id} onChange={(value) => handleInputChange('work_schedule_id', value)}>
                                {Object.entries(workSchedules).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('employment_type')}
                            name="employment_type_id"
                            className="mt-4"
                            validateStatus={(validationErrors.employment_type_id || errors.employment_type_id) ? 'error' : ''}
                            help={validationErrors.employment_type_id || errors.employment_type_id}
                        >
                            <Select value={data.employment_type_id} onChange={(value) => handleInputChange('employment_type_id', value)}>
                                {Object.entries(employmentTypes).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_3')}</div>
                        <Form.Item name="no_work_experience" valuePropName="checked">
                            <Checkbox
                                checked={data.no_work_experience}
                                onChange={handleNoWorkExperienceChange}
                            >
                                {t('no_work_experience')}
                            </Checkbox>
                        </Form.Item>

                        {!data.no_work_experience && (
                            <>
                                {data.organizations.map((organization, index) => (
                                    <Space key={index} direction="vertical" style={{ display: 'flex', marginBottom: 5 }}>
                                        {editMode[index] ? (
                                            <>
                                                <Form.Item
                                                    label={t('organization_name')}
                                                    name={`organization_${index}_name`}
                                                    rules={[{ required: true, message: t('enter_organization_name') }]}
                                                    validateStatus={(validationErrors[`organizations.${index}.organization`] || errors[`organizations.${index}.organization`]) ? 'error' : ''}
                                                    help={validationErrors[`organizations.${index}.organization`] || errors[`organizations.${index}.organization`]}
                                                >
                                                    <Input
                                                        value={organization.organization}
                                                        onChange={(e) => handleNestedChange(index, 'organization', e.target.value)}
                                                        className="text-sm rounded py-1 border border-gray-300"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={t('position')}
                                                    name={`organization_${index}_position`}
                                                    rules={[{ required: true, message: t('enter_position') }]}
                                                    validateStatus={(validationErrors[`organizations.${index}.position`] || errors[`organizations.${index}.position`]) ? 'error' : ''}
                                                    help={validationErrors[`organizations.${index}.position`] || errors[`organizations.${index}.position`]}
                                                >
                                                    <Input
                                                        value={organization.position}
                                                        onChange={(e) => handleNestedChange(index, 'position', e.target.value)}
                                                        className="text-sm rounded py-1 border border-gray-300"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={t('responsibilities')}
                                                    name={`organization_${index}_responsibilities`}
                                                    validateStatus={(validationErrors[`organizations.${index}.responsibilities`] || errors[`organizations.${index}.responsibilities`]) ? 'error' : ''}
                                                    help={validationErrors[`organizations.${index}.responsibilities`] || errors[`organizations.${index}.responsibilities`]}
                                                >
                                                    <TextArea
                                                        value={organization.responsibilities}
                                                        onChange={(e) => handleNestedChange(index, 'responsibilities', e.target.value)}
                                                        rows={2}
                                                        className="text-sm rounded py-1 border border-gray-300"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={t('work_period')}
                                                    rules={[{ required: true, message: t('select_start_date') }]}
                                                    validateStatus={(validationErrors[`organizations.${index}.period`] || errors[`organizations.${index}.period`]) ? 'error' : ''}
                                                    help={validationErrors[`organizations.${index}.period`] || errors[`organizations.${index}.period`]}
                                                >
                                                    <div className="flex gap-x-5">
                                                        <div>
                                                            <input
                                                                type="date"
                                                                value={organization.start_date}
                                                                onChange={(e) => handleDateChange(index, 'start_date', e.target.value)}
                                                                className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            {!organization.isCurrent && (
                                                                <input
                                                                    type="date"
                                                                    value={organization.end_date}
                                                                    onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
                                                                    className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                                />
                                                            )}
                                                            <Checkbox
                                                                checked={organization.isCurrent}
                                                                className="flex"
                                                                onChange={() => handleCheckboxChange(index)}
                                                            >
                                                                {t('until_present')}
                                                            </Checkbox>
                                                        </div>
                                                    </div>
                                                </Form.Item>
                                                <div className="flex items-center gap-x-2">
                                                    <Button type="primary" onClick={() => toggleEditMode(index)}>
                                                        {t('save')}
                                                    </Button>
                                                    <Button danger onClick={() => removeOrganization(index)}>
                                                        {t('delete_workplace')}
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="border border-gray-200 py-4 mt-2 px-5 rounded-lg">
                                                <p>
                                                    <strong>{t('organization')}:</strong> {organization.organization}
                                                </p>
                                                <p>
                                                    <strong>{t('position')}:</strong> {organization.position}
                                                </p>
                                                <p>
                                                    <strong>{t('responsibilities')}:</strong> {organization.responsibilities}
                                                </p>
                                                <p>
                                                    <strong>{t('work_period')}:</strong> {organization.period}
                                                </p>
                                                <div className="flex mt-4 items-center gap-x-2">
                                                    <Button type="dashed" onClick={() => toggleEditMode(index)}>
                                                        {t('edit')}
                                                    </Button>
                                                    <Button danger onClick={() => removeOrganization(index)}>
                                                        {t('delete_workplace')}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Space>
                                ))}
                                <Button type="dashed" className="mt-3" onClick={addOrganization} icon={<PlusOutlined />}>
                                    {t('add_more_workplaces')}
                                </Button>
                            </>
                        )}
                        <hr />
                        <br/>

                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_4')}</div>
                        <Form.Item
                            label={t('education_level')}
                            name="education_level_id"
                            className="mt-4"
                            rules={[{ required: true, message: t('select_education_level') }]}
                            validateStatus={(validationErrors.education_level_id || errors.education_level_id) ? 'error' : ''}
                            help={validationErrors.education_level_id || errors.education_level_id}
                        >
                            <Select value={data.education_level_id} onChange={(value) => handleInputChange('education_level_id', value)}>
                                {Object.entries(educationLevels).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {data.education_level_id != 1 && (
                            <>
                                <Form.Item
                                    name="educational_institution"
                                    label={t('educational_institution')}
                                    validateStatus={(validationErrors.educational_institution || errors.educational_institution) ? 'error' : ''}
                                    help={validationErrors.educational_institution || errors.educational_institution}
                                >
                                    <Input
                                        value={data.educational_institution}
                                        onChange={(e) => handleInputChange('educational_institution', e.target.value)}
                                        className="text-sm rounded py-1 border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="faculty"
                                    label={t('faculty_and_specialization')}
                                    validateStatus={(validationErrors.faculty || errors.faculty) ? 'error' : ''}
                                    help={validationErrors.faculty || errors.faculty}
                                >
                                    <Input
                                        value={data.faculty}
                                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                                        className="text-sm rounded py-1 border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="year"
                                    label={t('graduation_year')}
                                    validateStatus={(validationErrors.graduation_year || errors.graduation_year) ? 'error' : ''}
                                    help={validationErrors.graduation_year || errors.graduation_year}
                                >
                                    <DatePicker
                                        picker="year"
                                        placeholder={t('graduation_year')}
                                        value={data.graduation_year ? moment(data.graduation_year) : null}
                                        onChange={(date) => handleInputChange('graduation_year', date ? date.format('YYYY') : null)}
                                    />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            label={t('languages')}
                            name="languages"
                        >
                            <Select
                                mode="multiple"
                                value={data.languages}
                                onChange={(value) => handleInputChange('languages', value)}
                                validateStatus={(validationErrors.languages || errors.languages) ? 'error' : ''}
                                help={validationErrors.languages || errors.languages}
                            >
                                <Option value="Казахский">{t('kazakh')}</Option>
                                <Option value="Русский">{t('russian')}</Option>
                                <Option value="Английский">{t('english')}</Option>
                                <Option value="Немецкий">{t('german')}</Option>
                                <Option value="Французский">{t('french')}</Option>
                                <Option value="Китайский">{t('chinese')}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('skills')}
                            name="skills"
                            validateStatus={(validationErrors.skills || errors.skills) ? 'error' : ''}
                            help={validationErrors.skills || errors.skills}
                        >
                            <div className="flex items-center gap-x-2">
                                <Input
                                    value={data.newSkill}
                                    onChange={(e) => setData('newSkill', e.target.value)}
                                    className="text-sm rounded py-1 border border-gray-300"
                                    placeholder={t('enter_skill_and_press_button')}
                                />
                                <Button onClick={addSkill}>{t('add_skill')}</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.skills.map((skill) => (
                                    <Tag
                                        key={skill}
                                        closable
                                        onClose={(e) => removeSkill(skill, e)}
                                        className="rounded-full bg-gray-100 text-gray-500"
                                    >
                                        {skill}
                                    </Tag>
                                ))}
                            </div>
                        </Form.Item>
                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_5')}</div>
                        <Form.Item
                            label={t('ip_status')}
                            name="ip_status"
                            validateStatus={(validationErrors.ip_status || errors.ip_status) ? 'error' : ''}
                            help={validationErrors.ip_status || errors.ip_status}
                        >
                            <Select value={data.ip_status} onChange={(value) => handleInputChange('ip_status', value)}>
                                <Option value="0">{t('absent')}</Option>
                                <Option value="1">{t('present')}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('has_car')}
                            name="has_car"
                            validateStatus={(validationErrors.has_car || errors.has_car) ? 'error' : ''}
                            help={validationErrors.has_car || errors.has_car}
                        >
                            <Select value={data.has_car} onChange={(value) => handleInputChange('has_car', value)}>
                                <Option value="0">{t('no')}</Option>
                                <Option value="1">{t('yes')}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('driving_license')}
                            name="driving_license"
                            className="mt-4"
                            validateStatus={(validationErrors.driving_license || errors.driving_license) ? 'error' : ''}
                            help={validationErrors.driving_license || errors.driving_license}
                        >
                            <Select value={data.driving_license} onChange={(value) => handleInputChange('driving_license', value)}>
                                {Object.entries(drivingLicenses).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('about')}
                            name="about"
                            rules={[{ required: true, message: t('enter_about') }]}
                            validateStatus={(validationErrors.about || errors.about) ? 'error' : ''}
                            help={validationErrors.about || errors.about}
                        >
                            <TextArea
                                value={data.about}
                                onChange={(e) => handleInputChange('about', e.target.value)}
                                rows={4}
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            {t('create_resume')}
                        </Button>
                    </Form>
                </div>
                <div className="md:h-full sticky top-0 bg-[#F9FAFC] rounded-lg w-full hidden md:block md:col-span-2 p-5 md:relative">
                    <div>
                        <div className="text-lg">{t('troubles_with_creation')}</div>
                        <div className="text-sm font-light text-gray-500">{t('contact_for_help')}</div>
                        <div className="mt-10 text-sm">
                            <div>+7 707 221 31 31</div>
                            <div className="ml-auto">janamumkindik@gmail.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default CreateUpdateResume;
