import React, { useState } from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

export default function ForgotPassword() {
    const { data, setData, post, processing, reset } = useForm({
        phone: '',
        password: '',
        verificationCode: '',
    });

    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState(null);
    const login = 'janamumkindik@gmail.com';
    const password = '%Jana2023Mumkindik05';
    const phone = data.phone;

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        const newVerificationCode = Math.floor(100000 + Math.random() * 900000);
        const message = `JOLTAP Ваш код: ${newVerificationCode}`;
        setVerificationCode(newVerificationCode);

        const payload = new URLSearchParams({
            login: login,
            psw: password,
            phones: phone,
            mes: message,
            sender_id: '839907'
        });

        try {
            await fetch(`https://smsc.kz/sys/send.php?login=${login}&psw=${password}&phones=${phone}&mes=${encodeURIComponent(message)}`);
            setStep(2);
        } catch (error) {
            console.error('Error sending SMS:', error);
            setStep(2);
        }
    };

    const handleVerificationSubmit = (e) => {
        e.preventDefault();
        if (data.verificationCode == verificationCode) {
            setStep(3);
        } else {
            notification.error({
                message: 'Верификация не прошла',
                description: 'Введённый вами код подтверждения неверен. Пожалуйста, попробуйте снова.',
            });
        }
    };

    const handleSavePassword = (e) => {
        e.preventDefault();
        post('/restore_password', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <GuestLayout>
            <div className="flex w-full h-[650px]">
                <div className="mx-auto my-auto w-full max-w-md p-5">
                    {step == 1 && (
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
                    {step === 2 && (
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
                    {step === 3 && (
                        <>
                            <div className="font-bold text-4xl text-center">Придумайте новый пароль</div>
                            <form onSubmit={handleSavePassword}>
                                <div className="mb-4 mt-8">
                                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="verificationCode">
                                        Новый пароль
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
                                        Сохранить
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
