import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { CgClose } from "react-icons/cg";
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Pagination from '@/Components/Pagination';
import { Switch, Select, Input, Slider, Checkbox, Button as AntButton } from 'antd'; // Import necessary components from Ant Design
import { CgArrowsExchangeAltV, CgSearch } from "react-icons/cg";
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
        price_from: '',
        price_to: '',
        is_joltap: false,
        is_negotiable: false,
        is_used: false,
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

    const handleTypeToggle = (newType) => {
        setData('type', newType);
        get('/ads', {
            preserveScroll: true,
            preserveState: true,
            data: { ...data, type: newType }
        });
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

                <div className='flex flex-col md:flex-row gap-6 mt-5 px-3 md:px-0'>
                    {/* Main Content */}
                    <div className='flex-1'>
                        {/* Banner */}
                        <div className='bg-[#FFF9F9] rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between mb-6 relative overflow-hidden border border-gray-100'>
                            <div className='z-10 max-w-lg text-center md:text-left'>
                                <h1 className='text-3xl md:text-5xl font-black text-black leading-tight mb-2'>
                                    Маркетплейс <br />
                                    товаров и услуг для <br />
                                    <span className='text-[#E67E22] uppercase'>выпускников JOLTAP</span>
                                </h1>
                                <p className='text-gray-600 text-xl mt-4 font-medium'>
                                    Найдите нужную услугу или товар — <br />
                                    или разместите своё объявление
                                </p>
                            </div>
                            <div className='mt-6 md:mt-0 relative z-10'>
                                <img src="/images/service-banner-icon.png" alt="Marketplace" className="w-48 md:w-80 object-contain" onError={(e) => e.target.style.display='none'} />
                                {/* Fallback if image not found, using a styled div as in screenshot */}
                                {!document.querySelector('img[src="/images/service-banner-icon.png"]') && (
                                    <div className="w-32 h-32 md:w-56 md:h-56 bg-[#FFD7BA] rounded-3xl transform rotate-12 flex items-center justify-center shadow-xl shadow-orange-100">
                                        <div className="w-24 h-24 md:w-40 md:h-40 bg-[#E67E22] rounded-2xl transform -rotate-12 opacity-80 shadow-inner"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className='flex gap-2 p-1 bg-[#F3F4F6] rounded-xl mb-6 w-full md:w-max'>
                            <button
                                onClick={() => handleTypeToggle('product')}
                                className={`flex-1 md:w-64 py-3 rounded-lg font-semibold transition-all ${data.type === 'product' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-200' : 'text-[#6B7280] hover:text-gray-700'}`}
                            >
                                Товары
                            </button>
                            <button
                                onClick={() => handleTypeToggle('service')}
                                className={`flex-1 md:w-64 py-3 rounded-lg font-semibold transition-all ${data.type === 'service' ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-200' : 'text-[#6B7280] hover:text-gray-700'}`}
                            >
                                Услуги
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className='flex gap-2 mb-8'>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={data.keyword}
                                    onChange={handleKeywordChange}
                                    placeholder="Поиск..."
                                    className='w-full border-gray-200 rounded-xl py-3.5 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500 text-lg'
                                />
                                <div
                                    onClick={() => setIsFilterOpen(true)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-blue-500 md:hidden cursor-pointer'
                                >
                                    <CgArrowsExchangeAltV />
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                className='bg-[#3B82F6] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-lg shadow-lg shadow-blue-100'
                            >
                                Поиск...
                            </button>
                        </div>

                        {/* Cards Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {ads.data.map((ad, index) => (
                                <Link href={`/ad/${ad.id}`} key={index} className="bg-white group flex flex-col">
                                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3 bg-gray-100 border border-gray-100">
                                        <img
                                            src={ad.photos && ad.photos.length > 0 ? (ad.photos[0].url || ad.photos[0]) : "/images/default-avatar.png"}
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

                        <div className='mt-8'>
                            <Pagination links={ads.links} keyword={data.keyword} />
                        </div>
                    </div>

                    {/* Sidebar Filters */}
                    <div className='hidden md:block w-72'>
                        <div className='bg-white rounded-2xl border border-gray-100 p-6 sticky top-5'>
                            <h2 className='text-lg font-bold mb-6'>Фильтры</h2>

                            <div className='mb-6'>
                                <label className='text-[#9CA3AF] text-xs font-semibold uppercase mb-2 block'>Категория</label>
                                <Select
                                    value={data.category_id}
                                    onChange={(val) => setData('category_id', val)}
                                    className='w-full custom-select h-12 rounded-xl'
                                    placeholder="Выберите Категорию"
                                    allowClear
                                >
                                    {Object.entries(categories).map(([id, title]) => (
                                        <Option key={id} value={id}>{title}</Option>
                                    ))}
                                </Select>
                            </div>

                            <div className='mb-6'>
                                <label className='text-[#9CA3AF] text-xs font-semibold uppercase mb-2 block'>Регион</label>
                                <Select
                                    value={data.city_id}
                                    onChange={(val) => setData('city_id', val)}
                                    className='w-full custom-select h-12 rounded-xl'
                                    placeholder="Выберите город"
                                    allowClear
                                >
                                    {Object.entries(cities).map(([id, title]) => (
                                        <Option key={id} value={id}>{title}</Option>
                                    ))}
                                </Select>
                            </div>

                            <div className='mb-6'>
                                <label className='text-[#9CA3AF] text-xs font-semibold uppercase mb-2 block'>Цена</label>
                                <div className='flex items-center gap-2'>
                                    <Select
                                        placeholder="От:"
                                        className='flex-1 h-12'
                                        value={data.price_from || undefined}
                                        onChange={(val) => setData('price_from', val)}
                                    >
                                        <Option value="1000">1000</Option>
                                        <Option value="5000">5000</Option>
                                        <Option value="10000">10000</Option>
                                    </Select>
                                    <Select
                                        placeholder="До:"
                                        className='flex-1 h-12'
                                        value={data.price_to || undefined}
                                        onChange={(val) => setData('price_to', val)}
                                    >
                                        <Option value="50000">50000</Option>
                                        <Option value="100000">100000</Option>
                                        <Option value="500000">500000</Option>
                                    </Select>
                                </div>
                            </div>

                            <div className='flex items-center justify-between mb-4'>
                                <span className='text-gray-700 text-sm'>Сертификат JOLTAP</span>
                                <Switch
                                    checked={data.is_joltap}
                                    onChange={(checked) => setData('is_joltap', checked)}
                                />
                            </div>

                            <div className='flex items-center justify-between mb-4'>
                                <span className='text-gray-700 text-sm'>Б/У</span>
                                <Switch
                                    checked={data.is_used}
                                    onChange={(checked) => setData('is_used', checked)}
                                />
                            </div>

                            <div className='flex items-center justify-between mb-8'>
                                <span className='text-gray-700 text-sm'>Договорная цена</span>
                                <Switch
                                    checked={data.is_negotiable}
                                    onChange={(checked) => setData('is_negotiable', checked)}
                                />
                            </div>

                            <button
                                onClick={handleSearch}
                                className='w-full bg-[#3B82F6] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors mb-4 shadow-lg shadow-blue-100'
                            >
                                Применить
                            </button>

                            <hr className="my-6 border-gray-100" />

                            <Link
                                href="/announcements/create"
                                className='w-full border-2 border-[#3B82F6] text-[#3B82F6] py-3.5 rounded-xl font-bold text-center block hover:bg-blue-50 transition-colors'
                            >
                                Создать объявление
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                {isFilterOpen && (
                    <div className='fixed top-0 left-0 w-full h-screen bg-white z-[60] px-5 py-7 overflow-y-auto'>
                        <div className='flex w-full items-center mb-8'>
                            <div className='text-xl font-bold'>Фильтры</div>
                            <CgClose
                                onClick={() => setIsFilterOpen(false)}
                                className='ml-auto text-2xl cursor-pointer'
                            />
                        </div>

                        <div className='mb-6'>
                            <label className='text-gray-400 text-sm mb-2 block'>Категория</label>
                            <Select
                                value={data.category_id}
                                onChange={(val) => setData('category_id', val)}
                                className='w-full h-12'
                                placeholder="Выберите Категорию"
                            >
                                {Object.entries(categories).map(([id, title]) => (
                                    <Option key={id} value={id}>{title}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className='mb-6'>
                            <label className='text-gray-400 text-sm mb-2 block'>Регион</label>
                            <Select
                                value={data.city_id}
                                onChange={(val) => setData('city_id', val)}
                                className='w-full h-12'
                                placeholder="Выберите город"
                            >
                                {Object.entries(cities).map(([id, title]) => (
                                    <Option key={id} value={id}>{title}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className='mb-6'>
                            <label className='text-gray-400 text-sm mb-2 block'>Цена</label>
                            <div className='flex items-center gap-2'>
                                <Input
                                    placeholder="От"
                                    value={data.price_from}
                                    onChange={(e) => setData('price_from', e.target.value)}
                                    className='h-12'
                                />
                                <Input
                                    placeholder="До"
                                    value={data.price_to}
                                    onChange={(e) => setData('price_to', e.target.value)}
                                    className='h-12'
                                />
                            </div>
                        </div>

                        <div className='flex items-center justify-between mb-4'>
                            <span className='text-gray-700 font-medium'>Сертификат JOLTAP</span>
                            <Switch
                                checked={data.is_joltap}
                                onChange={(checked) => setData('is_joltap', checked)}
                            />
                        </div>

                        <div className='flex items-center justify-between mb-4'>
                            <span className='text-gray-700 font-medium'>Б/У</span>
                            <Switch
                                checked={data.is_used}
                                onChange={(checked) => setData('is_used', checked)}
                            />
                        </div>

                        <div className='flex items-center justify-between mb-10'>
                            <span className='text-gray-700 font-medium'>Договорная цена</span>
                            <Switch
                                checked={data.is_negotiable}
                                onChange={(checked) => setData('is_negotiable', checked)}
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className='w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg mb-4 shadow-lg shadow-blue-200'
                        >
                            Применить
                        </button>

                        <button
                            onClick={resetSearch}
                            className='w-full text-blue-600 border-2 border-blue-600 py-4 rounded-xl font-bold text-lg'
                        >
                            Сбросить
                        </button>
                    </div>
                )}

                <style dangerouslySetInnerHTML={{ __html: `
                    .custom-select .ant-select-selector {
                        border-radius: 12px !important;
                        height: 48px !important;
                        padding-top: 8px !important;
                        border-color: #f3f4f6 !important;
                    }
                    .ant-select-selection-placeholder {
                        line-height: 48px !important;
                    }
                    .ant-select-selection-item {
                        line-height: 48px !important;
                    }
                ` }} />
            </GuestLayout>
        </>
    );
}
