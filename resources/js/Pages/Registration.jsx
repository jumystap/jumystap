import React, { useState } from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import { Upload, Button, notification, Modal, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function Registration({ errors, professions }) {
    const { t, i18n } = useTranslation();
    const { props } = usePage();
    const backendErrors = props.errors;

    const [step, setStep] = useState(0);
    const [verificationCode, setVerificationCode] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [certificateModalVisible, setCertificateModalVisible] = useState(false);
    const [certificateNumber, setCertificateNumber] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isGraduate, setIsGraduate] = useState(false);
    const [source, setSource] = useState(localStorage.getItem('source'));

    const { data, setData, post, processing, reset } = useForm({
        phone: '',
        verificationCode: '',
        name: '',
        email: '',
        password: '',
        date_of_birth: null,
        professions_ids: [],
        certificate_numbers: [],
        avatar: null,
        ipStatus1: '',
        ipStatus2: '',
        ipStatus3: '',
        role: '',
        description: '',
        is_graduate: 0,
        source: source,
        age: 30,
    });
    const login = 'janamumkindik@gmail.com';
    const password = '%Jana2023Mumkindik05';
    const phones = data.phone;

    const handleRoleSubmit = (role) => {
        setData('role', role);
        if(role != 'employee'){
            setStep(2);
        }else{
            setStep(1);
        }
    };

    const handleGraduateSelection = (graduateStatus) => {
        setIsGraduate(graduateStatus);
        setData('is_graduate', graduateStatus);
        setStep(2);
    };

    console.log(data);

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        const newVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const message = `JOLTAP Ваш код: ${newVerificationCode}`;
        setVerificationCode(newVerificationCode);

        const payload = new URLSearchParams({
            login: login,
            psw: password,
            phones: phones,
            mes: message,
            sender_id: '839907'
        });

        try {
            const response = await fetch('https://smsc.kz/sys/send.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: payload
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setStep(3);
        } catch (error) {
            console.error('Error sending SMS:', error);
            setStep(3);
        }
    };

    const handleVerificationSubmit = (e) => {
        e.preventDefault();
        if (data.verificationCode == verificationCode) {
            setStep(4);
        } else {
            notification.error({
                message: 'Верификация не прошла',
                description: 'Введённый вами код подтверждения неверен. Пожалуйста, попробуйте снова.',
            });
        }
    };

    const isValidCyrillicName = (name) => {
        const cyrillicPattern = /^[А-ЯЁӘІҢҒҮҰҚӨҺ][а-яёәіңғүұқөһ]+\s[А-ЯЁӘІҢҒҮҰҚӨҺ][а-яёәіңғүұқөһ]+ *$/;
        return cyrillicPattern.test(name);
    };


    const handleBasicInfoSubmit = (e) => {
        e.preventDefault();
        if(data.role != 'employee'){
            const formData = new FormData();
            formData.append('phone', data.phone);
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('source', source);

            post('/register', {
                data: formData,
                onSuccess: () => reset(),
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }else{
            if (data.role === 'employee' && !isValidCyrillicName(data.name)) {
                notification.error({
                    message: 'Ошибка в имени',
                    description: 'Имя и фамилия должны быть на кириллице и разделены пробелом.',
                });
                return;
            }
            if (isGraduate) {
                setStep(5);
            } else {
                setStep(6);
            }
        }
    };

    const handleAvatarUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/heic';
        if (!isJpgOrPng) {
            notification.error({
                message: 'Неправильный формат файла',
                description: 'Вы можете загрузить только JPG/PNG/HEIC файлы.',
            });
            return false;
        }
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
            setCertificateModalVisible(false);
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
                            professions_ids: [...prevData.professions_ids, profession.id],
                            certificate_numbers: [...prevData.certificate_numbers, certificateNumber]
                        }));
                        notification.success({
                            message: 'Сертификат подтвержден',
                            description: `Сертификат №${certificateNumber} подтвержден и добавлен в ваш профиль.`,
                        });
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

                    console.log(formattedPhone);
                    console.log(userPhone);

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
                        var professionId = 5;
                        console.log(result.PROFESSION.NAME_RU);
                        if (result.PROFESSION.ID == '42469') {
                            professionId = 5;
                            console.log('22');
                        } else {
                            professionId = professionMap[result.PROFESSION.NAME_RU];
                            console.log('11');
                        }
                        console.log(professionId)
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
            setCertificateModalVisible(false);
        }
    };

    const handleIPStatusSubmit = (e) => {
        e.preventDefault();
        if (isGraduate) {
            setStep(7);
        } else {
            setStep(8);
        }
    };

    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('phone', data.phone);
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('avatar', data.avatar);
        formData.append('ipStatus1', data.ipStatus1);
        formData.append('ipStatus2', data.ipStatus2);
        formData.append('ipStatus3', data.ipStatus3);
        formData.append('source', source);
        formData.append('age', data.age);
        data.professions_ids.forEach((id, index) => {
            formData.append(`professions_ids[${index}]`, id);
        });
        data.certificate_numbers.forEach((number, index) => {
            formData.append(`certificate_numbers[${index}]`, number);
        });

        post('/register', {
            data: formData,
            onSuccess: () => reset(),
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    };

    React.useEffect(() => {
        if (Object.keys(backendErrors).length > 0) {
            Object.values(backendErrors).forEach((error) => {
                notification.error({
                    message: 'Ошибка регистрации',
                    description: error,
                });
            });
        }
    }, [backendErrors]);

    return (
        <GuestLayout>
            <div className="flex w-full h-[650px]">
                <div className="mx-auto my-auto w-[400px]">
                    {step === 0 && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('select_user_type_title', { ns: 'register' })}</div>
                            <div className="mb-4 mt-8">
                                <div className="">
                                    <div className='text-sm font-light text-gray-500'>Зарегестрироваться как соискатель</div>
                                    <button
                                        onClick={() => handleRoleSubmit('employee')}
                                        className="w-full mt-3 border-gray-300 block text-gray-500 border-2 hover:bg-orange-500 transition-all duration-100 hover:text-white hover:border-orange-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                    >
                                        {t('job_seeker_option', { ns: 'register' })}
                                    </button>
                                    <div className='mt-10 text-sm font-light text-gray-500'>Зарегестрироваться как работодатель</div>
                                    <button
                                        onClick={() => handleRoleSubmit('employer')}
                                        className="w-full block border-gray-300 mt-3 text-gray-500 border-2 hover:bg-orange-500 transition-all duration-100 hover:text-white hover:border-orange-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                    >
                                        {t('employee_seeker_option', { ns: 'register' })}
                                    </button>
                                    <button
                                        onClick={() => handleRoleSubmit('company')}
                                        className="border-gray-300 w-full mt-4 block text-gray-500 border-2 hover:bg-orange-500 transition-all duration-200 hover:text-white hover:border-orange-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                    >
                                        {t('freelancer_option', { ns: 'register' })}
                                    </button>
                                    <a href='/terms' className='mt-10 block'>Продолжая вы принимаете <span className='text-orange-500'>Пользовательское соглашение</span></a>
                                </div>
                            </div>
                        </>
                    )}
                    {step === 1 && data.role === 'employee' && (
                        <>
                            <div className="font-bold text-4xl text-center">Вы выпускник?</div>
                            <div className="mb-4 mt-8">
                                <div className="flex flex-col space-y-4">
                                    <button
                                        onClick={() => handleGraduateSelection(true)}
                                        className="border-gray-300 text-gray-500 border-2 hover:bg-orange-500 transition-all duration-100 hover:text-white hover:border-orange-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                    >
                                        Да
                                    </button>
                                    <button
                                        onClick={() => handleGraduateSelection(false)}
                                        className="border-gray-300 text-gray-500 border-2 hover:bg-orange-500 transition-all duration-100 hover:text-white hover:border-orange-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                    >
                                        Нет
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('register_title', { ns: 'register' })}</div>
                            <form onSubmit={handlePhoneSubmit}>
                                <div className="mb-4 mt-8">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="phone">
                                        {t('phone_label', { ns: 'register' })}
                                    </label>
                                    <PhoneInput
                                        country={'kz'}
                                        onlyCountries={['kz']}
                                        value={data.phone}
                                        onChange={phone => setData('phone', phone)}
                                        inputStyle={{
                                            width: '100%',
                                            padding: '20px',
                                            paddingLeft: '50px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={processing}
                                    >
                                        {t('send_code_button', { ns: 'register' })}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('verify_code_title', { ns: 'register' })}</div>
                            <form onSubmit={handleVerificationSubmit}>
                                <div className="mb-4 mt-8">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="verificationCode">
                                        {t('verification_code_label', { ns: 'register' })}
                                    </label>
                                    <input
                                        type="text"
                                        id="verificationCode"
                                        value={data.verificationCode}
                                        onChange={e => setData('verificationCode', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={processing}
                                    >
                                        {t('verify_button', { ns: 'register' })}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('basic_info_title', { ns: 'register' })}</div>
                            <form onSubmit={handleBasicInfoSubmit}>
                                <div className="mb-2 mt-8">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="name">
                                        {data.role == 'employee' ? (t('name_label', { ns: 'register' })) : (t('company_name_label', { ns: 'register' }))}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="email">
                                        {t('email_label', { ns: 'register' })}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                {data.role === 'employee' ? (
                                    <>
                                        <div className="mb-2">
                                            <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="date_of_birth">
                                                {t('date_of_birth_label', { ns: 'register' })}
                                            </label>
                                            <input
                                                id="age"
                                                type='number'
                                                name='age'
                                                onChange={e => setData('age', e.target.value)}
                                                value={data.age}
                                                className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label className="block text-gray-500 text-sm font-bold mb-2"
                                            htmlFor="description">
                                            {t('description_label', { ns: 'register' })}
                                        </label>
                                        <textarea
                                            name='description'
                                            id='description'
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className='w-full rounded'
                                        />
                                    </>
                                )}
                                <div className="mb-2">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
                                        {t('password_label', { ns: 'register' })}
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={processing}
                                    >
                                        {t('next_button', { ns: 'register' })}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {step === 5 && isGraduate && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('upload_avatar_title', { ns: 'register' })}</div>
                            <form onSubmit={(e) => { e.preventDefault(); setStep(6); }}>
                                <div className='mt-5'>
                                    {certificates.map((certificate, index) => (
                                        <div key={index} className="mb-2 text-center">
                                            {certificate.profession}: {certificate.number}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="border border-gray-300 w-full hover:bg-gray-300 transition-all duration-100 text-gray-500 py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                                        onClick={() => setCertificateModalVisible(true)}
                                    >
                                        Добавить сертификат
                                    </button>
                                </div>
                                <div className="flex mt-3 items-center justify-between">
                                    <button
                                        type="submit"
                                        className={`w-full transition-all duration-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${certificates.length === 0 || processing ? 'bg-gray-300 font-regular cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'
                                            }`}
                                        disabled={certificates.length === 0 || processing}
                                    >
                                        Далее
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {step === 6 && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('additional_info_title', { ns: 'register' })}</div>
                            <form onSubmit={handleIPStatusSubmit}>
                                <div className="mb-4 mt-4">
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
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={processing}
                                    >
                                        Далее
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {step === 7 && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('upload_avatar_title', { ns: 'register' })}</div>
                            <form onSubmit={handleRegistrationSubmit}>
                                <div className="mb-2 mt-8 w-full">
                                    <label className="block text-gray-500 text-sm font-bold mb-2 w-full" htmlFor="avatar">
                                        {t('avatar_label', { ns: 'register' })}
                                    </label>
                                    <Upload
                                        id="avatar"
                                        beforeUpload={handleAvatarUpload}
                                        showUploadList={false}
                                        className='w-full block'
                                    >
                                        <Button icon={<UploadOutlined />} className='w-[400px] block' >{t('upload_button', { ns: 'register' })}</Button>
                                    </Upload>
                                    {avatarPreview && (
                                        <div className="mt-4 text-center">
                                            <img src={avatarPreview} alt="Avatar Preview" className="mx-auto w-[150px] h-[150px] object-cover rounded-full border border-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={!data.avatar || processing}
                                    >
                                        {t('register_button', { ns: 'register' })}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {step === 8 && !isGraduate && (
                        <>
                            <div className="font-bold text-4xl text-center">{t('upload_avatar_title', { ns: 'register' })}</div>
                            <form onSubmit={handleRegistrationSubmit}>
                                <div className="mb-2 mt-8 w-full">
                                    <label className="block text-gray-500 text-sm font-bold mb-2 w-full" htmlFor="avatar">
                                        {t('avatar_label', { ns: 'register' })}
                                    </label>
                                    <Upload
                                        id="avatar"
                                        beforeUpload={handleAvatarUpload}
                                        showUploadList={false}
                                        className='w-full block'
                                    >
                                        <Button icon={<UploadOutlined />} className='w-[400px] block' >{t('upload_button', { ns: 'register' })}</Button>
                                    </Upload>
                                    {avatarPreview && (
                                        <div className="mt-4 text-center">
                                            <img src={avatarPreview} alt="Avatar Preview" className="mx-auto w-[150px] h-[150px] object-cover rounded-full border border-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 w-full hover:bg-orange-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={!data.avatar || processing}
                                    >
                                        {t('register_button', { ns: 'register' })}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <Modal
                title="Добавить сертификат"
                visible={certificateModalVisible}
                onOk={handleCertificateAdd}
                onCancel={() => setCertificateModalVisible(false)}
                okText="Добавить"
                cancelText="Отмена"
            >
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
                </div>
            </Modal>
        </GuestLayout>
    );
}
