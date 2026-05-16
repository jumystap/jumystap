import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Pagination from '@/Components/Pagination';
import { Switch, Select } from 'antd'; // Import Select from Ant Design
import InfoModal from '@/Components/InfoModal';
import FeedbackModal from '@/Components/FeedbackModal.jsx';
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { MdIosShare } from "react-icons/md";
import MobileFilterSheet from "@/Components/Mobile/MobileFilterSheet";

const { Option } = Select;

const PAYMENT_TYPE_DAILY = 'Ежедневная оплата';
const PAYMENT_TYPE_OPTIONS = [
    { value: PAYMENT_TYPE_DAILY, labelKey: 'daily_payment' },
    { value: 'Еженедельная оплата', labelKey: 'weekly_payment' },
    { value: 'Ежемесячная оплата', labelKey: 'monthly_payment' },
];
const PAYMENT_TYPE_ALIASES = {
    daily: 'Ежедневная оплата',
    weekly: 'Еженедельная оплата',
    monthly: 'Ежемесячная оплата',
    'ежедневная оплата': 'Ежедневная оплата',
    'еженедельная оплата': 'Еженедельная оплата',
    'ежемесячная оплата': 'Ежемесячная оплата',
};

const EMPTY_FILTERS = {
    searchKeyword: '',
    specializationCategories: [],
    specializations: [],
    city: '',
    minSalary: '',
    isSalary: false,
    noExperience: false,
    isPermanent: false,
    paymentType: '',
    publicTime: '',
};

const buildFilterPayload = (filters) => Object.entries(filters).reduce((payload, [key, value]) => {
    if (Array.isArray(value)) {
        if (value.length > 0) {
            payload[key] = value;
        }
        return payload;
    }

    if (typeof value === 'boolean') {
        if (value) {
            payload[key] = value;
        }
        return payload;
    }

    if (value !== null && value !== undefined && value !== '') {
        payload[key] = value;
    }

    return payload;
}, {});

const getArrayParam = (params, key) => {
    const directValue = params.get(key);

    if (directValue) {
        return directValue.split(',');
    }

    return Array.from(params.entries())
        .filter(([paramKey]) => paramKey === `${key}[]` || paramKey.startsWith(`${key}[`))
        .map(([, value]) => value);
};

const isTruthyParam = (value) => value === 'true' || value === '1';

const normalizePaymentTypeValue = (value) => {
    if (!value) {
        return '';
    }

    const trimmedValue = value.trim();

    return PAYMENT_TYPE_ALIASES[trimmedValue.toLowerCase()] || trimmedValue;
};

const filterSelectOptionByLabel = (input, option) => {
    const label = String(option?.label ?? option?.children ?? '').toLowerCase();

    return label.includes(input.trim().toLowerCase());
};

const getMobileSelectPopupContainer = (triggerNode) => (
    triggerNode.closest('.jt-mobile-sheet__body') || triggerNode.parentElement || document.body
);

