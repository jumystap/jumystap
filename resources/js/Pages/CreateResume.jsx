import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Checkbox, Input, Select, DatePicker, Tag, Button, Upload, Space, Cascader, Avatar } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru'
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import GuestLayout from '@/Layouts/GuestLayout';

const { Option } = Select;

const kazakhstanCities = [
    "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
    "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
    "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
    "Экибастуз", "Рудный", "Жезказган"
];

const CreateUpdateResume = ({ announcement, specialization }) => {
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);
    const [editMode, setEditMode] = useState([true]); // Initially all organizations are in edit mode
    const { data, setData, post } = useForm({
        organizations: [{ organization: '', position: '', period: '', isCurrent: false, start_date: '', end_date: '' }],
        city: '',
        district: '',
        languages: [],
        photo_path: null,
        education: '',
        faculty: '',
        specialization: '',
        graduation_year: null,
        ip_status: '',
        desired_field: '',
        skills: [],
        newSkill: '',
    });

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
        setEditMode([...editMode, true]); // Add a new entry to editMode for the new organization
    };

    const updatePeriod = (index) => {
        const updatedOrganizations = [...data.organizations];
        const { start_date, end_date, isCurrent } = updatedOrganizations[index];

        let period;
        if (isCurrent) {
            period = `${format(new Date(start_date), 'd MMM yyyy', { locale: ru })} - По настоящее время`;
        } else {
            period = `${format(new Date(start_date), 'd MMM yyyy', { locale: ru })} - ${end_date ? format(new Date(end_date), 'd MMM yyyy', { locale: ru }) : ''}`;
        }
        updatedOrganizations[index].period = period;
        setData('organizations', updatedOrganizations);
    };

    const handleDateChange = (index, field, value) => {
        const updatedOrganizations = [...data.organizations];
        updatedOrganizations[index][field] = value;
        updatePeriod(index);
        setData('organizations', updatedOrganizations);
    };

    const handleCheckboxChange = (index) => {
        const updatedOrganizations = [...data.organizations];
        updatedOrganizations[index].isCurrent = !updatedOrganizations[index].isCurrent;

        if (updatedOrganizations[index].isCurrent) {
            updatedOrganizations[index].end_date = ''; // Clear end_date if currently employed
        }

        updatePeriod(index);
        setData('organizations', updatedOrganizations);
    };

    const removeOrganization = (index) => {
        const updatedOrganizations = data.organizations.filter((_, i) => i !== index);
        setData('organizations', updatedOrganizations);
        setEditMode(editMode.filter((_, i) => i !== index)); // Remove the corresponding edit mode state
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

    const toggleEditMode = (index) => {
        const updatedEditMode = [...editMode];
        updatedEditMode[index] = !updatedEditMode[index];
        setEditMode(updatedEditMode);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            setData('photo_path', file);
            return false;
        },
    };

    const findCascaderValue = (specialization, specialization_id) => {
        for (let category of specialization) {
            const specialization = category.specialization.find(spec => spec.id === specialization_id);
            if (specialization) {
                return [category.id, specialization.id]; // Return the category id and specialization id as a path
            }
        }
        return []; // Return empty if not found
    };

    const findSpecializationName = (specialization, specialization_id) => {
        for (let category of specialization) {
            const specialization = category.specialization.find(spec => spec.id === specialization_id);
            if (specialization) {
                return specialization.name_ru// Return the category id and specialization id as a path
            }
        }
        return ''; // Return empty if not found
    };

    const defaultValue = findCascaderValue(specialization, data.specialization_id);

    const addSkill = () => {
        if (data.newSkill.trim()) {
            if (!data.skills.includes(data.newSkill.trim())) {
                setData((prevData) => ({
                    ...prevData,
                    skills: [...prevData.skills, prevData.newSkill.trim()],
                    newSkill: ''
                }));
            } else {
                alert("Этот навык уже добавлен"); // Optional: alert the user if the skill already exists
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
                        <div className='font-semibold text-2xl mb-4'>Создать резюме</div>
                        <div className='flex gap-x-5'>
                        {data.photo_path && <img src={URL.createObjectURL(data.photo_path)} className='w-[200px] h-[250px] object-cover'/>}
                        <Form.Item label="Загрузите вашу фотографию" name='photo' rules={[{ required: true, message: 'Пожалуйста, загрузите фотографию' }]}>
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
                                                defaultValue={organization.organization}
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
                                                defaultValue={defaultValue}
                                                onChange={(value) => handleNestedChange(index, 'position', value[1])}
                                                placeholder="Должность"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Период работы"
                                            className='mt-[-17px]'
                                            rules={[{ required: true, message: 'Пожалуйста, укажите дату начала работы' }]}
                                        >
                                            <div className='flex gap-x-5'>
                                                <div>
                                                    <input
                                                        type="date"
                                                        defaultValue={organization.start_date}
                                                        value={organization.start_date}
                                                        onChange={(e) => handleDateChange(index, 'start_date', e.target.value)}
                                                        className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                    />
                                                </div>
                                                <div>
                                                    {!organization.isCurrent && (
                                                        <input
                                                            type="date"
                                                            defaultValue={organization.end_date}
                                                            value={organization.end_date}
                                                            onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
                                                            className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                        />
                                                    )}
                                                    <Checkbox
                                                        checked={organization.isCurrent}
                                                        className='flex'
                                                        onChange={() => handleCheckboxChange(index)}
                                                    >
                                                        По настоящее время
                                                    </Checkbox>
                                                </div>
                                            </div>
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
                                        <p><strong>Должность:</strong> {findSpecializationName(specialization, organization.position)}</p>
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
                                name="city"
                                rules={[{ required: true, message: 'Please enter a city' }]}
                            >
                                <Input
                                    type="text"
                                    name="city"
                                    className='text-sm rounded py-1 mt-[0px] border border-gray-300'
                                    value={data.city}
                                    onChange={() => setData('city', data.city)}
                                />
                            </Form.Item>
                        )}


                        {data.city === 'Астана' && (
                            <Form.Item
                                label="Укажите ваш район проживания"
                                name="district"
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
                            name='languages'
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
                                <Option value="Немецкий">Немецкий</Option>
                                <Option value="Французкий">Французкий</Option>
                                <Option value="Китайский">Китайский</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Укажите ваше образование"
                            name='education'
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
                                <Form.Item
                                    name='faculty'
                                    label="Факультет и специализация"
                                    rules={[{ required: data.education !== 'Среднее', message: 'Пожалуйста, укажите желаемую сферу работы' }]}
                                >
                                    <Input
                                        value={data.faculty}
                                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                                        className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name='year'
                                    rules={[{ required: data.education !== 'Среднее', message: 'Пожалуйста, укажите желаемую сферу работы' }]}
                                    label="Год окончания"
                                >
                                    <DatePicker
                                        picker="year"
                                        placeholder='Год окончания'
                                        value={data.graduation_year ? moment(data.graduation_year) : null}
                                        onChange={(date) => handleInputChange('graduation_year', date ? date.format('YYYY') : null)}
                                    />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            label="Укажите наличие ИП"
                            name='ip_status'
                            rules={[{ required: true, message: 'Пожалуйста, укажите статус ИП' }]}
                        >
                            <Select value={data.ip_status} onChange={(value) => handleInputChange('ip_status', value)}>
                                <Option value="Присутствует">Присутствует</Option>
                                <Option value="Отсутствует">Отсутствует</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="В какой сфере вы желаете работать"
                            name='desired_field'
                            rules={[{ required: true, message: 'Пожалуйста, укажите желаемую сферу работы' }]}
                        >
                            <Cascader
                                options={cascaderData}
                                onChange={(value) => setData('desired_field', value[1])}
                                placeholder="В какой сфере вы желаете работать"
                            />
                        </Form.Item>
                        <Form.Item label="Навыки" name='skills'>
                            <div className='flex items-center gap-x-2'>
                            <Input
                                value={data.newSkill}
                                onChange={(e) => setData('newSkill', e.target.value)}
                                className="text-sm rounded py-1 mt-[0px] border border-gray-300"
                                placeholder="Введите навык и нажмите кнопку"
                            />
                            <Button onClick={addSkill} className=''>
                                Добавить навык
                            </Button>
                            </div>
                            <div className='flex flex-wrap gap-2 mt-2'>
                                {data.skills.map((skill, index) => (
                                    <Tag
                                        key={index}
                                        closable
                                        onClose={() => removeSkill(skill)}
                                        className='rounded-full bg-gray-100 text-gray-500'
                                    >
                                        {skill}
                                    </Tag>
                                ))}
                            </div>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Создать резюме
                        </Button>
                    </Form>
                </div>
                <div className='md:h-full sticky top-0 bg-[#F9FAFC] rounded-lg w-full hidden md:block md:col-span-2 p-5 md:relative'>
                        <div className=''>
                            <div className='text-lg'>Сложности с созданием?</div>
                            <div className='text-sm font-light text-gray-500'>При возникновении трудностей вы можете обратиться по этим контактным данным</div>
                            <div className='mt-10 text-sm'>
                                <div>+7 707 221 31 31</div>
                                <div className='ml-auto'>janamumkindik@gmail.com</div>
                            </div>
                        </div>
                    </div>
            </div>
        </GuestLayout>
    );
};

export default CreateUpdateResume;

