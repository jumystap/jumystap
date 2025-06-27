import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {Form, Input, Select, DatePicker, Tag, Button, Upload, Space, Cascader, Checkbox, message} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import GuestLayout from '@/Layouts/GuestLayout';
import {useTranslation} from "react-i18next";

const { Option } = Select;

const kazakhstanCities = [
    "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
    "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
    "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
    "Экибастуз", "Рудный", "Жезказган"
];

const UpdateResume = ({ resume, specializations, languages }) => {
    const { t, i18n } = useTranslation('createResume');
    const [showOtherCityInput, setShowOtherCityInput] = useState(resume.city === 'Другое');
    const [editMode, setEditMode] = useState(resume.organizations.map(() => false)); // Initially all organizations are not in edit mode
    const { data, setData, put} = useForm({
        organizations: resume.organizations || [{ organization: '', position_id: '', period: '' }],
        city: resume.city || '',
        district: resume.district || '',
        languages: languages || [],
        photo: resume.photo_path || null,
        education: resume.education || '',
        faculty: resume.faculty || '',
        specialization: resume.specialization || '',
        graduation_year: resume.graduation_year || null,
        ip_status: resume.ip_status || '',
        desired_field: Number(resume.desired_field) || '',
        skills: resume.skills || [],
        newSkill: '',
    });

    const handleCityChange = (value) => {
        setData('city', value);
        setShowOtherCityInput(value === 'Другое');
    };

    const cascaderData = specializations.map(category => ({
        value: category.id,
        label: category.name_ru,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: spec.name_ru
        }))
    }));

    const findCascaderValue = (specializations, specialization_id) => {
        for (let category of specializations) {
            const specialization = category.specialization.find(spec => spec.id === specialization_id);
            if (specialization) {
                return [category.id, specialization.id];
            }
        }
        return [];
    };

    const findSpecializationName = (specializations, specialization_id) => {
        for (let category of specializations) {
            const specialization = category.specialization.find(spec => spec.id === specialization_id);
            if (specialization) {
                return specialization.name_ru// Return the category id and specialization id as a path
            }
        }
        return ''; // Return empty if not found
    };

    const defaultValue = findCascaderValue(specializations, data.desired_field);


    const addOrganization = () => {
        setData('organizations', [...data.organizations, { organization: '', position_id: '', period: null }]);
        setEditMode([...editMode, true]);
    };

    const updatePeriod = (index) => {
        const updatedOrganizations = [...data.organizations];
        const { start_date, end_date, isCurrent } = updatedOrganizations[index];

        let period;
        if (isCurrent) {
            period = `${format(new Date(start_date), 'd MMM yyyy', { locale: ru })} - ` + t('until_present');
        } else {
            period = `${format(new Date(start_date), 'd MMM yyyy', { locale: ru })} - ${end_date ? format(new Date(end_date), 'd MMM yyyy', { locale: ru }) : ''}`;
        }
        updatedOrganizations[index].period = period;
        setData('organizations', updatedOrganizations);
    };

    const handleCheckboxChange = (index) => {
        const updatedOrganizations = [...data.organizations];
        updatedOrganizations[index].isCurrent = !updatedOrganizations[index].isCurrent;

        if (updatedOrganizations[index].isCurrent) {
            updatedOrganizations[index].end_date = ''; // Clear end_date if currently employed
        }

        updatePeriod(index);
        setData('organizations', updatedOrganizations);
    };

    const handleDateChange = (index, field, value) => {
        const updatedOrganizations = [...data.organizations];
        updatedOrganizations[index][field] = value;
        updatePeriod(index);
        setData('organizations', updatedOrganizations);
    };

    const removeOrganization = (index) => {
        const updatedOrganizations = data.organizations.filter((_, i) => i !== index);
        setData('organizations', updatedOrganizations);
        setEditMode(editMode.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        const errors = {};

        const url = `/resumes/${resume.id}`;
        try {
            put(url, data, {
                onSuccess: () => {
                    message.success('Resume saved successfully');
                },
                onError: (errors) => {
                    message.error('Failed to save Resume');
                    console.error('Failed to save Resume:', errors);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
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
        const updatedEditMode = [...editMode];
        updatedEditMode[index] = !updatedEditMode[index];
        setEditMode(updatedEditMode);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            setData('photo', file);
            return false;
        },
    };

    const addSkill = () => {
        if (data.newSkill.trim()) {
            if (!data.skills.includes(data.newSkill.trim())) {
                setData((prevData) => ({
                    ...prevData,
                    skills: [...prevData.skills, prevData.newSkill.trim()],
                    newSkill: ''
                }));
            } else {
                alert("Этот навык уже добавлен");
            }
        }
    };

    const removeSkill = (removedSkill) => {
        setData('skills', data.skills.filter(skill => skill !== removedSkill));
    };

    return (
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="col-span-5 p-5">
                    <Form layout="vertical" onFinish={handleSubmit}  initialValues={data}>
                        <div className='font-semibold text-2xl mb-4'>Редактировать резюме</div>
                        <div className='flex gap-x-5'>
                            {data.photo && (
                                typeof data.photo === 'string' ? (
                                    <img src={`/storage/${data.photo}`} className='w-[200px] h-[250px] object-cover' />
                                ) : (
                                    <img src={URL.createObjectURL(data.photo)} className='w-[200px] h-[250px] object-cover' />
                                )
                            )}
                        <Form.Item label="Загрузите вашу фотографию" name='photo'>
                            <Upload {...uploadProps} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Загрузить фото</Button>
                            </Upload>
                        </Form.Item>
                        </div>

                        <div className='font-semibold text-xl mb-4 mt-2'>{t('specify_work_experience')}</div>
                        {data.organizations.map((organization, index) => (
                            <Space key={index} direction="vertical" style={{ display: 'flex', marginBottom: 5 }}>
                                {editMode[index] ? (
                                    <>
                                        <Form.Item
                                            label={t('organization_name')}
                                            name='organization.name'
                                            rules={[{ required: true, message: t('please_specify_organization_name') }]}
                                        >
                                            <Input
                                                defaultValue={organization.organization}
                                                value={organization.organization}
                                                onChange={(e) => handleNestedChange(index, 'organization', e.target.value)}
                                                className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={t('position')}
                                            name='organization.profession'
                                            className='mt-[-17px]'
                                            rules={[{ required: true, message: t('please_specify_position') }]}
                                        >
                                            <Cascader
                                                options={cascaderData}
                                                defaultValue={findCascaderValue(specializations, Number(organization.position_id))}
                                                onChange={(value) => handleNestedChange(index, 'position_id', value[1])}
                                                placeholder={t('position')}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={t('work_period')}
                                            className='mt-[-17px]'
                                            rules={[{ required: true, message: t('please_specify_start_date') }]}
                                        >
                                            <div className='flex gap-x-5'>
                                                <div>
                                                    <input
                                                        type="date"
                                                        defaultValue={organization.start_date}
                                                        value={organization.start_date}
                                                        onChange={(e) => handleDateChange(index, 'start_date', e.target.value)}
                                                        className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    {!organization.isCurrent && (
                                                        <input
                                                            type="date"
                                                            defaultValue={organization.end_date}
                                                            value={organization.end_date}
                                                            onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
                                                            className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                        />
                                                    )}
                                                    <Checkbox
                                                        checked={organization.isCurrent}
                                                        className='flex'
                                                        onChange={() => handleCheckboxChange(index)}
                                                    >
                                                        {t('until_present')}
                                                    </Checkbox>
                                                </div>
                                                <div>{organization.period}</div>
                                            </div>
                                        </Form.Item>

                                        <div className='flex items-center mt-[-10px] gap-x-2'>
                                            <Button type="primary" onClick={() => toggleEditMode(index)}>{t('save')}</Button>
                                            <Button danger onClick={() => removeOrganization(index)}>
                                                {t('delete_workplace')}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className='border border-gray-200 py-4 mt-2 px-5 rounded-lg'>
                                        <p><strong>{t('organization')}:</strong> {organization.organization}</p>
                                        <p><strong>{t('position')}:</strong> {findSpecializationName(specializations, Number(organization.position_id))}</p>
                                        <p><strong>{t('work_period')}:</strong> {organization.period}</p>
                                        <div className='flex mt-4 items-center gap-x-2'>
                                            <Button type="dashed" onClick={() => toggleEditMode(index)}>Редактировать</Button>
                                            <Button danger onClick={() => removeOrganization(index)}>
                                                {t('delete_workplace')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Space>
                        ))}
                        <Button type="dashed" className='mt-3' onClick={addOrganization} icon={<PlusOutlined />}>
                            {t('add_more_workplaces')}
                        </Button>

                        <Form.Item
                            label={t('city')}
                            name="city"
                            className='mt-4'
                            rules={[{ required: true, message: 'Пожалуйста, выберите город' }]}
                        >
                            <Select value={data.city} onChange={handleCityChange}>
                                {kazakhstanCities.map((city) => (
                                    <Option key={city} value={city}>{city}</Option>
                                ))}
                                <Option value="Другое">Другое</Option>
                            </Select>
                        </Form.Item>

                        {showOtherCityInput && (
                            <Form.Item
                                label={t('enter_other_city')}
                                name="city"
                                rules={[{ required: true, message: 'Пожалуйста, укажите ваш город' }]}
                            >
                                <Input
                                    type="text"
                                    name="city"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    value={data.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                />
                            </Form.Item>
                        )}

                        {data.city === 'Астана' && (
                            <Form.Item
                                label={t('specify_residence_area')}
                                name="district"
                                rules={[{ required: true, message: t('please_specify_residence_area') }]}
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

                        <Form.Item
                            label={t('specify_languages')}
                            name='languages'
                            className='mt-4'
                            rules={[{ required: true, message: t('please_specify_languages') }]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                value={data.languages}
                                onChange={(value) => handleInputChange('languages', value)}
                            >
                                <Option value="Казахский">{t('kazakh')}</Option>
                                <Option value="Русский">{t('russian')}</Option>
                                <Option value="Английский">{t('english')}</Option>
                                <Option value="Немецкий">{t('german')}</Option>
                                <Option value="Французкий">{t('french')}</Option>
                                <Option value="Китайский">{t('chinese')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('specify_education')}
                            name='education'
                            rules={[{ required: true, message: t('please_specify_education') }]}
                        >
                            <Select
                                value={data.education}
                                name="education"
                                onChange={(value) => handleInputChange('education', value)}>
                                <Option value="Среднее">{t('secondary')}</Option>
                                <Option value="Среднее специальное">{t('secondary_special')}</Option>
                                <Option value="Неоконченное высшее">{t('incomplete_higher')}</Option>
                                <Option value="Высшее">{t('higher')}</Option>
                            </Select>
                        </Form.Item>
                        {data.education !== 'Среднее' && (
                            <>
                                <Form.Item
                                    name='faculty'
                                    label={t('faculty_and_specialization')}
                                    rules={[{ required: data.education !== 'Среднее', message: t('please_specify_desired_work_field') }]}
                                >
                                    <Input
                                        value={data.faculty}
                                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                                        className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name='year'
                                    // rules={[{ required: data.education !== 'Среднее', message: t('please_specify_graduation_year') }]}
                                    label={t('graduation_year')}
                                >
                                    <DatePicker
                                        picker="year"
                                        placeholder={t('graduation_year')}
                                        defaultValue={data.graduation_year ? moment(data.graduation_year, 'YYYY') : null}
                                        onChange={(date) =>
                                            handleInputChange('graduation_year', date ? date.format('YYYY') : null)
                                        }
                                    />

                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            label={t('specify_ip_status')}
                            name='ip_status'
                            rules={[{ required: true, message: t('please_specify_ip_status') }]}
                        >
                            <Select value={data.ip_status} onChange={(value) => handleInputChange('ip_status', value)}>
                                <Option value="Присутствует">{t('present')}</Option>
                                <Option value="Отсутствует">{t('absent')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('desired_work_field')}
                            rules={[{ required: true, message: t('please_specify_desired_work_field') }]}
                            initialValue={defaultValue}
                        >
                            <Cascader
                                options={cascaderData}
                                placeholder={t('desired_work_field')}
                                defaultValue={defaultValue}
                                onChange={(value) => setData('desired_field', value[1])}
                            />
                        </Form.Item>

                        <Form.Item label={t('skills')} name='skills'>
                            <div className='flex items-center gap-x-2'>
                                <Input
                                    value={data.newSkill}
                                    onChange={(e) => setData('newSkill', e.target.value)}
                                    className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                    placeholder={t('enter_skill_and_press_button')}
                                />
                                <Button onClick={addSkill}>
                                    {t('add_skill')}
                                </Button>
                            </div>
                            <div className='flex flex-wrap gap-2 mt-2'>
                                {data.skills.map((skill, index) => (
                                    <Tag
                                        key={index}
                                        closable
                                        onClose={() => removeSkill(skill)}
                                        className='rounded-full bg-gray-100 text-gray-500'
                                    >
                                        {skill}
                                    </Tag>
                                ))}
                            </div>
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            Сохранить изменения
                        </Button>
                    </Form>
                </div>
            </div>
        </GuestLayout>
    );
};

export default UpdateResume;
