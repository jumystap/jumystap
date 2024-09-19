import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Input, Button, Select, Form, Typography, message, Cascader } from 'antd';
import GuestLayout from '@/Layouts/GuestLayout';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const forbiddenWords = [
    "abuse"];

const UpdateAnnouncement = ({ announcement, industries, specializations }) => {
    const { t } = useTranslation();

    const { data, setData, put, processing, errors } = useForm({
        type_kz: announcement.type_kz || 'Жарнама',
        type_ru: announcement.type_ru || 'Объявление',
        title: announcement.title || '',
        description: announcement.description || '',
        cost: announcement.cost || '',
        active: announcement.active || true,
        city: announcement.city || '',
        location: announcement.location || '',
        work_time: announcement.work_time || '',
        payment_type: announcement.payment_type || '',
        specialization_id: announcement.specialization_id || null,
        salary_type: announcement.salary_type || null,
        cost_min: announcement.cost_min || null,
        cost_max: announcement.cost_max || null,

    });

    const cascaderData = specializations.map(category => ({
        value: category.id,
        label: category.name_ru,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: spec.name_ru
        }))
    }));

    const findCategoryForSpecialization = (specializationId) => {
        for (const category of specializations) {
            if (category.specialization.some(spec => spec.id === specializationId)) {
                return category.id;
            }
        }
        return null;
    };

    const [validationErrors, setValidationErrors] = useState({});
    const [showOtherCityInput, setShowOtherCityInput] = useState(data.city === 'Другое');

    useEffect(() => {
        if (data.type_ru === 'Объявление') {
            setData('type_kz', 'Жарнама');
        } else if (data.type_ru === 'Вакансия') {
            setData('type_kz', 'Вакансия');
        }
    }, [data.type_ru]);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSelectChange = (name, value) => {
        setData(name, value);
        if (name === 'city') {
            setShowOtherCityInput(value === 'Другое');
        }
    };

    const handleSalaryTypeChange = (value) => {
        setData('salary_type', value);
    }

    const containsForbiddenWords = (text) => {
        const lowerCaseText = text.toLowerCase();
        return forbiddenWords.some((word) => lowerCaseText.includes(word));
    };

    const handleSubmit = () => {
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

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        put(`/announcements/${announcement.id}`, {
            onSuccess: () => {
                message.success('Объявление успешно обновлено');
            },
            onError: (errors) => {
                message.error('Failed to update announcement');
                console.error('Failed to update announcement:', errors);
            }
        });
    };

    return (
        <GuestLayout>
            <div className="container mx-auto p-4">
                <Title level={2} className="text-orange-500">
                    {t('title_edit', { ns: 'createAnnouncement' })}
                </Title>
                <Form onFinish={handleSubmit} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Form.Item
                            label={t('type', { ns: 'createAnnouncement' })}
                            name="type_ru"
                        >
                            <Select
                                defaultValue={data.type_ru}
                                value={data.type_ru}
                                onChange={(value) => handleSelectChange('type_ru', value)}
                            >
                                <Option value="Объявление">{t('announcement', { ns: 'createAnnouncement' })}</Option>
                                <Option value="Вакансия">{t('vacancy', { ns: 'createAnnouncement' })}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('title', { ns: 'createAnnouncement' })}
                            name="title"
                            help={errors.title || validationErrors.title}
                            validateStatus={errors.title || validationErrors.title ? 'error' : ''}
                        >
                            <Input
                                type="text"
                                name="title"
                                defaultValue={data.title}
                                value={data.title}
                                onChange={handleChange}
                                className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                            />
                        </Form.Item>
                        <Form.Item
                            label='Выберите тип зарплаты'
                            name="salary_type"
                        >
                            <Select
                                defaultValue={data.salary_type}
                                value={data.salary_type}
                                onChange={handleSalaryTypeChange}
                            >
                                <Option value='min'>От</Option>
                                <Option value='max'>До</Option>
                                <Option value='undefined'>Договорная</Option>
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
                                    defaultValue={data.cost_max}
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
                                    defaultValue={data.cost_min}
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
                                    defaultValue={data.cost}
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    value={data.cost}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        )}
                        <Form.Item
                            label='Адрес'
                            name="location"
                            help={errors.location}
                            validateStatus={errors.location ? 'error' : ''}
                        >
                            <Input
                                type="text"
                                name="location"
                                defaultValue={data.location}
                                value={data.location}
                                onChange={handleChange}
                                className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('paymentType', { ns: 'createAnnouncement' })}
                            name="payment_type"
                        >
                            <Select
                                defaultValue={data.payment_type}
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
                                defaultValue={data.work_time}
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
                            label='Город'
                            name="city"
                            help={errors.city}
                            validateStatus={errors.city ? 'error' : ''}
                        >
                            <Select
                                defaultValue={data.city}
                                value={data.city}
                                onChange={(value) => handleSelectChange('city', value)}
                            >
                                {["Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
                                    "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
                                    "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
                                    "Экибастуз", "Рудный", "Жезказган", "Дистанционное", "Другое"].map(city => (
                                        <Option key={city} value={city}>{city}</Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Специализация"
                            name="specialization_id"
                        >
                            <Cascader
                                options={cascaderData}
                                onChange={(value) => setData('specialization_id', value[1])}
                                placeholder="Выберите специализацию"
                                defaultValue={(() => {
                                    const category_id = findCategoryForSpecialization(announcement.specialization_id);
                                    return category_id ? [category_id, announcement.specialization_id] : [];
                                })()}
                            />
                        </Form.Item>
                        {showOtherCityInput && (
                            <Form.Item
                                label='Введите другой город'
                                name="city"
                                help={errors.city}
                                validateStatus={errors.city ? 'error' : ''}
                            >
                                <Input
                                    type="text"
                                    name="city"
                                    defaultValue={data.city}
                                    value={data.city}
                                    onChange={handleChange}
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                />
                            </Form.Item>
                        )}
                    </div>
                    <Form.Item
                        label={
                            <span>
                                {t('description', { ns: 'createAnnouncement' })}
                                <span className="ml-2 text-gray-500 text-xs">
                                    (Описание вакансии должно быть информативным и включать условия труда и т.д.)
                                </span>
                            </span>
                        }
                        name="description"
                        help={errors.description || validationErrors.description}
                        validateStatus={errors.description || validationErrors.description ? 'error' : ''}
                    >
                        <TextArea
                            name="description"
                            defaultValue={data.description}
                            value={data.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={processing}
                            className="w-full md:w-auto"
                        >
                            Сохранить
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

export default UpdateAnnouncement;

