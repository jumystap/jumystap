import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emails from 'emailjs-com';
import { notification, Button, Checkbox, ConfigProvider } from 'antd';

export default function InfoModal({ isOpen, onClose}) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
                <div>Анкета</div>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                </form>
            </div>
        </div>
    );
}
