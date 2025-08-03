import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Checkbox, Input, Select, DatePicker, Tag, Button, Upload, Space } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import GuestLayout from '@/Layouts/GuestLayout';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

const kazakhstanCities = [
    'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз',
    'Павлодар', 'Усть-Каменогорск', 'Семей', 'Костанай', 'Петропавловск',
    'Кызылорда', 'Атырау', 'Актау', 'Уральск', 'Темиртау', 'Талдыкорган',
    'Экибастуз', 'Рудный', 'Жезказган',
];

const CreateUpdateResume = ({ drivingLicenses, employmentTypes, workSchedules }) => {
    const { t } = useTranslation('createResume');
    const [showOtherCityInput, setShowOtherCityInput] = useState(false);
    const [editMode, setEditMode] = useState([true]);

    const { data, setData, post } = useForm({
        title: '',
        photo_path: null,
        email: '',
        phone: '',
        city: '',
        district: '',
        profession: '',
        salary: '',
        employment_type: '',
        work_schedule: '',
        organizations: [{
            organization: '',
            position: '',
            responsibility: '',
            period: '',
            isCurrent: false,
            start_date: '',
            end_date: ''
        }],
        noWorkExperience: false,
        education: '',
        faculty: '',
        educational_institution: '',
        graduation_year: null,
        languages: [],
        skills: [],
        newSkill: '',
        ip_status: '',
        driving_license: '',
        about: '',
    });

    const handleCityChange = (value) => {
        setData('city', value);
        setShowOtherCityInput(value === 'Другое');
    };

    const handleNoWorkExperienceChange = (e) => {
        const checked = e.target.checked;
        setData((prevData) => ({
            ...prevData,
            noWorkExperience: checked,
            organizations: checked ? [] : [{
                organization: '',
                position: '',
                responsibility: '',
                period: '',
                isCurrent: false,
                start_date: '',
                end_date: ''
            }],
        }));
        setEditMode(checked ? [] : [true]);
    };

    const addOrganization = () => {
        if (!data.noWorkExperience) {
            setData('organizations', [
                ...data.organizations,
                {
                    organization: '',
                    position: '',
                    responsibility: '',
                    period: '',
                    isCurrent: false,
                    start_date: '',
                    end_date: ''
                },
            ]);
            setEditMode([...editMode, true]);
        }
    };

    const updatePeriod = (index) => {
        const updatedOrganizations = [...data.organizations];
        const { start_date, end_date, isCurrent } = updatedOrganizations[index];

        let period = '';
        if (start_date) {
            try {
                period = `${format(new Date(start_date), 'd MMM yyyy', { locale: ru })} - `;
                period += isCurrent ? t('until_present') : (end_date ? format(new Date(end_date), 'd MMM yyyy', { locale: ru }) : '');
            } catch (error) {
                console.error('Invalid date format:', error);
            }
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
            updatedOrganizations[index].end_date = '';
        }
        updatePeriod(index);
        setData('organizations', updatedOrganizations);
    };

    const removeOrganization = (index) => {
        const updatedOrganizations = data.organizations.filter((_, i) => i !== index);
        setData('organizations', updatedOrganizations);
        setEditMode(editMode.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        post('/resumes/create');
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
        setEditMode((prevEditMode) => {
            const newEditMode = [...prevEditMode];
            newEditMode[index] = !newEditMode[index];
            return newEditMode;
        });
    };

    const uploadProps = {
        beforeUpload: (file) => {
            setData('photo_path', file);
            return false;
        },
    };

    const addSkill = () => {
        if (data.newSkill.trim() && !data.skills.includes(data.newSkill.trim())) {
            setData((prevData) => ({
                ...prevData,
                skills: [...prevData.skills, prevData.newSkill.trim()],
                newSkill: '',
            }));
        } else if (data.newSkill.trim()) {
            alert(t('skill_already_added'));
        }
    };

    const removeSkill = (removedSkill, e) => {
        e.preventDefault();
        setData('skills', data.skills.filter((skill) => skill !== removedSkill));
    };

    return (
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="col-span-5 p-5">
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <div className="font-semibold text-2xl mb-4">{t('create_resume')}</div>
                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_1')}</div>
                        <Form.Item
                            name="title"
                            label={t('title')}
                            rules={[{ required: true, message: t('please_enter_title') }]}
                        >
                            <Input
                                value={data.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>

                        <div className="flex gap-x-5">
                            {data.photo_path && (
                                <img src={URL.createObjectURL(data.photo_path)} className="w-[200px] h-[250px] object-cover" />
                            )}
                            <Form.Item
                                label={t('upload_your_photo')}
                                name="photo"
                                rules={[{ required: true, message: t('please_upload_photo') }]}
                            >
                                <Upload {...uploadProps} showUploadList={false}>
                                    <Button icon={<UploadOutlined />}>{t('upload_photo')}</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="email"
                            label={t('email')}
                            rules={[{ required: true, message: t('please_enter_email') }]}
                        >
                            <Input
                                value={data.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label={t('phone')}
                            rules={[{ required: true, message: t('please_enter_phone') }]}
                        >
                            <Input
                                value={data.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('city')}
                            name="city"
                            className="mt-4"
                            rules={[{ required: true, message: t('select_a_city') }]}
                        >
                            <Select value={data.city} onChange={handleCityChange}>
                                {kazakhstanCities.map((city) => (
                                    <Option key={city} value={city}>
                                        {city}
                                    </Option>
                                ))}
                                <Option value="Дистанционное">{t('remote')}</Option>
                                <Option value="Другое">{t('other')}</Option>
                            </Select>
                        </Form.Item>
                        {showOtherCityInput && (
                            <Form.Item
                                label={t('enter_other_city')}
                                name="city"
                                rules={[{ required: true, message: t('please_enter_city') }]}
                            >
                                <Input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="text-sm rounded py-1 border border-gray-300"
                                />
                            </Form.Item>
                        )}
                        {data.city === 'Астана' && (
                            <Form.Item
                                label={t('specify_residence_area')}
                                name="district"
                                rules={[{ required: true, message: t('please_specify_residence_area') }]}
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

                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_2')}</div>
                        <Form.Item
                            name="profession"
                            label={t('profession')}
                            rules={[{ required: true, message: t('please_enter_profession') }]}
                        >
                            <Input
                                value={data.profession}
                                onChange={(e) => handleInputChange('profession', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            name="salary"
                            label={t('salary')}
                            rules={[{ required: true, message: t('please_enter_salary') }]}
                        >
                            <Input
                                value={data.salary}
                                onChange={(e) => handleInputChange('salary', e.target.value)}
                                className="text-sm rounded py-1 border border-gray-300"
                            />
                        </Form.Item>
                        <Form.Item
                            label={t('work_schedule')}
                            name="work_schedule"
                            className="mt-4"
                            rules={[{ required: true, message: t('select_a_work_schedule') }]}
                        >
                            <Select value={data.work_schedule} onChange={(value) => handleInputChange('work_schedule', value)}>
                                {Object.entries(workSchedules).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('employment_type')}
                            name="employment_type"
                            className="mt-4"
                            rules={[{ required: true, message: t('select_a_employment_type') }]}
                        >
                            <Select value={data.employment_type} onChange={(value) => handleInputChange('employment_type', value)}>
                                {Object.entries(employmentTypes).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_3')}</div>
                        <Form.Item name="noWorkExperience" valuePropName="checked">
                            <Checkbox
                                checked={data.noWorkExperience}
                                onChange={handleNoWorkExperienceChange}
                            >
                                {t('no_work_experience')}
                            </Checkbox>
                        </Form.Item>

                        {!data.noWorkExperience && (
                            <>
                                {data.organizations.map((organization, index) => (
                                    <Space key={index} direction="vertical" style={{ display: 'flex', marginBottom: 5 }}>
                                        {editMode[index] ? (
                                            <>
                                                <Form.Item
                                                    label={t('organization_name')}
                                                    name={`organization_${index}_name`}
                                                    rules={[{ required: true, message: t('please_specify_organization_name') }]}
                                                >
                                                    <Input
                                                        value={organization.organization}
                                                        onChange={(e) => handleNestedChange(index, 'organization', e.target.value)}
                                                        className="text-sm rounded py-1 border border-gray-300"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={t('position')}
                                                    name={`organization_${index}_position`}
                                                    rules={[{ required: true, message: t('please_specify_position') }]}
                                                >
                                                    <Input
                                                        value={organization.position}
                                                        onChange={(e) => handleNestedChange(index, 'position', e.target.value)}
                                                        className="text-sm rounded py-1 border border-gray-300"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={t('responsibilities')}
                                                    name={`organization_${index}_responsibility`}
                                                >
                                                    <TextArea
                                                        value={organization.responsibility}
                                                        onChange={(e) => handleNestedChange(index, 'responsibility', e.target.value)}
                                                        rows={2}
                                                        className="text-sm rounded py-1 border border-gray-300"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={t('work_period')}
                                                    rules={[{ required: true, message: t('please_specify_start_date') }]}
                                                >
                                                    <div className="flex gap-x-5">
                                                        <div>
                                                            <input
                                                                type="date"
                                                                value={organization.start_date}
                                                                onChange={(e) => handleDateChange(index, 'start_date', e.target.value)}
                                                                className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            {!organization.isCurrent && (
                                                                <input
                                                                    type="date"
                                                                    value={organization.end_date}
                                                                    onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
                                                                    className="px-2 py-1 text-sm rounded-lg border border-gray-200 bg-white"
                                                                />
                                                            )}
                                                            <Checkbox
                                                                checked={organization.isCurrent}
                                                                className="flex"
                                                                onChange={() => handleCheckboxChange(index)}
                                                            >
                                                                {t('until_present')}
                                                            </Checkbox>
                                                        </div>
                                                    </div>
                                                </Form.Item>
                                                <div className="flex items-center gap-x-2">
                                                    <Button type="primary" onClick={() => toggleEditMode(index)}>
                                                        {t('save')}
                                                    </Button>
                                                    <Button danger onClick={() => removeOrganization(index)}>
                                                        {t('delete_workplace')}
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="border border-gray-200 py-4 mt-2 px-5 rounded-lg">
                                                <p>
                                                    <strong>{t('organization')}:</strong> {organization.organization}
                                                </p>
                                                <p>
                                                    <strong>{t('position')}:</strong> {organization.position}
                                                </p>
                                                <p>
                                                    <strong>{t('responsibilities')}:</strong> {organization.responsibility || t('none_specified')}
                                                </p>
                                                <p>
                                                    <strong>{t('work_period')}:</strong> {organization.period}
                                                </p>
                                                <div className="flex mt-4 items-center gap-x-2">
                                                    <Button type="dashed" onClick={() => toggleEditMode(index)}>
                                                        {t('edit')}
                                                    </Button>
                                                    <Button danger onClick={() => removeOrganization(index)}>
                                                        {t('delete_workplace')}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Space>
                                ))}
                                <Button type="dashed" className="mt-3" onClick={addOrganization} icon={<PlusOutlined />}>
                                    {t('add_more_workplaces')}
                                </Button>
                            </>
                        )}

                        <hr />

                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_4')}</div>
                        <Form.Item
                            label={t('specify_education')}
                            name="education"
                            rules={[{ required: true, message: t('please_specify_education') }]}
                        >
                            <Select value={data.education} onChange={(value) => handleInputChange('education', value)}>
                                <Option value="Среднее">{t('secondary')}</Option>
                                <Option value="Среднее специальное">{t('secondary_special')}</Option>
                                <Option value="Неоконченное высшее">{t('incomplete_higher')}</Option>
                                <Option value="Высшее">{t('higher')}</Option>
                            </Select>
                        </Form.Item>

                        {data.education !== 'Среднее' && (
                            <>
                                <Form.Item
                                    name="educational_institution"
                                    label={t('educational_institution')}
                                    rules={[{ required: true, message: t('please_enter_educational_institution') }]}
                                >
                                    <Input
                                        value={data.educational_institution}
                                        onChange={(e) => handleInputChange('educational_institution', e.target.value)}
                                        className="text-sm rounded py-1 border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="faculty"
                                    label={t('faculty_and_specialization')}
                                    rules={[{ required: true, message: t('please_faculty_and_specialization') }]}
                                >
                                    <Input
                                        value={data.faculty}
                                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                                        className="text-sm rounded py-1 border border-gray-300"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="year"
                                    label={t('graduation_year')}
                                    rules={[{ required: true, message: t('please_specify_graduation_year') }]}
                                >
                                    <DatePicker
                                        picker="year"
                                        placeholder={t('graduation_year')}
                                        value={data.graduation_year ? moment(data.graduation_year) : null}
                                        onChange={(date) => handleInputChange('graduation_year', date ? date.format('YYYY') : null)}
                                    />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            label={t('specify_languages')}
                            name="languages"
                            rules={[{ required: true, message: t('please_specify_languages') }]}
                        >
                            <Select
                                mode="multiple"
                                value={data.languages}
                                onChange={(value) => handleInputChange('languages', value)}
                            >
                                <Option value="Казахский">{t('kazakh')}</Option>
                                <Option value="Русский">{t('russian')}</Option>
                                <Option value="Английский">{t('english')}</Option>
                                <Option value="Немецкий">{t('german')}</Option>
                                <Option value="Французский">{t('french')}</Option>
                                <Option value="Китайский">{t('chinese')}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={t('skills')} name="skills">
                            <div className="flex items-center gap-x-2">
                                <Input
                                    value={data.newSkill}
                                    onChange={(e) => setData('newSkill', e.target.value)}
                                    className="text-sm rounded py-1 border border-gray-300"
                                    placeholder={t('enter_skill_and_press_button')}
                                />
                                <Button onClick={addSkill}>{t('add_skill')}</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.skills.map((skill) => (
                                    <Tag
                                        key={skill}
                                        closable
                                        onClose={(e) => removeSkill(skill, e)}
                                        className="rounded-full bg-gray-100 text-gray-500"
                                    >
                                        {skill}
                                    </Tag>
                                ))}
                            </div>
                        </Form.Item>
                        <div className="font-semibold text-xl mb-4 mt-2">{t('block_5')}</div>
                        <Form.Item
                            label={t('specify_ip_status')}
                            name="ip_status"
                            rules={[{ required: true, message: t('please_specify_ip_status') }]}
                        >
                            <Select value={data.ip_status} onChange={(value) => handleInputChange('ip_status', value)}>
                                <Option value="Присутствует">{t('present')}</Option>
                                <Option value="Отсутствует">{t('absent')}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('has_car')}
                            name="has_car"
                            rules={[{ required: true, message: t('please_select_has_car') }]}
                        >
                            <Select value={data.has_car} onChange={(value) => handleInputChange('has_car', value)}>
                                <Option value="0">{t('no')}</Option>
                                <Option value="1">{t('yes')}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={t('driving_license')}
                            name="driving_license"
                            className="mt-4"
                            rules={[{ required: true, message: t('select_a_driving_license') }]}
                        >
                            <Select value={data.driving_license} onChange={(value) => handleInputChange('driving_license', value)}>
                                {Object.entries(drivingLicenses).map(([value, label]) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label={t('about')}>
                            <TextArea
                                name="about"
                                value={data.about}
                                onChange={(e) => handleInputChange('about', e.target.value)}
                                rows={4}
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            {t('create_resume')}
                        </Button>
                    </Form>
                </div>
                <div className="md:h-full sticky top-0 bg-[#F9FAFC] rounded-lg w-full hidden md:block md:col-span-2 p-5 md:relative">
                    <div>
                        <div className="text-lg">{t('troubles_with_creation')}</div>
                        <div className="text-sm font-light text-gray-500">{t('contact_for_help')}</div>
                        <div className="mt-10 text-sm">
                            <div>+7 707 221 31 31</div>
                            <div className="ml-auto">janamumkindik@gmail.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default CreateUpdateResume;
