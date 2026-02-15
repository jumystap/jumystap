import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { CgClose } from "react-icons/cg";
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Pagination from '@/Components/Pagination';
import { Switch, Select } from 'antd'; // Import Select from Ant Design
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { MdIosShare } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";


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
        type: 'product',
        category_id: '',
        city_id: '',
    });

    const handleTypeChange = (event) => {
        setData('type', event.target.value);
    };
    const handleTypeToggle = (newType) => {
        setData('type', newType);
        router.get('/ads', { ...data, type: newType }, {
            preserveScroll: true,
            preserveState: true,
            queryStringArrayFormat: 'indices',
        });
    };

    useEffect(() => {
        setTypeId(data.type);
    }, [data.type]);
    const handleCategoryChange = (event) => {
        setData('category_id', event.target.value);
    };
    const handleCityChange = (event) => {
        setData('city_id', event.target.value);
    };



    const handleShare = (id) => {
        const url = `https://jumystap.kz/ads/${id}`;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this ad',
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
        const typeParam = params.get('type');

        if (keyword || city_id || typeParam) {
            setData({
                ...data,
                keyword: keyword || data.keyword,
                city_id: city_id || data.city_id,
                type: typeParam || data.type,
            });
            if (city_id) setCityId(city_id);
            if (typeParam) setTypeId(typeParam);
        }
    }, []);

    const handleSearch = () => {
        setIsFilterOpen(false)
        router.get('/ads', data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const resetSearch = () => {
        const resetData = {
            keyword: '',
            type: 'product',
            category_id: '',
            city_id: '',
        };
        setData(resetData);
        setAdType('all');
        setCategoryId('');
        setCityId('');
        router.get('/ads', resetData, {
            preserveScroll: true,
            preserveState: true,
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
                            value={data.type}
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
                            value={data.category_id}
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
                            value={data.city_id}
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

                        <div className="z-10 md:mx-5 mx-3 p-5 mt-2 rounded-lg md:px-10 md:py-7 border border-gray-100">
                            <div className="flex">
                                <div>
                                    <p className="mt-3 font-bold text-2xl">
                                        Маркетплейс <br />
                                        товаров и услуг для <br />
                                        <span className='text-[#E67E22] uppercase'>выпускников JOLTAP</span>
                                    </p>
                                    <p className="mt-4 text-lg md:mt-1">
                                        Найдите нужную услугу или товар — <br />
                                        или разместите своё объявление
                                    </p>
                                </div>

                                <div className="hidden md:block ml-auto">
                                    <img src="/images/logo_3d.png" className="md:w-[100px] w-[250px]"/>
                                </div>
                            </div>
                        </div>

                        <div className='mt-5 flex items-center px-3 md:px-5 md:mb-5 gap-x-2'>
                            <button
                                onClick={() => handleTypeToggle('product')}
                                className={`flex-1 md:w-80 py-4 rounded-xl font-semibold transition-all ${data.type === 'product' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-200' : 'bg-[#EBF2FF] text-[#6B7280]'}`}
                            >
                                Товары
                            </button>
                            <button
                                onClick={() => handleTypeToggle('service')}
                                className={`flex-1 md:w-80 py-4 rounded-xl font-semibold transition-all ${data.type === 'service' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-200' : 'bg-[#EBF2FF] text-[#6B7280]'}`}
                            >
                                Услуги
                            </button>
                        </div>

                        <div className='mt-5 flex items-center px-3 md:px-5 mb-5 gap-x-2'>
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
                        {data.type === 'service' ? (
                            <div className='grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 px-3 md:px-5 mt-3 md:mt-0 md:mb-5'>
                                {ads.data.map((ad, index) => (
                                    <Link href={`/ad/${ad.id}`} key={index} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex-1">
                                            <h3 className='text-base md:text-xl font-bold text-gray-900 leading-tight mb-2'>{ad.title}</h3>
                                            <div className='text-sm md:text-lg font-medium text-gray-900 mb-4'>
                                                {ad.price_type === "exact" && ad.price_exact && `${ad.price_exact.toLocaleString()} ₸`}
                                                {ad.price_type === "range" && ad.price_from && ad.price_to &&
                                                    (i18n?.language === "ru" ? `от ${ad.price_from.toLocaleString()} ₸ до ${ad.price_to.toLocaleString()} ₸` :
                                                        `${ad.price_from.toLocaleString()} ₸ бастап ${ad.price_to.toLocaleString()} ₸ дейін`)
                                                }
                                                {ad.price_type === "range" && !ad.price_from && ad.price_to &&
                                                    `${i18n?.language === "ru"
                                                        ? "до " + ad.price_to.toLocaleString() + " ₸"
                                                        : ad.price_to.toLocaleString() + " ₸ дейін"}`
                                                }
                                                {ad.price_type === "range" && ad.price_from && !ad.price_to &&
                                                    `${i18n?.language === "ru"
                                                        ? "от " + ad.price_from.toLocaleString() + " ₸"
                                                        : ad.price_from.toLocaleString() + " ₸ бастап"}`
                                                }
                                                {ad.price_type === "negotiable" && "Договорная цена"}
                                            </div>

                                            <div className='flex flex-wrap gap-2 mb-6'>
                                                <div className='text-[10px] md:text-xs bg-gray-50 text-gray-400 py-1.5 px-3 rounded-md border border-gray-100'>
                                                    г. {ad.city.title}
                                                </div>
                                                {ad.is_remote && (
                                                    <div className='text-[10px] md:text-xs bg-gray-50 text-gray-400 py-1.5 px-3 rounded-md border border-gray-100'>
                                                        Удаленно
                                                    </div>
                                                )}
                                            </div>

                                            <div className='flex items-center gap-2 md:gap-3 mb-6'>
                                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {ad.user.avatar ? (
                                                        <img src={ad.user.avatar} alt={ad.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <HiOutlineUserCircle className="w-full h-full text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className='font-bold text-gray-900 text-sm md:text-lg leading-tight mb-0.5'>{ad.user.name}</div>
                                                    {ad.user.is_graduate === 1 && (
                                                        <div className='text-[10px] md:text-sm text-gray-500'>Выпускник JOLTAP</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='w-full bg-[#3B82F6] text-white py-3 rounded-xl font-bold text-center transition-colors hover:bg-blue-600'>
                                            Подробнее
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 px-3 md:px-5 mt-3 md:mt-0 md:mb-5'>
                                {ads.data.map((ad, index) => (
                                    <Link href={`/ad/${ad.id}`} key={index} className="bg-white group flex flex-col">
                                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3 bg-gray-100 border border-gray-100">
                                            <img
                                                src={ad.photos && ad.photos.length > 0 ? (ad.photos[0].url || ad.photos[0]) : "/images/image.png"}
                                                alt={ad.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />

                                            {/* Badges */}
                                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                {ad.is_used && (
                                                    <span className="bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Б/У</span>
                                                )}
                                                {ad.user.is_graduate === 1 && (
                                                    <span className="bg-[#E67E22] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Выпускник</span>
                                                )}
                                            </div>

                                            {/* Pagination dots indicator */}
                                            {ad.photos && ad.photos.length > 1 && (
                                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                                                    {ad.photos.slice(0, 5).map((_, i) => (
                                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className='text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2'>{ad.title}</h3>
                                            <div className='text-lg font-bold text-gray-900 mb-1'>
                                                {ad.price_type === "exact" && ad.price_exact && `${ad.price_exact.toLocaleString()} ₸`}
                                                {ad.price_type === "range" && ad.price_from && ad.price_to && `${ad.price_from.toLocaleString()} ₸ - ${ad.price_to.toLocaleString()} ₸`}
                                                {ad.price_type === "range" && !ad.price_from && ad.price_to &&
                                                    `${i18n?.language === "ru"
                                                        ? "до " + ad.price_to.toLocaleString() + " ₸"
                                                        : ad.price_to.toLocaleString() + " ₸ дейін"}`
                                                }
                                                {ad.price_type === "range" && ad.price_from && !ad.price_to &&
                                                    `${i18n?.language === "ru"
                                                        ? "от " + ad.price_from.toLocaleString() + " ₸"
                                                        : ad.price_from.toLocaleString() + " ₸ бастап"}`
                                                }
                                                {ad.price_type === "negotiable" && "Договорная цена"}
                                            </div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                                                г. {ad.city.title}{ad.address ? `, ${ad.address}` : ''}
                                            </div>
                                        </div>

                                        <div className='w-full bg-[#EBF2FF] text-[#3B82F6] py-2.5 rounded-xl font-bold text-center group-hover:bg-[#3B82F6] group-hover:text-white transition-colors'>
                                            Подробнее
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <div className='mt-8'>
                            <Pagination links={ads.links} keyword={data.keyword} />
                        </div>
                    </div>
                    {/* Desktop Filter Sidebar */}
                    <div className='col-span-2 border-l border-gray-200 h-screen sticky top-0 md:block hidden'>
                        <div>
                            <div className='font-bold p-3 text-sm border-b border-gray-200'>{t('filters', { ns: 'announcements' })}</div>
                        </div>
                        <div className='flex px-3 flex-col md:flex-col'>
                            <div className='text-gray-500 mt-5'>{t('type', { ns: 'announcements' })}</div>
                            <select
                                value={data.type}
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
                                value={data.category_id}
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
                                value={data.city_id}
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
