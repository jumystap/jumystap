import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from "@/Layouts/GuestLayout";
import 'tailwindcss/tailwind.css';
import { useForm } from '@inertiajs/react';
import { Upload, Button, notification, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UpdateUser = ({ user, professions, userProfessions }) => {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: user.name || '',
        email: user.email || '',
        age: user.age || 30,
        phone: user.phone || '',
        ipStatus1: user.ip == 'Есть ИП' ? 'yes' : 'no',
        ipStatus2: user.status == 'В активном поиске' ? 'yes' : 'no',
        ipStatus3: user.work_status == 'Ищет работу' ? 'yes' : 'no',
        avatar: null,
        professions_ids: userProfessions.map(up => up.profession_id) || [],
        certificate_numbers: userProfessions.map(up => up.certificate_number) || [],
        description: user.description || '',
        is_graduate: user.is_graduate,
    });


    const [certificateNumber, setCertificateNumber] = useState('');
    const [certificates, setCertificates] = useState(userProfessions || []);
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

    const handleCertificateAdd = async () => {
        if (certificates.some(certificate => certificate.number === certificateNumber)) {
            notification.error({
                message: 'Сертификат уже добавлен',
                description: `Сертификат №${certificateNumber} уже добавлен.`,
            });
            return;
        }

        try {
            let response = await fetch(`/api/certificates/${certificateNumber}`);
            let result;

            if (response.ok) {
                result = await response.json();
            } else {
                result = null;
            }

            if (result) {
                const formattedPhone = result.phone.replace(/[\s+()-]/g, '');
                const userPhone = data.phone.replace(/[\s+()-]/g, '');

                if (formattedPhone === userPhone) {
                    const profession = professions.find(prof => prof.id === result.profession_id);

                    if (profession) {
                        setCertificates([...certificates, { number: certificateNumber, profession: profession.name_ru }]);
                        setData(prevData => ({
                            ...prevData,
                            is_graduate: true,
                            professions_ids: [...prevData.professions_ids, profession.id],
                            certificate_numbers: [...prevData.certificate_numbers, certificateNumber]
                        }));
                        notification.success({
                            message: 'Сертификат подтвержден',
                            description: `Сертификат №${certificateNumber} подтвержден и добавлен в ваш профиль.`,
                        });
                        return;
                    } else {
                        notification.error({
                            message: 'Профессия не найдена',
                            description: `Профессия для сертификата №${certificateNumber} не найдена.`,
                        });
                    }
                } else {
                    notification.error({
                        message: 'Сертификат не найден',
                        description: `Сертификат №${certificateNumber} не найден или не соответствует вашему номеру телефона.`,
                    });
                }
            }

            if (!result) {
                let url = `https://crm.joltap.kz/rest/1/gsjlekv9xqpwgw3q/working_certificates.certificates.list?number=${certificateNumber}`;
                console.log('API URL:', url);

                response = await fetch(url);
                let data2 = await response.json();
                result = data2.result[0];

                if (!result) {
                    url = `https://crm.joltap.kz/rest/1/gsjlekv9xqpwgw3q/digital_certificates.certificates.list?number=${certificateNumber}`;
                    console.log('API URL:', url);

                    response = await fetch(url);
                    data2 = await response.json();
                    result = data2.result[0];
                }

                if (result) {
                    const formattedPhone = result.PHONE.replace(/[\s+()-]/g, '');
                    const userPhone = data.phone.replace(/[\s+()-]/g, '');

                    if (formattedPhone === userPhone) {
                        const professionMap = {
                            "Основы изготовления корпусной мебели": 5,
                            "Ремонт обуви и изготовление ключей": 6,
                            "Основы бухгалтерского учета": 8,
                            "Модельер-конструктор": 2,
                            "Швея": 1,
                            "Электрогазосварщик": 7,
                            "Бариста": 3,
                            "Продавец-кассир": 4,
                            "Базовые цифровые навыки": 16,
                            "Веб-дизайн + Создание и разработка сайта": 14,
                            "Графический дизайнер": 12,
                            "Мобилограф": 10,
                            "Маркетплейс": 15,
                            "Видеомонтаж": 13,
                            "Таргетолог": 11,
                            "SMM": 9,
                        };
                        const professionId = professionMap[result.PROFESSION.NAME_RU];
                        if (professionId) {
                            setCertificates([...certificates, { number: certificateNumber, profession: result.PROFESSION.NAME_RU }]);
                            setData(prevData => ({
                                ...prevData,
                                is_graduate: true,
                                professions_ids: [...prevData.professions_ids, professionId],
                                certificate_numbers: [...prevData.certificate_numbers, certificateNumber]
                            }));
                            notification.success({
                                message: 'Сертификат подтвержден',
                                description: `Сертификат №${certificateNumber} подтвержден и добавлен в ваш профиль.`,
                            });
                        } else {
                            notification.error({
                                message: 'Сертификат не найден',
                                description: `Сертификат №${certificateNumber} не найден или не соответствует вашему номеру телефона.`,
                            });
                        }
                    } else {
                        notification.error({
                            message: 'Сертификат не найден',
                            description: `Сертификат №${certificateNumber} не найден или не соответствует вашему номеру телефона.`,
                        });
                    }
                } else {
                    notification.error({
                        message: 'Сертификат не найден',
                        description: `Сертификат №${certificateNumber} не найден.`,
                    });
                }
            }
        } catch (error) {
            console.error('Error validating certificate:', error);
            notification.error({
                message: 'Ошибка проверки сертификата',
                description: 'Произошла ошибка при проверке сертификата. Пожалуйста, попробуйте снова.',
            });
        } finally {
            setCertificateNumber('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.avatar) {
            clearErrors('avatar'); // Clear any existing avatar errors
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
            <div className="container mx-auto p-4">
                <div className="bg-white rounded-lg p-6 max-w-full mx-auto">
                    <div className="font-bold text-4xl text-left mb-4">{t('basic_info_title', { ns: 'register' })}</div>
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
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                        </div>
                        {user.role.name === 'employee' && (
                            <>
                                <div className="mb-2">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="age">
                                        {t('age_label', { ns: 'register' })}
                                    </label>
                                    <input
                                        id="age"
                                        value={data.age}
                                        name="age"
                                        type="number"
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
                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="certificateNumber">
                                        Укажите номер сертификата
                                    </label>
                                    <Input
                                        id="certificateNumber"
                                        value={certificateNumber}
                                        onChange={e => setCertificateNumber(e.target.value)}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    <Button onClick={handleCertificateAdd} className="hover:bg-gray-600 transition-all text-gray-500 w-full duration-100 py-3 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
                                        Добавить сертификат
                                    </Button>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    {certificates.map((certificate, index) => (
                                        <div key={index} className="mb-2 text-center border-b border-gray-300 pb-2">
                                            <span className="font-semibold">{certificate.profession_name}:</span> {certificate.certificate_number}
                                        </div>
                                    ))}
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
                                    className="w-full rounded appearance-none border px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                            </div>
                        )}
                        <div className="flex items-center justify-between col-span-1 md:col-span-2">
                            <button
                                type="submit"
                                className="bg-orange-500 w-full hover:bg-orange-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={processing}
                            >
                                Cохранить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
};

export default UpdateUser;

