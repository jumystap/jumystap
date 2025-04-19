import React, { useState } from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import {notification} from "antd";

export default function ForgotPassword() {
    const { data, setData, post, processing, reset } = useForm({
        phone: '',
        password: '',
        verificationCode: '',
    });

    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const phone = data.phone;

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();

        const payload = new URLSearchParams({
            channel: 1,
            receiver: phone,
            type: 'forgot',
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
                    message: t('verification_code_send_error', { ns: 'register' }),
                    description: result.message,
                });
            }else{
                setStep(2);
            }

        } catch (error) {
            console.error('Error sending SMS:', error);
            setStep(2);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        const payload = new URLSearchParams({
            channel: 1,
            receiver: phone,
            code: data.verificationCode,
            type: 'forgot',
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
                message: t('verification_failed', { ns: 'register' }),
                description: result.message,
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
                            <div className="font-bold text-4xl text-center">{t('recovery_account_title', { ns: 'register' })}</div>
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
