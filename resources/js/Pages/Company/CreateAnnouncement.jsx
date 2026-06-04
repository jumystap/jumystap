import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Input, Button, Select, Form, Typography, Cascader, notification } from 'antd';
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
    "Астана", "Алматы", "Шымкент", "Актау", "Атырау", "Жезказган", "Караганда", "Косшы", "Костанай", "Кызылорда",
    "Павлодар", "Петропавловск", "Рудный", "Семей", "Талдыкорган", "Тараз", "Темиртау", "Туркестан", "Уральск",
    "Усть-Каменогорск", "Щучинск", "Экибастуз"
];

const WORK_TIME_VALUES = {
    FULL_DAY: 'Полный день',
    SHIFT: 'Сменный график',
    FLEXIBLE: 'Гибкий график',
    REMOTE: 'Удаленная работа',
    ROTATION: 'Вахта',
};

const CITY_VALUES = {
    REMOTE: 'Дистанционное',
    OTHER: 'Другое',
};

const EMPLOYMENT_VALUES = {
    FULL: 'Полная занятость',
    PART: 'Частичная занятость',
    PART_TIME: 'Подработка',
    PROJECT: 'Проектная работа/заказ',
};

const PAYMENT_VALUES = {
    DAILY: 'Ежедневная оплата',
    WEEKLY: 'Еженедельная оплата',
    MONTHLY: 'Ежемесячная оплата',
    PIECEWORK: 'Сдельная оплата',
    NEGOTIABLE: 'Договорная оплата',
};

const EXPERIENCE_VALUES = {
    NONE: 'Без опыта работы',
    THREE_TO_SIX_MONTHS: 'От 3 мес. до 6 мес.',
    SIX_MONTHS_TO_ONE_YEAR: 'От 6 мес. до 1 года.',
    ONE_TO_THREE_YEARS: 'От 1 года до 3 лет.',
    THREE_TO_SIX_YEARS: 'От 3 лет до 6 лет.',
    MORE_THAN_SIX_YEARS: 'Более 6 лет',
};

const EDUCATION_VALUES = {
    NOT_REQUIRED: 'Не требуется',
    SECONDARY: 'Среднее',
    HIGHER: 'Высшее',
    SPECIAL: 'Среднее-специальное',
    JOLTAP: 'Сертификат Joltap',
};

