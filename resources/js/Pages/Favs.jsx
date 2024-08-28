import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { Link } from '@inertiajs/react';
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Favs({ auth, announcements, errors }) {
    const { t, i18n } = useTranslation();
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
                <div className='text-2xl font-bold mt-10'>
                    Объявления которые вам понравились
                </div>
                <div className='flex flex-col md:flex-row gap-5 mt-5'>
                    <select
                        value={announcementType}
                        onChange={handleAnnouncementTypeChange}
                        name="announcementType"
                        className={`block border rounded-lg w-full md:w-auto ${announcementType === 'all' ? 'border-gray-300 text-gray-500' : 'font-bold border-[#f36706]'}`}
                    >
                        <option value="all">{announcementType === 'all' ? t('annonce_type', { ns: 'announcements' }) : t('annonce_type_default', { ns: 'announcements' })}</option>
                        <option value="vacancy">Вакансия</option>
                        <option value="project">{t('project', { ns: 'announcements' })}</option>
                    </select>

                    <select
                        value={searchCity}
                        onChange={handleCityChange}
                        name="searchCity"
                        className='block border rounded-lg w-full md:w-auto border-gray-300 text-gray-500'
                    >
                        <option value="">{t('all_cities', { ns: 'announcements' })}</option>
                        {uniqueCities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={handleSearchKeywordChange}
                        placeholder={t('search_placeholder', { ns: 'announcements' })}
                        className='block border rounded-lg w-full md:w-full border-gray-300 text-gray-500 p-2'
                    />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
                    {filteredAnnouncements.map((anonce, index) => (
                        <Link href={`/announcement/${anonce.id}`} key={index} className='p-3 border hover:border-orange-500 transition-all duration-150 block border-gray-300 rounded-lg'>
                            <div className='flex items-center'>
                                <div className='text-[8pt] font-bold text-white py-1 px-2 rounded bg-[#f36706] '>
                                    {i18n.language === 'ru' ? anonce.type_ru.toUpperCase() : anonce.type_kz.toUpperCase()}
                                </div>
                                <div className='font-bold text-sm ml-auto'>
                                    {anonce.cost.toLocaleString()} ₸
                                </div>
                            </div>
                            <div className='mt-3 text-[10pt]'>
                                {anonce.title}
                            </div>
                            <div className='mt-2 flex gap-x-1 text-gray-500 font-light items-center text-sm'>
                                <FaLocationDot className='text-orange-500' />
                                {anonce.city}
                            </div>
                            <div className='text-sm font-light text-gray-500'>
                                {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('орналастырылды')}
                            </div>
                        </Link>
                    ))}
                </div>
            </GuestLayout>
        </>
    );
}

