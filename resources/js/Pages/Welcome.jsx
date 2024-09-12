import React from 'react';
import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useTranslation } from 'react-i18next';
import { SiFireship } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MdAccessTime } from 'react-icons/md';
import Pagination from '@/Components/Pagination';

export default function Welcome({ auth, employees, freelancers, visits, announcements, top_announcements, urgent_announcements, work_professions, digital_professions }) {
    const { t, i18n } = useTranslation();

    function toDoubleString(value) {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }

    console.log(announcements);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
    };

    const kz = {
        ...ru,
        formatDistance: (token, count, options) => {
            const formatDistanceLocale = {
                lessThanXSeconds: {
                    one: '1 секунд',
                    other: 'Секунд',
                },
                xSeconds: {
                    one: '1 секунд',
                    other: '{{count}} секунд',
                },
                halfAMinute: 'жарты минут',
                lessThanXMinutes: {
                    one: 'Бірнеше минут',
                    other: 'Минут',
                },
                xMinutes: {
                    one: '1 минут',
                    other: '{{count}} минут',
                },
                aboutXHours: {
                    one: 'Шамамен 1 сағат',
                    other: 'Шамамен {{count}} сағат',
                },
                xHours: {
                    one: '1 сағат',
                    other: '{{count}} сағат',
                },
                xDays: {
                    one: '1 күн',
                    other: '{{count}} күн',
                },
                aboutXWeeks: {
                    one: 'Шамамен 1 апта',
                    other: 'Шамамен {{count}} апта',
                },
                xWeeks: {
                    one: '1 апта',
                    other: '{{count}} апта',
                },
                aboutXMonths: {
                    one: 'Шамамен 1 ай',
                    other: 'Шамамен {{count}} ай',
                },
                xMonths: {
                    one: '1 ай',
                    other: '{{count}} ай',
                },
                aboutXYears: {
                    one: 'Шамамен 1 жыл',
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
        <>
            <GuestLayout>
                <Head title="Работа и вакансии в Казахстане | Биржа труда - Жумыстап">
                    <meta name="description" content="Жумыстап – биржа труда в Казахстане. Удобный поиск работы и вакансий, размещение резюме. Тысячи актуальных предложений для соискателей и работодателей" />
                </Head>
                <div className='grid md:grid-cols-7 grid-cols-1'>
                    <div className='col-span-5'>
                        <div className='flex border-b md:sticky md:top-0 bg-white bg-opacity-50 backdrop-blur-md border-gray-200'>
                            <div className='cursor-pointer hover:bg-gray-100 transition-all duration-150 font-semibold p-4 border-b-2 text-sm border-blue-500'>Вакансии для вас</div>
                            <div className='cursor-pointer hover:bg-gray-100 transition-all duration-150 font-semibold p-4 text-gray-500 text-sm'>Вакансии дня</div>
                        </div>
                        <div className='block bg-gradient-to-r md:mx-5 mx-3 p-5 from-blue-500 via-blue-600 to-blue-700 mt-2 rounded-lg md:px-10 md:py-7 text-white'>
                            <div className='font-bold text-lg md:text-2xl'>
                                {i18n.language == 'ru' ?
                                (`Это размещение уже посмотрели ${visits.toLocaleString()} раз`)
                                :
                                (`Бұл орналастыру қазірдің өзінде ${visits.toLocaleString()} рет қаралды`)}
                            </div>
                            <div className='font-light md:text-lg md:mt-3'>{i18n.language == 'ru' ? ('Здесь могла бы быть Ваша реклама') : ('Сіздің жарнамаңыз осында болуы мүмкін')}</div>
                            <div className='flex gap-x-5 mt-3 items-center'>
                                <a
                                    href="tel:87072213131"
                                    className='px-3 md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-blue-500 hover:bg-white transition-all duration-150 hover:text-black'
                                >
                                    {i18n.language == 'ru' ? ('Связаться'):('Байланысу')}
                                </a>
                                <Link
                                    className='block text-white text-sm font-light md:text-sm'
                                >
                                    {i18n.language == 'ru' ? ('Подробнее'):('Толығырақ')}
                                </Link>
                            </div>
                        </div>
                        <div className='border-b border-gray-200 mt-5'>
                        </div>
                        {announcements.data.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200'>
                                <div className='flex'>
                                    <div className='flex gap-x-1 text-blue-400 items-center'>
                                        <FaLocationDot className='text-sm'/>
                                        <div className='text-sm'>{anonce.city}, {anonce.location}</div>
                                    </div>
                                    <div className='ml-auto text-sm text-right text-gray-500'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                    </div>
                                </div>
                                <div className='mt-7 text-lg font-bold'>
                                    {anonce.title}
                                </div>
                                <div className='flex mt-4 gap-x-3 items-center'>
                                    <div className='md:text-xl text-lg font-regular'>
                                        {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                        {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'undefined' && (`Договорная`)}
                                    </div>
                                </div>
                                <div className='mt-4 text-sm text-gray-500 font-light'>
                                    {anonce.description.length > 60 ? anonce.description.substring(0, 90) + '...' : anonce.description}
                                </div>
                                <div className='flex gap-x-1 items-center mt-4'>
                                    <MdAccessTime className='text-xl'/>
                                    <div className='text-sm'>График работы: {anonce.work_time}</div>
                                </div>
                            </Link>
                        ))}
                        <Pagination links={announcements.links} />
                    </div>
                    <div className='col-span-2 border-l md:block hidden border-gray-200 h-screen sticky top-0'>
                        <div>
                            <div className='font-bold p-3 text-sm border-b border-gray-200'>Вам могут понравиться</div>
                            {urgent_announcements.map((urgent, key) => (
                                <Link href={`/announcement/${urgent.id}`} key={key} className='block hover:bg-gray-100 transition-all duration-150 border-b border-gray-200 p-3'>
                                    <div className='flex items-center'>
                                        <div className='uppercase text-white text-xs px-2 bg-red-600 font-bold rounded'>{t('urgent', {ns: 'index'})}</div>
                                        <div className='flex items-center font-bold gap-x-2 text-sm ml-auto'>
                                            <SiFireship className='text-red-600 text-lg' />
                                            {urgent.salary_type == 'exact' && urgent.cost && (`${urgent.cost.toLocaleString() } ₸ `)}
                                            {urgent.salary_type == 'min' && (`от ${urgent.cost_min.toLocaleString()} ₸ `)}
                                            {urgent.salary_type == 'max' && (`до ${urgent.cost_max.toLocaleString()} ₸ `)}
                                            {urgent.salary_type == 'undefined' && (`Договорная`)}
                                        </div>
                                    </div>
                                    <div className='mt-3 text-[11pt] max-w-[400px]'>
                                        {urgent.title}
                                    </div>
                                    <div className='flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm'>
                                        <FaLocationDot className='text-red-600' />
                                        {urgent.city}
                                    </div>
                                    <div className='text-sm font-light text-gray-500'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(urgent.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                    </div>
                                </Link>
                            ))}
                            {top_announcements.map((top, key) => (
                                <Link href={`/announcement/${top.id}`} key={key} className='block hover:bg-gray-100 transition-all duration-150 border-b border-gray-200 p-3'>
                                    <div className='flex items-center'>
                                        <div className='uppercase text-white text-xs px-2 bg-blue-500 font-bold rounded'>{t('top', {ns: 'index'})}</div>
                                        <div className='flex gap-x-2 items-center font-bold text-sm ml-auto'>
                                            <FaStar className='text-blue-500 text-lg'/>
                                            {top.salary_type == 'exact' && top.cost && (`${top.cost.toLocaleString() } ₸ `)}
                                            {top.salary_type == 'min' && (`от ${top.cost_min.toLocaleString()} ₸ `)}
                                            {top.salary_type == 'max' && (`до ${top.cost_max.toLocaleString()} ₸ `)}
                                            {top.salary_type == 'undefined' && (`Договорная`)}
                                        </div>
                                    </div>
                                    <div className='mt-3 text-[11pt] max-w-[400px]'>
                                        {top.title}
                                    </div>
                                    <div className='flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm'>
                                        <FaLocationDot className='text-blue-500' />
                                        {top.city}
                                    </div>
                                    <div className='text-sm font-light text-gray-500'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(top.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}
