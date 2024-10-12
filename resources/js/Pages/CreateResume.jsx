import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Input, Select, DatePicker, Button, Upload, Space } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import GuestLayout from '@/Layouts/GuestLayout';

const { Option } = Select;

const CreateUpdateResume = () => {
    const { data, setData, post } = useForm({
        organizations: [{ organization: '', position: '', period: null }],
        city: '',
        district: '',
        languages: [],
        photo: null,
        education: '',
        faculty: '',
        specialization: '',
        graduation_year: null,
        ip_status: '',
        desired_field: '',
        skills: ['', '', ''],
    });

    const addOrganization = () => {
        setData('organizations', [...data.organizations, { organization: '', position: '', period: null }]);
    };

    const removeOrganization = (index) => {
        const updatedOrganizations = data.organizations.filter((_, i) => i !== index);
        setData('organizations', updatedOrganizations);
    };

    const handleSubmit = () => {
        post('/create_resume');
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

    const uploadProps = {
        beforeUpload: (file) => {
            setData('photo', file);
            return false;
        },
    };

    return (
        <GuestLayout>
            <div className="grid grid-cols-7">
                <div className="col-span-5 p-5">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <h2>Укажите ваш опыт работы</h2>
                        {data.organizations.map((organization, index) => (
                            <Space key={index} direction="vertical" style={{ display: 'flex', marginBottom: 16 }}>
                                <Form.Item
                                    label="Наименование организации"
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
                                    rules={[{ required: true, message: 'Пожалуйста, укажите должность' }]}
                                >
                                    <Input
                                        value={organization.position}
                                        onChange={(e) => handleNestedChange(index, 'position', e.target.value)}
                                        className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Период работы"
                                    rules={[{ required: true, message: 'Пожалуйста, укажите период работы' }]}
                                >
                                    <DatePicker
                                        value={organization.period ? moment(organization.period) : null}
                                        onChange={(date) => handleNestedChange(index, 'period', date ? date.format('YYYY-MM-DD') : null)}
                                    />
                                </Form.Item>
                                <Button danger onClick={() => removeOrganization(index)}>
                                    Удалить место работы
                                </Button>
                            </Space>
                        ))}
                        <Button type="dashed" onClick={addOrganization} icon={<PlusOutlined />}>
                            Добавить еще место работы
                        </Button>

                        <Form.Item
                            label="Укажите город проживания"
                            rules={[{ required: true, message: 'Пожалуйста, укажите город' }]}
                        >
                            <Select value={data.city} onChange={(value) => handleInputChange('city', value)}>
                                <Option value="Астана">Астана</Option>
                                <Option value="Алматы">Алматы</Option>
                            </Select>
                        </Form.Item>

                        {data.city === 'Астана' && (
                            <Form.Item
                                label="Укажите ваш район проживания"
                                rules={[{ required: true, message: 'Пожалуйста, укажите район' }]}
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
                            label="Укажите какими языками вы владеете"
                            rules={[{ required: true, message: 'Пожалуйста, укажите языки' }]}
                        >
                            <Select
                                mode="multiple"
                                value={data.languages}
                                onChange={(value) => handleInputChange('languages', value)}
                            >
                                <Option value="Казахский">Казахский</Option>
                                <Option value="Русский">Русский</Option>
                                <Option value="Английский">Английский</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Загрузите вашу фотографию"
                            rules={[{ required: true, message: 'Пожалуйста, загрузите фотографию' }]}
                        >
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Загрузить фото</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Укажите ваше образование"
                            rules={[{ required: true, message: 'Пожалуйста, укажите образование' }]}
                        >
                            <Select value={data.education} onChange={(value) => handleInputChange('education', value)}>
                                <Option value="Среднее">Среднее</Option>
                                <Option value="Среднее специальное">Среднее специальное</Option>
                                <Option value="Неоконченное высшее">Неоконченное высшее</Option>
                                <Option value="Высшее">Высшее</Option>
                            </Select>
                        </Form.Item>

                        {data.education !== 'Среднее' && (
                            <>
                                <Form.Item label="Факультет и специализация">
                                    <Input
                                        value={data.faculty}
                                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                                        className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item label="Год окончания">
                                    <DatePicker
                                        picker="year"
                                        value={data.graduation_year ? moment(data.graduation_year) : null}
                                        onChange={(date) => handleInputChange('graduation_year', date ? date.format('YYYY') : null)}
                                    />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            label="Укажите наличие ИП"
                            rules={[{ required: true, message: 'Пожалуйста, укажите статус ИП' }]}
                        >
                            <Select value={data.ip_status} onChange={(value) => handleInputChange('ip_status', value)}>
                                <Option value="Присутствует">Присутствует</Option>
                                <Option value="Отсутствует">Отсутствует</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="В какой сфере вы желаете работать"
                            rules={[{ required: true, message: 'Пожалуйста, укажите желаемую сферу работы' }]}
                        >
                            <Select value={data.desired_field} onChange={(value) => handleInputChange('desired_field', value)}>
                                <Option value="IT">IT</Option>
                                <Option value="Маркетинг">Маркетинг</Option>
                                <Option value="Строительство">Строительство</Option>
                                <Option value="Финансы">Финансы</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Какие навыки вы хотите указать"
                            rules={[{ required: true, message: 'Пожалуйста, укажите навыки' }]}
                        >
                            {data.skills.map((skill, index) => (
                                <Input
                                    key={index}
                                    value={skill}
                                    onChange={(e) => {
                                        const updatedSkills = [...data.skills];
                                        updatedSkills[index] = e.target.value;
                                        setData('skills', updatedSkills);
                                    }}
                                    className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                />
                            ))}
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            Создать резюме
                        </Button>
                    </Form>
                </div>
            </div>
        </GuestLayout>
    );
};

export default CreateUpdateResume;

