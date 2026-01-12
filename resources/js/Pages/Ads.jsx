import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { CgClose } from "react-icons/cg";
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Pagination from '@/Components/Pagination';
import { Switch, Select } from 'antd'; // Import Select from Ant Design
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { MdIosShare } from "react-icons/md";

const { Option } = Select;

export default function Ads({auth, ads, types, categories, cities }) {
    const { t, i18n } = useTranslation();
    const [adType, setAdType] = useState('all');
    const [type, setTypeId] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [city_id, setCityId] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { keyword: queryKeyword } = usePage().props;

    // const cityArray = Object.entries(cities).map(([id, title]) => ({ id, title }));
    // const typeArray = Object.entries(types).map(([value, label]) => ({ value, label }));

    const { data, setData, get } = useForm({
        keyword: queryKeyword || '',
        type: '',
        category_id: '',
        city_id: '',
    });

    const handleTypeChange = (event) => {
        setTypeId(event.target.value);
        setData('type', event.target.value);
    };
    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
        setData('category_id', event.target.value);
    };
    const handleCityChange = (event) => {
        setCityId(event.target.value);
        setData('city_id', event.target.value);
    };



    const handleShare = (id) => {
        const url = `https://jumystap.kz/ads/${id}`;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this announcement',
                url: url,
            }).then(() => {
                console.log('Share was successful.');
            }).catch((error) => {
                console.error('Sharing failed:', error);
            });
        } else {
            alert(`Share this link: ${url}`);
        }
    };

    const handleKeywordChange = (event) => {
        setData('keyword', event.target.value);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get('keyword');
        const city_id = params.get('city_id');

        if (keyword || city_id) {
            setData({
                keyword: keyword || '',
                city_id: city_id || '',
            });
            setCityId(city_id || '');
        }
    }, []);

    const handleSearch = () => {
        setIsFilterOpen(false)
        get('/ads', { preserveScroll: true, preserveState: true });
    };

    const resetSearch = () => {
        setData({
            keyword: '',
            category_id: '',
            city_id: '',
        });
        setAdType('all');
        setCategoryId('');
        setCityId('');
        get('/ads', {
            preserveScroll: true,
            preserveState: true
        });
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


    return (
        <>
            <GuestLayout>
                <Head title="Работа в Казахстане | свежие вакансии и объявления ">
                    <meta name="description" content="Ознакомьтесь с актуальными объявлениями о работе на Жумыстап. Свежие вакансии от ведущих компаний Казахстана. Найдите работу или разместите объявление уже сегодня" />
                </Head>
                <div className='fixed bg-black hidden bg-opacity-50 top-0 left-0 w-full h-screen z-50'>
                    <div className='w-[80%] bg-white rounded-lg h-[20%]'></div>
                </div>
                {/* Mobile Filter Modal */}
                {isFilterOpen && (
                    <div className='fixed top-0 left-0 w-full h-screen bg-white z-40 px-5 py-7'>
                        <div className='flex w-full items-center'>
                            <div className='text-xl font-bold'>{t('filters', { ns: 'announcements' })}</div>
                            <CgClose
                                onClick={() => setIsFilterOpen(false)}
                                className='ml-auto text-2xl inline-block cursor-pointer'
                            />
                        </div>
                        <input
                            type="text"
                            value={data.keyword}
                            onChange={handleKeywordChange}
                            placeholder={t('search', { ns: 'announcements' })}
                            className='block mt-5 border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                        />

                        <div className='text-gray-500 mt-5'>{t('type', { ns: 'announcements' })}</div>
                        <select
                            value={type}
                            onChange={handleTypeChange}
                            className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                        >
                            <option value="">{t('select_type', { ns: 'announcements' })}</option>
                            {types.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        <div className='text-gray-500 mt-5'>{t('category', { ns: 'announcements' })}</div>
                        <select
                            value={category_id}
                            onChange={handleCategoryChange}
                            className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                        >
                            <option value="">{t('select_category', { ns: 'announcements' })}</option>
                            {Object.entries(categories).map(([id, title]) => (
                                <option key={id} value={id}>
                                    {title}
                                </option>
                            ))}
                        </select>

                        <div className='text-gray-500 mt-5'>{t('region', { ns: 'announcements' })}</div>
                        <select
                            value={city_id}
                            onChange={handleCityChange}
                            className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                        >
                            <option value="">{t('select_city', { ns: 'announcements' })}</option>
                            {Object.entries(cities).map(([id, title]) => (
                                <option key={id} value={id}>
                                    {title}
                                </option>
                            ))}
                        </select>

                        <div className='bottom-10'>
                            <div onClick={handleSearch} className='w-full bg-blue-600 text-white font-semibold py-2 text-center rounded-lg mt-10 cursor-pointer'>
                                {t('apply', { ns: 'announcements' })}
                            </div>
                            <div onClick={resetSearch} className='w-full text-blue-500 border-2 border-blue-500 font-semibold py-2 text-center rounded-lg mt-2 cursor-pointer'>
                                {t('reset', { ns: 'announcements' })}
                            </div>
                        </div>
                    </div>
                )}
                <div className='grid md:grid-cols-7 grid-cols-1'>
                    <div className='col-span-5'>
                        <div className='mt-5 flex items-center px-3 md:px-5 md:mb-5 gap-x-2'>
                            <input
                                type="text"
                                value={data.keyword}
                                onChange={handleKeywordChange}
                                placeholder={t('search', { ns: 'announcements' })}
                                className='block border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                            />
                            <button
                                className='md:block hidden text-white rounded-lg bg-blue-500 py-2 px-5'
                                onClick={handleSearch}
                            >
                                {t('search', { ns: 'announcements' })}
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
                        {ads.data.map((ad, index) => (
                            <Link href={`/ad/${ad.id}`} key={index} className={`block px-5 py-5 border rounded-lg hover:border-blue-500 transition-all duration-150 border-gray-200 md:mx-5 mx-3 mt-3`}>
                                <div className='flex items-center'>
                                    <div className={`flex gap-x-1 ${ad.city.title == 'Астана' ? ('text-blue-400'):('text-gray-400')} items-center`}>
                                        <CiLocationOn />
                                        <div className='text-[10pt] md:text-sm'>{ad.city.title}</div>
                                        {ad.is_remote ? (
                                            <>
                                                <div className='text-[10pt] md:text-sm ml-10'>Удаленно</div>
                                            </>
                                        ) : ('')}
                                    </div>
                                    <div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500'>
                                        {i18n.language == 'ru' ? ('Изменено') : ('')} {`${formatDistanceToNow(new Date(ad.updated_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('өзгертілді')}
                                    </div>
                                </div>
                                <div className='mt-5 text-lg font-bold'>
                                    {ad.title}
                                </div>
                                <div className='flex md:mt-2 mt-2 gap-x-3 items-center'>
                                    <div className='md:text-xl text-xl font-regular'>
                                        {ad.price_type === "exact" &&
                                            ad.price_exact &&
                                            `${ad.price_exact.toLocaleString()} ₸ `}
                                        {ad.price_type === "range" &&
                                            ad.price_from &&
                                            ad.price_to &&
                                            `${i18n?.language === "ru" ? "от " + ad.price_from.toLocaleString() + " ₸ до " + ad.price_to.toLocaleString() + " ₸" :
                                                ad.price_from.toLocaleString() + " ₸ бастап " + ad.price_to.toLocaleString() + " ₸ дейін"}`
                                        }
                                        {ad.price_type === "negotiable" && t("negotiable", { ns: "index" })}
                                    </div>
                                </div>
                                <div className='flex gap-x-2 mt-2'>
                                    <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                                        {ad.category.name_ru}
                                    </div>
                                    {ad.user.is_graduate ? (
                                        <>
                                            <div className='text-sm bg-blue-300 text-gray-500 py-1 px-4 rounded-lg'>
                                                Выпускник JOLTAP
                                            </div>
                                        </>
                                        ) : ('')}
                                </div>
                                <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                                    {auth.user ? (
                                        <>
                                            <a
                                                href={`/connect/${auth.user.id}/${ad.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className='text-blue-500 text-center rounded-lg text-sm text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                                <span className='font-bold'>{t('contact', { ns: 'announcements' })}</span>
                                            </a>
                                            {auth.user.email === 'admin@example.com' && (
                                                <a
                                                    href={`/announcements/update/${ad.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className='text-blue-500 text-center rounded-lg text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                                    <span className='font-bold'>{t('edit', { ns: 'announcements' })}</span>
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href='/login'
                                            onClick={(e) => e.stopPropagation()}
                                            className='text-blue-500 text-center rounded-lg text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>{t('contact', { ns: 'announcements' })}</span>
                                        </Link>
                                    )}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare(ad.id);
                                        }}
                                        className={`border-2 border-blue-500 rounded-lg inline-block px-3 py-2 cursor-pointer transition-all duration-150`}>
                                        <MdIosShare className='text-blue-500 text-xl' />
                                    </div>
                                </div>
                            </Link>
                        ))}
                        <Pagination links={ads.links} keyword={data.keyword} />
                    </div>
                    {/* Desktop Filter Sidebar */}
                    <div className='col-span-2 border-l border-gray-200 h-screen sticky top-0 md:block hidden'>
                        <div>
                            <div className='font-bold p-3 text-sm border-b border-gray-200'>{t('filters', { ns: 'announcements' })}</div>
                        </div>
                        <div className='flex px-3 flex-col md:flex-col'>
                            <div className='text-gray-500 mt-5'>{t('type', { ns: 'announcements' })}</div>
                            <select
                                value={type}
                                onChange={handleTypeChange}
                                className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                            >
                                <option value="">{t('select_type', { ns: 'announcements' })}</option>
                                {types.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <div className='text-gray-500 mt-5'>{t('category', { ns: 'announcements' })}</div>
                            <select
                                value={category_id}
                                onChange={handleCategoryChange}
                                className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                            >
                                <option value="">{t('select_category', { ns: 'announcements' })}</option>
                                {Object.entries(categories).map(([id, title]) => (
                                    <option key={id} value={id}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                            <div className='text-gray-500 mt-5'>{t('region', { ns: 'announcements' })}</div>
                            <select
                                value={city_id}
                                onChange={handleCityChange}
                                className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                            >
                                <option value="">{t('select_city', { ns: 'announcements' })}</option>
                                {Object.entries(cities).map(([id, title]) => (
                                    <option key={id} value={id}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                            <div className='bottom-10'>
                                <div onClick={handleSearch} className='w-full bg-blue-600 text-white font-semibold py-2 text-center rounded-lg mt-10 cursor-pointer'>
                                    {t('apply', { ns: 'announcements' })}
                                </div>
                                <div onClick={resetSearch} className='w-full text-blue-500 border-2 border-blue-500 font-semibold py-2 text-center rounded-lg mt-2 cursor-pointer'>
                                    {t('reset', { ns: 'announcements' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}
