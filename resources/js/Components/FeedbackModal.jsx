import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emails from 'emailjs-com';
import { notification, Button } from 'antd';

export default function FeedbackModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const templateParams = {
            name,
            phone,
        };

        emails.send('service_gemcvsd', 'template_3p0vezb', templateParams, '2aHWUXyiS63MSOUf3')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                onSubmit(templateParams);
                setLoading(false);
                setMessage('');
                setName('');
                setPhone('');
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
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
                <h2 className="text-xl mb-4">Отправить заявку</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                        placeholder={t('your_name', { ns: 'header' })}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                        placeholder="Ваш номер телефона"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
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

