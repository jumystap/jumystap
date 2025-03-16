import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { Link } from '@inertiajs/react';
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MdAccessTime } from 'react-icons/md';

export default function Favs({ auth, announcements, errors }) {
    const { t, i18n } = useTranslation('announcements');
    const [announcementType, setAnnouncementType] = useState('all');
    const [searchCity, setSearchCity] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

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

    const handleAnnouncementTypeChange = (event) => {
        setAnnouncementType(event.target.value);
    };

    const handleCityChange = (event) => {
        setSearchCity(event.target.value);
    };

    const handleSearchKeywordChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const sortedAnnouncements = announcements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const uniqueCities = [...new Set(announcements.map(anonce => anonce.city))];

    const filteredAnnouncements = sortedAnnouncements.filter((anonce) => {
        const announcementTypeMatches = (announcementType === 'all') ||
                                        (announcementType === 'vacancy' && anonce.type_ru === 'Вакансия') ||
                                        (announcementType === 'project' && anonce.type_ru === 'Заказ');

        const cityMatches = searchCity === '' || anonce.city === searchCity;

        const keywordMatches = searchKeyword === '' ||
                               anonce.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                               anonce.description?.toLowerCase().includes(searchKeyword.toLowerCase());

        return announcementTypeMatches && cityMatches && keywordMatches;
    });

    return (
        <>
            <GuestLayout>
                <div className='grid grid-cols-1 md:grid-cols-7'>
                    <div className='col-span-5'>
                        <div className='mt-5'>
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={handleSearchKeywordChange}
                                placeholder={t('search')}
                                className='block border-y w-full border-[0px] text-xl border-gray-300 text-gray-500 px-5 p-2'
                            />
                        </div>
                        {announcements.length == 0 && (
                            <div className='flex flex-col w-full py-10'>
                                <div className='text-center text-gray-500'>{t('no_favorite_jobs')}</div>
                                <Link href='/announcements' className='mx-auto mt-3 px-7 text-center inline-block py-2 bg-blue-500 text-white rounded-lg'>{t('add')}</Link>
                            </div>
                        )}
                        {filteredAnnouncements.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200'>
                                <div className='flex'>
                                    <div className='flex gap-x-1 text-blue-400 items-center'>
                                        <FaLocationDot className='text-sm'/>
                                        <div className='text-sm'>{anonce.city}, {anonce.location}</div>
                                    </div>
                                    <div className='ml-auto text-sm text-gray-500'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('орналастырылды')}
                                    </div>
                                </div>
                                <div className='mt-7 text-lg font-bold'>
                                    {anonce.title}
                                </div>
                                <div className='flex mt-4 gap-x-3 items-center'>
                                    <div className='text-xl font-regular'>
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
                                    <div className='flex gap-x-2 mt-2'>
                                        <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                                            {anonce.experience}
                                        </div>
                                        <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                                            {anonce.work_time}
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4 text-sm text-gray-500 font-light'>
                                    {anonce.description}
                                </div>
                                <div className='flex gap-x-1 items-center mt-4'>
                                    <MdAccessTime className='text-xl'/>
                                    <div className='text-sm'>{t('work_schedule')}: {anonce.work_time}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className='col-span-2 md:block hidden border-l border-gray-200 h-screen sticky top-0'>
                        <div>
                            <div className='font-bold p-3 text-sm border-b border-gray-200'>{t('you_may_like')}</div>
                        </div>
                        <div className='flex flex-col md:flex-col'>
                            <select
                                value={announcementType}
                                onChange={handleAnnouncementTypeChange}
                                name="announcementType"
                                className={`block border-b py-4 border-[0px] w-full md:w-auto ${announcementType === 'all' ? 'border-gray-300 text-gray-500' : 'font-bold border-blue-500'}`}
                            >
                                <option value="all">{announcementType === 'all' ? t('annonce_type', { ns: 'announcements' }) : t('annonce_type_default', { ns: 'announcements' })}</option>
                                <option value="vacancy">{t('job')}</option>
                                <option value="project">{t('project', { ns: 'announcements' })}</option>
                            </select>

                            <select
                                value={searchCity}
                                onChange={handleCityChange}
                                name="searchCity"
                                className='block border-b py-4 border-[0px] w-full md:w-auto border-gray-300 text-gray-500'
                            >
                                <option value="">{t('all_cities', { ns: 'announcements' })}</option>
                                {uniqueCities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}

