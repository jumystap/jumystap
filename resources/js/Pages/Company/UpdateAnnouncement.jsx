import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Input, Button, Select, Form, Typography, message, Cascader } from 'antd';
import GuestLayout from '@/Layouts/GuestLayout';
import CurrencyInput from 'react-currency-input-field';

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

const UpdateAnnouncement = ({isAdmin, announcement, specializations }) => {
    const { t } = useTranslation();
    const isEdit = true;
    const [salaryType, setSalaryType] = useState(announcement.salary_type || '');
    const [isTop, setIsTop] = useState(announcement.is_top);
    const [isUrgent, setIsUrgent] = useState(announcement.is_urgent);
    const [isExactSalary, setIsExactSalary] = useState(announcement.salary_type === 'exact');
    const [isUndefinedSalary, setIsUndefinedSalary] = useState(announcement.salary_type === 'undefined');
    const newRequirementRef = useRef(null);
    const newResponsibilityRef = useRef(null);
    const newConditionRef = useRef(null);

    const { data, setData, post, put, processing, errors } = useForm({
        type_kz: 'Тапсырыс',
        type_ru: 'Заказ',
        title: announcement.title || '',
        description: announcement.description || '',
        payment_type: announcement.payment_type || '',
        cost: announcement.cost || null,
        work_time: announcement.work_time || '',
        work_hours: announcement.work_hours || '',
        education: announcement.education || '',
        experience: announcement.experience || '',
        employemnt_type: announcement.employemnt_type || '',
        start_time: announcement.start_time || '',
        location: announcement.address || [''],
        condition: announcement.conditions || [''],
        requirement: announcement.requirements || [''],
        responsibility: announcement.responsibilities || [''],
        city: announcement.city || '',
        status: announcement.status,
        specialization_id: announcement.specialization_id || null,
        salary_type: announcement.salary_type || '',
        cost_min: announcement.cost_min || null,
        cost_max: announcement.cost_max || null,
        is_top: announcement.is_top || false,
        is_urgent: announcement.is_urgent || false,
    });

    const handleSalaryTypeChange = (e) => {
        const isChecked = e.target.checked;
        setSalaryType(isChecked ? 'za_smenu' : '');
        setData('salary_type', isChecked ? 'za_smenu' : '');
    };

    const handleIsTopChange = (e) => {
        const isChecked = e.target.checked;
        setIsTop(!!isChecked);
        setData('is_top', !!isChecked);
    };

    const handleIsUrgentChange = (e) => {
        const isChecked = e.target.checked;
        setIsUrgent(!!isChecked);
        setData('is_urgent', !!isChecked);
    };

    const handleExactSalaryChange = (e) => {
        const isChecked = e.target.checked;
        setIsExactSalary(isChecked);
        setIsUndefinedSalary(false);

        if (isChecked) {
            setData({
                ...data,
                salary_type: 'exact',
                cost_min: null,
                cost_max: null
            });
            setSalaryType('exact');
        } else if (!isUndefinedSalary) {
            setData({
                ...data,
                salary_type: data.cost_min || data.cost_max ? 'diapason' : ''
            });
            setSalaryType(data.cost_min || data.cost_max ? 'diapazon' : '');
        }
    };

    const handleUndefinedSalaryChange = (e) => {
        const isChecked = e.target.checked;
        setIsUndefinedSalary(isChecked);
        setIsExactSalary(false);

        if (isChecked) {
            setData({
                ...data,
                salary_type: 'undefined',
                cost: null,
                cost_min: null,
                cost_max: null
            });
            setSalaryType('undefined');
        } else {
            setData({
                ...data,
                salary_type: data.cost ? 'exact' : (data.cost_min || data.cost_max ? 'diapason' : '')
            });
            setSalaryType(data.cost ? 'exact' : (data.cost_min || data.cost_max ? 'diapazon' : ''));
        }
    };

    const handleSalaryChange = (value, name) => {
        const parsedValue = value ? parseInt(value.replace(/\D/g, '')) : null;

        setData(prevData => {
            const updatedData = {
                ...prevData,
                [name]: parsedValue,
            };

            if (isUndefinedSalary) {
                updatedData.salary_type = 'undefined';
            } else if (isExactSalary) {
                updatedData.salary_type = 'exact';
            } else {
                const hasMin = !!updatedData.cost_min;
                const hasMax = !!updatedData.cost_max;

                if (hasMin && hasMax) {
                    updatedData.salary_type = 'diapason';
                } else if (hasMin) {
                    updatedData.salary_type = 'min';
                } else if (hasMax) {
                    updatedData.salary_type = 'max';
                } else {
                    updatedData.salary_type = '';
                }
            }

            if (name === 'za_smenu') {
                updatedData.salary_type = 'za_smenu';
            }

            setSalaryType(updatedData.salary_type);
            return updatedData;
        });
    };

    const cascaderData = specializations.map(category => ({
        value: category.id,
        label: category.name_ru,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: spec.name_ru
        }))
    }));

    useEffect(() => {
        if (newRequirementRef.current) {
            newRequirementRef.current.focus();
            newRequirementRef.current.selectionStart = 0;
            newRequirementRef.current.selectionEnd = 0;
        }
    }, [data.requirement.length]);

    useEffect(() => {
        if (newResponsibilityRef.current) {
            newResponsibilityRef.current.focus();
            newResponsibilityRef.current.selectionStart = 0;
            newResponsibilityRef.current.selectionEnd = 0;
        }
    }, [data.responsibility.length]);

    useEffect(() => {
        if (newConditionRef.current) {
            newConditionRef.current.focus();
            newConditionRef.current.selectionStart = 0;
            newConditionRef.current.selectionEnd = 0;
        }
    }, [data.condition.length]);

    const addRequirementAtIndex = (index, newText) => {
        setData((prevData) => ({
            ...prevData,
            requirement: [
                ...prevData.requirement.slice(0, index + 1),
                { id: index, announcement_id: prevData.announcement_id || announcement.id, requirement: newText },
                ...prevData.requirement.slice(index + 1)
            ]
        }));
    };

    const addResponsibilityAtIndex = (index, newText) => {
        setData((prevData) => ({
            ...prevData,
            responsibility: [
                ...prevData.responsibility.slice(0, index + 1),
                { id: index, announcement_id: prevData.announcement_id || announcement.id, responsibility: newText },
                ...prevData.responsibility.slice(index + 1)
            ]
        }));
    };

    const addConditionAtIndex = (index, newText) => {
        setData((prevData) => ({
            ...prevData,
            condition: [
                ...prevData.condition.slice(0, index + 1),
                { id: index, announcement_id: prevData.announcement_id || announcement.id, condition: newText },
                ...prevData.condition.slice(index + 1)
            ]
        }));
    };

    const findCascaderValue = (specializations, specialization_id) => {
        for (let category of specializations) {
            const specialization = category.specialization.find(spec => spec.id === specialization_id);
            if (specialization) {
                return [category.id, specialization.id];
            }
        }
        return [];
    };

    const defaultValue = findCascaderValue(specializations, data.specialization_id);

    const deleteLocation = (index) => {
        const newLocation = [...data.location];
        newLocation.splice(index, 1);
        setData((prevData) => ({
            ...prevData,
            location: newLocation.length > 0 ? newLocation : []
        }));
    };

    const deleteRequirement = (index) => {
        const newRequirements = [...data.requirement];
        newRequirements.splice(index, 1);
        setData((prevData) => ({
            ...prevData,
            requirement: newRequirements.length > 0 ? newRequirements : []
        }));
    };

    const deleteResponsibility = (index) => {
        const newResponsibilities = [...data.responsibility];
        newResponsibilities.splice(index, 1);
        setData((prevData) => ({
            ...prevData,
            responsibility: newResponsibilities.length > 0 ? newResponsibilities : []
        }));
    };

    const deleteCondition = (index) => {
        const newConditions = [...data.condition];
        newConditions.splice(index, 1);
        setData((prevData) => ({
            ...prevData,
            condition: newConditions.length > 0 ? newConditions : []
        }));
    };

    const [validationErrors, setValidationErrors] = useState({});
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);

    const addRequirement = () => {
        setData((prevData) => ({
            ...prevData,
            requirement: [
                ...prevData.requirement,
                { id: null, announcement_id: prevData.announcement_id || announcement.id, requirement: "" }
            ]
        }));
    };

    const addResponsibility = () => {
        setData((prevData) => ({
            ...prevData,
            responsibility: [
                ...prevData.responsibility,
                { id: null, announcement_id: prevData.announcement_id || announcement.id, responsibility: "" }
            ]
        }));
    };

    const addCondition = () => {
        setData((prevData) => ({
            ...prevData,
            condition: [
                ...prevData.condition,
                { id: null, announcement_id: prevData.announcement_id || announcement.id, condition: "" }
            ]
        }));
    };

    const handleRequirementChange = (index, e) => {
        const updatedRequirements = [...data.requirement];
        updatedRequirements[index].requirement = e.target.value;
        updatedRequirements[index].id = index;
        setData('requirement', updatedRequirements);
    };

    const handleResponsibilityChange = (index, e) => {
        const updatedResponsibilities = [...data.responsibility];
        updatedResponsibilities[index].responsibility = e.target.value;
        updatedResponsibilities[index].id = index;
        setData('responsibility', updatedResponsibilities);
    };

    const handleConditionChange = (index, e) => {
        const updatedConditions = [...data.condition];
        updatedConditions[index].condition = e.target.value;
        updatedConditions[index].id = index;
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
        setData((prevData) => ({
            ...prevData,
            location: [
                ...prevData.location,
                { id: null, announcement_id: prevData.announcement_id || announcement.id, adress: "" }
            ]
        }));
    };

    const handleLocationChange = (index, e) => {
        const updatedLocations = [...data.location];
        updatedLocations[index].adress = e.target.value;
        updatedLocations[index].id = index;
        setData('location', updatedLocations);
    };

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

        const url = `/announcements/${announcement.id}`;
        try {
            put(url, data, {
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
            <div className="grid grid-cols-1 md:grid-cols-7 mx-auto p-4">
                <div className='col-span-5'>
                    <Title level={3} className="">
                        {isEdit ? t('title_edit', { ns: 'createAnnouncement' }) : t('create_title', { ns: 'createAnnouncement' })}
                    </Title>
                    <Form onFinish={handleSubmit} layout="vertical" initialValues={data}>
                        <Form.Item
                            label={
                                <span>
                                    {t('title', { ns: 'createAnnouncement' })}
                                    <span className="ml-2 font-regular text-gray-500">
                                        {t('title_recommendation', { ns: 'createAnnouncement' })}
                                    </span>
                                </span>
                            }
                            name="title"
                            validateStatus={errors.title ? 'error' : ''}
                            help={errors.title}
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
                            initialValue={defaultValue}
                        >
                            <Cascader
                                options={cascaderData}
                                placeholder={t('select_specialization', { ns: 'createAnnouncement' })}
                                defaultValue={defaultValue}
                                onChange={(value) => setData('specialization_id', value[1])}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('city', { ns: 'createAnnouncement' })}
                            name="city"
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
                                name="other_city"
                            >
                                <Input
                                    type="text"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    name="city"
                                    value={data.city}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        )}
                        <div className='mb-4'>
                            {t('location', { ns: 'createAnnouncement' })}
                        </div>
                        {data.location.map((loc, index) => (
                            <Form.Item
                                name={`location[${index}].adress`}
                                className='mt-[-15px]'
                                validateStatus={errors?.[`location.${index}.adress`] ? 'error' : ''}
                                help={errors?.[`location.${index}.adress`] || null}
                            >
                                <input
                                    key={index}
                                    type="text"
                                    className='text-sm w-full rounded py-1 mt-1 border border-gray-300'
                                    value={loc.adress}
                                    onChange={(e) => handleLocationChange(index, e)}
                                />
                                <button type="button" className='text-red-500 mt-1' onClick={() => deleteLocation(index)}>{t('delete', { ns: 'createAnnouncement' })}</button>
                            </Form.Item>
                        ))}
                        <div
                            className='text-blue-500 mt-[-15px] mb-2'
                            onClick={addLocation}
                        >
                            {t('add_another_address', { ns: 'createAnnouncement' })}
                        </div>
                        <div className='grid grid-cols-2 gap-x-5 mt-5'>
                            <Form.Item
                                label={t('work_time', { ns: 'createAnnouncement' })}
                                name="work_time"
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
                                label={t('employemnt_type', { ns: 'createAnnouncement' })}
                                name="employemnt_type"
                            >
                                <Select
                                    name="employemnt_type"
                                    value={data.employemnt_type}
                                    onChange={(value) => setData('employemnt_type', value)}
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
                            validateStatus={errors.work_hours ? 'error' : ''}
                            help={errors.work_hours}
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
                        {!isUndefinedSalary && (
                            <>
                                {isExactSalary ? (
                                    <Form.Item
                                        label={t('cost', { ns: 'createAnnouncement' })}
                                        rules={[{ required: true, message: 'Please enter the exact salary' }]}
                                    >
                                        <CurrencyInput
                                            className='w-full text-sm rounded py-1 mt-[0px] border border-gray-300'
                                            name="cost"
                                            value={data.cost}
                                            onValueChange={(value) => handleSalaryChange(value, 'cost')}
                                            validateStatus={errors.cost ? 'error' : ''}
                                            help={errors.cost}
                                        />
                                    </Form.Item>
                                ) : (
                                    <div className='grid grid-cols-2 gap-x-3'>
                                        <Form.Item
                                            label={t('cost_min', { ns: 'createAnnouncement' })}
                                            rules={[{ required: !data.cost_max && !isExactSalary && !isUndefinedSalary, message: 'Please enter either min or max salary' }]}
                                        >
                                            <CurrencyInput
                                                name="cost_min"
                                                value={data.cost_min}
                                                onValueChange={(value) => handleSalaryChange(value, 'cost_min')}
                                                className='text-sm rounded py-1 mt-[0px] border border-gray-300 w-full'
                                                validateStatus={errors.cost_min ? 'error' : ''}
                                                help={errors.cost_min}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={t('cost_max', { ns: 'createAnnouncement' })}
                                            rules={[{ required: !data.cost_min && !isExactSalary && !isUndefinedSalary, message: 'Please enter either min or max salary' }]}
                                        >
                                            <CurrencyInput
                                                className='text-sm rounded w-full py-1 mt-[0px] border border-gray-300'
                                                name="cost_max"
                                                value={data.cost_max}
                                                onValueChange={(value) => handleSalaryChange(value, 'cost_max')}
                                                validateStatus={errors.cost_max ? 'error' : ''}
                                                help={errors.cost_max}
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </>
                        )}
                        <div className='flex items-center gap-x-2 mt-[-15px]'>
                            <input
                                type='checkbox'
                                name='undefined'
                                id='undefined'
                                className='rounded border-gray-400'
                                checked={isUndefinedSalary}
                                onChange={handleUndefinedSalaryChange}
                            />
                            <label htmlFor='undefined'>{t('undefined_cost', { ns: 'createAnnouncement' })}</label>
                        </div>
                        {!isUndefinedSalary && (
                            <>
                                <div className='flex items-center gap-x-2 mt-2'>
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
                                        checked={salaryType === 'za_smenu'}
                                        onChange={handleSalaryTypeChange}
                                    />
                                    <label htmlFor='za_smenu'>{t('per_shift', { ns: 'createAnnouncement' })}</label>
                                </div>
                            </>
                        )}
                        <div className='grid mt-4 grid-cols-2 gap-x-5'>
                            <Form.Item
                                label={t('experience', { ns: 'createAnnouncement' })}
                                name="experience"
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
                            >
                                <Select
                                    value={data.education}
                                    onChange={(value) => setData('education', value)}
                                >
                                    <Option value="Необязательно">Необязательно</Option>
                                    <Option value="Среднее">Среднее</Option>
                                    <Option value="Высшее">Высшее</Option>
                                    <Option value="Среднее-специальное">Среднее-специальное</Option>
                                    <Option value="Сертификат Joltap">Сертификат Joltap</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div className='mb-4'>
                            <span>
                                {t('requirement', { ns: 'createAnnouncement' })}
                                <span className="font-regular ml-2 mb-4 text-gray-500">
                                    {t('requirement_example', { ns: 'createAnnouncement' })}
                                </span>
                            </span>
                        </div>
                        {data.requirement.map((req, index) => (
                            <Form.Item
                                name={`requirement[${index}].requirement`}
                                className='mt-[-10px]'
                                validateStatus={errors?.[`requirement.${index}.requirement`] ? 'error' : ''}
                                help={errors?.[`requirement.${index}.requirement`] || null}
                            >
                                <TextArea
                                    ref={index === data.requirement.length - 1 ? newRequirementRef : null}
                                    key={index}
                                    type="text"
                                    className='text-sm w-full rounded py-1 border border-gray-300'
                                    value={req.requirement}
                                    onChange={(e) => handleRequirementChange(index, e)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            const textarea = e.target;
                                            const cursorPosition = textarea.selectionStart;
                                            const currentText = textarea.value;

                                            const textBeforeCursor = currentText.substring(0, cursorPosition);
                                            const textAfterCursor = currentText.substring(cursorPosition);

                                            handleRequirementChange(index, {
                                                target: { value: textBeforeCursor },
                                            });

                                            addRequirementAtIndex(index, textAfterCursor);
                                        }
                                    }}
                                />
                                <button type="button" className='text-red-500 mt-1' onClick={() => deleteRequirement(index)}>{t('delete', { ns: 'createAnnouncement' })}</button>
                            </Form.Item>
                        ))}
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addRequirement}>
                            {t('add', { ns: 'createAnnouncement' })}
                        </div>
                        <div className='mb-4'>
                            {t('responsibility', { ns: 'createAnnouncement' })}
                            <span className="font-regular ml-2 text-gray-500">
                                {t('responsibility_example', { ns: 'createAnnouncement' })}
                            </span>
                        </div>
                        {data.responsibility.map((resp, index) => (
                            <Form.Item
                                name={`responsibility[${index}].responsibility`}
                                className='mt-[-10px]'
                                validateStatus={errors?.[`responsibility.${index}.responsibility`] ? 'error' : ''}
                                help={errors?.[`responsibility.${index}.responsibility`] || null}
                            >
                                <TextArea
                                    ref={index === data.responsibility.length - 1 ? newResponsibilityRef : null}
                                    key={index}
                                    type="text"
                                    name={`responsibility-${index}`}
                                    className='text-sm rounded py-1 border border-gray-300'
                                    value={resp.responsibility}
                                    onChange={(e) => handleResponsibilityChange(index, e)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            const textarea = e.target;
                                            const cursorPosition = textarea.selectionStart;
                                            const currentText = textarea.value;

                                            const textBeforeCursor = currentText.substring(0, cursorPosition);
                                            const textAfterCursor = currentText.substring(cursorPosition);

                                            handleResponsibilityChange(index, {
                                                target: { value: textBeforeCursor },
                                            });

                                            addResponsibilityAtIndex(index, textAfterCursor);
                                        }
                                    }}
                                />
                                <button type="button" className='text-red-500 mt-1' onClick={() => deleteResponsibility(index)}>{t('delete', { ns: 'createAnnouncement' })}</button>
                            </Form.Item>
                        ))}
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addResponsibility}>
                            {t('add', { ns: 'createAnnouncement' })}
                        </div>
                        <div className='mb-4'>
                            {t('condition', { ns: 'createAnnouncement' })}
                            <span className="ml-2 font-regular text-gray-500">
                                {t('condition_example', { ns: 'createAnnouncement' })}
                            </span>
                        </div>
                        {data.condition.map((cond, index) => (
                            <Form.Item
                                name={`condition[${index}].condition`}
                                className='mt-[-10px]'
                                validateStatus={errors?.[`condition.${index}.condition`] ? 'error' : ''}
                                help={errors?.[`condition.${index}.condition`] || null}
                            >
                                <TextArea
                                    ref={index === data.condition.length - 1 ? newConditionRef : null}
                                    key={index}
                                    type="text"
                                    name={`condition-${index}`}
                                    className='text-sm rounded py-1 border border-gray-300'
                                    value={cond.condition}
                                    onChange={(e) => handleConditionChange(index, e)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            const textarea = e.target;
                                            const cursorPosition = textarea.selectionStart;
                                            const currentText = textarea.value;

                                            const textBeforeCursor = currentText.substring(0, cursorPosition);
                                            const textAfterCursor = currentText.substring(cursorPosition);

                                            handleConditionChange(index, {
                                                target: { value: textBeforeCursor },
                                            });

                                            addConditionAtIndex(index, textAfterCursor);
                                        }
                                    }}
                                />
                                <button type="button" className='text-red-500 mt-1' onClick={() => deleteCondition(index)}>{t('delete', { ns: 'createAnnouncement' })}</button>
                            </Form.Item>
                        ))}
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addCondition}>
                            {t('add', { ns: 'createAnnouncement' })}
                        </div>
                        <Form.Item
                            label={t('additional_info', { ns: 'createAnnouncement' })}
                        >
                            <TextArea
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </Form.Item>
                        {
                            isAdmin ?
                                <div className='flex items-center gap-x-2 mt-2 mb-2'>
                                    <input
                                        type='checkbox'
                                        name='is_top'
                                        id='is_top'
                                        className='rounded border-gray-400'
                                        checked={isTop == 1}
                                        onChange={handleIsTopChange}
                                    />
                                    <label htmlFor='is_top'>{t('is_top', { ns: 'createAnnouncement' })}</label>
                                </div>
                                : ''
                        }
                        {
                            isAdmin ?
                                <div className='flex items-center gap-x-2 mt-2 mb-2'>
                                    <input
                                        type='checkbox'
                                        name='is_urgent'
                                        id='is_urgent'
                                        className='rounded border-gray-400'
                                        checked={isUrgent == 1}
                                        onChange={handleIsUrgentChange}
                                    />
                                    <label htmlFor='is_urgent'>{t('is_urgent', { ns: 'createAnnouncement' })}</label>
                                </div>
                            : ''
                        }

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={processing}>
                                {t('edit', { ns: 'createAnnouncement' })}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </GuestLayout>
    );
};

export default UpdateAnnouncement;
