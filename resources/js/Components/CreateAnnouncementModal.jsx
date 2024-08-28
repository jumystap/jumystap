import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { useForm } from '@inertiajs/react';
import 'tailwindcss/tailwind.css';

const forbiddenWords = [
    "abuse", "ass", "bastard", "bitch", "bollocks", "bugger", "bullshit", "crap", "cunt",
    "damn", "dick", "dildo", "fag", "faggot", "fuck", "goddamn", "hell", "jerk", "motherfucker",
    "nigga", "nigger", "penis", "piss", "prick", "pussy", "shit", "slut", "twat", "whore",
    "asshole", "bastards", "bitches", "bollock", "cocksucker", "cunts", "dicks", "dildos",
    "faggots", "fucks", "fucking", "motherfuckers", "niggers", "penises", "shits", "sluts",
    "twats", "whores", "дурак", "идиот", "тупица", "болван", "кретин", "жопа", "мудак", "сволочь", "ублюдок",
    "говно", "мразь", "сука", "падла", "дрянь", "проститутка", "шлюха", "пидор", "пидорас",
    "гандон", "хуесос", "хуево", "ебать", "блядь", "бля", "пиздец", "мать твою", "нахуй",
    "пошел нахуй", "ебаный", "ебануть", "ебанутый", "ебать", "заебал", "заебись", "пидорас",
    "хуй", "хер", "пизда", "ебать", "выебать", "ебло", "блядский", "ебаный", "нахуй"
];

const CreateAnnouncementModal = ({ isOpen, onRequestClose, announcement = null }) => {
    const { t } = useTranslation();
    const isEdit = announcement !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        type_kz: announcement ? announcement.type_kz : 'Жарнама',
        type_ru: announcement ? announcement.type_ru : 'Объявление',
        title: announcement ? announcement.title : '',
        description: announcement ? announcement.description : '',
        payment_type: announcement ? announcement.payment_type : '',
        cost: announcement ? announcement.cost : '',
        active: announcement ? announcement.active : true
    });

    const [validationErrors, setValidationErrors] = useState({});

    // Update type_kz when type_ru changes
    useEffect(() => {
        if (data.type_ru === 'Объявление') {
            setData('type_kz', 'Жарнама');
        } else if (data.type_ru === 'Вакансия') {
            setData('type_kz', 'Вакансия');
        }
    }, [data.type_ru]);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const containsForbiddenWords = (text) => {
        const lowerCaseText = text.toLowerCase();
        return forbiddenWords.some((word) => lowerCaseText.includes(word));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};

        if (containsForbiddenWords(data.title)) {
            errors.title = "Измените текст. Присутствует цензура";
        }
        if (containsForbiddenWords(data.description)) {
            errors.description = "Измените текст. Присутствует цензура";
        }
        if (containsForbiddenWords(data.payment_type)) {
            errors.payment_type = "Измените текст. Присутствует цензура";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const submitAction = isEdit ? put : post;
        const url = isEdit ? `/announcements/${announcement.id}` : '/create_announcement';

        submitAction(url, {
            onSuccess: () => {
                onRequestClose();
            },
            onError: (errors) => {
                console.error('Failed to save announcement:', errors);
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            ariaHideApp={false}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 md:mx-0">
                <h2 className="text-2xl font-semibold mb-4 text-orange-500">
                    {isEdit ? t('title_edit', { ns: 'createAnnouncement' }) : t('title', { ns: 'createAnnouncement' })}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            {t('type', { ns: 'createAnnouncement' })}
                        </label>
                        <select
                            name="type_ru"
                            value={data.type_ru}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="Объявление">{t('announcement', { ns: 'createAnnouncement' })}</option>
                            <option value="Вакансия">{t('vacancy', { ns: 'createAnnouncement' })}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            {t('title', { ns: 'createAnnouncement' })}
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        {validationErrors.title && <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            {t('description', { ns: 'createAnnouncement' })}
                        </label>
                        <textarea
                            type="text"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        {validationErrors.description && <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            {t('paymentType', { ns: 'createAnnouncement' })}
                        </label>
                        <input
                            type="text"
                            name="payment_type"
                            value={data.payment_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.payment_type && <p className="text-red-500 text-xs mt-1">{errors.payment_type}</p>}
                        {validationErrors.payment_type && <p className="text-red-500 text-xs mt-1">{validationErrors.payment_type}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            {t('cost', { ns: 'createAnnouncement' })}
                        </label>
                        <input
                            type="number"
                            name="cost"
                            value={data.cost}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={processing}
                    >
                        {isEdit ? "Сохранить" : t('create', { ns: 'createAnnouncement' })}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default CreateAnnouncementModal;
