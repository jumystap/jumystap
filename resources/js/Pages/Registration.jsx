import React, { useState } from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { notification, Modal, Input } from 'antd';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FaRegCheckCircle } from "react-icons/fa";
import InputMask from 'react-input-mask';
import { handleCertificateAdd } from '@/Share/certificateHandler';

export default function Registration({ errors, professions }) {
    const { t, i18n } = useTranslation();
    const { props } = usePage();
    const backendErrors = props.errors;

    const [step, setStep] = useState(0);
    const [verificationCode, setVerificationCode] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [certificateModalVisible, setCertificateModalVisible] = useState(false);
    const [certificateNumber, setCertificateNumber] = useState('');
    const [source, setSource] = useState(localStorage.getItem('source'));
    const [phoneCode, setPhoneCode] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        phone: '',
        verificationCode: '',
        name: '',
        email: '',
        password: '',
        password_confirm: '',
        date_of_birth: '',
        gender: '',
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

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            setPhoneCode(true);
        } catch (error) {
            console.error('Error sending SMS:', error);
            setPhoneCode(true);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = () => {
        if (data.verificationCode == verificationCode) {
            setStep(3);
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
        if (data.role === 'employee' && !isValidCyrillicName(data.name)) {
            notification.error({
                message: 'Ошибка в имени',
                description: 'Имя и фамилия должны быть на кириллице и разделены пробелом.',
            });
            return;
        }
        if (!data.name || !data.email) {
            notification.error({
                message: 'Ошибка',
                description: 'Все поля обязательны для заполнения.',
            });
            return;
        }
        setStep(2);
    };

    const handlePhoneChange = (e) => {
        const formattedPhone = e.target.value.replace(/[^\d]/g, '');
        setData('phone', formattedPhone);
    };

    const handleCertificateAddLocal = () => {
        handleCertificateAdd(certificateNumber, data, certificates, setCertificates, setData, professions, setCertificateNumber);
    };

    const handleRegistrationSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('phone', data.phone);
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('gender', data.gender);
        formData.append('avatar', data.avatar);
        formData.append('source', source);
        if(certificates.length > 0){
            setData('is_graduate', 1);
            formData.append('is_graduate', 1);
        }else{
            formData.append('is_graduate', 0);
            setData('is_graduate', 0);
        }
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
                        {step === 0 && (
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
                        {step === 1 && (
                            <>
                                <div className="mb-10 font-semibold text-xl text-center">Введите основную информацию</div>
                                <div className='text-sm font-semibold'>
                                    {data.role === 'employee' ? 'Имя и Фамилия' : 'Название компании'}
                                </div>
                                <input
                                    type='text'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className='w-[350px] mt-1 block border-gray-300 rounded-lg'
                                    placeholder={data.role === 'employee' ? 'Введите ваше имя и фамилию' : 'Введите название компании'}
                                />
                                {errors.name && <p className='text-red-500 text-sm mt-2'>{errors.name}</p>}
                                <div className='mt-5 text-sm font-semibold'>Электронная почта</div>
                                <input
                                    type='email'
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className='w-[350px] mt-1 block border-gray-300 rounded-lg'
                                    placeholder='Введите вашу электронную почту'
                                />
                                {errors.email && <p className='text-red-500 text-sm mt-2'>{errors.email}</p>}
                                {data.role == 'employee' && (
                                    <div className='flex w-[350px] gap-x-5'>
                                        <div className='w-[50%]'>
                                            <div className='mt-5 text-sm font-semibold'>Дата рождения</div>
                                            <input
                                                type='date'
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className='w-full mt-1 border-gray-300 rounded-lg'
                                                placeholder='Выберите дату рождения'
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <div className='mt-5 text-sm font-semibold'>Пол</div>
                                            <select
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className='w-full mt-1 block border-gray-300 rounded-lg'
                                            >
                                                <option value='м'>Мужской</option>
                                                <option value='ж'>Женский</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                                <button
                                    className='py-2 font-bold w-full block text-white rounded-lg bg-blue-500 mt-5'
                                    onClick={handleBasicInfoSubmit}
                                >
                                    Далее
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <div className='w-[350px]'>
                                <div className="mb-10 font-semibold text-xl text-center">Потвердите номер телефона</div>
                                <InputMask
                                  mask="+7 999 999 99 99"
                                  value={data.phone}
                                  onChange={handlePhoneChange}
                                  maskChar={null}
                                >
                                  {(inputProps) => <Input {...inputProps} type="tel" className="block w-full mt-1 border-gray-300 rounded-lg" placeholder="Введите ваш телефон" />}
                                </InputMask>
                                {errors.phone && <p className='text-red-500 text-sm mt-2'>{errors.phone.message}</p>}
                                {phoneCode ? (
                                    <>
                                        <input
                                            type='number'
                                            value={data.verificationCode}
                                            onChange={(e) => setData('verificationCode', e.target.value)}
                                            className='block mt-3 border-gray-300 w-full rounded-lg'
                                            placeholder='Введите код потверждения'
                                        />
                                        <button
                                            className='py-2 font-bold w-full inline-block text-white rounded-lg bg-blue-500 mt-5'
                                            onClick={handleVerificationSubmit}
                                        >
                                            Подтвердить
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className='py-2 font-bold w-full inline-block text-white rounded-lg bg-blue-500 mt-5'
                                        onClick={handlePhoneSubmit}
                                    >
                                        {loading ? (
                                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />} />
                                        ) : (
                                            'Отправить код'
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                        {step === 3 && (
                            <div className='w-[350px]'>
                                <div className='mt-5 text-sm font-semibold'>Придумайте пароль</div>
                                <input
                                    type='password'
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className='block mt-1 border-gray-300 w-full rounded-lg'
                                    placeholder='Введите пароль'
                                />
                                <div className='mt-5 text-sm font-semibold'>Повторите пароль</div>
                                <input
                                    type='password'
                                    value={data.password_confirm}
                                    onChange={(e) => setData('password_confirm', e.target.value)}
                                    className='block mt-1 border-gray-300 w-full rounded-lg'
                                    placeholder='Повторите пароль'
                                />
                                {data.role === 'employee' ? (
                                    <>
                                        <div className='mt-5 text-sm font-semibold'>Если у вас есть сертификат JOLTAP</div>
                                        <button
                                            className='block mt-1 w-full border border-blue-500 rounded-lg text-blue-500 py-2'
                                            onClick={() => setCertificateModalVisible(true)}
                                        >
                                            Добавить сертификат
                                        </button>
                                        {certificates.length > 0 && (
                                            <>
                                                {certificates.map((certificate, index) => (
                                                    <div className='mt-3'>
                                                        {certificate.profession} : {certificate.number}
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className='mt-5 text-sm font-semibold'>Описание компании</div>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className='w-full h-[150px] mt-1 border-gray-300 rounded-lg capitalize'
                                            placeholder='Введите описание компании'
                                        />
                                    </>
                                )}
                                <button
                                    onClick={handleRegistrationSubmit}
                                    className='bg-blue-500 text-white rounded-lg mt-5 py-2 text-center w-full'
                                >
                                    Создать аккаунт
                                </button>
                            </div>
                        )}
                        <div className='flex mt-5'>
                            <div className='flex mx-auto gap-x-5 mt-5'>
                                {[...Array(4).keys()].map(i => (
                                    <div key={i} className={`${step === i ? 'px-10 bg-blue-500' : 'px-2 bg-gray-200'} inline-block rounded-full py-1`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='h-full bg-[#F9FAFC] rounded-lg col-span-2 p-5 relative'>
                    {['Тип пользователя', 'Основная информация', 'Контактные данные', 'Дополнительная информация'].map((label, i) => (
                        <div key={i} className='flex items-center gap-x-3 mt-7'>
                            <FaRegCheckCircle className={`text-2xl ${step === i ? 'text-blue-500' : 'text-gray-300'}`} />
                            <div>
                                <div className={`font-semibold ${step === i ? '' : 'text-gray-500'}`}>{label}</div>
                                <div className='text-sm text-gray-500'>Шаг {i + 1}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                title="Добавить сертификат"
                visible={certificateModalVisible}
                onOk={handleCertificateAddLocal}
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

