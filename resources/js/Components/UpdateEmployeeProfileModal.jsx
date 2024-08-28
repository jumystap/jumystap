import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';
import DatePicker from 'antd/es/date-picker'; // Ensure correct import for DatePicker
import Select from 'antd/es/select'; // Ensure correct import for Select
import { useForm } from '@inertiajs/react';
import { Upload, Button, notification, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const UpdateEmployeeProfileModal = ({ isOpen, onRequestClose, user, professions }) => {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        profession_id: user.profession ? user.profession.id : '',
        date_of_birth: user.date_of_birth || '',
        phone: user.phone || '',
        ipStatus1: user.ipStatus1 || '',
        ipStatus2: user.ipStatus2 || '',
        ipStatus3: user.ipStatus3 || '',
        avatar: user.avatar || '', // Add avatar field
        professions_ids: user.professions_ids || [],
        certificate_numbers: user.certificate_numbers || [],
        description: '',
    });

    const [certificateNumber, setCertificateNumber] = useState('');
    const [certificates, setCertificates] = useState(user.certificates || []);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleDateChange = (date, dateString) => {
        setData('date_of_birth', dateString);
    };

    const handleProfessionChange = (value) => {
        setData('profession_id', value);
    };

    const handleAvatarUpload = (file) => {
        setData('avatar', file);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target.result);
        reader.readAsDataURL(file);
        return false;
    };

    const handleCertificateAdd = async () => {
        try {
            let url = `https://crm.joltap.kz/rest/1/gsjlekv9xqpwgw3q/working_certificates.certificates.list?number=${certificateNumber}`;
            console.log('API URL:', url);

            let response = await fetch(url);
            let data2 = await response.json();
            let result = data2.result[0];

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
                            professions_ids: [...prevData.professions_ids, professionId],
                            certificate_numbers: [...prevData.certificate_numbers, certificateNumber]
                        }));
                        notification.success({
                            message: 'Сертификат подтвержден',
                            description: `Сертификат №${certificateNumber} подтвержден и добавлен в ваш профиль.`,
                        });
                        console.log(professionId)
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

    console.log(data);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/update', {
            onSuccess: () => {
                onRequestClose();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            ariaHideApp={false}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="font-bold text-4xl text-center">{t('basic_info_title', { ns: 'register' })}</div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-2 mt-8">
                        <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="name">
                            {t('name_label', { ns: 'register' })}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    </div>
                    <div className="mb-4 mt-8">
                        <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="avatar">
                            {t('avatar_label', { ns: 'register' })}
                        </label>
                        <Upload
                            id="avatar"
                            beforeUpload={handleAvatarUpload}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>{t('upload_button', { ns: 'register' })}</Button>
                        </Upload>
                        {avatarPreview && (
                            <div className="mt-4 text-center">
                                <img src={avatarPreview} alt="Avatar Preview" className="mx-auto w-[150px] h-[150px] object-cover rounded-full border border-gray-300" />
                            </div>
                        )}
                        {errors.avatar && <div className="text-red-500 text-sm">{errors.avatar}</div>}
                    </div>
                    <div className="mb-4 mt-8">
                        <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="ipStatus1">
                            {t('ipStatus1', { ns: 'register' })}
                        </label>
                        <select
                            id="ipStatus1"
                            value={data.ipStatus1}
                            onChange={e => setData('ipStatus1', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <Button onClick={handleCertificateAdd} className="hover:bg-gray-600 transition-all text-gray-500 w-full duration-100 py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                            Добавить сертификат
                        </Button>
                    </div>
                    <div>
                        {certificates.map((certificate, index) => (
                            <div key={index} className="mb-2 text-center">
                                {certificate.profession}: {certificate.number}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
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
        </Modal>
    );
};

export default UpdateEmployeeProfileModal;

