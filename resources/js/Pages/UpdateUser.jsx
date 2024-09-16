import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from "@/Layouts/GuestLayout";
import 'tailwindcss/tailwind.css';
import { useForm } from '@inertiajs/react';
import { Upload, Button, notification, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UpdateUser = ({ user }) => {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: user.name || '',
        email: user.email || '',
        date_of_birth: user.date_of_birth || '',
        phone: user.phone || '',
        ipStatus1: user.ip == 'Есть ИП' ? 'yes' : 'no',
        ipStatus2: user.status == 'В активном поиске' ? 'yes' : 'no',
        ipStatus3: user.work_status == 'Ищет работу' ? 'yes' : 'no',
        avatar: null,
        description: user.description || '',
        is_graduate: user.is_graduate,
    });

    const [avatarPreview, setAvatarPreview] = useState(user.image_url ? `/storage/${user.image_url}` : null);

    useEffect(() => {
        if (user.image_url) {
            setAvatarPreview(`/storage/${user.image_url}`);
        }
    }, [user.image_url]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'age' ? parseInt(value, 10) : value;
        setData(name, newValue);
    };

    const handleAvatarUpload = (file) => {
        setData('avatar', file);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target.result);
        reader.readAsDataURL(file);
        return false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.avatar) {
            clearErrors('avatar');
        }

        post('/update', {
            data,
            onSuccess: () => {
                notification.success({
                    message: 'Профиль обновлен',
                    description: 'Ваш профиль успешно обновлен.',
                });
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                notification.error({
                    message: 'Ошибка обновления профиля',
                    description: 'Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте снова.',
                });
            }
        });
    };

    return (
        <GuestLayout>
            <div className="grid grid-cols-1 md:grid-cols-7">
                <div className="bg-white col-span-5 rounded-lg p-6">
                    <div className="text-left mb-4">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-[150px] h-[150px] object-cover rounded-full border border-gray-300 mx-auto md:mx-0" />
                        ) : (
                            <div className="w-[150px] h-[150px] rounded-full border border-gray-300 flex items-center justify-center mx-auto md:mx-0">
                                <span className="text-gray-500">{t('no_avatar', { ns: 'register' })}</span>
                            </div>
                        )}
                        <Upload
                            id="avatar"
                            beforeUpload={handleAvatarUpload}
                            showUploadList={false}
                            className='mt-4 block mx-auto md:mx-0'
                        >
                            <Button icon={<UploadOutlined />}>{t('upload_button', { ns: 'register' })}</Button>
                        </Upload>
                        {errors.avatar && <div className="text-red-500 text-sm">{errors.avatar}</div>}
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="mb-2">
                            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="name">
                                {t('name_label', { ns: 'register' })}
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full border-gray-300 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="email">
                                {t('email_label', { ns: 'register' })}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                        </div>
                        {user.role.name === 'employee' && (
                            <>
                                <div className="mb-2">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="age">
                                        Дата рождения
                                    </label>
                                    <input
                                        id="date_of_birth"
                                        value={data.date_of_birth}
                                        name="date_of_birth"
                                        type="date"
                                        onChange={handleChange}
                                        className="w-full appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="ipStatus1">
                                        {t('ipStatus1', { ns: 'register' })}
                                    </label>
                                    <select
                                        id="ipStatus1"
                                        value={data.ipStatus1}
                                        onChange={e => setData('ipStatus1', e.target.value)}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="no">{t('option1', { ns: 'register' })}</option>
                                        <option value="yes">{t('option2', { ns: 'register' })}</option>
                                    </select>
                                    {errors.ipStatus1 && <div className="text-red-500 text-sm">{errors.ipStatus1}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="ipStatus2">
                                        {t('ipStatus2', { ns: 'register' })}
                                    </label>
                                    <select
                                        id="ipStatus2"
                                        value={data.ipStatus2}
                                        onChange={e => setData('ipStatus2', e.target.value)}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="no">{t('option3', { ns: 'register' })}</option>
                                        <option value="yes">{t('option4', { ns: 'register' })}</option>
                                    </select>
                                    {errors.ipStatus2 && <div className="text-red-500 text-sm">{errors.ipStatus2}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="ipStatus3">
                                        {t('ipStatus3', { ns: 'register' })}
                                    </label>
                                    <select
                                        id="ipStatus3"
                                        value={data.ipStatus3}
                                        onChange={e => setData('ipStatus3', e.target.value)}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="no">{t('option5', { ns: 'register' })}</option>
                                        <option value="yes">{t('option6', { ns: 'register' })}</option>
                                    </select>
                                    {errors.ipStatus3 && <div className="text-red-500 text-sm">{errors.ipStatus3}</div>}
                                </div>
                            </>
                        )}
                        {user.role.name !== 'employee' && (
                            <div className="mb-2 col-span-1 md:col-span-2">
                                <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="description">
                                    {t('description_label', { ns: 'register' })}
                                </label>
                                <textarea
                                    name='description'
                                    id='description'
                                    value={data.description}
                                    onChange={handleChange}
                                    className="w-full rounded appearance-none border border-gray-300 px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                            </div>
                        )}
                        <div className="flex items-center justify-between col-span-1 md:col-span-2">
                            <button
                                type="submit"
                                className="bg-blue-500 w-full hover:bg-blue-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                disabled={processing}
                            >
                                Cохранить
                            </button>
                        </div>
                    </form>
                </div>
                <div className='md:block hidden col-span-2 border-l border-gray-200 sticky top-0 h-screen'>
                </div>
            </div>
        </GuestLayout>
    );
};

export default UpdateUser;

