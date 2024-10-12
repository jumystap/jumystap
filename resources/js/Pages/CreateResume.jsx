import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Input, Select, DatePicker, Button, Upload, Space } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import GuestLayout from '@/Layouts/GuestLayout';

const { Option } = Select;

const CreateUpdateResume = () => {
    const { data, setData, post } = useForm({
        organizations: [{
            organization: '',
            position: '',
            period: null
        }],
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

    // Handler for adding a new job experience
    const addOrganization = () => {
        setData('organizations', [
            ...data.organizations,
            { organization: '', position: '', period: null }
        ]);
    };

    // Handler for removing a job experience
    const removeOrganization = (index) => {
        const updatedOrganizations = data.organizations.filter((_, i) => i !== index);
        setData('organizations', updatedOrganizations);
    };

    // Handler for form submission
    const handleSubmit = () => {
        post('/resume/store'); // Adjust the route according to your app
    };

    // Ant Design Upload Props
    const uploadProps = {
        beforeUpload: (file) => {
            setData('photo', file);
            return false; // Prevent auto upload
        }
    };

    return (
        <GuestLayout>
        <Form layout="vertical" onFinish={handleSubmit}>
            <h2>Укажите ваш опыт работы</h2>
            {data.organizations.map((organization, index) => (
                <Space key={index} direction="vertical" style={{ display: 'flex', marginBottom: 16 }}>
                    <Form.Item label="Наименование организации">
                        <Input
                            value={organization.organization}
                            onChange={(e) => setData(`organizations.${index}.organization`, e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Должность">
                        <Input
                            value={organization.position}
                            onChange={(e) => setData(`organizations.${index}.position`, e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Период работы">
                        <DatePicker
                            value={organization.period ? moment(organization.period) : null}
                            onChange={(date) => setData(`organizations.${index}.period`, date ? date.format('YYYY-MM-DD') : null)}
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

            <Form.Item label="Укажите город проживания">
                <Select
                    value={data.city}
                    onChange={(value) => setData('city', value)}
                >
                    <Option value="Астана">Астана</Option>
                    <Option value="Алматы">Алматы</Option>
                </Select>
            </Form.Item>

            {data.city === 'Астана' && (
                <Form.Item label="Укажите ваш район проживания">
                    <Select
                        value={data.district}
                        onChange={(value) => setData('district', value)}
                    >
                        <Option value="Есиль">Есиль</Option>
                        <Option value="Алматы">Алматы</Option>
                        <Option value="Нура">Нура</Option>
                        <Option value="Сарыарка">Сарыарка</Option>
                        <Option value="Байконур">Байконур</Option>
                    </Select>
                </Form.Item>
            )}

            <Form.Item label="Укажите какими языками вы владеете">
                <Select
                    mode="multiple"
                    value={data.languages}
                    onChange={(value) => setData('languages', value)}
                >
                    <Option value="Казахский">Казахский</Option>
                    <Option value="Русский">Русский</Option>
                    <Option value="Английский">Английский</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Загрузите вашу фотографию">
                <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Загрузить фото</Button>
                </Upload>
            </Form.Item>

            <Form.Item label="Укажите ваше образование">
                <Select
                    value={data.education}
                    onChange={(value) => setData('education', value)}
                >
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
                            onChange={(e) => setData('faculty', e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Год окончания">
                        <DatePicker
                            picker="year"
                            value={data.graduation_year ? moment(data.graduation_year) : null}
                            onChange={(date) => setData('graduation_year', date ? date.format('YYYY') : null)}
                        />
                    </Form.Item>
                </>
            )}

            <Form.Item label="Укажите наличие ИП">
                <Select
                    value={data.ip_status}
                    onChange={(value) => setData('ip_status', value)}
                >
                    <Option value="Присутствует">Присутствует</Option>
                    <Option value="Отсутствует">Отсутствует</Option>
                </Select>
            </Form.Item>

            <Form.Item label="В какой сфере вы желаете работать">
                <Select
                    value={data.desired_field}
                    onChange={(value) => setData('desired_field', value)}
                >
                    <Option value="IT">IT</Option>
                    <Option value="Маркетинг">Маркетинг</Option>
                    <Option value="Строительство">Строительство</Option>
                    <Option value="Финансы">Финансы</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Укажите ваши ключевые навыки">
                <Input
                    placeholder="Навык 1"
                    value={data.skills[0]}
                    onChange={(e) => setData('skills[0]', e.target.value)}
                />
                <Input
                    placeholder="Навык 2"
                    value={data.skills[1]}
                    onChange={(e) => setData('skills[1]', e.target.value)}
                />
                <Input
                    placeholder="Навык 3"
                    value={data.skills[2]}
                    onChange={(e) => setData('skills[2]', e.target.value)}
                />
            </Form.Item>

            <Button type="primary" htmlType="submit">
                Сохранить
            </Button>
        </Form>
        </GuestLayout>
    );
};

export default CreateUpdateResume;