export default function Announcements({ auth, announcements, specializationCategories, specializationCategoriesData, cities }) {
    const { t, i18n } = useTranslation();
    const [announcementType, setAnnouncementType] = useState('all');
    const [searchCity, setSearchCity] = useState('');
    const [selectedSpecializationCategories, setSelectedSpecializationCategories] = useState([]); // Multiple specialization_category selection
    const [selectedSpecializations, setSelectedSpecializations] = useState([]); // Multiple specialization selection
    const [city, setCity] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [isSalary, setIsSalary] = useState(false);
    const [noExperience, setNoExperience] = useState(false);
    const [isPermanent, setIsPermanent] = useState(false);
    const [paymentType, setPaymentType] = useState('');
    const [mobileCategorySearch, setMobileCategorySearch] = useState('');
    const [mobileSpecializationSearch, setMobileSpecializationSearch] = useState('');
    const [publicTime, setPublicTime] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { searchKeyword: querySearchKeyword } = usePage().props;

    const specializationCategoryData = specializationCategoriesData;

    const cityArray = Object.entries(cities).map(([id, name]) => ({ id, name }));

    const { data, setData } = useForm({
        ...EMPTY_FILTERS,
        searchKeyword: querySearchKeyword || '',
    });

    // Compute specialization options based on selected specializationCategories
    const specializationOptions = useMemo(() => {
        const uniqueSpecializations = [];
        selectedSpecializationCategories.forEach(specialization_categoryValue => {
            const specialization_category = specializationCategoryData.find(s => s.value === specialization_categoryValue);
            if (specialization_category && specialization_category.specializations) {
                specialization_category.specializations.forEach(specialization => {
                    if (!uniqueSpecializations.find(ind => ind.value === specialization.value)) {
                        uniqueSpecializations.push(specialization);
                    }
                });
            }
        });
        return uniqueSpecializations;
    }, [selectedSpecializationCategories]);

    const handleCityChange = (event) => {
        setCity(event.target.value);
        setData('city', event.target.value);
    };

    const handleSpecializationCategoryChange = (values) => {
        setSelectedSpecializationCategories(values);
        setSelectedSpecializations([]); // Reset specializations when specializationCategories change
        setData('specializationCategories', values);
        setData('specializations', []); // Reset specializations in form data
    };

    const handleMobileSpecializationCategoryChange = (values) => {
        handleSpecializationCategoryChange(values);
        setMobileCategorySearch('');
        setMobileSpecializationSearch('');
    };

    const handleSpecializationChange = (values) => {
        setSelectedSpecializations(values);
        setData('specializations', values);
    };

    const handleMobileSpecializationChange = (values) => {
        handleSpecializationChange(values);
        setMobileSpecializationSearch('');
    };

    const handleShare = (id) => {
        const url = `https://jumystap.kz/announcement/${id}`;
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

    const handleMinSalaryChange = (event) => {
        setMinSalary(event.target.value);
        setData('minSalary', event.target.value);
    };

    const handleIsSalaryChange = (checked) => {
        setIsSalary(checked);
        setData('isSalary', checked);
    };

    const handleNoExperienceChange = (checked) => {
        setNoExperience(checked);
        setData('noExperience', checked);
    };

    const handleIsPermanentChange = (checked) => {
        setIsPermanent(checked);
        setData('isPermanent', checked);
    };

    const handlePaymentTypeChange = (value) => {
        const nextPaymentType = normalizePaymentTypeValue(value);
        setPaymentType(nextPaymentType);
        setData('paymentType', nextPaymentType);
    };

    const handlePublicTimeChange = (value) => {
        setPublicTime(value);
        setData('publicTime', value);
    };

    const handleSearchKeywordChange = (event) => {
        setData('searchKeyword', event.target.value);
    };

    const handleFeedbackSubmit = (feedback) => {
        axios.post('/send-feedback', { feedback }).then(() => {
            console.log(t('feedback_sent', { ns: 'header' }));
        }).catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const searchKeyword = params.get('searchKeyword');
        const isSalary = params.get('isSalary');
        const noExperience = params.get('noExperience');
        const isPermanent = params.get('isPermanent') || params.get('is_permanent');
        const paymentType = normalizePaymentTypeValue(params.get('paymentType') || params.get('payment_type'));
        const publicTime = params.get('publicTime');
        const city = params.get('city');
        const minSalary = params.get('minSalary');
        const specializationCategories = getArrayParam(params, 'specializationCategories');
        const specializations = getArrayParam(params, 'specializations');

        if (searchKeyword || isSalary || noExperience || isPermanent || paymentType || publicTime || city || minSalary || specializationCategories.length || specializations.length) {
            setData({
                searchKeyword: searchKeyword || '',
                specializationCategories: specializationCategories,
                specializations: specializations,
                city: city || '',
                minSalary: minSalary || '',
                isSalary: isTruthyParam(isSalary),
                noExperience: isTruthyParam(noExperience),
                isPermanent: isTruthyParam(isPermanent),
                paymentType: paymentType,
                publicTime: publicTime || '',
            });
            setCity(city || '');
            setMinSalary(minSalary || '');
            setIsSalary(isTruthyParam(isSalary));
            setNoExperience(isTruthyParam(noExperience));
            setIsPermanent(isTruthyParam(isPermanent));
            setPaymentType(paymentType);
            setPublicTime(publicTime || '');
            setSelectedSpecializationCategories(specializationCategories);
            setSelectedSpecializations(specializations);
        }
    }, []);

    const submitFilters = (filters) => {
        setIsFilterOpen(false);
        router.get('/announcements', buildFilterPayload(filters), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleSearch = () => {
        submitFilters(data);
    };

    const applyQuickFilter = (changes) => {
        const nextData = {
            ...data,
            ...changes,
        };

        setData(nextData);

        if (Object.prototype.hasOwnProperty.call(changes, 'isSalary')) {
            setIsSalary(changes.isSalary);
        }

        if (Object.prototype.hasOwnProperty.call(changes, 'noExperience')) {
            setNoExperience(changes.noExperience);
        }

        if (Object.prototype.hasOwnProperty.call(changes, 'isPermanent')) {
            setIsPermanent(changes.isPermanent);
        }

        if (Object.prototype.hasOwnProperty.call(changes, 'paymentType')) {
            setPaymentType(changes.paymentType);
        }

        submitFilters(nextData);
    };

    const quickFilterClassName = (isActive) => [
        'jt-announcements-quick-filter shrink-0 rounded-full border px-3 text-sm font-semibold transition-all duration-150',
        isActive
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-gray-200 bg-white text-gray-600',
    ].join(' ');

    const paymentTypeOptions = PAYMENT_TYPE_OPTIONS.map(option => ({
        ...option,
        label: t(option.labelKey, { ns: 'announcements' }),
    }));

    const isDailyPaymentSelected = paymentType === PAYMENT_TYPE_DAILY;

    const resetLocalFilters = () => {
        setAnnouncementType('all');
        setSearchCity('');
        setSelectedSpecializationCategories([]);
        setSelectedSpecializations([]);
        setMobileCategorySearch('');
        setMobileSpecializationSearch('');
        setCity('');
        setMinSalary('');
        setIsSalary(false);
        setNoExperience(false);
        setIsPermanent(false);
        setPaymentType('');
        setPublicTime('');
    };

    const resetSearch = () => {
        const nextData = { ...EMPTY_FILTERS };
        setData(nextData);
        resetLocalFilters();
        setIsFilterOpen(false);
        router.get('/announcements', {}, {
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

    const handleAnnouncementTypeChange = (event) => {
        setAnnouncementType(event.target.value);
    };

    const uniqueCities = [...new Set(announcements.data.map(anonce => anonce.city))];

    return (
        <>
            <GuestLayout hideMobileBottomNav={isFilterOpen}>
                <Head title="Работа в Казахстане | свежие вакансии и объявления ">
                    <meta name="description" content="Ознакомьтесь с актуальными объявлениями о работе на Жумыстап. Свежие вакансии от ведущих компаний Казахстана. Найдите работу или разместите объявление уже сегодня" />
                </Head>
                <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleFeedbackSubmit} />
                <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} specializations={specializationCategories} />
                <div className='fixed bg-black hidden bg-opacity-50 top-0 left-0 w-full h-screen z-50'>
                    <div className='w-[80%] bg-white rounded-lg h-[20%]'></div>
                </div>
                {/* Mobile Filter Modal */}
                {isFilterOpen && (
                    <MobileFilterSheet
                        title={t('filters', { ns: 'announcements' })}
                        onClose={() => setIsFilterOpen(false)}
                        footer={
                            <>
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className='w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white shadow-sm'
                                >
                                    {t('apply', { ns: 'announcements' })}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetSearch}
                                    className='mt-3 w-full rounded-xl border-2 border-blue-500 py-3 text-center font-semibold text-blue-500'
                                >
                                    {t('reset', { ns: 'announcements' })}
                                </button>
                            </>
                        }
                    >
                        <input
                            type="text"
                            value={data.searchKeyword}
                            onChange={handleSearchKeywordChange}
                            placeholder={t('search', { ns: 'announcements' })}
                            className='block border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                        />
                        <div className='text-gray-500 mt-5'>{t('specialization_category', { ns: 'announcements' })}</div>
                        <Select
                            mode="multiple"
                            showSearch
                            placeholder={t('select_specialization_category', { ns: 'announcements' })}
                            value={selectedSpecializationCategories}
                            searchValue={mobileCategorySearch}
                            onSearch={setMobileCategorySearch}
                            onChange={handleMobileSpecializationCategoryChange}
                            filterOption={filterSelectOptionByLabel}
                            optionFilterProp="label"
                            getPopupContainer={getMobileSelectPopupContainer}
                            popupClassName="jt-mobile-select-dropdown"
                            className="jt-mobile-filter-select block mt-2 w-full"
                            maxTagCount="responsive"
                        >
                            {specializationCategoryData.map(specialization_category => (
                                <Option
                                    key={specialization_category.value}
                                    value={specialization_category.value}
                                    label={specialization_category.label}
                                >
                                    {specialization_category.label}
                                </Option>
                            ))}
                        </Select>
                        <div className='text-gray-500 mt-5'>{t('specialization', { ns: 'announcements' })}</div>
                        <Select
                            mode="multiple"
                            showSearch
                            placeholder={t('select_specialization', { ns: 'announcements' })}
                            value={selectedSpecializations}
                            searchValue={mobileSpecializationSearch}
                            onSearch={setMobileSpecializationSearch}
                            onChange={handleMobileSpecializationChange}
                            filterOption={filterSelectOptionByLabel}
                            optionFilterProp="label"
                            getPopupContainer={getMobileSelectPopupContainer}
                            popupClassName="jt-mobile-select-dropdown"
                            className="jt-mobile-filter-select block mt-2 w-full"
                            disabled={selectedSpecializationCategories.length === 0}
                            notFoundContent={t('no_specializations', { ns: 'announcements' })}
                            maxTagCount="responsive"
                        >
                            {specializationOptions.map(specialization => (
                                <Option
                                    key={specialization.value}
                                    value={specialization.value}
                                    label={specialization.label}
                                >
                                    {specialization.label}
                                </Option>
                            ))}
                        </Select>
                        <div className='text-gray-500 mt-5'>{t('region', { ns: 'announcements' })}</div>
                        <select
                            value={city}
                            onChange={handleCityChange}
                            className='block mt-2 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                        >
                            <option value="">{t('select_city', { ns: 'announcements' })}</option>
                            {cityArray.map(city => (
                                <option key={city.id} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={minSalary}
                            onChange={handleMinSalaryChange}
                            placeholder={t('income_level_from', { ns: 'announcements' })}
                            className='block mt-5 border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                        />
                        <div className='jt-mobile-filter-toggle'>
                            <div className='jt-mobile-filter-toggle__label'>{t('specified_income', { ns: 'announcements' })}</div>
                            <Switch checked={isSalary} onChange={handleIsSalaryChange} />
                        </div>
                        <div className='jt-mobile-filter-toggle'>
                            <div className='jt-mobile-filter-toggle__label'>{t('no_experience', { ns: 'announcements' })}</div>
                            <Switch checked={noExperience} onChange={handleNoExperienceChange} />
                        </div>
                        <div className='jt-mobile-filter-toggle'>
                            <div className='jt-mobile-filter-toggle__label'>{t('permanent_hiring', { ns: 'announcements' })}</div>
                            <Switch checked={isPermanent} onChange={handleIsPermanentChange} />
                        </div>
                        <div className='text-gray-500 mt-5'>{t('payment_type', { ns: 'announcements' })}</div>
                        <Select
                            allowClear
                            placeholder={t('select_payment_type', { ns: 'announcements' })}
                            value={paymentType || undefined}
                            onChange={handlePaymentTypeChange}
                            getPopupContainer={getMobileSelectPopupContainer}
                            popupClassName="jt-mobile-select-dropdown"
                            className="jt-mobile-filter-select block mt-2 w-full"
                        >
                            {paymentTypeOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </MobileFilterSheet>
                )}
                <div className='grid md:grid-cols-7 grid-cols-1'>
                    <div className='col-span-5'>
                        <div className='hidden bg-gradient-to-r md:mx-5 mx-3 p-5 from-orange-500 via-orange-700 to-orange-800 mt-2 rounded-lg md:flex md:px-10 md:py-7 text-white'>
                            <div>
                                <div className='font-bold text-lg md:text-xl'>
                                    {t('get_free_training', { ns: 'employees' })}
                                </div>
                                <div className='font-light md:mt-3'>{t('for_blue_collar_jobs', { ns: 'employees' })}</div>
                                <div className='flex gap-x-5 mt-3 items-center'>
                                    <div
                                        onClick={() => setIsOpen(true)}
                                        className='px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-orange-500 hover:bg-white transition-all duration-150 hover:text-black'
                                    >
                                        {t('submit_an_application', { ns: 'employees' })}
                                    </div>
                                    <a
                                        href='https://www.instagram.com/joltap.kz'
                                        className='block text-white text-sm font-light md:text-sm'
                                    >
                                        {t('detail', { ns: 'employees' })}
                                    </a>
                                </div>
                            </div>
                            <div className='ml-auto pt-2'>
                                <img src='/images/joltap.png' className='md:w-[200px] w-[120px]' />
                            </div>
                        </div>
                        <div className='mt-3 flex items-center px-0 md:mt-5 md:px-5 md:mb-5 gap-x-2'>
                            <input
                                type="text"
                                value={data.searchKeyword}
                                onChange={handleSearchKeywordChange}
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
                                className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500 p-0 text-2xl leading-none text-white md:hidden'
                                onClick={handleSearch}
                                aria-label={t('search', { ns: 'announcements' })}
                            >
                                <IoSearch />
                            </button>
                            <div
                                onClick={() => setIsFilterOpen(true)}
                                className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-blue-500 p-0 text-3xl leading-none text-blue-500 md:hidden'
                                role="button"
                                aria-label={t('filters', { ns: 'announcements' })}
                            >
                                <CgArrowsExchangeAltV />
                            </div>
                        </div>
                        <div className='mt-2 flex gap-2 overflow-x-auto px-0 pb-1 md:hidden'>
                            <button
                                type="button"
                                onClick={() => applyQuickFilter({ noExperience: !noExperience })}
                                className={quickFilterClassName(noExperience)}
                            >
                                {t('quick_no_experience', { ns: 'announcements' })}
                            </button>
                            <button
                                type="button"
                                onClick={() => applyQuickFilter({ isSalary: !isSalary })}
                                className={quickFilterClassName(isSalary)}
                            >
                                {t('with_salary', { ns: 'announcements' })}
                            </button>
                            <button
                                type="button"
                                onClick={() => applyQuickFilter({ paymentType: isDailyPaymentSelected ? '' : PAYMENT_TYPE_DAILY })}
                                className={quickFilterClassName(isDailyPaymentSelected)}
                            >
                                {t('daily_payment', { ns: 'announcements' })}
                            </button>
                            <button
                                type="button"
                                onClick={() => applyQuickFilter({ isPermanent: !isPermanent })}
                                className={quickFilterClassName(isPermanent)}
                            >
                                {t('permanent_hiring', { ns: 'announcements' })}
                            </button>
                        </div>
                        {announcements.data.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className={`block px-5 py-5 border rounded-lg hover:border-blue-500 transition-all duration-150 border-gray-200 md:mx-5 mx-3 mt-3`}>
                                <div className='flex items-center'>
                                    <div className={`flex gap-x-1 ${anonce.city == 'Астана' ? ('text-blue-400'):('text-gray-400')} items-center`}>
                                        <CiLocationOn />
                                        <div className='text-[10pt] md:text-sm'>{anonce.city ?? t('is_remote', { ns: 'announcements' })}</div>
                                    </div>
                                    <div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500'>
                                        {i18n.language == 'ru' ? ('Изменено') : ('')} {`${formatDistanceToNow(new Date(anonce.updated_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('өзгертілді')}
                                    </div>
                                </div>
                                <div className='mt-5 text-lg font-bold'>
                                    {anonce.title}
                                </div>
                                {anonce.is_permanent && (
                                    <div className='mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                                        {t('permanent_hiring', { ns: 'announcements' })}
                                    </div>
                                )}
                                <div className='flex md:mt-2 mt-2 gap-x-3 items-center'>
                                    <div className='md:text-xl text-xl font-regular'>
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
                                <div className='flex gap-x-2 mt-2'>
                                    <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                                        {anonce.experience}
                                    </div>
                                    <div className='text-sm bg-gray-100 text-gray-500 py-1 px-4 rounded-lg'>
                                        {anonce.work_time}
                                    </div>
                                </div>
                                <div className='flex items-center mt-5 gap-x-3 gap-y-2'>
                                    <span className='text-blue-500 text-center rounded-lg text-sm items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                        <span className='font-bold'>{t('detail', { ns: 'announcements' })}</span>
                                    </span>
                                    {auth.user?.email === 'admin@example.com' && (
                                        <a
                                            href={`/announcements/update/${anonce.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className='text-blue-500 text-center rounded-lg items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>{t('edit', { ns: 'announcements' })}</span>
                                        </a>
                                    )}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare(anonce.id);
                                        }}
                                        className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-blue-500 p-0 text-xl leading-none cursor-pointer transition-all duration-150'
                                        role="button"
                                        aria-label="Share announcement"
                                    >
                                        <MdIosShare className='text-blue-500' />
                                    </div>
                                </div>
                            </Link>
                        ))}
                        <Pagination links={announcements.links} searchKeyword={data.searchKeyword} />
                    </div>
                    {/* Desktop Filter Sidebar */}
                    <div className='col-span-2 border-l border-gray-200 h-screen sticky top-0 md:block hidden'>
                        <div>
                            <div className='font-bold p-3 text-sm border-b border-gray-200'>{t('filters', { ns: 'announcements' })}</div>
                        </div>
                        <div className='flex px-3 flex-col md:flex-col'>
                            <div className='text-gray-500 mt-5'>{t('specialization_category', { ns: 'announcements' })}</div>
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder={t('select_specialization_category', { ns: 'announcements' })}
                                value={selectedSpecializationCategories}
                                onChange={handleSpecializationCategoryChange}
                                filterOption={filterSelectOptionByLabel}
                                className="block mt-2 w-full text-base"
                                maxTagCount={3}
                            >
                                {specializationCategoryData.map(specialization_category => (
                                    <Option
                                        key={specialization_category.value}
                                        value={specialization_category.value}
                                        label={specialization_category.label}
                                    >
                                        {specialization_category.label}
                                    </Option>
                                ))}
                            </Select>
                            <div className='text-gray-500 mt-5'>{t('specialization', { ns: 'announcements' })}</div>
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder={t('select_specialization', { ns: 'announcements' })}
                                value={selectedSpecializations}
                                onChange={handleSpecializationChange}
                                filterOption={filterSelectOptionByLabel}
                                className="block mt-2 w-full text-base"
                                disabled={selectedSpecializationCategories.length === 0}
                                notFoundContent={t('no_specializations', { ns: 'announcements' })}
                                maxTagCount={3}
                            >
                                {specializationOptions.map(specialization => (
                                    <Option
                                        key={specialization.value}
                                        value={specialization.value}
                                        label={specialization.label}
                                    >
                                        {specialization.label}
                                    </Option>
                                ))}
                            </Select>
                            <div className='text-gray-500 mt-5'>{t('region', { ns: 'announcements' })}</div>
                            <select
                                value={city}
                                onChange={handleCityChange}
                                className='block mt-2 h-8 w-full rounded-md border-gray-300 px-3 py-1 text-sm leading-5'
                            >
                                <option value="">{t('select_city', { ns: 'announcements' })}</option>
                                {cityArray.map(city => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={minSalary}
                                onChange={handleMinSalaryChange}
                                placeholder={t('income_level_from', { ns: 'announcements' })}
                                className='block mt-5 h-8 w-full rounded-md border border-gray-300 px-3 py-1 text-sm leading-5'
                            />
                            <div className='mt-5 flex items-center'>
                                <div>{t('specified_income', { ns: 'announcements' })}</div>
                                <Switch className='ml-auto' checked={isSalary} onChange={handleIsSalaryChange} />
                            </div>
                            <div className='mt-5 flex items-center'>
                                <div>{t('no_experience', { ns: 'announcements' })}</div>
                                <Switch className='ml-auto' checked={noExperience} onChange={handleNoExperienceChange} />
                            </div>
                            <div className='mt-5 flex items-center'>
                                <div>{t('permanent_hiring', { ns: 'announcements' })}</div>
                                <Switch className='ml-auto' checked={isPermanent} onChange={handleIsPermanentChange} />
                            </div>
                            <div className='mt-5'>{t('payment_type', { ns: 'announcements' })}</div>
                            <Select
                                allowClear
                                placeholder={t('select_payment_type', { ns: 'announcements' })}
                                value={paymentType || undefined}
                                onChange={handlePaymentTypeChange}
                                className="block mt-2 w-full text-base"
                            >
                                {paymentTypeOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
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
