import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { CgClose} from "react-icons/cg";
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FaLocationDot } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MdAccessTime } from 'react-icons/md';
import Pagination from '@/Components/Pagination';
import FeedbackModal from '@/Components/FeedbackModal';
import { Switch } from 'antd';
import Carousel from '@/Components/Carousel';
import InfoModal from '@/Components/InfoModal';
import { Cascader } from 'antd';
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";

export default function Announcements({ auth, announcements, specializations, errors, cities}) {
    const { t, i18n } = useTranslation();
    const [announcementType, setAnnouncementType] = useState('all');
    const [searchCity, setSearchCity] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [city, setCity] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [isSalary, setIsSalary] = useState(false);
    const [publicTime, setPublicTime] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSpecialization, setSelectedSpecialization] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const { searchKeyword: querySearchKeyword } = usePage().props;

    const { data, setData, get } = useForm({
        searchKeyword: querySearchKeyword || '',
        specialization: '',
        city: '',
        minSalary: '',
        isSalary: false,
    });

    const handleCityChange = (event) => {
        setCity(event.target.value);
        setData('city', event.target.value);
    };

    const handleSpecializationChange = (value) => {
        setSpecialization(value);
        setData('specialization', value[1]);
    };

    const handleMinSalaryChange = (event) => {
        setMinSalary(event.target.value);
        setData('minSalary', event.target.value);
    };

    const handleIsSalaryChange = (checked) => {
        setIsSalary(checked);
        setData('isSalary', checked);
    };

    const handlePublicTimeChange = (value) => {
        setPublicTime(value);
        setData('publicTime', value);
    };

    const handleSearchKeywordChange = (event) => {
        setData('searchKeyword', event.target.value);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const searchKeyword = params.get('searchKeyword');
        const isSalary = params.get('isSalary');
        const city = params.get('city');
        const minSalary = params.get('minSalary');
        const specialization = params.get('specialization');

        if (searchKeyword) {
            setData('searchKeyword', searchKeyword);
            setData('isSalary', isSalary);
            setIsSalary(isSalary);
            setData('city', city);
            setCity(city);
            setData('minSalary', minSalary);
            setMinSalary(minSalary)
            setData('specialization', specialization);
            setSpecialization(specialization);
        }
    }, []);

    const handleSearch = () => {
        get('/announcements', {preserveScroll: true});
    };

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

    const cascaderOptions = specializations.map(category => ({
        value: category.id,
        label: category.name_ru,
        children: category.specialization.map(spec => ({
            value: spec.id,
            label: spec.name_ru
        }))
    }));


    const handleFeedbackSubmit = (feedback) => {
        axios.post('/send-feedback', { feedback }).then((response) => {
            console.log((t('feedback_sent', { ns: 'header' })));
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleAnnouncementTypeChange = (event) => {
        setAnnouncementType(event.target.value);
    };

    const uniqueCities = [...new Set(announcements.data.map(anonce => anonce.city))];

    return (
        <>
            <GuestLayout>
                <Head title="Работа в Казахстане | свежие вакансии и объявления ">
                    <meta name="description" content="Ознакомьтесь с актуальными объявлениями о работе на Жумыстап. Свежие вакансии от ведущих компаний Казахстана. Найдите работу или разместите объявление уже сегодня" />
                </Head>
                <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleFeedbackSubmit} />
                <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} specializations={specializations} />
                <div
                    className='fixed bg-black hidden bg-opacity-50 top-0 left-0 w-full h-screen z-50'
                >
                    <div className='w-[80%] bg-white rounded-lg h-[20%]'>
                    </div>
                </div>
                {isFilterOpen && (
                    <div className='fixed top-0 left-0 w-full h-screen bg-white z-40 px-5 py-7'>
                        <div className='flex w-full items-center'>
                            <div className='text-xl font-bold'>Фильтры</div>
                            <CgClose
                                onClick={() => setIsFilterOpen(false)}
                                className='ml-auto text-2xl inline-block cursor-pointer'
                            />
                        </div>
                        <input
                            type="text"
                            value={data.searchKeyword}
                            onChange={handleSearchKeywordChange}
                            placeholder={t('search_placeholder', { ns: 'announcements' })}
                            className='block mt-5 border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                        />

                        <div className='text-gray-500 mt-5'>Специализация</div>
                        <Cascader
                            options={cascaderOptions}
                            placeholder="Выберите специализацию"
                            onChange={handleSpecializationChange}
                            className="block mt-2 w-full text-base"
                        />

                        <div className='text-gray-500 mt-5'>Регион</div>
                        <select
                            value={city}
                            onChange={handleCityChange}
                            className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                        >
                            <option value="">Выберите город</option>
                            {cities.map((cityName, index) => (
                                <option key={index} value={cityName}>
                                    {cityName}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={minSalary}
                            onChange={handleMinSalaryChange}
                            placeholder='Уровень дохода от'
                            className='block mt-5 border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                        />

                        <div className='mt-5 flex items-center'>
                            <div>Указан доход</div>
                            <Switch className='ml-auto' checked={isSalary} onChange={handleIsSalaryChange} />
                        </div>

                        <div className='bottom-10'>
                            <div onClick={handleSearch} className='w-full bg-blue-600 text-white font-semibold py-2 text-center rounded-lg mt-10 cursor-pointer'>
                                Применить
                            </div>
                        </div>
                    </div>
                )}
                <div className='grid md:grid-cols-7 grid-cols-1'>
                    <div className='col-span-5'>
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
                        <div className='mt-5 flex items-center px-3 md:px-5 md:mb-5 gap-x-2'>
                            <input

                                type="text"
                                value={data.searchKeyword}
                                onChange={handleSearchKeywordChange}
                                placeholder={t('search_placeholder', { ns: 'announcements' })}
                                className='block border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                            />
                            <button
                                className='md:block hidden text-white rounded-lg bg-blue-500 py-2 px-5'
                                onClick={handleSearch}
                            >
                                Найти
                            </button>
                            <button
                                className='md:hidden block text-white text-2xl rounded-lg bg-blue-500 py-2 px-4'
                                onClick={handleSearch}
                            >
                                <IoSearch />
                            </button>
                            <div
                                onClick={() => setIsFilterOpen(true)}
                                className='text-3xl px-2 border-2 rounded-lg text-blue-500 md:hidden border-blue-500 py-1'
                            >
                                <CgArrowsExchangeAltV />
                            </div>
                        </div>

                        <div className='border-b border-gray-200 mt-3'>
                        </div>
                        {announcements.data.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className='block px-5 py-5 border-b hover:bg-gray-100 transition-all duration-150 border-gray-200'>
                                <div className='flex'>
                                    <div className={`flex gap-x-1 ${anonce.city == 'Астана' ? ('text-black'):('text-blue-400')} items-center`}>
                                        <FaLocationDot className='text-sm'/>
                                        <div className='text-[10pt] md:text-sm'>{anonce.city}, {anonce.location}</div>
                                    </div>
                                    <div className='ml-auto md:text-sm text-right text-[10pt] text-gray-500'>
                                        {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.created_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('орналастырылды')}
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
                        <Pagination links={announcements.links} searchKeyword={data.searchKeyword} />
                    </div>
                    <div className='col-span-2 border-l border-gray-200 h-screen sticky top-0 md:block hidden'>
                        <div>
                            <div className='font-bold p-3 text-sm border-b border-gray-200'>Вам могут понравится</div>
                        </div>
                        <div className='flex flex-col md:flex-col'>
                            <select
                                value={announcementType}
                                onChange={handleAnnouncementTypeChange}
                                name="announcementType"
                                className={`block border-b py-4 border-[0px] w-full md:w-auto ${announcementType === 'all' ? 'border-gray-300 text-gray-500' : 'font-bold border-blue-500'}`}
                            >
                                <option value="all">{announcementType === 'all' ? t('annonce_type', { ns: 'announcements' }) : t('annonce_type_default', { ns: 'announcements' })}</option>
                                <option value="vacancy">Вакансия</option>
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
