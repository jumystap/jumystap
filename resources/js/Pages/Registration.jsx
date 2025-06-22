import React, { useState } from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { notification, Modal, Input } from 'antd';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FaRegCheckCircle } from "react-icons/fa";
import InputMask from 'react-input-mask';

export default function Registration({ errors, professions }) {
    const { t, i18n } = useTranslation('register');
    const { props } = usePage();
    const backendErrors = props.errors;

    const [step, setStep] = useState(0);
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
        avatar: null,
        role: '',
        description: ' ',
        source: source,
    });
    const phones = data.phone;

    const handleRoleSubmit = (role) => {
        setData('role', role);
        setStep(1);
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = new URLSearchParams({
            channel: 1,
            receiver: phones,
            type: 'register',
        });

        try {
            const response = await fetch('/api/send-verification-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: payload
            });

            const result = await response.json();

            if (result.success === false) {
                notification.error({
                    message: t('verification_code_send_error'),
                    description: result.message,
                });
            }else{
                setPhoneCode(true);
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async () => {
        const payload = new URLSearchParams({
            channel: 1,
            receiver: phones,
            code: data.verificationCode,
            type: 'register',
        });

        const response = await fetch('/api/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        const result = await response.json();
        if (result.success === true) {
            setStep(3);
        } else {
            notification.error({
                message: t('verification_failed'),
                description: result.message,
            });
        }
    };

    const isValidCyrillicName = (name) => {
        const cyrillicPattern = /^[А-ЯЁӘІҢҒҮҰҚӨҺ][а-яёәіңғүұқөһ]+(?:-[А-ЯЁӘІҢҒҮҰҚӨҺ][а-яёәіңғүұқөһ]+)*\s[А-ЯЁӘІҢҒҮҰҚӨҺ][а-яёәіңғүұқөһ]+(?:-[А-ЯЁӘІҢҒҮҰҚӨҺ][а-яёәіңғүұқөһ]+)*$/;
        return cyrillicPattern.test(name.trim());
    };


    const handleBasicInfoSubmit = (e) => {
        e.preventDefault();
        if (data.role === 'employee' && !isValidCyrillicName(data.name)) {
            notification.error({
                message: t('name_error'),
                description: t('name_must_be_cyrillic'),
            });
            return;
        }
        if (!data.name || !data.email) {
            notification.error({
                message: t('error'),
                description: t('all_fields_required'),
            });
            return;
        }
        setStep(2);
    };

    const handlePhoneChange = (e) => {
        const formattedPhone = e.target.value.replace(/[^\d]/g, '');
        setData('phone', formattedPhone);
    };

    const handleRegistrationSubmit = (e) => {
        e.preventDefault();

        if (data.role !== 'employee' && !data.description.trim()) {
            notification.error({
                message: t('error'),
                description: t('company_description_required'),
            });
            return;
        }

        const formData = new FormData();
        formData.append('phone', data.phone);
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('gender', data.gender);
        formData.append('avatar', data.avatar);
        formData.append('source', source);

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
                    message: t('registration_error'),
                    description: error,
                });
            });
        }
    }, [backendErrors]);

    return (
        <GuestLayout>
            <div className='w-full md:h-screen h-[700px] grid md:grid-cols-7 grid-cols-1 px-5 md:px-[0px]'>
                <div className='flex col-span-5'>
                    <div className='mx-auto my-auto'>
                        {step === 0 && (
                            <>
                                <div className="font-semibold text-xl text-center">{t('select_user_type_title', { ns: 'register' })}</div>
                                <div className="mb-4 mt-8">
                                    <div className="">
                                        <div className='text-sm font-light text-gray-500'>{t('register_as_applicant')}</div>
                                        <button
                                            onClick={() => handleRoleSubmit('employee')}
                                            className="w-full mt-3 border-gray-300 block text-gray-400 border-2 hover:bg-blue-500 transition-all duration-100 hover:text-white hover:border-blue-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                        >
                                            {t('job_seeker_option', { ns: 'register' })}
                                        </button>
                                        <div className='mt-10 text-sm font-light text-gray-500'>{t('register_as_employer')}</div>
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
                                        <a href='/terms' className='mt-10 block'>{t('by_continuing_you_accept')} <span className='text-blue-500'>{t('user_agreement')}</span></a>
                                    </div>
                                </div>
                            </>
                        )}
                        {step === 1 && (
                            <>
                                <div className="mb-10 font-semibold text-xl text-center">
                                    {t('enter_main_information')}
                                </div>
                                <div className='text-sm font-semibold'>
                                    {data.role === 'employee' ? t('full_name') : t('company_name')}
                                </div>
                                <input
                                    type='text'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className='w-[350px] mt-1 block border-gray-300 rounded-lg'
                                    placeholder={data.role === 'employee' ? t('enter_your_full_name') : t('enter_company_name')}
                                />
                                {errors.name && <p className='text-red-500 text-sm mt-2'>{errors.name}</p>}
                                <div className='mt-5 text-sm font-semibold'>{t('email')}</div>
                                <input
                                    type='email'
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className='w-[350px] mt-1 block border-gray-300 rounded-lg'
                                    placeholder={t('email')}
                                />
                                {errors.email && <p className='text-red-500 text-sm mt-2'>{errors.email}</p>}
                                {data.role == 'employee' && (
                                    <div className='flex w-[350px] gap-x-5'>
                                        <div className='w-[50%]'>
                                            <div className='mt-5 text-sm font-semibold'>{t('birth_date')}</div>
                                            <input
                                                type='date'
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className='w-full mt-1 border-gray-300 rounded-lg'
                                                placeholder={t('select_birth_date')}
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <div className='mt-5 text-sm font-semibold'>{t('sex')}</div>
                                            <select
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className='w-full mt-1 block border-gray-300 rounded-lg'
                                            >
                                                <option value='м'>{t('male')}</option>
                                                <option value='ж'>{t('female')}</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                                <button
                                    className='py-2 font-bold w-full block text-white rounded-lg bg-blue-500 mt-5'
                                    onClick={handleBasicInfoSubmit}
                                >
                                    {t('next')}
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <div className='w-[350px]'>
                                <div className="mb-10 font-semibold text-xl text-center">{t('confirm_phone_number')}</div>
                                <InputMask
                                  mask="+7 999 999 99 99"
                                  value={data.phone}
                                  onChange={handlePhoneChange}
                                  maskChar={null}
                                >
                                  {(inputProps) => <Input {...inputProps} type="tel" className="block w-full mt-1 border-gray-300 rounded-lg" placeholder="Введите ваш телефон" />}
                                </InputMask>
                                <small className='text-blue-500 text-sm mt-2'>{t('enter_whatsapp_number')}</small>
                                {errors.phone && <p className='text-red-500 text-sm mt-2'>{errors.phone.message}</p>}
                                {phoneCode ? (
                                    <>
                                        <input
                                            type='number'
                                            value={data.verificationCode}
                                            onChange={(e) => setData('verificationCode', e.target.value)}
                                            className='block mt-3 border-gray-300 w-full rounded-lg'
                                            placeholder={t('enter_confirmation_code')}
                                        />
                                        <button
                                            className='py-2 font-bold w-full inline-block text-white rounded-lg bg-blue-500 mt-5'
                                            onClick={handleVerificationSubmit}
                                        >
                                            {t('confirm')}
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
                                            t('send_code')
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                        {step === 3 && (
                            <div className='w-[350px]'>
                                <div className='mt-5 text-sm font-semibold'>{t('create_password')}</div>
                                <input
                                    type='password'
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className='block mt-1 border-gray-300 w-full rounded-lg'
                                    placeholder={t('enter_password')}
                                />
                                <div className='mt-5 text-sm font-semibold'>{t('repeat_password')}</div>
                                <input
                                    type='password'
                                    value={data.password_confirm}
                                    onChange={(e) => setData('password_confirm', e.target.value)}
                                    className='block mt-1 border-gray-300 w-full rounded-lg'
                                    placeholder={t('repeat_password')}
                                />
                                {data.role != 'employee' && (
                                    <>
                                        <div className='mt-5 text-sm font-semibold'>{t('company_description')}</div>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className='w-full h-[150px] mt-1 border-gray-300 rounded-lg'
                                            placeholder={t('enter_company_description')}
                                        />
                                    </>
                                )}
                                <button
                                    onClick={handleRegistrationSubmit}
                                    className='register bg-blue-500 text-white rounded-lg mt-5 py-2 text-center w-full'
                                >
                                    {t('create_account')}
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
                <div className='h-full bg-[#F9FAFC] rounded-lg col-span-2 p-5 md:relative md:block hidden'>
                    {[
                        t('user_type_label'),
                        t('upload_avatar_title'),
                        t('contact_info'),
                        t('additional_info_title'),
                    ].map((label, i) => (
                        <div key={i} className='flex items-center gap-x-3 mt-7'>
                            <FaRegCheckCircle className={`text-2xl ${step === i ? 'text-blue-500' : 'text-gray-300'}`} />
                            <div>
                                <div className={`font-semibold ${step === i ? '' : 'text-gray-500'}`}>{label}</div>
                                <div className='text-sm text-gray-500'>{t('step')} {i + 1}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GuestLayout>
    );
}

