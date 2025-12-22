import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import emails from 'emailjs-com';
import { notification, Button, Checkbox, ConfigProvider } from 'antd';

export default function ScamModal({ isOpen, onClose }) {
    const { t } = useTranslation('header');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedScams, setSelectedScams] = useState([]);
    const [error, setError] = useState('');

    const scams = [
        t('prohibited_substances'),
        t('scammers'),
        t('intimate_services'),
        t('other_custom_option'),
    ];

    if (!isOpen) return null;

    const handleScamChange = (checkedValues) => {
        setSelectedScams(checkedValues);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (selectedScams.length === 0) {
            setLoading(false);
            setError(t('please_select_at_least_one_complaint'));
            return;
        }

        if (selectedScams.length > 0 && selectedScams.join(', ').includes('другое (свой вариант)') && reason.trim() === '') {
            setLoading(false);
            setError(t('reason_required', { ns: 'header' }));
            return;
        }

        try {
            const combined = '<b>Жалоба:</b>\nФИО: ' + name + '\nТелефон: ' + phone + '\nПричина: ' + selectedScams.join(', ') + '\nТекст: ' + reason;
            const response = fetch(`https://api.telegram.org/bot8474272412:AAEVmEp9uFDgV9XitBgY7S5A9DqXSTnaOZ0/sendMessage?chat_id=-1002334471884&parse_mode=html&text=${encodeURIComponent(combined)}`);
            console.log('SUCCESS!', response);
            setLoading(false);
            setName('');
            setPhone('');
            setReason('');
            setSelectedScams([]);
            onClose();
            notification.success({
                message: t('success'),
                description: t('your_complaint_has_been_successfully_submitted'),
            });
        } catch (error) {
            console.log('FAILED...', error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 font-regular bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
                <div className="mb-4">{t('send_complaint', { ns: 'header' })}</div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder={t('your_name', { ns: 'header' })}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder={t('your_phone_number', { ns: 'header' })}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <div>
                        <div className='mb-2 text-gray-500'>{t('select_complaint_reason', { ns: 'header' })}:</div>
                        <ConfigProvider
                            theme={{
                                token: {
                                    fontSize: '16px',
                                },
                            }}
                        >
                            <Checkbox.Group
                                options={scams}
                                value={selectedScams}
                                onChange={handleScamChange}
                                className='checkbox-group-custom'
                                style={{ display: 'flex', flexDirection: 'column' }}
                            />
                        </ConfigProvider>
                    </div>

                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder={t('custom_option', { ns: 'header' })}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    {error && <div className="text-red-500 mt-2">{error}</div>} {/* Display error if no scam is selected */}

                    <div className="flex justify-end mt-4">
                        <Button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-lg" onClick={onClose}>
                            {t('cancel', { ns: 'header' })}
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="bg-[#F36706] hover:bg-orange-500 text-white rounded-lg"
                        >
                            {t('send', { ns: 'header' })}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

