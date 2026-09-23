import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { notification, Button, Checkbox, Radio } from 'antd';

export default function SurveyModal({ isOpen, onClose }) {
    const { t } = useTranslation('index');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('');
    const [joltapGraduate, setJoltapGraduate] = useState(null);
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        const originalTouchAction = document.body.style.touchAction;
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.touchAction = originalTouchAction;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const resetForm = () => {
        setName('');
        setPhone('');
        setPosition('');
        setJoltapGraduate(null);
        setConsent(false);
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !phone.trim() || !position.trim()) {
            setError(t('survey_fill_all_fields'));
            return;
        }
        if (joltapGraduate === null) {
            setError(t('survey_select_joltap'));
            return;
        }
        if (!consent) {
            setError(t('survey_consent_required'));
            return;
        }

        setLoading(true);

        try {
            await axios.post('/placement-surveys', {
                name: name.trim(),
                phone: phone.trim(),
                position: position.trim(),
                is_graduate: joltapGraduate,
                consent,
            });

            setLoading(false);
            resetForm();
            onClose();

            notification.success({
                message: t('survey_success_title'),
                description: t('survey_success_desc'),
            });
        } catch {
            setLoading(false);
            notification.error({ message: t('survey_error') });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] font-regular bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[90vh] flex flex-col overflow-hidden">
                <div className="overflow-y-auto overscroll-contain p-6">
                    <div className="font-semibold text-lg mb-4">
                        {t('survey_modal_title')}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder={t('survey_name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                            required
                        />
                        <input
                            type="tel"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder={t('survey_phone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={100}
                            required
                        />
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder={t('survey_position')}
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            maxLength={100}
                            required
                        />

                        <div>
                            <div className="mb-2 text-gray-500">{t('survey_joltap_question')}</div>
                            <Radio.Group
                                value={joltapGraduate}
                                onChange={(e) => setJoltapGraduate(e.target.value)}
                                className="flex flex-col gap-1"
                            >
                                <Radio value={true}>{t('survey_yes')}</Radio>
                                <Radio value={false}>{t('survey_no')}</Radio>
                            </Radio.Group>
                        </div>

                        <Checkbox
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-1"
                        >
                            {t('survey_consent')}
                        </Checkbox>

                        {error && <div className="text-red-500">{error}</div>}

                        <div className="flex justify-end gap-2 mt-3">
                            <Button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                                onClick={handleClose}
                            >
                                {t('survey_cancel')}
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="bg-[#F36706] hover:bg-orange-500 text-white rounded-lg"
                            >
                                {t('survey_submit')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
