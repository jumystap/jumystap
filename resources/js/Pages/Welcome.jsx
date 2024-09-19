import React, {useState} from 'react';
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
import FeedbackModal from '@/Components/FeedbackModal';
import Carousel from '@/Components/Carousel';
import InfoModal from '@/Components/InfoModal';

export default function Welcome({ specializations, auth, employees, freelancers, visits, announcements, top_announcements, urgent_announcements, work_professions, digital_professions }) {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

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


    console.log(announcements);
    const handleFeedbackSubmit = (feedback) => {
        axios.post('/send-feedback', { feedback }).then((response) => {
            console.log((t('feedback_sent', { ns: 'header' })));
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <>
            <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleFeedbackSubmit}/>
            <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} specializations={specializations}/>
            <GuestLayout>
                <Head title="Работа и вакансии в Казахстане | Биржа труда - Жумыстап">
                    <meta name="description" content="Жумыстап – биржа труда в Казахстане. Удобный поиск работы и вакансий, размещение резюме. Тысячи актуальных предложений для соискателей и работодателей" />
                </Head>
                <div className='grid md:grid-cols-7 grid-cols-1 z-20'>
                    <div className='col-span-5'>
                        <div className='flex border-b md:sticky md:top-0 bg-white bg-opacity-50 backdrop-blur-md border-gray-200'>
                            <div className='cursor-pointer hover:bg-gray-100 transition-all duration-150 font-semibold p-4 border-b-2 text-sm border-blue-500'>Вакансии для вас</div>
                            <div className='cursor-pointer hover:bg-gray-100 transition-all duration-150 font-semibold p-4 text-gray-500 text-sm'>Вакансии дня</div>
                        </div>
                        <Carousel>
                        <div className='block flex bg-gradient-to-r md:mx-5 mx-3 p-5 from-orange-500 via-orange-700 to-orange-800 mt-2 rounded-lg md:px-10 md:py-7 text-white'>
                            <div>
                                <div className='font-bold text-lg md:text-2xl'>
                                    {i18n.language == 'ru' ?
                                        (`Пройди бесплатное обучение`)
                                    :
                                        (`Пройди бесплатное обучение `)
                                    }
                                </div>
                                <div className='font-light md:text-lg md:mt-3'>{i18n.language == 'ru' ? ('по рабочим профессиям') : ('по рабочим профессиям')}</div>
                                <div className='flex gap-x-5 mt-3 items-center'>
                                    <div
                                        onClick={() => setIsOpen(true)}
                                        className='px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-orange-500 hover:bg-white transition-all duration-150 hover:text-black'
                                    >
                                        {i18n.language == 'ru' ? ('Оставить заявку'):('Оставить заявку')}
                                    </div>
                                    <a
                                        href='https://www.instagram.com/joltap.kz'
                                        className='block text-white text-sm font-light md:text-sm'
                                    >
                                        {i18n.language == 'ru' ? ('Подробнее'):('Толығырақ')}
                                    </a>
                                </div>
                            </div>
                            <div className='ml-auto pt-2'>
                                <img src='/images/joltap.png' className='md:w-[200px] w-[120px]' />
                            </div>
                        </div>
                        <div
                        className='mx-3 md:mx-5 md:px-10 px-4 py-7 bg-gradient-to-r from-blue-500 to-blue-800  mt-2 rounded-lg'
                        >
                            <div className='font-semibold text-lg md:text-xl text-white'>Подбери вакансии для себя!</div>
                            <div className='font-light mt-2 text-white'>Заполни анкету и найди подходящие вакансии</div>
                            {auth.user ? (
                                <div
                                    className='text-blue-500 px-10 py-2 text-sm mt-4 cursor-pointer bg-white rounded-lg font-bold inline-block'
                                    onClick={() => setIsInfoOpen(true)}
                                >
                                    Заполнить
                                </div>
                            ):(
                                <Link
                                    className='text-blue-500 px-10 py-2 text-sm mt-4 cursor-pointer bg-white rounded-lg font-bold inline-block'
                                    href='/login'
                                >
                                    Заполнить
                                </Link>
                            )}
                        </div>
                        </Carousel>
                        <div className='border-b border-gray-200 mt-5'>
                        </div>
                        {urgent_announcements.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200 md:hidden block'>
                                <div className='flex items-center'>
                                    <div className='flex gap-x-1 text-blue-400 items-center'>
                                        <div className='text-white bg-red-600 font-bold text-xs py-1 px-2 rounded'>СРОЧНО</div>
                                    </div>
                                    <div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500 flex items-center'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                    </div>
                                </div>
                                <div className='md:mt-7 mt-5 text-lg font-bold'>
                                    {anonce.title}
                                </div>
                                <div className='flex md:mt-4 mt-2  gap-x-1 items-center'>
                                    <SiFireship className='text-red-600 text-lg' />
                                    <div className='md:text-xl text-lg font-regular'>
                                        {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                        {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'undefined' && (`Договорная`)}
                                    </div>
                                </div>
                                <div className='md:mt-4 mt-2 text-sm text-gray-500 font-light'>
                                    {anonce.description.length > 60 ? anonce.description.substring(0, 90) + '...' : anonce.description}
                                </div>
                                <div className='flex gap-x-1 items-center mt-4'>
                                    <MdAccessTime className='text-xl'/>
                                    <div className='text-sm'>График работы: {anonce.work_time}</div>
                                </div>
                            </Link>
                        ))}
                        {top_announcements.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200 md:hidden'>
                                <div className='flex'>
                                    <div className='flex gap-x-1 text-blue-400 items-center'>
                                        <div className='text-white bg-blue-500 font-bold text-xs py-1 px-3 rounded'>ТОП</div>
                                    </div>
                                    <div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                    </div>
                                </div>
                                <div className='md:mt-7 mt-5 text-lg font-bold'>
                                    {anonce.title}
                                </div>
                                <div className='flex md:mt-4 mt-2 gap-x-1 items-center'>
                                    <FaStar className='text-blue-500 text-lg'/>
                                    <div className='md:text-xl text-lg font-regular'>
                                        {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                        {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'undefined' && (`Договорная`)}
                                    </div>
                                </div>
                                <div className='md:mt-4 mt-2 text-sm text-gray-500 font-light'>
                                    {anonce.description.length > 60 ? anonce.description.substring(0, 90) + '...' : anonce.description}
                                </div>
                                <div className='flex gap-x-1 items-center mt-4'>
                                    <MdAccessTime className='text-xl'/>
                                    <div className='text-sm'>График работы: {anonce.work_time}</div>
                                </div>
                            </Link>
                        ))}
                        {announcements.data.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className={`block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200`}>
                                <div className='flex'>
                                    <div className={`flex gap-x-1 ${anonce.city == 'Астана' ? ('text-black'):('text-blue-400')} items-center`}>
                                        <FaLocationDot className='text-sm'/>
                                        <div className='text-[10pt] md:text-sm'>{anonce.city}, {anonce.location}</div>
                                    </div>
                                    <div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}
                                    </div>
                                </div>
                                <div className='md:mt-7 mt-5 text-lg font-bold'>
                                    {anonce.title}
                                </div>
                                <div className='flex md:mt-4 mt-2 gap-x-3 items-center'>
                                    <div className='md:text-xl text-lg font-regular'>
                                        {anonce.salary_type == 'exact' && anonce.cost && (`${anonce.cost.toLocaleString() } ₸ `)}
                                        {anonce.salary_type == 'min' && (`от ${anonce.cost_min.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'max' && (`до ${anonce.cost_max.toLocaleString()} ₸ `)}
                                        {anonce.salary_type == 'undefined' && (`Договорная`)}
                                    </div>
                                </div>
                                <div className='md:mt-4 mt-2 text-sm text-gray-500 font-light'>
                                    {anonce.description.length > 60 ? anonce.description.substring(0, 90) + '...' : anonce.description}
                                </div>
                                <div className='flex gap-x-1 items-center mt-4'>
                                    <MdAccessTime className='text-xl'/>
                                    <div className='text-sm'>График работы: {anonce.work_time}</div>
                                </div>
                            </Link>
                        ))}
                        <Pagination links={announcements.links} />
                        <div className='pb-10'>
                            <div className='flex mt-5'>
                                <div className='mx-auto'>
                                    <div className='border-orange-500 text-orange-500 border px-10 rounded-lg py-2 font-light'>{work_professions.length} {t('work_skills', { ns: 'index'})}</div>
                                </div>
                            </div>
                            <div className='grid px-5 md:grid-cols-2 gap-5 mt-7'>
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
                                    <div className='border-orange-500 border px-10 text-orange-500 rounded-lg mt-5 py-2 font-light'>{digital_professions.length} {t('digital_skills', { ns: 'index'})}</div>
                                </div>
                            </div>
                            <div className='grid px-5 md:grid-cols-2 gap-5 mt-7'>
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
