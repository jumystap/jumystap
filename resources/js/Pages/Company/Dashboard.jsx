import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMailOpenOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

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
                    <div className='rounded-lg '>
                        {user.announcement.length > 0 ? (
                            <div className='grid md:grid-cols-1 grid-cols-1'>
                                {user.announcement.map((anonce, index) => (
                                    <div key={index} className='p-3 border-t border-gray-300 w-full'>
                                        <div className='flex items-center'>
                                            {!anonce.active && (
                                                <div className=' text-sm text-gray-500'>
                                                    {t('on_moderation', { ns: 'dashboard' })}
                                                </div>
                                            )}
                                            <div className="ml-auto">
                                                <div className='font-bold text-sm ml-auto'>
                                                    {anonce.salary_type === "exact" &&
                                                        anonce.cost &&
                                                        `${anonce.cost.toLocaleString()} ₸ `}
                                                    {anonce?.salary_type === "min" && anonce.cost_min &&
                                                        `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸" : anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                                                    }
                                                    {anonce.salary_type === "max" && anonce.cost_max &&
                                                        `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸" : anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                                                    }
                                                    {anonce.salary_type === "diapason" &&
                                                        anonce.cost_min &&
                                                        anonce.cost_max &&
                                                        `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸" :
                                                            anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                                                    }
                                                    {anonce.salary_type === "undefined" && t("negotiable", { ns: "index" })}
                                                    {anonce.salary_type === "za_smenu" && (
                                                        <>
                                                            {anonce.cost &&
                                                                `${anonce.cost.toLocaleString()} ₸ / ` + t("per_shift", { ns: "index" })
                                                            }
                                                            {anonce.cost_min &&
                                                                !anonce.cost_max &&
                                                                `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                                    t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап"}`
                                                            }
                                                            {!anonce.cost_min &&
                                                                anonce.cost_max &&
                                                                `${i18n?.language === "ru" ? "до " + anonce.cost_max.toLocaleString() + " ₸ / " + t("per_shift", { ns: "index" }) :
                                                                    t("per_shift", { ns: "index" }) + " " + anonce.cost_max.toLocaleString() + " ₸ / дейін"}`
                                                            }
                                                            {anonce.cost_min &&
                                                                anonce.cost_max &&
                                                                `${i18n?.language === "ru" ? "от " + anonce.cost_min.toLocaleString() + " ₸ до " + anonce.cost_max.toLocaleString() + " ₸ " + t("per_shift", { ns: "index" }):
                                                                    t("per_shift", { ns: "index" }) + " " + anonce.cost_min.toLocaleString() + " ₸ бастап " + anonce.cost_max.toLocaleString() + " ₸ дейін"}`
                                                            }
                                                        </>
                                                    )}
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
                                            {i18n.language === 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                        </div>
                                        <div className='text-sm font-light text-gray-500 mt-2'>
                                            {anonce.visit_count} {t('views', { ns: 'dashboard' })}
                                        </div>
                                        <div className='flex md:flex-row flex-col mt-4 gap-x-5 gap-y-2'>
                                            <Link className='block w-full text-center border border-gray-300 rounded-lg text-sm py-2' href={`/profile/announcement/${anonce.id}`}>{t('view', { ns: 'dashboard' })}</Link>
                                            <Link className='block w-full text-center py-2 text-gray-500 font-light text-sm' href={`/announcement/update/${anonce.id}`}>{t('update', { ns: 'dashboard' })}</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='flex md:h-[200px] h-full'>
                                <div className='my-auto mx-auto text-gray-400 md:text-2xl text-lg font-bold'>{t('dont_have_any_ads', { ns: 'dashboard' })}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='md:block hidden col-span-2 border-l border-gray-200 pt-5 h-screen sticky top-0'>

                </div>
            </div>
        </>
    )
}
