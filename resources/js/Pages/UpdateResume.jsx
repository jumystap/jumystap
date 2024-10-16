import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Input, Select, DatePicker, Tag, Button, Upload, Space, Cascader, Avatar } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import GuestLayout from '@/Layouts/GuestLayout';

const { Option } = Select;

const kazakhstanCities = [
    "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
    "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
    "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
    "Экибастуз", "Рудный", "Жезказган"
];

const UpdateResume = ({ resume, specialization }) => {
    const [showOtherCityInput, setShowOtherCityInput] = useState(resume.city === 'Другое');
    const [editMode, setEditMode] = useState(resume.organizations.map(() => false)); // Initially all organizations are not in edit mode
    const { data, setData, post, setDefaults } = useForm({
        organizations: resume.organizations || [{ organization: '', position: '', period: '' }],
        city: resume.city || '',
        district: resume.district || '',
        languages: resume.languages || [],
        photo: resume.photo_path || null,
        education: resume.education || '',
        faculty: resume.faculty || '',
        specialization: resume.specialization || '',
        graduation_year: resume.graduation_year || null,
        ip_status: resume.ip_status || '',
        desired_field: resume.desired_field || '',
        skills: resume.skills || [],
        newSkill: '',
    });

    useEffect(() => {
        setDefaults(data);
    }, []);

    const handleCityChange = (value) => {
        setData('city', value);
        setShowOtherCityInput(value === 'Другое');
    };

    const cascaderData = specialization.map(category => ({
        value: category.id,
        label: category.name_ru,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: spec.name_ru
        }))
    }));

    const addOrganization = () => {
        setData('organizations', [...data.organizations, { organization: '', position: '', period: null }]);
        setEditMode([...editMode, true]);
    };

    const handlePeriodChange = (index, startDate, endDate) => {
        const updatedOrganizations = [...data.organizations];

        const start = startDate ? startDate.format('YYYY-MM-DD') : updatedOrganizations[index].period?.split(' - ')[0];
        const end = endDate ? endDate.format('YYYY-MM-DD') : updatedOrganizations[index].period?.split(' - ')[1];

        const period = `${start} - ${end}`;

        updatedOrganizations[index] = { ...updatedOrganizations[index], period };
        setData('organizations', updatedOrganizations);
    };

    const removeOrganization = (index) => {
        const updatedOrganizations = data.organizations.filter((_, i) => i !== index);
        setData('organizations', updatedOrganizations);
        setEditMode(editMode.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        post(`/update_resume/${resume.id}`);
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
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <div className='font-semibold text-2xl mb-4'>Редактировать резюме</div>
                        <div className='flex gap-x-5'>
                        {data.photo && <img src={URL.createObjectURL(data.photo)} className='w-[200px] h-[250px] object-cover'/>}
                        <Form.Item label="Загрузите вашу фотографию" name='photo'>
                            <Upload {...uploadProps} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Загрузить фото</Button>
                            </Upload>
                        </Form.Item>
                        </div>

                        <div className='font-semibold text-xl mb-4 mt-2'>Укажите ваш опыт работы</div>
                        {data.organizations.map((organization, index) => (
                            <Space key={index} direction="vertical" style={{ display: 'flex', marginBottom: 5 }}>
                                {editMode[index] ? (
                                    <>
                                        <Form.Item
                                            label="Наименование организации"
                                            name='organization.name'
                                            rules={[{ required: true, message: 'Пожалуйста, укажите наименование организации' }]}
                                        >
                                            <Input
                                                value={organization.organization}
                                                onChange={(e) => handleNestedChange(index, 'organization', e.target.value)}
                                                className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Должность"
                                            name='organization.profession'
                                            className='mt-[-17px]'
                                            rules={[{ required: true, message: 'Пожалуйста, укажите должность' }]}
                                        >
                                            <Cascader
                                                options={cascaderData}
                                                onChange={(value) => handleNestedChange(index, 'position', value[1])}
                                                placeholder="Должность"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Период работы"
                                            name='organization.period'
                                            className='mt-[-17px]'
                                            rules={[{ required: true, message: 'Пожалуйста, укажите период работы' }]}
                                        >
                                            <Space direction="horizontal">
                                                <DatePicker
                                                    onChange={(date) => handlePeriodChange(index, date, null)}
                                                    placeholder="Начало"
                                                />
                                                <DatePicker
                                                    onChange={(date) => handlePeriodChange(index, null, date)}
                                                    placeholder="Конец"
                                                />
                                                <div>{organization.period}</div>
                                            </Space>
                                        </Form.Item>
                                        <div className='flex items-center mt-[-10px] gap-x-2'>
                                            <Button type="primary" onClick={() => toggleEditMode(index)}>Сохранить</Button>
                                            <Button danger onClick={() => removeOrganization(index)}>
                                                Удалить место работы
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className='border border-gray-200 py-4 mt-2 px-5 rounded-lg'>
                                        <p><strong>Организация:</strong> {organization.organization}</p>
                                        <p><strong>Должность:</strong> {organization.position}</p>
                                        <p><strong>Период работы:</strong> {organization.period}</p>
                                        <div className='flex mt-4 items-center gap-x-2'>
                                            <Button type="dashed" onClick={() => toggleEditMode(index)}>Редактировать</Button>
                                            <Button danger onClick={() => removeOrganization(index)}>
                                                Удалить место работы
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Space>
                        ))}
                        <Button type="dashed" className='mt-3' onClick={addOrganization} icon={<PlusOutlined />}>
                            Добавить еще место работы
                        </Button>

                        <Form.Item
                            label='Город'
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
                                label='Название города'
                                name="district"
                                className='mt-[-15px]'
                                rules={[{ required: true, message: 'Пожалуйста, укажите ваш город' }]}
                            >
                                <Input value={data.district} onChange={(e) => handleInputChange('district', e.target.value)} />
                            </Form.Item>
                        )}

                        <Form.Item
                            label='Языки'
                            name='languages'
                            className='mt-4'
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                value={data.languages}
                                onChange={(value) => handleInputChange('languages', value)}
                            >
                                <Option value="Русский">Русский</Option>
                                <Option value="Казахский">Казахский</Option>
                                <Option value="Английский">Английский</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label='Уровень образования'
                            name='education'
                            rules={[{ required: true, message: 'Пожалуйста, укажите уровень образования' }]}
                        >
                            <Input value={data.education} onChange={(e) => handleInputChange('education', e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            label='Факультет'
                            name='faculty'
                            rules={[{ required: true, message: 'Пожалуйста, укажите факультет' }]}
                        >
                            <Input value={data.faculty} onChange={(e) => handleInputChange('faculty', e.target.value)} />
                        </Form.Item>

                        <Form.Item
                            label="Желаемая специализация"
                            name='desired_field'
                            className='mt-[-17px]'
                            rules={[{ required: true, message: 'Пожалуйста, выберите специализацию' }]}
                        >
                            <Cascader
                                options={cascaderData}
                                onChange={(value) => handleInputChange('desired_field', value[1])}
                                placeholder="Выберите специализацию"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Навыки"
                            name="skills"
                        >

                            <Input
                                value={data.newSkill}
                                onChange={(e) => handleInputChange('newSkill', e.target.value)}
                                onPressEnter={addSkill}
                                placeholder="Введите навык и нажмите Enter"
                            />
                            <div className='mt-2'>
                                {data.skills.map((skill, index) => (
                                    <Tag key={index} closable onClose={() => removeSkill(skill)}>{skill}</Tag>
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
