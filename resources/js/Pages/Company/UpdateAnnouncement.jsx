import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Input, Button, Select, Form, Typography, message, Cascader} from 'antd';
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

const UpdateAnnouncement = ({ announcement, specializations }) => {
    const { t } = useTranslation();
    const isEdit = true;
    const [salaryType, setSalaryType] = useState('');
    const [isExactSalary, setIsExactSalary] = useState(false);
    const [isUndefiendSalary, setIsUndefiendSalary] = useState(false);
    console.log(announcement)
    const newRequirementRef = useRef(null);
    const newResponsibilityRef = useRef(null);
    const newConditionRef = useRef(null);

    const handleSalaryTypeChange = (e) => {
        if (e.target.checked) {
            setData('salary_type', 'za_smenu');
        } else {
            setData('salary_type', '');
        }
    };

    const formatNumber = (value) => {
        if (!value) return '';
        return number.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const parseNumber = (value) => {
        return value.replace(/\s/g, ''); // Remove spaces for storing as a number
    };

    const handleExactSalaryChange = (e) => {
        setIsExactSalary(e.target.checked);
        if (e.target.checked) {
            setData('cost_min', null);
            setData('cost_max', null);
            setSalaryType('exact')
            setData('salary_type', 'exact');
        } else {
            setData('cost', null);
            setSalaryType('')
        }
    };
    const handleUndefiendSalaryChange = (e) => {
        setIsUndefiendSalary(e.target.checked);
        if (e.target.checked) {
            setData('cost_min', null);
            setData('cost_max', null);
            setSalaryType('undefiend');
            setData('salary_type', 'undefined');
        } else {
            setSalaryType('')
        }
    };

    const cascaderData = specializations.map(category => ({
        value: category.id,
        label: category.name_ru,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: spec.name_ru
        }))
    }));

    // Find the path based on the specialization_id

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
        requirement:  announcement.requirements || [''],
        responsobility: announcement.responsibilities || [''],
        city: announcement.city || '',
        active: announcement.active || true,
        specialization_id: announcement.specialization_id || null,
        salary_type: announcement.salary_type || '',
        cost_min: announcement.cost_min || null,
        cost_max: announcement.cost_max || null,
    });

    useEffect(() => {
        if (newRequirementRef.current) {
            newRequirementRef.current.focus(); // Move focus to the new TextArea
            newRequirementRef.current.selectionStart = 0; // Move cursor to the beginning
            newRequirementRef.current.selectionEnd = 0;
        }
    }, [data.requirement.length]);

    useEffect(() => {
        if (newResponsibilityRef.current) {
            newResponsibilityRef.current.focus(); // Move focus to the new TextArea
            newResponsibilityRef.current.selectionStart = 0; // Move cursor to the beginning
            newResponsibilityRef.current.selectionEnd = 0;
        }
    }, [data.responsobility.length]);
    useEffect(() => {
        if (newConditionRef.current) {
            newConditionRef.current.focus(); // Move focus to the new TextArea
            newConditionRef.current.selectionStart = 0; // Move cursor to the beginning
            newConditionRef.current.selectionEnd = 0;
        }
    }, [data.condition.length]);

    const addRequirementAtIndex = (index, newText) => {
        setData((prevData) => ({
            ...prevData,
            requirement: [
                ...prevData.requirement.slice(0, index + 1),
                { id: null, announcement_id: prevData.announcement_id || announcement.id, requirement: newText }, // Add a new item with correct structure
                ...prevData.requirement.slice(index + 1)
            ]
        }));
    };

    const addResponsibilityAtIndex = (index, newText) => {
        setData((prevData) => ({
            ...prevData,
            responsobility: [
                ...prevData.responsobility.slice(0, index + 1),
                { id: null, announcement_id: prevData.announcement_id || announcement.id, responsibility: newText }, // Add a new item with correct structure
                ...prevData.responsobility.slice(index + 1)
            ]
        }));
    };

    const addConditionAtIndex = (index, newText) => {
        setData((prevData) => ({
            ...prevData,
            condition: [
                ...prevData.condition.slice(0, index + 1),
                { id: null, announcement_id: prevData.announcement_id || announcement.id, condition: newText }, // Add a new item with correct structure
                ...prevData.condition.slice(index + 1)
            ]
        }));
    };

    const findCascaderValue = (specializations, specialization_id) => {
        for (let category of specializations) {
            const specialization = category.specialization.find(spec => spec.id === specialization_id);
            if (specialization) {
                return [category.id, specialization.id]; // Return the category id and specialization id as a path
            }
        }
        return []; // Return empty if not found
    };

    const defaultValue = findCascaderValue(specializations, data.specialization_id);

    const deleteRequirement = (index) => {
        const newRequirements = [...data.requirement]; // Create a shallow copy
        newRequirements.splice(index, 1); // Remove the requirement at the specified index
        setData((prevData) => ({
            ...prevData,
            requirement: newRequirements.length > 0 ? newRequirements : [], // Set to empty array if nothing left
        }));
    };

    const deleteResponsibility = (index) => {
        const newResponsibilities = [...data.responsobility]; // Create a shallow copy
        newResponsibilities.splice(index, 1); // Remove the responsibility at the specified index
        setData((prevData) => ({
            ...prevData,
            responsobility: newResponsibilities.length > 0 ? newResponsibilities : [], // Set to empty array if nothing left
        }));
    };

    // Function to delete a condition
    const deleteCondition = (index) => {
        const newConditions = [...data.condition]; // Create a shallow copy
        newConditions.splice(index, 1); // Remove the condition at the specified index
        setData((prevData) => ({
            ...prevData,
            condition: newConditions.length > 0 ? newConditions : [], // Set to empty array if nothing left
        }));
    };

    const handleSalaryChange = (name, value) => {
        value = value ? parseInt(value) : null;

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value,
            };

            const cost_min = updatedData.cost_min;
            const cost_max = updatedData.cost_max;
            const cost = updatedData.cost;

            if (cost_min && !cost_max) {
                updatedData.salary_type = 'min';
                updatedData.cost = '';
            } else if (!cost_min && cost_max) {
                updatedData.salary_type = 'max';
                updatedData.cost = '';
            } else if (cost_min && cost_max) {
                updatedData.salary_type = 'diapason';
            } else if (cost) {
                updatedData.salary_type = 'exact'; // Reset if both are empty
            } else {
                updatedData.salary_type = 'undefined'; // Reset if both are empty
            }

            return updatedData;
        });
    };

    const [validationErrors, setValidationErrors] = useState({});
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);

    console.log(data)
    // Function to add a new requirement
    const addRequirement = () => {
        setData((prevData) => ({
            ...prevData,
            requirement: [
                ...prevData.requirement,
                { id: null, announcement_id: prevData.announcement_id || announcement.id, requirement: "" }
            ]
        }));
    };

    // Function to add a new responsibility
    const addResponsibility = () => {
        setData((prevData) => ({
            ...prevData,
            responsobility: [
                ...prevData.responsobility,
                { id: null, announcement_id: prevData.announcement_id || announcement.id, responsibility: "" }
            ]
        }));
    };

    // Function to add a new condition
    const addCondition = () => {
        setData((prevData) => ({
            ...prevData,
            condition: [
                ...prevData.condition,
                { id: null, announcement_id: prevData.announcement_id || announcement.id, condition: "" }
            ]
        }));
    };


    // Функции для обновления значений в массивах
    const handleRequirementChange = (index, e) => {
        const updatedRequirements = [...data.requirement];
        updatedRequirements[index].requirement = e.target.value;
        updatedRequirements[index].id = index;
        setData('requirement', updatedRequirements);
    };

    const handleResponsibilityChange = (index, e) => {
        const updatedResponsibilities = [...data.responsobility];
        updatedResponsibilities[index].responsibility = e.target.value;
        updatedResponsibilities[index].id = index;
        setData('responsobility', updatedResponsibilities);
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

        const submitAction = put;
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
                                <span className='font-semibold'>
                                    Загаловок
                                    <span className="ml-2 font-regular text-gray-500">
                                        (Напишите наименование вакансии с заглавной буквы без дополнительной информации)
                                    </span>
                                </span>
                            }
                            name="title"
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
                            label={<span className='font-semibold'>Укажите отрасль/сферу</span>}
                            initialValue={defaultValue}
                        >
                            <Cascader
                                options={cascaderData}
                                placeholder="Выберите специализацию"
                                defaultValue={defaultValue}
                                onChange={(value) => setData('specialization_id', value[1])}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<span className='font-semibold'>Город</span>}
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
                                label={<span className='font-semibold'>Введите другой город</span>}
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
                            <span className='font-semibold'>
                                Укажите адрес рабочего места
                            </span>
                        </div>
                        {data.location.map((loc, index) => (
                        <Form.Item
                            name={`location[${index}].adress`}
                            className='mt-[-15px]'
                        >
                                <input
                                    key={index}
                                    type="text"
                                    className='text-sm w-full rounded py-1 mt-1 border border-gray-300'
                                    value={loc.adress}
                                    defaultValue={loc.adress}
                                    onChange={(e) => handleLocationChange(index, e)}
                                />
                        </Form.Item>
                        ))}
                        <div
                            className='text-blue-500 mt-[-15px] mb-2'
                            onClick={addLocation}
                        >
                            + Добавить еще один адрес
                        </div>
                        <div className='grid grid-cols-2 gap-x-5 mt-5'>
                            <Form.Item
                                label={<span className='font-semibold'>График работы</span>}
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
                                label='Тип занятости'
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
                                    Заполните рабочее время и дни
                                    <span className="ml-2 text-gray-500">
                                        (например: 5/2 с 10:00 до 19:00)
                                    </span>
                                </span>
                            }
                            name="work_hours"
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
                            label="Тип оплаты"
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
                        {!isUndefiendSalary && (
                        <>
                        {isExactSalary ? (
                            <Form.Item label='Точная Зарплата' rules={[{ required: true, message: 'Please enter the exact salary' }]}>
                                <CurrencyInput
                                    className='w-full text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    name="cost"
                                    onValueChange={(name, value) => handleSalaryChange(value, name)}
                                    defaultValue={data.cost}
                                />
                            </Form.Item>
                        ) : (
                            <div className='grid grid-cols-2 gap-x-3'>
                                <Form.Item label='Зарплата От' rules={[{ required: !data.cost_max, message: 'Please enter either min or max salary' }]}>
                                    <CurrencyInput
                                        name="cost_min"
                                        defaultValue={data.cost_min}
                                        onValueChange={(name, value) => handleSalaryChange(value, name)}
                                        className='text-sm rounded py-1 mt-[0px] border border-gray-300 w-full'
                                    />
                                </Form.Item>
                                <Form.Item label='Зарплата До' rules={[{ required: !data.cost_min, message: 'Please enter either min or max salary' }]}>
                                    <CurrencyInput
                                        className='text-sm rounded w-full py-1 mt-[0px] border border-gray-300'
                                        name="cost_max"
                                        defaultValue={data.cost_max}
                                        onValueChange={(name, value) => handleSalaryChange(value, name)}
                                    />
                                </Form.Item>
                            </div>
                        )}
                        </>
                        )}
                        <div className='flex items-center gap-x-2 mt-[-15px]'>
                            <input
                                type='checkbox'
                                name='undefiend'
                                id='undefiend'
                                className='rounded border-gray-400'
                                checked={isUndefiendSalary}
                                onChange={handleUndefiendSalaryChange}
                            />
                            <label htmlFor='undefiend'>Договорная зарплата</label>
                        </div>
                        {!isUndefiendSalary && (
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
                            <label htmlFor='exact_salary'>Точная зарплата</label>
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
                            <label htmlFor='za_smenu'>За смену</label>
                        </div>
                        </>
                        )}

                        <div className='grid mt-4 grid-cols-2 gap-x-5'>
                            <Form.Item
                                label='Необходимый опыт работы'
                                name="experience"
                            >
                                <Select
                                    value={data.work_time}
                                    onChange={(value) => setData('experience', value)}
                                >
                                    <Option value="Без опыта работы">Без опыта работы</Option>
                                    <Option value="От 1 года">От 1 года</Option>
                                    <Option value="От 3 лет">От 3 лет</Option>
                                    <Option value="От 5 лет">От 5 лет</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='Образование'
                                name="education"
                                rules={[{ required: true, message: 'Please select a payment type' }]}
                            >
                                <Select
                                    value={data.work_time}
                                    onChange={(value) => setData('education', value)}
                                >
                                    <Option value="Необязательно">Необязательно</Option>
                                    <Option value="Среднее">Среднее</Option>
                                    <Option value="Высшее">Высшее</Option>
                                    <Option value="Специальное">Специальное</Option>
                                </Select>
                            </Form.Item>
                        </div>
                          {/* Критерии/Требования */}
                        <div className='font-semibold mb-4'>
                                <span>
                                    Критерии/Требования
                                    <span className="font-regular ml-2 mb-4 text-gray-500">
                                        (например: черты характера, навыки, аккредитации и тд.)
                                    </span>
                                </span>
                        </div>
                        {data.requirement.map((req, index) => (
                        <Form.Item
                            name={`requirement[${index}].requirement`}
                            className='mt-[-10px]'
                            >
                                <TextArea
                                    ref={index === data.requirement.length - 1 ? newRequirementRef : null}
                                    key={index}
                                    type="text"
                                    className='text-sm w-full rounded py-1 border border-gray-300'
                                    defaultValue={req.requirement}
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
                                <button type="button" className='text-red-500 mt-1' onClick={() => deleteRequirement(index)}>Удалить</button>
                        </Form.Item>
                        ))}
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addRequirement}>
                            + Добавить
                        </div>

                        {/* Обязанности */}
                        <div className='mb-4 font-semibold'>
                            Обязанности работника
                            <span className="font-regular ml-2 text-gray-500">
                                (какие рабочие задачи сотрудник будет выполнять)
                            </span>
                        </div>
                        {data.responsobility.map((resp, index) => (
                        <Form.Item
                            name={`responsibility[${index}].responsibility`}
                            className='mt-[-10px]'
                        >
                                <TextArea
                                    ref={index === data.responsobility.length - 1 ? newResponsibilityRef : null}
                                    key={index}
                                    type="text"
                                    name={`responsibility-${index}`}
                                    className='text-sm rounded py-1 border border-gray-300'
                                    value={resp.responsibility}
                                    defaultValue={resp.responsibility}
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
                                <button type="button" className='text-red-500 mt-1' onClick={() => deleteResponsibility(index)}>Удалить</button>
                        </Form.Item>
                        ))}
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addResponsibility}>
                            + Добавить
                        </div>

                        {/* Условия труда */}
                        <div className='mb-4 font-semibold'>
                            Условия труда
                            <span className="ml-2 font-regular text-gray-500">
                                (например:питание, развозка, и тд.)
                            </span>
                        </div>
                        {data.condition.map((cond, index) => (
                        <Form.Item name={`condition[${index}].condition`} className='mt-[-10px]'>
                                <TextArea
                                    ref={index === data.condition.length - 1 ? newConditionRef : null}
                                    key={index}
                                    type="text"
                                    name={`condition-${index}`}
                                    className='text-sm rounded py-1 border border-gray-300'
                                    defaultValue={cond.condition}
                                    value={cond.condition}
                                    onChange={(e) => handleConditionChange(index, e)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();  // Prevent default "Enter" behavior (line break)
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
                                <button type="button" className='text-red-500 mt-1' onClick={() => deleteCondition(index)}>Удалить</button>
                        </Form.Item>
                        ))}
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addCondition}>
                            + Добавить
                        </div>
                        <Form.Item
                            label='Описание'

                        >
                            <TextArea name="description"
                            value={data.description}
                            onChange={handleChange} rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={processing}>
                                Изменить
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </GuestLayout>
    );
};

export default UpdateAnnouncement;

