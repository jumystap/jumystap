import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Input, Button, Select, Form, Typography, message } from 'antd';
import GuestLayout from '@/Layouts/GuestLayout';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const forbiddenWords = [
     "abuse"
];

const phoneRegex = /(\b8\d{10}\b|\+7\d{10}\b|\+7 \(\d{3}\) \d{3} \d{2} \d{2}\b)/;

const kazakhstanCities = [
    "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
    "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
    "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
    "Экибастуз", "Рудный", "Жезказган"
];

const CreateAnnouncement = ({ announcement = null, industries }) => {
    const { t } = useTranslation();
    const isEdit = announcement !== null;
    const [salaryType, setSalaryType] = useState('');

    const { data, setData, post, put, processing, errors } = useForm({
        type_kz: 'Тапсырыс',
        type_ru: 'Заказ',
        title: '',
        description: '',
        payment_type: '',
        cost: null,
        work_time: '',
        location: '',
        city: '',
        active: true,
        industry_id: null,
        salary_type: '',
        cost_min: null,
        cost_max: null,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);

    useEffect(() => {
        if (data.type_ru === 'Заказ') {
            setData('type_kz', 'Тапсырыс');
        } else if (data.type_ru === 'Вакансия') {
            setData('type_kz', 'Вакансия');
        }
    }, [data.type_ru]);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleCityChange = (value) => {
        setData('city', value);
        setShowOtherCityInput(value === 'Другое');
    };

    const handleSalaryTypeChange = (value) => {
        setData('salary_type', value);
    }

    const containsForbiddenWords = (text) => {
        const lowerCaseText = text.toLowerCase();
        return forbiddenWords.some((word) => lowerCaseText.includes(word));
    };

    const containsPhoneNumber = (text) => {
        return phoneRegex.test(text);
    };

    const handleSubmit = (e) => {
        const errors = {};

        if (containsForbiddenWords(data.title)) {
            errors.title = "Измените текст. Присутствует цензура";
        }
        if (containsForbiddenWords(data.description)) {
            errors.description = "Измените текст. Присутствует цензура";
        }
        if (containsForbiddenWords(data.payment_type)) {
            errors.payment_type = "Измените текст. Присутствует цензура";
        }

        if (containsPhoneNumber(data.description)) {
            errors.description = "Описание содержит номер телефона, что запрещено.";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const submitAction = isEdit ? put : post;
        const url = isEdit ? `/announcements/${announcement.id}` : '/create_announcement';

        try {
            submitAction(url, data, {
                onSuccess: () => {
                    message.success('Announcement saved successfully');
                },
                onError: (errors) => {
                    message.error('Failed to save announcement');
                    console.error('Failed to save announcement:', errors);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <GuestLayout>
            <div className="container mx-auto p-4">
                <Title level={2} className="text-orange-500">
                    {isEdit ? t('title_edit', { ns: 'createAnnouncement' }) : t('create_title', { ns: 'createAnnouncement' })}
                </Title>
                <Form onFinish={handleSubmit} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Form.Item
                            label={t('type', { ns: 'createAnnouncement' })}
                            name="type_ru"
                            rules={[{ required: true, message: 'Please select a type' }]}
                        >
                            <Select value={data.type_ru} onChange={(value) => setData('type_ru', value)}>
                                <Option value="Заказ">{t('announcement', { ns: 'createAnnouncement' })}</Option>
                                <Option value="Вакансия">{t('vacancy', { ns: 'createAnnouncement' })}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('title', { ns: 'createAnnouncement' })}
                            name="title"
                            rules={[{ required: true, message: 'Please enter a title' }]}
                            help={errors.title || validationErrors.title}
                            validateStatus={errors.title || validationErrors.title ? 'error' : ''}
                        >
                            <Input
                                type="text"
                                name="title"
                                className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                value={data.title}
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('paymentType', { ns: 'createAnnouncement' })}
                            name="payment_type"
                            rules={[{ required: true, message: 'Please select a payment type' }]}
                            help={errors.payment_type || validationErrors.payment_type}
                            validateStatus={errors.payment_type || validationErrors.payment_type ? 'error' : ''}
                        >
                            <Select
                                value={data.payment_type}
                                onChange={(value) => setData('payment_type', value)}
                            >
                                <Option value="Ежедневная оплата">Ежедневная оплата</Option>
                                <Option value="Еженедельная оплата">Еженедельная оплата</Option>
                                <Option value="Ежемесячная оплата">Ежемесячная оплата</Option>
                                <Option value="Сдельная оплата">Сдельная оплата</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label='График работы'
                            name="work_time"
                        >
                            <Select
                                value={data.work_time}
                                onChange={(value) => setData('work_time', value)}
                            >
                                <Option value="5/2">5/2</Option>
                                <Option value="2/2">2/2</Option>
                                <Option value="6/1">6/1</Option>
                                <Option value="Гибкий график">Гибкий график</Option>
                                <Option value="Вахтовый метод">Вахтовый метод</Option>
                                <Option value="Сменный график">Сменный график</Option>
                                <Option value="Другое">Другое</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label='Адрес'
                            name="location"
                            rules={[{ required: true, message: 'Please enter an address' }]}
                        >
                            <Input
                                type="text"
                                name="location"
                                className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                value={data.location}
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label='Город'
                            name="city"
                            rules={[{ required: true, message: 'Please select a city' }]}
                        >
                            <Select
                                value={data.city}
                                onChange={handleCityChange}
                            >
                                {kazakhstanCities.map((city) => (
                                    <Option key={city} value={city}>{city}</Option>
                                ))}
                                <Option value="Дистанционное">Дистанционное</Option>
                                <Option value="Другое">Другое</Option>
                            </Select>
                        </Form.Item>

                        {showOtherCityInput && (
                            <Form.Item
                                label='Введите другой город'
                                name="city"
                                rules={[{ required: true, message: 'Please enter a city' }]}
                            >
                                <Input
                                    type="text"
                                    name="city"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    value={data.city}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        )}
                        <Form.Item
                            label='Выберите тип зарплаты'
                            name="salary_type"
                        >
                            <Select
                                value={data.salary_type}
                                onChange={handleSalaryTypeChange}
                            >
                                <Option value='min'>От</Option>
                                <Option value='max'>До</Option>
                                <Option value='undefined'>Договарная</Option>
                                <Option value='exact'>Точная</Option>
                            </Select>
                        </Form.Item>
                        {data.salary_type == 'max' && (
                            <Form.Item
                                label='Зарплата До'
                                name="cost_max"
                            >
                                <Input
                                    type="number"
                                    name="cost_max"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    value={data.cost_min}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        )}
                        {data.salary_type == 'min' && (
                            <Form.Item
                                label='Зарплата От'
                                name="cost_min"
                            >
                                <Input
                                    type="number"
                                    name="cost_min"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    value={data.cost_min}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        )}
                        {data.salary_type == 'exact' && (
                            <Form.Item
                                label={t('cost', { ns: 'createAnnouncement' })}
                                name="cost"
                            >
                                <Input
                                    type="number"
                                    name="cost"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    value={data.cost}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        )}
                        <Form.Item
                            label='Выберите отрасль'
                            name="industry_id"
                        >
                            <Select
                                value={data.industry_id}
                                onChange={(value) => setData('industry_id', value)}
                            >
                                {industries.map((item) => (
                                    <Option key={item.id} value={item.id}>{item.name_ru}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item
                        label={
                            <span>
                                {t('description', { ns: 'createAnnouncement' })}
                                <span className="ml-2 text-gray-500">
                                    (Описание вакансии должно быть информативным и включать условия труда и т.д.)
                                </span>
                            </span>
                        }
                        name="description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                        help={errors.description || validationErrors.description}
                        validateStatus={errors.description || validationErrors.description ? 'error' : ''}
                    >
                        <TextArea
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            rows={12}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={processing}
                            className="w-full md:w-auto"
                        >
                            {isEdit ? "Сохранить" : t('create', { ns: 'createAnnouncement' })}
                        </Button>
                        <Button
                            type="default"
                            onClick={() => window.location.href = '/profile'}
                            className="w-full md:w-auto mt-2 md:mt-0 md:ml-2"
                        >
                            Назад
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </GuestLayout>
    );
};

export default CreateAnnouncement;
