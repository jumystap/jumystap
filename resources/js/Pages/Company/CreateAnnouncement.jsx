import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Input, Button, Select, Form, Typography, message, Cascader } from 'antd';
import GuestLayout from '@/Layouts/GuestLayout';
import CurrencyInput from 'react-currency-input-field';
import PhoneInput from 'react-phone-input-2';

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

const CreateAnnouncement = ({ announcement = null, specializations }) => {
    const { t } = useTranslation();
    const isEdit = announcement !== null;
    const [isExactSalary, setIsExactSalary] = useState(false);
    const [withPhone, setWithPhone] = useState(false);

    const handleSalaryTypeChange = (e) => {
        setData(prevData => ({
            ...prevData,
            salary_type: e.target.checked ? 'za_smenu' : 'undefined'
        }));
    };

    const handleExactSalaryChange = (e) => {
        const isChecked = e.target.checked;
        setIsExactSalary(isChecked);

        setData(prevData => ({
            ...prevData,
            cost_min: isChecked ? null : prevData.cost_min,
            cost_max: isChecked ? null : prevData.cost_max,
            cost: isChecked ? '' : null,
            salary_type: isChecked ? 'exact' : 'undefined'
        }));
    };

    const cascaderData = specializations.map(category => ({
        value: category.id,
        label: category.name_ru,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: spec.name_ru
        }))
    }));

    const { data, setData, post, put, processing, errors } = useForm({
        type_kz: 'Тапсырыс',
        type_ru: 'Заказ',
        title: '',
        description: '',
        payment_type: '',
        cost: null,
        work_time: '',
        work_hours: '',
        education: '',
        experience: '',
        employment_type: '',
        start_time: '',
        location: [''],
        condition: [''],
        requirement: [''],
        responsibility: [''],
        city: '',
        status: 1,
        specialization_id: null,
        salary_type: 'undefined',
        cost_min: null,
        cost_max: null,
        phone: '',
    });

    const deleteRequirement = (index) => {
        const newRequirements = [...data.requirement];
        newRequirements.splice(index, 1);
        setData({ ...data, requirement: newRequirements });
    };

    const deleteResponsibility = (index) => {
        const newResponsibilities = [...data.responsibility];
        newResponsibilities.splice(index, 1);
        setData({ ...data, responsibility: newResponsibilities });
    };

    const deleteCondition = (index) => {
        const newConditions = [...data.condition];
        newConditions.splice(index, 1);
        setData({ ...data, condition: newConditions });
    };

    const deleteLocation = (index) => {
        const newLocation = [...data.location];
        newLocation.splice(index, 1);
        setData({ ...data, location: newLocation });
    };

    const handleSalaryChange = (value, name) => {
        const parsedValue = value ? parseInt(value) : null;

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: parsedValue,
            };

            const { cost_min, cost_max, cost } = updatedData;

            if (isExactSalary) {
                updatedData.salary_type = 'exact';
            } else if (cost_min && !cost_max) {
                updatedData.salary_type = 'min';
            } else if (!cost_min && cost_max) {
                updatedData.salary_type = 'max';
            } else if (cost_min && cost_max) {
                updatedData.salary_type = 'diapason';
            } else {
                updatedData.salary_type = 'undefined'; // Reset if both are empty
            }

            return updatedData;
        });
    };

    const [validationErrors, setValidationErrors] = useState({});
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);

    const addRequirement = () => {
        setData('requirement', [...data.requirement, '']);
    };
    const addResponsibility = () => {
        setData('responsibility', [...data.responsibility, '']);
    };
    const addCondition = () => {
        setData('condition', [...data.condition, '']);
    };

    const handleRequirementChange = (index, e) => {
        const updatedRequirements = [...data.requirement];
        updatedRequirements[index] = e.target.value;
        setData('requirement', updatedRequirements);
    };

    const handleResponsibilityChange = (index, e) => {
        const updatedResponsibilities = [...data.responsibility];
        updatedResponsibilities[index] = e.target.value;
        setData('responsibility', updatedResponsibilities);
    };

    const handleConditionChange = (index, e) => {
        const updatedConditions = [...data.condition];
        updatedConditions[index] = e.target.value;
        setData('condition', updatedConditions);
    };

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

    const addLocation = () => {
        setData('location', [...data.location, '']);
    };

    const handleLocationChange = (index, e) => {
        const updatedLocations = [...data.location];
        updatedLocations[index] = e.target.value;
        setData('location', updatedLocations);
    };

    const containsForbiddenWords = (text) => {
        const lowerCaseText = text.toLowerCase();
        return forbiddenWords.some((word) => lowerCaseText.includes(word));
    };

    const containsPhoneNumber = (text) => {
        return phoneRegex.test(text);
    };

    const handleWithPhone = (e) => {
        const isChecked = e.target.checked;
        setWithPhone(isChecked);
        setData('phone', isChecked ? data.phone : '');
    };

    function isValidPhone(phone) {
        if (!phone) return false;

        const digits = phone.replace(/\D/g, '');
        if (digits.length !== 11) return false;

        const code = digits.substring(1, 4); // 2nd to 4th digits (index 1 to 3)
        const validCodes = ['700', '701', '702', '705', '706', '707', '708', '747', '771', '775', '776', '777', '778'];

        return validCodes.includes(code);
    }

    const handleSubmit = (e) => {
        const errors = {};

        if (containsForbiddenWords(data.title)) {
            errors.title = t('change_text_censorship_detected', { ns: 'createAnnouncement' });
        }
        if (containsForbiddenWords(data.description)) {
            errors.description = t('change_text_censorship_detected', { ns: 'createAnnouncement' });
        }
        if (containsForbiddenWords(data.payment_type)) {
            errors.payment_type = t('change_text_censorship_detected', { ns: 'createAnnouncement' });
        }

        if (containsPhoneNumber(data.description)) {
            errors.description = t('description_contains_phone_number', { ns: 'createAnnouncement' });
        }

        if (withPhone && !isValidPhone(data.phone)) {
            if(!data.phone){
                errors.phone = t('enter_phone_again', { ns: 'createAnnouncement' });
            }else{
                errors.phone = t('invalid_phone_number', { ns: 'createAnnouncement' });
            }
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const submitAction = isEdit ? put : post;
        const url = isEdit ? `/announcements/${announcement.id}` : '/announcements/store';
        submitAction(url, {
            ...data,
            onSuccess: () => message.success(t('successfully_saved', { ns : 'createAnnouncement'})),
            onError: (err) => {
                message.error(t('failed_to_save', { ns: 'createAnnouncement' }));
                console.error('Failed to save announcement:', err);
            }
        });
    };

    return (
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7 mx-auto p-4">
                <div className='col-span-5'>
                    <Title level={3} className="">
                        {isEdit ? t('title_edit', { ns: 'createAnnouncement' }) : t('create_title', { ns: 'createAnnouncement' })}
                    </Title>
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Form.Item
                            label={
                                <span>
                                    {t('title', { ns: 'createAnnouncement' })}
                                    <span className="ml-2 text-gray-500">
                                        {t('title_recommendation', { ns: 'createAnnouncement' })}
                                    </span>
                                </span>
                            }
                            name="title"
                            rules={[{ required: true, message: t('please_fill_title', { ns: 'createAnnouncement' }) }]}
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
                            label={t('specialization', { ns: 'createAnnouncement' })}
                            name="specialization_id"
                            rules={[{ required: true, message: t('please_select_specialization', { ns: 'createAnnouncement' }) }]}
                        >
                            <Cascader
                                options={cascaderData}
                                onChange={(value) => setData('specialization_id', value[1])}
                                placeholder={t('select_specialization', { ns: 'createAnnouncement' })}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('city', { ns: 'createAnnouncement' })}
                            name="city"
                            rules={[{ required: true, message: t('select_city', { ns: 'createAnnouncement' }) }]}
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
                                label={t('enter_another_city', { ns: 'createAnnouncement' })}
                                name="city"
                                rules={[{ required: true, message: t('please_enter_city', { ns: 'createAnnouncement' })}]}
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
                        <Form.Item label={t('location', { ns: 'createAnnouncement' })}>
                            {data.location.map((loc, index) => (
                                <Form.Item
                                    key={index}
                                    name={['location', index]}
                                    rules={[{ required: true, message: t('enter_location', { ns: 'createAnnouncement' }) }]}
                                    help={errors?.[`location.${index}`] || validationErrors?.[`location.${index}`]}
                                    validateStatus={errors?.[`location.${index}`] || validationErrors?.[`location.${index}`] ? 'error' : ''}
                                >
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            className="text-sm rounded py-1 mt-2 border border-gray-300 flex-1"
                                            value={loc}
                                            onChange={(e) => handleLocationChange(index, e)}
                                        />
                                        <button
                                            className="text-orange-500 mt-3"
                                            type="button"
                                            onClick={() => deleteLocation(index)}
                                        >
                                            {t('delete', { ns: 'createAnnouncement' })}
                                        </button>
                                    </div>
                                </Form.Item>
                            ))}
                        </Form.Item>

                        <div
                            className='text-blue-500 mt-[-15px] mb-2'
                            onClick={addLocation}
                        >
                            {t('add_another_address', { ns: 'createAnnouncement' })}
                        </div>
                        <div className='grid grid-cols-2 gap-x-5'>
                            <Form.Item
                                label={t('work_time', { ns: 'createAnnouncement' })}
                                name="work_time"
                                rules={[{ required: true, message: t('please_select_work_time', { ns: 'createAnnouncement' }) }]}
                            >
                                <Select
                                    value={data.work_time}
                                    onChange={(value) => setData('work_time', value)}
                                >
                                    <Option value="Полный день">Полный день</Option>
                                    <Option value="Сменный график">Сменный график</Option>
                                    <Option value="Гибкий график">Гибкий график</Option>
                                    <Option value="Удаленная работа">Удаленная работа</Option>
                                    <Option value="Вахта">Вахта</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t('employment_type', { ns: 'createAnnouncement' })}
                                name="employment_type"
                                rules={[{ required: true, message: t('please_select_employment_type', { ns: 'createAnnouncement' }) }]}
                            >
                                <Select
                                    value={data.employment_type}
                                    onChange={(value) => setData('employment_type', value)}
                                >
                                    <Option value="Полная занятость">Полная занятость</Option>
                                    <Option value="Частичная занятость">Частичная занятость </Option>
                                    <Option value="Подработка">Подработка</Option>
                                    <Option value="Проектная работа/зака">Проектная работа/заказ</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item
                            label={
                                <span>
                                    {t('fill_working_hours_and_days', { ns: 'createAnnouncement' })}
                                    <span className="ml-2 text-gray-500">
                                        {t('working_hours_example', { ns: 'createAnnouncement' })}
                                    </span>
                                </span>
                            }
                            name="work_hours"
                            rules={[{ required: true, message: t('please_select_work_hours', { ns: 'createAnnouncement' }) }]}
                            help={errors.work_hours || validationErrors.work_hours}
                            validateStatus={errors.work_hours || validationErrors.work_hours ? 'error' : ''}
                        >
                            <Input
                                type="text"
                                className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                name="work_hours"
                                value={data.work_hours}
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('paymentType', { ns: 'createAnnouncement' })}
                            name="payment_type"
                            rules={[{ required: true, message: t('please_select_paymentType', { ns: 'createAnnouncement' }) }]}
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
                        {isExactSalary ? (
                            <Form.Item
                                label={t('cost', { ns: 'createAnnouncement' })}
                                rules={[{ required: true, message: t('please_enter_exact_salary', { ns: 'createAnnouncement' }) }]}
                                help={errors.cost || validationErrors.cost}
                                validateStatus={errors.cost || validationErrors.cost ? 'error' : ''}
                            >
                                <CurrencyInput
                                    name="cost"
                                    className='text-sm rounded w-full py-1 mt-[0px] border border-gray-300'
                                    onValueChange={(value) => handleSalaryChange(value, 'cost')}
                                    value={data.cost}
                                />
                            </Form.Item>
                        ) : (
                            <div className='grid grid-cols-2 gap-x-3'>
                                <Form.Item
                                    label={t('cost_min', { ns: 'createAnnouncement' })}
                                    rules={[{ required: !data.cost_max, message: t('please_enter_min_or_max_salary', { ns: 'createAnnouncement' }) }]}>
                                    <CurrencyInput
                                        name="cost_min"
                                        className='text-sm rounded w-full py-1 mt-[0px] border border-gray-300'
                                        onValueChange={(value) => handleSalaryChange(value, 'cost_min')}
                                        value={data.cost_min}
                                    />
                                </Form.Item>
                                <Form.Item label={t('cost_max', { ns: 'createAnnouncement' })}
                                           rules={[{ required: !data.cost_min, message: t('please_enter_min_or_max_salary', { ns: 'createAnnouncement' }) }]}>
                                    <CurrencyInput
                                        name="cost_max"
                                        className='text-sm w-full rounded py-1 mt-[0px] border border-gray-300'
                                        onValueChange={(value) => handleSalaryChange(value, 'cost_max')}
                                        value={data.cost_max}
                                    />
                                </Form.Item>
                            </div>
                        )}

                        <div className='flex items-center gap-x-2 mt-[-15px]'>
                            <input
                                type='checkbox'
                                name='exact_salary'
                                id='exact_salary'
                                className='rounded border-gray-400'
                                checked={isExactSalary}
                                onChange={handleExactSalaryChange}
                            />
                            <label htmlFor='exact_salary'>{t('cost', { ns: 'createAnnouncement' })}</label>
                        </div>

                        <div className='flex items-center gap-x-2 mt-2 mb-2'>
                            <input
                                type='checkbox'
                                name='za_smenu'
                                id='za_smenu'
                                className='rounded border-gray-400'
                                checked={data.salary_type === 'za_smenu'}
                                onChange={handleSalaryTypeChange}
                            />
                            <label htmlFor='za_smenu'>{t('per_shift', { ns: 'createAnnouncement' })}</label>
                        </div>

                        <div className='grid mt-4 grid-cols-2 gap-x-5'>
                            <Form.Item
                                label={t('experience', { ns: 'createAnnouncement' })}
                                name="experience"
                                rules={[{ required: true, message: t('please_select_experience', { ns: 'createAnnouncement' }) }]}
                            >
                                <Select
                                    value={data.experience}
                                    onChange={(value) => setData('experience', value)}
                                >
                                    <Option value="Без опыта работы">Без опыта работы</Option>
                                    <Option value="От 3 мес. до 6 мес.">От 3 мес. до 6 мес.</Option>
                                    <Option value="От 6 мес. до 1 года.">От 6 мес. до 1 года.</Option>
                                    <Option value="От 1 года до 3 лет.">От 1 года до 3 лет.</Option>
                                    <Option value="От 3 лет до 6 лет.">От 3 лет до 6 лет.</Option>
                                    <Option value="Более 6 лет">Более 6 лет</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t('education', { ns: 'createAnnouncement' })}
                                name="education"
                                rules={[{ required: true, message: t('please_select_education', { ns: 'createAnnouncement' }) }]}
                            >
                                <Select
                                    value={data.education}
                                    onChange={(value) => setData('education', value)}
                                >
                                    <Option value="Не требуется">Не требуется</Option>
                                    <Option value="Среднее">Среднее</Option>
                                    <Option value="Высшее">Высшее</Option>
                                    <Option value="Среднее-специальное">Среднее-специальное</Option>
                                    <Option value="Сертификат Joltap">Сертификат Joltap</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        {/* Критерии/Требования */}
                        <Form.Item
                            label={
                                <span>
                                    {t('requirement', { ns: 'createAnnouncement' })}
                                    <span className="ml-2 text-gray-500">
                                        {t('requirement_example', { ns: 'createAnnouncement' })}
                                    </span>
                                </span>
                            }
                        >
                            {data.requirement.map((req, index) => (
                                <Form.Item
                                    key={index}
                                    name={['requirement', index]}
                                    rules={[{ required: true, message: t('fill_requirement', { ns: 'createAnnouncement' })}]}
                                    help={errors?.[`requirement.${index}`] || validationErrors?.[`requirement.${index}`]}
                                    validateStatus={errors?.[`requirement.${index}`] || validationErrors?.[`requirement.${index}`] ? 'error' : ''}
                                >
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            className="text-sm rounded py-1 mt-3 border border-gray-300 flex-1"
                                            value={req}
                                            onChange={(e) => handleRequirementChange(index, e)}
                                        />
                                        <button
                                            className="text-orange-500 mt-3"
                                            type="button"
                                            onClick={() => deleteRequirement(index)}
                                        >
                                            {t('delete', { ns: 'createAnnouncement' })}
                                        </button>
                                    </div>
                                </Form.Item>
                            ))}
                        </Form.Item>

                        <div className="text-blue-500 mt-[-15px] mb-2 cursor-pointer" onClick={addRequirement}>
                            {t('add', { ns: 'createAnnouncement' })}
                        </div>

                        {/* Обязанности */}
                        <Form.Item
                            label={
                                <span>
                                    {t('responsibility', { ns: 'createAnnouncement' })}
                                    <span className="ml-2 text-gray-500">
                                        {t('responsibility_example', { ns: 'createAnnouncement' })}
                                    </span>
                                </span>
                            }
                        >
                            {data.responsibility.map((resp, index) => (
                                <Form.Item
                                    key={index}
                                    name={['responsibility', index]}
                                    rules={[{ required: true, message: t('fill_responsibility', { ns: 'createAnnouncement' }) }]}
                                    help={errors?.[`responsibility.${index}`] || validationErrors?.[`responsibility.${index}`]}
                                    validateStatus={errors?.[`responsibility.${index}`] || validationErrors?.[`responsibility.${index}`] ? 'error' : ''}
                                >
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            className="text-sm rounded py-1 mt-3 border border-gray-300 flex-1"
                                            value={resp}
                                            onChange={(e) => handleResponsibilityChange(index, e)}
                                        />
                                        <button
                                            className="text-orange-500 mt-3"
                                            type="button"
                                            onClick={() => deleteResponsibility(index)}
                                        >
                                            {t('delete', { ns: 'createAnnouncement' })}
                                        </button>
                                    </div>
                                </Form.Item>
                            ))}
                        </Form.Item>

                        <div className="text-blue-500 mt-[-15px] mb-2 cursor-pointer" onClick={addResponsibility}>
                            {t('add', { ns: 'createAnnouncement' })}
                        </div>

                        {/* Условия труда */}
                        <Form.Item
                            label={
                                <span>
                                    {t('condition', { ns: 'createAnnouncement' })}
                                    <span className="ml-2 text-gray-500">
                                        {t('condition_example', { ns: 'createAnnouncement' })}
                                    </span>
                                </span>
                            }
                        >
                            {data.condition.map((cond, index) => (
                                <Form.Item
                                    key={index}
                                    name={['condition', index]}
                                    rules={[{ required: true, message: t('fill_condition', { ns: 'createAnnouncement' }) }]}
                                    help={errors?.[`condition.${index}`] || validationErrors?.[`condition.${index}`]}
                                    validateStatus={errors?.[`condition.${index}`] || validationErrors?.[`condition.${index}`] ? 'error' : ''}
                                >
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            className="text-sm rounded py-1 mt-3 border border-gray-300 flex-1"
                                            value={cond}
                                            onChange={(e) => handleConditionChange(index, e)}
                                        />
                                        <button
                                            className="text-orange-500 mt-3"
                                            type="button"
                                            onClick={() => deleteCondition(index)}
                                        >
                                            {t('delete', { ns: 'createAnnouncement' })}
                                        </button>
                                    </div>
                                </Form.Item>
                            ))}
                        </Form.Item>

                        <div className="text-blue-500 mt-[-15px] mb-2 cursor-pointer" onClick={addCondition}>
                            {t('add', { ns: 'createAnnouncement' })}
                        </div>

                        <Form.Item
                            label={
                                <span>
                                    {t('additional_info', { ns: 'createAnnouncement' })}
                                    <span className="ml-2 text-gray-500">
                                    </span>
                                </span>
                            }
                            name="description"
                        >
                            <TextArea
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                rows={12}
                            />
                        </Form.Item>
                        <>
                            <div className='flex items-center gap-x-2 mt-2 mb-2'>
                                <input
                                    type='checkbox'
                                    name='with_phone'
                                    id='with_phone'
                                    className='rounded border-gray-400'
                                    checked={withPhone}
                                    onChange={handleWithPhone}
                                />
                                <label htmlFor='with_phone'>{t('with_phone', { ns: 'createAnnouncement' })}</label>
                            </div>
                        </>
                        {withPhone && (
                            <Form.Item
                                label={
                                    <span>
                                    {t('additional_info', { ns: 'createAnnouncement' })}
                                        <span className="ml-2 text-gray-500">
                                    </span>
                                </span>
                                }
                                name="phone"
                                validateStatus={(validationErrors.phone || errors.phone) ? 'error' : ''}
                                help={validationErrors.phone || errors.phone}
                            >
                                <PhoneInput
                                    specialLabel={t('phone', { ns: 'createAnnouncement' })}
                                    country={'kz'}
                                    onlyCountries={['kz']}
                                    value={data.phone}
                                    onChange={(value) => setData('phone', value)}
                                    inputClass="ant-input css-dev-only-do-not-override-qnu6hi ant-input-outlined text-sm rounded py-1 mt-[0px] border border-gray-300"
                                />
                                <Input
                                    type="hidden"
                                    value={data.phone}
                                />
                            </Form.Item>
                        )}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={processing}
                                className="w-full md:w-auto"
                            >
                                {isEdit ? t('save', { ns: 'createAnnouncement' }) : t('create', { ns: 'createAnnouncement' })}
                            </Button>
                            <Button
                                type="default"
                                onClick={() => window.location.href = '/profile'}
                                className="w-full md:w-auto mt-2 md:mt-0 md:ml-2"
                            >
                                {t('back', { ns: 'createAnnouncement' })}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </GuestLayout>
    );
};

export default CreateAnnouncement;