const CreateAnnouncement = ({ announcement = null, specializations }) => {
    const { t, i18n } = useTranslation();
    const isEdit = announcement !== null;
    const [isExactSalary, setIsExactSalary] = useState(false);
    const [withPhone, setWithPhone] = useState(false);
    const requirementInputRefs = useRef([]);
    const responsibilityInputRefs = useRef([]);
    const conditionInputRefs = useRef([]);
    const pendingFocusRef = useRef(null);

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
        label: i18n.language === 'ru' ? category.name_ru : category.name_kz,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: i18n.language === 'ru' ? spec.name_ru : spec.name_kz
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
    const isRemoteWork = data.work_time === 'Удаленная работа';

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

    useEffect(() => {
        if (!pendingFocusRef.current) return;
        const { type, index } = pendingFocusRef.current;
        const refsByType = {
            requirement: requirementInputRefs,
            responsibility: responsibilityInputRefs,
            condition: conditionInputRefs,
        };
        const inputEl = refsByType[type]?.current?.[index];
        if (inputEl) {
            inputEl.focus();
            const length = inputEl.value?.length ?? 0;
            if (typeof inputEl.setSelectionRange === 'function') {
                inputEl.setSelectionRange(length, length);
            }
        }
        pendingFocusRef.current = null;
    }, [data.requirement.length, data.responsibility.length, data.condition.length]);

    const queueFocus = (type, index) => {
        pendingFocusRef.current = { type, index };
    };

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
        setShowOtherCityInput(value === CITY_VALUES.OTHER);
    };

    const handleWorkTimeChange = (value) => {
        setData((prevData) => {
            const nextData = { ...prevData, work_time: value };
            if (value === WORK_TIME_VALUES.REMOTE) {
                nextData.city = '';
                nextData.location = [];
            } else if (prevData.location.length === 0) {
                nextData.location = [''];
            }
            return nextData;
        });
        if (value === WORK_TIME_VALUES.REMOTE) {
            setShowOtherCityInput(false);
        }
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
            onSuccess: () => notification.success({
                message: t('successfully_saved', { ns : 'createAnnouncement'})
            }),
            onError: (errors) => {
                if (typeof errors === 'object') {
                    Object.values(errors).forEach((error) => {
                        notification.error({
                            message: t('failed_to_save', { ns: 'createAnnouncement' }),
                            description: error,
                        });
                    });
                } else {
                    notification.error({
                        message: t('failed_to_save', { ns: 'createAnnouncement' }),
                    });
                }
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
                        {!isRemoteWork && (
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
                                    <Option value={CITY_VALUES.REMOTE}>{t('city_remote', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={CITY_VALUES.OTHER}>{t('city_other', { ns: 'createAnnouncement' })}</Option>
                                </Select>
                            </Form.Item>
                        )}

                        {!isRemoteWork && showOtherCityInput && (
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
                        {!isRemoteWork && (
                            <>
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
                            </>
                        )}
                        <div className='grid grid-cols-2 gap-x-5'>
                            <Form.Item
                                label={t('work_time', { ns: 'createAnnouncement' })}
                                name="work_time"
                                rules={[{ required: true, message: t('please_select_work_time', { ns: 'createAnnouncement' }) }]}
                            >
                                <Select
                                    value={data.work_time}
                                    onChange={handleWorkTimeChange}
                                >
                                    <Option value={WORK_TIME_VALUES.FULL_DAY}>{t('work_time_full_day', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={WORK_TIME_VALUES.SHIFT}>{t('work_time_shift', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={WORK_TIME_VALUES.FLEXIBLE}>{t('work_time_flexible', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={WORK_TIME_VALUES.REMOTE}>{t('work_time_remote', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={WORK_TIME_VALUES.ROTATION}>{t('work_time_rotation', { ns: 'createAnnouncement' })}</Option>
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
                                    <Option value={EMPLOYMENT_VALUES.FULL}>{t('employment_full', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EMPLOYMENT_VALUES.PART}>{t('employment_part', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EMPLOYMENT_VALUES.PART_TIME}>{t('employment_part_time', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EMPLOYMENT_VALUES.PROJECT}>{t('employment_project', { ns: 'createAnnouncement' })}</Option>
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
                                <Option value={PAYMENT_VALUES.DAILY}>{t('payment_daily', { ns: 'createAnnouncement' })}</Option>
                                <Option value={PAYMENT_VALUES.WEEKLY}>{t('payment_weekly', { ns: 'createAnnouncement' })}</Option>
                                <Option value={PAYMENT_VALUES.MONTHLY}>{t('payment_monthly', { ns: 'createAnnouncement' })}</Option>
                                <Option value={PAYMENT_VALUES.PIECEWORK}>{t('payment_piecework', { ns: 'createAnnouncement' })}</Option>
                                <Option value={PAYMENT_VALUES.NEGOTIABLE}>{t('payment_negotiable', { ns: 'createAnnouncement' })}</Option>
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
                                    <Option value={EXPERIENCE_VALUES.NONE}>{t('experience_none', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EXPERIENCE_VALUES.THREE_TO_SIX_MONTHS}>{t('experience_3to6months', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EXPERIENCE_VALUES.SIX_MONTHS_TO_ONE_YEAR}>{t('experience_6months_to_1year', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EXPERIENCE_VALUES.ONE_TO_THREE_YEARS}>{t('experience_1to3years', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EXPERIENCE_VALUES.THREE_TO_SIX_YEARS}>{t('experience_3to6years', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EXPERIENCE_VALUES.MORE_THAN_SIX_YEARS}>{t('experience_more_6years', { ns: 'createAnnouncement' })}</Option>
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
                                    <Option value={EDUCATION_VALUES.NOT_REQUIRED}>{t('education_not_required', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EDUCATION_VALUES.SECONDARY}>{t('education_secondary', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EDUCATION_VALUES.HIGHER}>{t('education_higher', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EDUCATION_VALUES.SPECIAL}>{t('education_special', { ns: 'createAnnouncement' })}</Option>
                                    <Option value={EDUCATION_VALUES.JOLTAP}>{t('education_joltap', { ns: 'createAnnouncement' })}</Option>
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
                                        ref={(el) => {
                                            requirementInputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        className="text-sm rounded py-1 mt-3 border border-gray-300 flex-1"
                                        value={req}
                                        onChange={(e) => handleRequirementChange(index, e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                const currentText = e.target.value ?? '';
                                                const cursorPosition = e.target.selectionStart ?? currentText.length;
                                                const textBeforeCursor = currentText.substring(0, cursorPosition);
                                                const textAfterCursor = currentText.substring(cursorPosition);
                                                setData((prevData) => {
                                                    const next = [...prevData.requirement];
                                                    next[index] = textBeforeCursor;
                                                    next.splice(index + 1, 0, textAfterCursor);
                                                    return { ...prevData, requirement: next };
                                                });
                                                queueFocus('requirement', index + 1);
                                            }
                                        }}
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
                                        ref={(el) => {
                                            responsibilityInputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        className="text-sm rounded py-1 mt-3 border border-gray-300 flex-1"
                                        value={resp}
                                        onChange={(e) => handleResponsibilityChange(index, e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                const currentText = e.target.value ?? '';
                                                const cursorPosition = e.target.selectionStart ?? currentText.length;
                                                const textBeforeCursor = currentText.substring(0, cursorPosition);
                                                const textAfterCursor = currentText.substring(cursorPosition);
                                                setData((prevData) => {
                                                    const next = [...prevData.responsibility];
                                                    next[index] = textBeforeCursor;
                                                    next.splice(index + 1, 0, textAfterCursor);
                                                    return { ...prevData, responsibility: next };
                                                });
                                                queueFocus('responsibility', index + 1);
                                            }
                                        }}
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
                                        ref={(el) => {
                                            conditionInputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        className="text-sm rounded py-1 mt-3 border border-gray-300 flex-1"
                                        value={cond}
                                        onChange={(e) => handleConditionChange(index, e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                const currentText = e.target.value ?? '';
                                                const cursorPosition = e.target.selectionStart ?? currentText.length;
                                                const textBeforeCursor = currentText.substring(0, cursorPosition);
                                                const textAfterCursor = currentText.substring(cursorPosition);
                                                setData((prevData) => {
                                                    const next = [...prevData.condition];
                                                    next[index] = textBeforeCursor;
                                                    next.splice(index + 1, 0, textAfterCursor);
                                                    return { ...prevData, condition: next };
                                                });
                                                queueFocus('condition', index + 1);
                                            }
                                        }}
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
