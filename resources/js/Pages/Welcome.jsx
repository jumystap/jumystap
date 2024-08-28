import React from 'react';
import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useTranslation } from 'react-i18next';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { SiFireship } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Welcome({ auth, employees, freelancers, visits, announcements, top_announcements, urgent_announcements, work_professions, digital_professions }) {
    const { t, i18n } = useTranslation();

    function toDoubleString(value) {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }

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
        <>
            <GuestLayout>
                <Head title="JUMYSTAP – программа возможностей" />
                <div className='grid md:grid-cols-7 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  py-10 mt-5 rounded-lg flex'>
                    <div className='pl-5 pr-5 md:pl-20 my-auto md:col-span-3'>
                        <div className='text-xl text-center md:text-left uppercase mb-2 font-bold text-white'>{t('for_everyone', {ns: 'index'})}</div>
                        <div className='md:flex-row flex flex-col gap-2 md:gap-5 mt-4'>
                            <Link href="/create_announcement" className='px-3 block md:px-5 py-2 text-white md:text-md text-sm rounded-lg border-2 border-white hover:bg-white transition-all duration-150 hover:text-black'>{t('post_ad', { ns: 'carousel' })}</Link>
                            <Link href="/employees" className='px-3 md:px-5 inline-block py-2 text-white md:text-md text-sm rounded-lg border-2 border-white hover:bg-white transition-all duration-150 hover:text-black'>{t('find_employee', { ns: 'carousel' })}</Link>
                            <Link href="/reviews" className='px-3 md:px-5 inline-block py-2 text-white md:text-md text-sm rounded-lg border-2 border-white hover:bg-white transition-all duration-150 hover:text-black'>Оставить отзыв</Link>
                        </div>
                    </div>
                    <div className='md:flex hidden text-white gap-x-10 col-span-4'>
                        <div>
                            <div className='font-bold text-4xl'>1500+</div>
                            <div className='font-light text-sm'>{i18n.language == 'ru' ? ('соискателей и фрилансеров'):('жұмыс іздеушілер мен фрилансерлер')}</div>
                        </div>
                        <div>
                            <div className='font-bold text-4xl'>300+</div>
                            <div className='font-light text-sm'>{i18n.language == 'ru' ? ('вакансий и заказов'):('бос орындар мен тапсырыстар')}</div>
                        </div>
                        <div>
                            <div className='font-bold text-4xl'>100+</div>
                            <div className='font-light text-sm'>{i18n.language == 'ru' ? ('мобилографов'):('мобилограф')}</div>
                        </div>
                        <div>
                            <div className='font-bold text-4xl'>100+</div>
                            <div className='font-light text-sm'>{i18n.language == 'ru' ? ('СММщиков'):('СММ-мамандары')}</div>
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='font-bold border-b-2 border-red-600 py-2 inline-block'>{t('urgent_title', {ns: 'index'})}</div>
                    {urgent_announcements.length > 0 ? (
                    <div className='mt-5 grid grid-cols-1 md:grid-cols-4 gap-5'>
                        {urgent_announcements.map((urgent, key) => (
                            <Link href={`/announcement/${urgent.id}`} key={key} className='hover:border-red-600 transition-all duration-150 border border-gray-300 rounded-lg p-3'>
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
                                    {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(urgent.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('орналастырылды')}
                                </div>
                            </Link>
                        ))}
                    </div>
                    ) : (
                        <div className='text-center'>123123</div>
                    )}
                </div>
                <div className='md:hidden block bg-gradient-to-r p-5 from-blue-500 via-blue-600 to-blue-700 mt-5 rounded-lg md:px-20 md:py-10 text-white'>
                    <div className='font-bold text-lg md:text-3xl'>
                        {i18n.language == 'ru' ?
                        (`Это размещение уже посмотрели ${visits.toLocaleString()} раз`)
                        :
                        (`Бұл орналастыру қазірдің өзінде ${visits.toLocaleString()} рет қаралды`)}
                    </div>
                    <div className='font-light md:text-xl md:mt-3'>{i18n.language == 'ru' ? ('Здесь могла бы быть Ваша реклама') : ('Сіздің жарнамаңыз осында болуы мүмкін')}</div>
                    <div className='flex gap-x-5 mt-3 items-center'>
                        <a
                            href="tel:87072213131"
                            className='px-3 md:text-base block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-blue-500 hover:bg-white transition-all duration-150 hover:text-black'
                        >
                            {i18n.language == 'ru' ? ('Связаться'):('Байланысу')}
                        </a>
                        <Link
                            className='block text-white text-sm font-light md:text-base'
                        >
                            {i18n.language == 'ru' ? ('Подробнее'):('Толығырақ')}
                        </Link>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='font-bold border-b-2 border-blue-500 py-2 inline-block'>{t('top_title', {ns: 'index'})}</div>
                    {top_announcements.length > 0 ? (
                    <div className='mt-5 grid grid-cols-1 md:grid-cols-4 gap-5'>
                        {top_announcements.map((top, key) => (
                            <Link href={`/announcement/${top.id}`} key={key} className='hover:border-blue-500 transition-all duration-150 border border-gray-300 rounded-lg p-3'>
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
                                    {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(top.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('орналастырылды')}
                                </div>
                            </Link>
                        ))}
                    </div>
                    ) : (
                        <div className='text-center'>123123</div>
                    )}
                </div>
                <div className='hidden md:block bg-gradient-to-r p-5 from-blue-500 via-blue-600 to-blue-700 mt-5 rounded-lg md:px-20 md:py-10 text-white'>
                    <div className='font-bold text-lg md:text-3xl'>
                        {i18n.language == 'ru' ?
                        (`Это размещение уже посмотрели ${visits.toLocaleString()} раз`)
                        :
                        (`Бұл орналастыру қазірдің өзінде ${visits.toLocaleString()} рет қаралды`)}
                    </div>
                    <div className='font-light md:text-xl md:mt-3'>{i18n.language == 'ru' ? ('Здесь могла бы быть Ваша реклама') : ('Сіздің жарнамаңыз осында болуы мүмкін')}</div>
                    <div className='flex gap-x-5 mt-3 items-center'>
                        <a
                            href="tel:87072213131"
                            className='px-3 md:text-base block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-blue-500 hover:bg-white transition-all duration-150 hover:text-black'
                        >
                            {i18n.language == 'ru' ? ('Связаться'):('Байланысу')}
                        </a>
                        <Link
                            className='block text-white text-sm font-light md:text-base'
                        >
                            {i18n.language == 'ru' ? ('Подробнее'):('Толығырақ')}
                        </Link>
                    </div>
                </div>
                <div className='md:hidden block bg-gradient-to-r p-5 from-orange-500 via-orange-600 to-orange-700 mt-5 rounded-lg text-white'>
                    <div className='font-bold text-lg'>{t('banner_2', {ns: 'index'})}</div>
                    <div className='flex gap-x-3 mt-3'>
                        <Link href="/create_announcement" className='px-3 block md:px-5 py-2 font-bold md:text-md text-xs rounded-lg bg-white text-orange-500 hover:bg-white transition-all duration-150 hover:text-black'>{t('post_ad', { ns: 'carousel' })}</Link>
                        <Link href="/employees" className='px-3 md:px-5 inline-block py-2 text-white md:text-md text-xs rounded-lg border border-white hover:bg-white transition-all duration-150 hover:text-black'>{t('find_employee', { ns: 'carousel' })}</Link>
                    </div>
                </div>
                <div className='mt-5 w-full'>
                    <div className='font-bold border-b-2 border-orange-500 py-2 inline-block'>{t('relevant_title', {ns: 'index'})}</div>
                    {announcements.length > 0 ? (
                    <div className='mt-5 grid grid-cols-1 md:grid-cols-4 gap-5'>
                        {announcements.map((anonce, key) => (
                            <Link href={`/announcement/${anonce.id}`} key={key} className='hover:border-orange-500 transition-all duration-150 border border-gray-300 rounded-lg p-3'>
                                <div className='flex items-center'>
                                    <div className='text-[8pt] font-bold text-white py-1 px-2 rounded bg-[#f36706] '>
                                        {i18n.language == 'ru' ? (
                                            anonce.type_ru.toUpperCase()
                                        ) : (
                                            anonce.type_kz.toUpperCase()
                                        )}
                                    </div>
                                    <div className='font-bold text-sm ml-auto'>
                                        {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                        {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'undefined' && (`Договорная`)}

                                    </div>
                                </div>
                                <div className='mt-3 text-[11pt]'>
                                    {anonce.title}
                                </div>
                                <div className='flex mt-2 text-gray-500 gap-x-1 font-light items-center text-sm'>
                                    <FaLocationDot className='text-orange-500' />
                                    {anonce.city}
                                </div>
                                <div className='text-sm font-light text-gray-500'>
                                    {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('орналастырылды')}
                                </div>
                            </Link>
                        ))}
                    </div>
                    ) : (
                        <div className='text-center'>123123</div>
                    )}
                    <div className='flex mt-5'>
                        <Link href='/announcements' className='items-center gap-x-2 mx-auto text-white font-bold rounded-lg text-center flex py-2 px-5 bg-orange-500'>
                            {t('show_more', {ns: 'index'})}
                            <IoArrowForwardCircleOutline className='text-2xl my-auto'/>
                        </Link>
                    </div>
                </div>
                <div className='mt-10'>
                    <div className='text-center font-bold mt-5'>{t('more', { ns: 'index'})}</div>
                    <div className='flex'>
                        <div className='mx-auto'>
                            <div className='border-[#f36706] border-2 px-10 rounded-lg mt-5 py-2 font-bold'>{work_professions.length} {t('work_skills', { ns: 'index'})}</div>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-3 gap-5 mt-7'>
                        {work_professions.map((work, index) => (
                            <Link href={`/profession/${work.group.name}#${work.id}`} key={index} className='flex gap-5 w-full py-3 border border-gray-300 px-5 rounded-lg items-center hover:border-[#f36706] transition-all duration-150'>
                                <img src={`/storage/${work.icon_url}`} className="w-[30px] h-[30px]" alt="" />
                                <div>
                                    {i18n.language == 'ru' ? (
                                        work.name_ru
                                    ) : (
                                        work.name_kz
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className='flex mt-5'>
                        <div className='mx-auto'>
                            <div className='border-[#f36706] border-2 px-10 rounded-lg mt-5 py-2 font-bold'>{digital_professions.length} {t('digital_skills', { ns: 'index'})}</div>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-3 gap-5 mt-7'>
                        {digital_professions.map((digital, index) => (
                            <Link href={`/profession/${digital.group.name}#${digital.id}`} key={index} className='flex gap-5 w-full py-3 border border-gray-300 px-5 rounded-lg items-center hover:border-[#f36706] transition-all duration-150'>
                                <img src={`/storage/${digital.icon_url}`} className="w-[30px] h-[30px]" alt="" />
                                <div>
                                    {i18n.language == 'ru' ? (
                                        digital.name_ru
                                    ) : (
                                        digital.name_kz
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}
