import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emails from 'emailjs-com';
import { notification, Button, Checkbox, ConfigProvider } from 'antd';

export default function FeedbackModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedProfessions, setSelectedProfessions] = useState([]);
    const [error, setError] = useState('');

    const professions = [
        'Основы изготовления корпусной мебели',
        'Бариста',
        'Электрогазосварщик',
        'Ремонт обуви и изготовление ключей',
        'Продавец-кассир',
        'Автоспециалист по замене масла и автошин'
    ];

    if (!isOpen) return null;

    const handleProfessionChange = (checkedValues) => {
        setSelectedProfessions(checkedValues);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (selectedProfessions.length === 0) {
            setLoading(false);
            setError('Пожалуйста, выберите хотя бы один навык.');
            return;
        }

        const templateParams = {
            name,
            phone,
            message: selectedProfessions.join(', '),
        };

        emails.send('service_gemcvsd', 'template_3p0vezb', templateParams, '2aHWUXyiS63MSOUf3')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                onSubmit(templateParams);
                setLoading(false);
                setName('');
                setPhone('');
                setSelectedProfessions([]);
                onClose();
                notification.success({
                    message: 'Успех',
                    description: 'Ваша заявка успешно отправлена!',
                });
            }, (error) => {
                console.log('FAILED...', error);
                setLoading(false);
            });
    };

    return (
        <div className="fixed inset-0 z-40 font-regular bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
                <div className="mb-4">Отправить заявку</div>
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
                        placeholder="Ваш номер телефона"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <div>
                        <div className='mb-2 text-gray-500'>Выберите желаемые навыки:</div>
                        <ConfigProvider
                            theme={{
                                token: {
                                    fontSize: '16px',
                                },
                            }}
                        >
                            <Checkbox.Group
                                options={professions}
                                value={selectedProfessions}
                                onChange={handleProfessionChange}
                                className='checkbox-group-custom'
                                style={{ display: 'flex', flexDirection: 'column' }}
                            />
                        </ConfigProvider>
                        {error && <div className="text-red-500 mt-2">{error}</div>} {/* Display error if no profession is selected */}
                    </div>

                    <Checkbox className='mt-5' required>
                        Я подтверждаю, что проживаю в городе Астана
                    </Checkbox>

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

