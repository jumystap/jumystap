import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import emails from 'emailjs-com';
import { notification, Button, Checkbox, ConfigProvider } from 'antd';

export default function FeedbackModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation('header');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedProfessions, setSelectedProfessions] = useState([]);
    const [error, setError] = useState('');

    const professions = [
        t('small_business_accounting_and_taxation'),
        t('seamstress'),
        t('fashion_designer_constructor'),
        t('kaspi_store_trading'),
        t('barista'),
        t('shoe_repair_and_key_making'),
        t('electric_gas_welder'),
        t('sales_manager'),
        t('cabinet_furniture_manufacturing_basics'),
        t('interior_design_basics'),
        t('baker'),
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
            setError(t('please_select_at_least_one_skill'));
            return;
        }

        const templateParams = {
            name,
            phone,
            message: selectedProfessions.join(', '),
        };

        try {
            const combined = '<b>Заявка:</b>\nФИО: ' + name + '\nТелефон: ' + phone + '\nПрофессия: ' + selectedProfessions.join(', ');
            const response = fetch(`https://api.telegram.org/bot8474272412:AAEVmEp9uFDgV9XitBgY7S5A9DqXSTnaOZ0/sendMessage?chat_id=-1002334471884&parse_mode=html&text=${encodeURIComponent(combined)}`);
            console.log('SUCCESS!', response);
            onSubmit(templateParams);
            setLoading(false);
            setName('');
            setPhone('');
            setSelectedProfessions([]);
            onClose();
            notification.success({
                message: t('success'),
                description: t('your_application_has_been_successfully_submitted'),
            });
        } catch (error) {
            console.log('FAILED...', error);
            setLoading(false);
        }

        // emails.send('service_gemcvsd', 'template_3p0vezb', templateParams, '2aHWUXyiS63MSOUf3')
        //     .then((response) => {
        //         console.log('SUCCESS!', response.status, response.text);
        //         onSubmit(templateParams);
        //         setLoading(false);
        //         setName('');
        //         setPhone('');
        //         setSelectedProfessions([]);
        //         onClose();
        //         notification.success({
        //             message: 'Успех',
        //             description: 'Ваша заявка успешно отправлена!',
        //         });
        //     }, (error) => {
        //         console.log('FAILED...', error);
        //         setLoading(false);
        //     });
    };

    return (
        <div className="fixed inset-0 z-40 font-regular bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
                <div className="mb-4">{t('submit_application', { ns: 'header' })}</div>
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
                        <div className='mb-2 text-gray-500'>{t('select_desired_skills', { ns: 'header' })}:</div>
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
                        {t('confirm_astana_residence', { ns: 'header' })}
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

