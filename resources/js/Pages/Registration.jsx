import React, { useState } from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import { Upload, Button, notification, Modal, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FaRegCheckCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

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
        role: '',
        description: '',
        is_graduate: 0,
        source: source,
    });
    const login = 'janamumkindik@gmail.com';
    const password = '%Jana2023Mumkindik05';
    const phones = data.phone;

    const handleRoleSubmit = (role) => {
        setData('role', role);
        setStep(1);
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
        formData.append('source', source);
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
            <div className='w-full h-screen grid grid-cols-7'>
                <div className='flex col-span-5'>
                    <div className='mx-auto my-auto'>
                        {step == 0 && (
                            <>
                                <div className="font-semibold text-xl text-center">{t('select_user_type_title', { ns: 'register' })}</div>
                                <div className="mb-4 mt-8">
                                    <div className="">
                                        <div className='text-sm font-light text-gray-500'>Зарегестрироваться как соискатель</div>
                                        <button
                                            onClick={() => handleRoleSubmit('employee')}
                                            className="w-full mt-3 border-gray-300 block text-gray-400 border-2 hover:bg-blue-500 transition-all duration-100 hover:text-white hover:border-blue-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                        >
                                            {t('job_seeker_option', { ns: 'register' })}
                                        </button>
                                        <div className='mt-10 text-sm font-light text-gray-500'>Зарегестрироваться как работодатель</div>
                                        <button
                                            onClick={() => handleRoleSubmit('employer')}
                                            className="w-full block border-gray-300 mt-3 text-gray-400 border-2 hover:bg-blue-500 transition-all duration-100 hover:text-white hover:border-blue-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                        >
                                            {t('employee_seeker_option', { ns: 'register' })}
                                        </button>
                                        <button
                                            onClick={() => handleRoleSubmit('company')}
                                            className="border-gray-300 w-full mt-4 block text-gray-400 border-2 hover:bg-blue-500 transition-all duration-200 hover:text-white hover:border-blue-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                        >
                                            {t('freelancer_option', { ns: 'register' })}
                                        </button>
                                        <a href='/terms' className='mt-10 block'>Продолжая вы принимаете <span className='text-blue-500'>Пользовательское соглашение</span></a>
                                    </div>
                                </div>
                            </>
                        )}
                        {step == 1 && (
                            <>
                                <div className="mb-10 font-semibold text-xl text-center">{t('select_user_type_title', { ns: 'register' })}</div>
                                <div className='text-sm font-semibold'>Имя и Фамилия</div>
                                <input
                                    type='text'
                                    className='w-[350px] mt-1 border-gray-300 rounded-lg'
                                    placeholder='Введите ваше имя и фамилию'
                                />
                                <div className='mt-5 text-sm font-semibold'>Электронная почта</div>
                                <input
                                    type='email'
                                    className='w-[350px] mt-1 border-gray-300 rounded-lg'
                                    placeholder='Введите вашу электронную почту'
                                />
                                <div className='flex w-[350px] gap-x-5'>
                                    <div className='w-[50%]'>
                                        <div className='mt-5 text-sm font-semibold'>Дата рождения</div>
                                        <input
                                            type='date'
                                            className='w-full mt-1 border-gray-300 rounded-lg'
                                            placeholder='Введите ваше имя и фамилию'
                                        />
                                    </div>
                                    <div className='w-[50%]'>
                                        <div className='mt-5 text-sm font-semibold'>Пол</div>
                                        <select
                                            className='w-full mt-1 block border-gray-300 rounded-lg'
                                        >
                                            <option className='w-full' value='м'>Мужской</option>
                                            <option className='w-full' value='ж'>Женский</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    className='py-2 font-bold w-full text-white rounded-lg bg-blue-500 mt-5'
                                    onClick={() => setStep(2)}
                                >
                                    Далее
                                </button>
                            </>
                        )}
                        {step == 2 && (
                            <div>
                            </div>
                        )}
                        <div className='flex mt-5'>
                            <div className='flex mx-auto gap-x-5 mt-5'>
                                <div onClick={() => setStep(0)} className={`${step == 0 ? ('px-10 bg-blue-500') : ('px-2 bg-gray-200')} cursor-pointer inline-block rounded-full py-1`}></div>
                                <div onClick={() => setStep(1)} className={`${step == 1 ? ('px-10 bg-blue-500') : ('px-2 bg-gray-200')} cursor-pointer inline-block rounded-full py-1`}></div>
                                <div onClick={() => setStep(2)} className={`${step == 2 ? ('px-10 bg-blue-500') : ('px-2 bg-gray-200')} cursor-pointer inline-block rounded-full py-1`}></div>
                                <div onClick={() => setStep(3)} className={`${step == 3 ? ('px-10 bg-blue-500') : ('px-2 bg-gray-200')} cursor-pointer inline-block rounded-full py-1`}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='h-full bg-[#F9FAFC] rounded-lg col-span-2 p-5 relative'>
                    <div className='flex items-center gap-x-3'>
                        <FaRegCheckCircle className={`text-2xl ${step == 0 ? ('text-blue-500') : ('text-gray-300')}`} />
                        <div>
                            <div className={`font-semibold ${step == 0 ? (''):('text-gray-500')}`}>Тип пользователя</div>
                            <div className='text-sm text-gray-500'>Выберите что вы ищете на данной платформе</div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-3 mt-7'>
                        <FaRegCheckCircle className={`text-2xl ${step == 1 ? ('text-blue-500') : ('text-gray-300')}`} />
                        <div>
                            <div className={`font-semibold ${step == 1 ? (''):('text-gray-500')}`}>Основная информация</div>
                            <div className='text-sm text-gray-500'>Выберите что вы ищете на данной платформе</div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-3 mt-7'>
                        <FaRegCheckCircle className={`text-2xl ${step == 2 ? ('text-blue-500') : ('text-gray-300')}`} />
                        <div>
                            <div className={`font-semibold ${step == 2 ? (''):('text-gray-500')}`}>Контактные данные</div>
                            <div className='text-sm text-gray-500'>Выберите что вы ищете на данной платформе</div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-3 mt-7'>
                        <FaRegCheckCircle className={`text-2xl ${step == 3 ? ('text-blue-500') : ('text-gray-300')}`} />
                        <div>
                            <div className={`font-semibold ${step == 3 ? (''):('text-gray-500')}`}>Дополнительная информация</div>
                            <div className='text-sm text-gray-500'>Выберите что вы ищете на данной платформе</div>
                        </div>
                    </div>
                    <div className='absolute bottom-5 pr-10'>
                        <div className='text-lg'>Сложности с регистрацией?</div>
                        <div className='text-sm font-light text-gray-500'>При возникновении трудностей вы можете обратиться по этим контактным данным</div>
                        <div className='mt-10 text-sm'>
                            <div>+7 707 221 31 31</div>
                            <div className='ml-auto'>janamumkindik@gmail.com</div>
                        </div>
                    </div>
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
