import React, { useState } from 'react';
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { notification, Input } from "antd";
import InputMask from 'react-input-mask';
import AuthSupportCard from "@/Components/AuthSupportCard";
import MobileSurface from "@/Components/Mobile/MobileSurface";

export default function ForgotPassword() {
    const { data, setData, post, processing, reset } = useForm({
        phone: '',
        password: '',
        verificationCode: '',
    });

    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const phone = data.phone;

    const normalizePhone = (value) => value.replace(/[^\d]/g, '');

    const handlePhoneChange = (e) => {
        setData('phone', normalizePhone(e.target.value));
    };

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

            if (result.success === true) {
                setStep(2);
            }else{
                notification.error({
                    message: t('verification_code_send_error', { ns: 'register' }),
                    description: result.message,
                });
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
            <div className="w-full md:h-screen min-h-[calc(100vh-140px)] grid md:grid-cols-7 grid-cols-1 gap-4 px-0 md:px-[0px]">
                <div className="flex md:col-span-5">
                    <MobileSurface className="jt-mobile-auth-card mx-auto my-0 w-full max-w-md md:my-auto md:bg-transparent md:shadow-none md:border-0 md:p-0">
                        {step === 1 && (
                            <>
                                <div className="font-bold text-4xl text-center">{t('recovery_account_title', { ns: 'register' })}</div>
                                <form onSubmit={handlePhoneSubmit}>
                                    <div className="mb-4 mt-8">
                                        <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="phone">
                                            {t('phone_label', { ns: 'register' })}
                                        </label>
                                        <InputMask
                                            mask="+7 999 999 99 99"
                                            value={data.phone}
                                            onChange={handlePhoneChange}
                                            maskChar={null}
                                        >
                                            {(inputProps) => (
                                                <Input
                                                    {...inputProps}
                                                    id="phone"
                                                    type="tel"
                                                    inputMode="tel"
                                                    className="block w-full mt-1 border-gray-300 rounded-lg"
                                                    placeholder="+7 700 000 00 00"
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 w-full hover:bg-blue-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
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
                                            className="appearance-none transition-all duration-150 border rounded w-full border-gray-300 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 w-full hover:bg-blue-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
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
                                            className="appearance-none transition-all duration-150 border rounded w-full border-gray-300 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 w-full hover:bg-blue-600 transition-all duration-100 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                            disabled={processing}
                                        >
                                            Сохранить
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </MobileSurface>
                </div>
                <AuthSupportCard
                    title={t('login_issues', { ns: 'faq' })}
                    description={t('if_you_experience_difficulties_you_can_contact_us_using_these_details', { ns: 'faq' })}
                />
            </div>
        </GuestLayout>
    );
}
