import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Input, Button, Select, Form, Typography, message, Cascader} from 'antd';
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

const UpdateAnnouncement = ({ announcement, specializations }) => {
    const { t } = useTranslation();
    const isEdit = true;
    const [salaryType, setSalaryType] = useState('');
    const [isExactSalary, setIsExactSalary] = useState(false);
    console.log(announcement)

    const handleSalaryTypeChange = (e) => {
        if (e.target.checked) {
            setData('salary_type', 'za_smenu');
        } else {
            setData('salary_type', '');
        }
    };

    const formatNumber = (value) => {
        if (!value) return '';
        return value // Add spaces every 3 digits
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
        } else {
            setData('cost', null);
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
        condition:  [''],
        requirement:  announcement.requirements || [''],
        responsobility:  [''],
        city: announcement.city || '',
        active: announcement.active || true,
        specialization_id: announcement.specialization_id || null,
        salary_type: announcement.salary_type || '',
        cost_min: announcement.cost_min || null,
        cost_max: announcement.cost_max || null,
    });


    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseNumber(value);
        setData((prevData) => ({
            ...prevData,
            [name]: parsedValue,
        }));

        if (name === 'cost_min' || name === 'cost_max') {
            const minFilled = !!value; // Use the updated value for checking
            const maxFilled = !!(name === 'cost_max' ? value : data.cost_max); // Use the value for cost_max if cost_min was updated

            if (minFilled && !maxFilled) {
                setData((prevData) => ({
                    ...prevData,
                    salary_type: 'min',
                }));
            } else if (!minFilled && maxFilled) {
                setData((prevData) => ({
                    ...prevData,
                    salary_type: 'max',
                }));
            } else if (minFilled && maxFilled) {
                setData((prevData) => ({
                    ...prevData,
                    salary_type: 'diapason',
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    salary_type: '',
                })); // Reset salary_type if both are empty
            }
        }
    };

    const [validationErrors, setValidationErrors] = useState({});
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);

    console.log(data)
    const addRequirement = () => {
        setData('requirement', [...data.requirement, '']);
    };
    const addResponsibility = () => {
        setData('responsobility', [...data.responsobility, '']);
    };
    const addCondition = () => {
        setData('condition', [...data.condition, '']);
    };

    // Функции для обновления значений в массивах
    const handleRequirementChange = (index, e) => {
        const updatedRequirements = [...data.requirement];
        updatedRequirements[index].requirement = e.target.value;
        setData('requirement', updatedRequirements);
    };

    const handleResponsibilityChange = (index, e) => {
        const updatedResponsibilities = [...data.responsobility];
        updatedResponsibilities[index] = e.target.value;
        setData('responsobility', updatedResponsibilities);
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
        setData('location', [...data.location, '']); // Добавляем новое пустое поле в массив location
    };

    const handleLocationChange = (index, e) => {
        const updatedLocations = [...data.location];
        updatedLocations[index].adress = e.target.value;
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
            <div className="grid grid-cols-1 md:grid-cols-7 mx-auto p-4">
                <div className='col-span-5'>
                    <Title level={3} className="">
                        {isEdit ? t('title_edit', { ns: 'createAnnouncement' }) : t('create_title', { ns: 'createAnnouncement' })}
                    </Title>
                     <Form onFinish={handleSubmit} layout="vertical" initialValues={data}>
                        <Form.Item
                            label={
                                <span>
                                    Загаловок
                                    <span className="ml-2 text-gray-500">
                                        (Напишите наименование вакансии с заглавной буквы без дополнительной информации)
                                    </span>
                                </span>
                            }
                            name="title"
                            rules={[{ required: true, message: 'Пожалуйста, введите заголовок' }]}
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
                            label="Специализация"
                            name="specialization_id"
                            rules={[{ required: true, message: 'Пожалуйста, выберите специализацию' }]}
                        >
                            <Cascader
                                options={cascaderData}
                                placeholder="Выберите специализацию"
                                onChange={(value) => setData('specialization_id', value[1])}
                            />
                        </Form.Item>
                        <Form.Item
                            label='Город'
                            name="city"
                            rules={[{ required: true, message: ' select a city' }]}
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
                                name="other_city"
                                rules={[{ required: true, message: 'Please enter a city' }]}
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
                        {data.location.map((loc, index) => (
                        <Form.Item
                            label='Адрес рабочего места:'
                            name={`location[${index}].adress`}
                            rules={[{ required: true, message: 'Please enter an address' }]}
                        >
                                <input
                                    key={index}
                                    type="text"
                                    className='text-sm w-full rounded py-1 mt-2 border border-gray-300'
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
                        <div className='grid grid-cols-2 gap-x-5'>
                            <Form.Item
                                label='График работы'
                                name="work_time"
                                rules={[{ required: true, message: 'Please select a payment type' }]}
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
                                label='Тип занятости'
                                name="employemnt_type"
                                rules={[{ required: true, message: 'Please select a payment type' }]}
                            >
                                <Select
                                    value={data.work_time}
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
                            label="Тип оплаты"
                            name="payment_type"
                            rules={[{ required: true, message: 'Please select a payment type' }]}
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
                            <Form.Item label='Точная Зарплата' name="cost" rules={[{ required: true, message: 'Please enter the exact salary' }]}>
                                <Input
                                    type="number"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    name="cost"
                                    value={data.cost}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        ) : (
                            <div className='grid grid-cols-2 gap-x-3'>
                                <Form.Item label='Зарплата От' name="cost_min" rules={[{ required: !data.cost_max, message: 'Please enter either min or max salary' }]}>
                                    <Input
                                        type="text"
                                        name="cost_min"
                                        value={formatNumber(data.cost_min)}
                                        onChange={handleSalaryChange}
                                        className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    />
                                </Form.Item>
                                <Form.Item label='Зарплата До' name="cost_max" rules={[{ required: !data.cost_min, message: 'Please enter either min or max salary' }]}>
                                    <Input
                                        type="number"
                                        className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                        name="cost_max"
                                        value={data.cost_max}
                                        onChange={handleSalaryChange}
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

                        <div className='grid mt-4 grid-cols-2 gap-x-5'>
                            <Form.Item
                                label='Необходимый опыт работы'
                                name="experience"
                                rules={[{ required: true, message: 'Please select a payment type' }]}
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
                        {data.requirement.map((req, index) => (
                        <Form.Item
                            label={
                                <span>
                                    Критерии/Требования
                                    <span className="ml-2 text-gray-500">
                                        (например: черты характера, навыки, аккредитации и тд.)
                                    </span>
                                </span>
                            }
                            name={`requirement[${index}].requirement`}
                            >
                                <Input
                                    key={index}
                                    type="text"
                                    className='text-sm rounded py-1 mt-3 border border-gray-300'
                                    defaultValue={req.requirement}
                                    value={req.requirement}
                                    onChange={(e) => handleRequirementChange(index, e)}
                                />
                        </Form.Item>
                        ))}
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addRequirement}>
                            + Добавить
                        </div>

                        {/* Обязанности */}
                        <Form.Item label={
                                <span>
                                    Обязанности работника
                                    <span className="ml-2 text-gray-500">
                                        (какие рабочие задачи сотрудник будет выполнять)
                                    </span>
                                </span>
                            } name="responsibility">
                            {data.responsobility.map((resp, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    name={`responsibility-${index}`}
                                    className='text-sm rounded py-1 mt-3 border border-gray-300'
                                    value={resp.responsobility}
                                    onChange={(e) => handleResponsibilityChange(index, e)}
                                />
                            ))}
                        </Form.Item>
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addResponsibility}>
                            + Добавить
                        </div>

                        {/* Условия труда */}
                        <Form.Item  label={
                                <span>
                                    Условия труда
                                    <span className="ml-2 text-gray-500">
                                        (например:питание, развозка, и тд.)
                                    </span>
                                </span>
                            }name="condition">
                            {data.condition.map((cond, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    name={`condition-${index}`}
                                    className='text-sm rounded py-1 mt-3 border border-gray-300'
                                    value={cond.condition}
                                    onChange={(e) => handleConditionChange(index, e)}
                                />
                            ))}
                        </Form.Item>
                        <div className='text-blue-500 mt-[-15px] mb-2 cursor-pointer' onClick={addCondition}>
                            + Добавить
                        </div>
                        <Form.Item
                            label='Описание'
                            name="description"
                            rules={[{ required: true, message: 'Пожалуйста, введите описание' }]}
                            value={data.description}
                            onChange={handleChange}
                        >
                            <TextArea rows={4} />
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

