import { Inertia } from '@inertiajs/inertia';
import {Link, router} from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMailOpenOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import {Button, message, Tabs} from 'antd';

export default function Dashboard({ user, announcements }) {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const { t, i18n } = useTranslation('dashboard');

    const openCreateAnnouncementModal = () => {
        setSelectedAnnouncement(null);
    };

    const openEditAnnouncementModal = (announcement) => {
        setSelectedAnnouncement(announcement);
    };

    const deleteAnnouncement = (id) => {
        Inertia.delete(route('announcements.delete', { id: id }), {
            onSuccess: () => {
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    }

    const formatPhoneNumber = (phoneNumber) => {
        const countryCode = '+7';
        const areaCode = phoneNumber.slice(1, 4);
        const firstPart = phoneNumber.slice(4, 7);
        const secondPart = phoneNumber.slice(7, 9);
        const thirdPart = phoneNumber.slice(9, 11);

        return `${countryCode} ${areaCode} ${firstPart} ${secondPart} ${thirdPart}`;
    };

    const formatSalary = (anonce) => {
        const { salary_type, cost, cost_min, cost_max } = anonce;
        const isRussian = i18n.language === 'ru';

        switch (salary_type) {
            case 'exact':
                return cost ? `${cost.toLocaleString()} ₸` : '';
            case 'min':
                return cost_min ? `${isRussian ? 'от ' : ''}${cost_min.toLocaleString()} ₸${isRussian ? '' : ' бастап'}` : '';
            case 'max':
                return cost_max ? `${isRussian ? 'до ' : ''}${cost_max.toLocaleString()} ₸${isRussian ? '' : ' дейін'}` : '';
            case 'diapason':
                if (cost_min && cost_max) {
                    return `${isRussian ? 'от ' : ''}${cost_min.toLocaleString()} ₸${isRussian ? ' до ' : ' бастап '}${cost_max.toLocaleString()} ₸${isRussian ? '' : ' дейін'}`;
                }
                return '';
            case 'undefined':
                return t('negotiable', { ns: 'index' });
            case 'za_smenu':
                if (cost) {
                    return `${cost.toLocaleString()} ₸ / ${t('per_shift', { ns: 'index' })}`;
                }
                if (cost_min && !cost_max) {
                    return `${isRussian ? 'от ' : ''}${cost_min.toLocaleString()} ₸${isRussian ? ' / ' : ' '}${t('per_shift', { ns: 'index' })}${isRussian ? '' : ' бастап'}`;
                }
                if (!cost_min && cost_max) {
                    return `${isRussian ? 'до ' : ''}${cost_max.toLocaleString()} ₸${isRussian ? ' / ' : ' '}${t('per_shift', { ns: 'index' })}${isRussian ? '' : ' дейін'}`;
                }
                if (cost_min && cost_max) {
                    return `${isRussian ? 'от ' : ''}${cost_min.toLocaleString()} ₸${isRussian ? ' до ' : ' бастап '}${cost_max.toLocaleString()} ₸${isRussian ? ' ' : ' '}${t('per_shift', { ns: 'index' })}${isRussian ? '' : ' дейін'}`;
                }
                return '';
            default:
                return '';
        }
    };

    const vacancyCount = user.announcement.filter(anonce => anonce.type_ru === 'Вакансия').length;
    const orderCount = user.announcement.filter(anonce => anonce.type_ru === 'Заказ').length;

    const kz = {
        ...ru,
        formatDistance: (token, count, options) => {
            const formatDistanceLocale = {
                lessThanXSeconds: { one: 'Бірнеше секунд', other: 'Секунд' },
                xSeconds: { one: 'Бір секунд', other: '{{count}} секунд' },
                halfAMinute: 'жарты минут',
                lessThanXMinutes: { one: 'Бірнеше минут', other: 'Минут' },
                xMinutes: { one: 'Бір минут', other: '{{count}} минут' },
                aboutXHours: { one: 'Шамамен бір сағат', other: 'Шамамен {{count}} сағат' },
                xHours: { one: 'Бір сағат', other: '{{count}} сағат' },
                xDays: { one: 'Бір күн', other: '{{count}} күн' },
                aboutXWeeks: { one: 'Шамамен бір апта', other: 'Шамамен {{count}} апта' },
                xWeeks: { one: 'Бір апта', other: '{{count}} апта' },
                aboutXMonths: { one: 'Шамамен бір ай', other: 'Шамамен {{count}} ай' },
                xMonths: { one: 'Бір ай', other: '{{count}} ай' },
                aboutXYears: { one: 'Шамамен бір жыл', other: 'Шамамен {{count}} жыл' },
                xYears: { one: 'Бір жыл', other: '{{count}} жыл' },
                overXYears: { one: 'Бір жылдан астам', other: '{{count}} жылдан астам' },
                almostXYears: { one: 'Бір жылға жуық', other: '{{count}} жылға жуық' },
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

    const statusTabs = [
        { key: 'all', label: t('all', { ns: 'dashboard' }), status: null },
        { key: '0', label: t('on_moderation', { ns: 'dashboard' }), status: 0 },
        { key: '1', label: t('active', { ns: 'dashboard' }), status: 1 },
        { key: '2', label: t('blocked', { ns: 'dashboard' }), status: 2 },
        { key: '3', label: t('archived', { ns: 'dashboard' }), status: 3 },
    ];

    const handleRepublish = (id) => {
        router.post(`/announcements/republish`, {
                id: id,
            },
            {
                onSuccess: () => {
                    message.success(t('announcement_republicated', { ns: 'dashboard' }));
                },
                onError: (errors) => {
                    if (errors.id) {
                        message.error(errors.id); // Display the specific validation error
                    } else {
                        message.error(errors.error || t('announcement_republication_error', { ns: 'dashboard' }));
                    }
                },
            })
    };

    const renderAnnouncements = (status) => {
        const filteredAnnouncements = status === null
            ? user.announcement
            : user.announcement.filter(anonce => anonce.status === status);

        if (filteredAnnouncements.length === 0) {
            return (
                <div className='flex md:h-[200px] h-full'>
                    <div className='my-auto mx-auto text-gray-400 md:text-2xl text-lg font-bold'>
                        {t('dont_have_any_announcements', { ns: 'dashboard' })}
                    </div>
                </div>
            );
        }

        return (
            <div className='grid md:grid-cols-1 grid-cols-1'>
                {filteredAnnouncements.map((anonce, index) => (
                    <div key={index} className='p-3 border-t border-gray-300 w-full'>
                        <div className='flex items-center'>
                            {anonce.status === 0 && (
                                <div className='text-sm text-orange-500'>
                                    {t('on_moderation', { ns: 'dashboard' })}
                                </div>
                            )}
                            {anonce.status === 1 && (
                                <div className='text-sm text-green-500'>
                                    {t('active', { ns: 'dashboard' })}
                                </div>
                            )}
                            {anonce.status === 2 && (
                                <div className='text-sm text-red-500'>
                                    {t('blocked', { ns: 'dashboard' })}
                                </div>
                            )}
                            {anonce.status === 3 && (
                                <div className='text-sm text-gray-500'>
                                    {t('archived', { ns: 'dashboard' })}
                                </div>
                            )}
                            <div className="ml-auto">
                                <div className='font-bold text-sm ml-auto'>
                                    {formatSalary(anonce)}
                                </div>
                            </div>
                        </div>
                        <div className='mt-3'>
                            {anonce.title}
                        </div>
                        <div className='flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm'>
                            <FaLocationDot className='text-blue-500' />
                            {anonce.city}
                        </div>
                        <div className='text-sm font-light text-gray-500 mt-2'>
                            {anonce.status === 1 && (
                                <div className="text-sm font-light text-gray-500 mt-2">
                                    {i18n.language === 'ru' ? 'Размещено' : ''}{' '}
                                    {formatDistanceToNow(new Date(anonce.published_at), {
                                        locale: i18n.language === 'ru' ? ru : kz,
                                        addSuffix: true,
                                    })}
                                    {i18n.language === 'kz' && ''}
                                </div>
                            )}
                            {anonce.status !== 1 && (
                                <div className="text-sm font-light text-gray-500 mt-2">
                                    {i18n.language === 'ru' ? 'Создано' : ''}{' '}
                                    {formatDistanceToNow(new Date(anonce.created_at), {
                                        locale: i18n.language === 'ru' ? ru : kz,
                                        addSuffix: true,
                                    })}
                                    {i18n.language === 'kz' && ''}
                                </div>
                            )}
                        </div>
                        <div className='text-sm font-light text-gray-500 mt-2'>
                            {anonce.visit_count} {t('views', { ns: 'dashboard' })}
                        </div>
                        <div className='flex md:flex-row flex-col mt-4 gap-x-5 gap-y-2'>
                            <Link className='block w-full text-center border border-gray-300 rounded-lg text-sm py-2' href={`/profile/announcement/${anonce.id}`}>{t('view', { ns: 'dashboard' })}</Link>
                            <Link className='block w-full text-center border border-gray-300 rounded-lg text-sm py-2' href={`/announcements/update/${anonce.id}`}>{t('update', { ns: 'dashboard' })}</Link>
                            {(anonce.status === 1 || anonce.status === 3) && (
                                <Button className='block w-full text-center border border-gray-300 rounded-lg text-sm py-2 h-full' onClick={() => handleRepublish(anonce.id)}>
                                {t('republish', { ns: 'dashboard' })}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-7'>
                <div className='col-span-5 pt-10'>
                    <div className='md:px-5 p-5'>
                        <div className='text-left font-bold text-2xl'>{user.name}</div>
                        <div className='mt-3'>
                            <div className='text-left text-gray-500'>
                                {user.description}
                            </div>
                        </div>
                        <div className='flex items-center mt-3 gap-x-2 text-base'>
                            <IoMailOpenOutline className='text-xl' />
                            <div>{user.email}</div>
                        </div>
                        <div className='flex items-center mt-4 gap-x-2 text-base'>
                            <LuPhone className='text-xl' />
                            <div>{formatPhoneNumber(user.phone)}</div>
                        </div>
                        <div className='flex mt-5 gap-x-2 font-semibold text-xl'>
                            <div>{vacancyCount + orderCount} <span className='text-gray-500 font-light text-base'>{t('vacancies', { ns: 'dashboard' })}</span></div>
                        </div>
                        <div className='flex md:flex-row flex-col gap-x-2 gap-y-4 mt-5'>
                            <Link href='/update'
                                  className='text-black border border-gray-300 rounded-lg text-center items-center inline-block py-2 px-10 cursor-pointer'
                            >
                                <span className='text-light text-sm'>{t('update', { ns: 'dashboard' })}</span>
                            </Link>
                            <Link href="/create_announcement"
                                  className='inline-block text-white rounded-lg text-center bg-blue-500 py-2 px-10 cursor-pointer'
                            >
                                <span className='font-light text-sm'>{t('create_announcement', { ns: 'dashboard' })}</span>
                            </Link>
                        </div>
                    </div>
                    <div className='p-3 font-semibold'>{t('your_announcements', { ns: 'dashboard' })}</div>
                    <div className='rounded-lg'>
                        <Tabs
                            className='ml-1'
                            defaultActiveKey="all"
                            items={statusTabs.map(tab => ({
                                key: tab.key,
                                label: tab.label,
                                children: renderAnnouncements(tab.status),
                            }))}
                        />
                    </div>
                </div>
                <div className='md:block hidden col-span-2 border-l border-gray-200 pt-5 h-screen sticky top-0'>
                </div>
            </div>
        </>
    )
}
