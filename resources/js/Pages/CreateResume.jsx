import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Input, Select, DatePicker, Button, Upload, Space, Cascader, Avatar} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import GuestLayout from '@/Layouts/GuestLayout';

const { Option } = Select;

const kazakhstanCities = [
    "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз",
    "Павлодар", "Усть-Каменогорск", "Семей", "Костанай", "Петропавловск",
    "Кызылорда", "Атырау", "Актау", "Уральск", "Темиртау", "Талдыкорган",
    "Экибастуз", "Рудный", "Жезказган"
];

const CreateUpdateResume = ({specialization}) => {
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);
    const { data, setData, post } = useForm({
        organizations: [{ organization: '', position: '', period: '' }],
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

    const handleCityChange = (value) => {
        setData('city', value);
        setShowOtherCityInput(value === 'Другое');
    };

    console.log(specialization)

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
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="col-span-5 p-5">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Загрузите вашу фотографию" rules={[{ required: true, message: 'Пожалуйста, загрузите фотографию' }]}>
                            <Upload {...uploadProps} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Загрузить фото</Button>
                            </Upload>
                            {data.photo && <Avatar src={URL.createObjectURL(data.photo)} size={64} />}
                        </Form.Item>

                        <h2>Укажите ваш опыт работы</h2>
                        {data.organizations.map((organization, index) => (
                            <Space key={index} direction="vertical" style={{ display: 'flex', marginBottom: 5 }}>
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
                                    <Cascader
                                        options={cascaderData}
                                        onChange={(value) => handleNestedChange(index, 'position', value[1])}
                                        placeholder="Должность"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Период работы"
                                    rules={[{ required: true, message: 'Пожалуйста, укажите период работы' }]}
                                >
                                    <Space direction="horizontal">
                                        <DatePicker
                                            onChange={(date) => handlePeriodChange(index, date, null)}
                                            placeholder="Начало"
                                        />
                                        <DatePicker
                                            onChange={(date) => handlePeriodChange(index, null, date)}
                                            placeholder="Конец"
                                        />
                                        <div>{organization.period}</div>
                                    </Space>
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
                                        placeholder='Год окончания'
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
                            <Cascader
                                options={cascaderData}
                                onChange={(value) => setData('desired_field', value[1])}
                                placeholder="В какой сфере вы желаете работать"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Укажите ваши ключевые навыки"
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
                                    className="text-sm rounded py-1 mt-2 border border-gray-300"
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

