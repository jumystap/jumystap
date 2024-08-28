import React, { useState } from 'react';
import Guest from "@/Layouts/GuestLayout";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';

export default function Reviews({ reviews }) {
    const { t, i18n } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialize Inertia form
    const { data, setData, post, reset, processing, errors } = useForm({
        name: '',
        phone: '',
        review: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reviews', {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    const kz = {
        ...ru,
        formatDistance: (token, count, options) => {
            const formatDistanceLocale = {
                lessThanXSeconds: {
                    one: 'Бірнеше секунд',
                    other: 'Секунд',
                },
                xSeconds: {
                    one: 'Бір секунд',
                    other: '{{count}} секунд',
                },
                halfAMinute: 'жарты минут',
                lessThanXMinutes: {
                    one: 'Бірнеше минут',
                    other: 'Минут',
                },
                xMinutes: {
                    one: 'Бір минут',
                    other: '{{count}} минут',
                },
                aboutXHours: {
                    one: 'Шамамен бір сағат',
                    other: 'Шамамен {{count}} сағат',
                },
                xHours: {
                    one: 'Бір сағат',
                    other: '{{count}} сағат',
                },
                xDays: {
                    one: 'Бір күн',
                    other: '{{count}} күн',
                },
                aboutXWeeks: {
                    one: 'Шамамен бір апта',
                    other: 'Шамамен {{count}} апта',
                },
                xWeeks: {
                    one: 'Бір апта',
                    other: '{{count}} апта',
                },
                aboutXMonths: {
                    one: 'Шамамен бір ай',
                    other: 'Шамамен {{count}} ай',
                },
                xMonths: {
                    one: 'Бір ай',
                    other: '{{count}} ай',
                },
                aboutXYears: {
                    one: 'Шамамен бір жыл',
                    other: 'Шамамен {{count}} жыл',
                },
                xYears: {
                    one: 'Бір жыл',
                    other: '{{count}} жыл',
                },
                overXYears: {
                    one: 'Бір жылдан астам',
                    other: '{{count}} жылдан астам',
                },
                almostXYears: {
                    one: 'Бір жылға жуық',
                    other: '{{count}} жылға жуық',
                },
            };

            const result = formatDistanceLocale[token];

            if (typeof result === 'string') {
                return result;
            }

            const form = count === 1 ? result.one : result.other.replace('{{count}}', count);

            if (options?.addSuffix) {
                if (options?.comparison > 0) {
                    return form + ' кейін';
                } else {
                    return form + ' бұрын';
                }
            }

            return form;
        }
    };

    return (
        <Guest>
            <div className="text-xl font-semibold text-orange-500 mt-4 md:hidden">Отзывы по платформе</div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-20'>
                <div className='md:block hidden mt-10'>
                    <h2 className="text-lg font-semibold mb-4">Оставить отзыв</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Имя</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Телефон</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+7 (___) ___-__-__"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Отзыв</label>
                            <textarea
                                value={data.review}
                                onChange={(e) => setData('review', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                rows="4"
                                required
                            ></textarea>
                            {errors.review && <div className="text-red-500 text-sm">{errors.review}</div>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-full"
                                disabled={processing}
                            >
                                {processing ? 'Отправка...' : 'Отправить'}
                            </button>
                        </div>
                    </form>
                </div>
                <div>
                    {reviews.length > 0 && (
                        <div className="grid mt-5 grid-cols-1">
                            {reviews.map((review, index) => (
                                <div className="py-4 border-b border-gray-300 mt-2" key={index}>
                                    <div className="flex">
                                        <div className="">{review.name}</div>
                                        <div className="ml-auto text-xs text-gray-500">
                                            {i18n.language === 'ru' ? 'Размещено' : ''} {`${formatDistanceToNow(new Date(review.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language === 'kz' && 'орналастырылды'}
                                        </div>
                                    </div>
                                    <div className="text-sm mt-2 text-gray-500">{review.review}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="px-5 fixed left-0 bottom-5 w-full md:hidden">
                <button onClick={() => setIsModalOpen(true)} className="text-center bg-orange-500 w-full font-semibold text-white shadow-lg shadow-orange-500/50 rounded-full py-2">
                    Оставить отзыв
                </button>
            </div>

            {/* Modal for leaving a review */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-[350px] w-full">
                        <h2 className="text-lg font-semibold mb-4">Оставить отзыв</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Имя</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Телефон</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+7 (___) ___-__-__"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Отзыв</label>
                                <textarea
                                    value={data.review}
                                    onChange={(e) => setData('review', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                    rows="4"
                                    required
                                ></textarea>
                                {errors.review && <div className="text-red-500 text-sm">{errors.review}</div>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-700 mr-3"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-full"
                                    disabled={processing}
                                >
                                    {processing ? 'Отправка...' : 'Отправить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Guest>
    );
}

