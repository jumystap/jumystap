import React, { useState, useEffect } from 'react';
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
import { CiLocationOn } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { MdIosShare } from "react-icons/md";

export default function Announcements({ auth, announcements, specializations, errors, cities}) {
    const { t, i18n } = useTranslation();
    const [announcementType, setAnnouncementType] = useState('all');
    const [searchCity, setSearchCity] = useState('');
    // Change specialization to an array to match Cascader's expected value format
    const [specialization, setSpecialization] = useState(['']); // Default to "All Specializations"
    const [city, setCity] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [isSalary, setIsSalary] = useState(false);
    const [noExperience, setNoExperience] = useState(false);
    const [publicTime, setPublicTime] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSpecialization, setSelectedSpecialization] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const { searchKeyword: querySearchKeyword } = usePage().props;

    const cityArray = Object.entries(cities).map(([id, name]) => ({ id, name }));

    const { data, setData, get } = useForm({
        searchKeyword: querySearchKeyword || '',
        specialization: '',
        city: '',
        minSalary: '',
        isSalary: false,
        noExperience: false,
    });

    console.log(announcements)
    const handleCityChange = (event) => {
        setCity(event.target.value);
        setData('city', event.target.value);
    };

    const handleSpecializationChange = (value) => {
        setSpecialization(value); // Value will be an array, e.g., [''], or ['category_id', 'spec_id']
        setData('specialization', value.length > 1 ? value[1] : ''); // Use second value if it exists, else empty string
    };

    const handleShare = (id) => {
        const url = `https://jumystap.kz/announcement/${id}`; // Ensure 'announcement' is in scope and has 'id'

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
            // Fallback for browsers that do not support the Web Share API
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
        const noExperience = params.get('noExperience');
        const city = params.get('city');
        const minSalary = params.get('minSalary');
        const specialization = params.get('specialization');

        if (searchKeyword) {
            setData('searchKeyword', searchKeyword);
            setData('isSalary', isSalary);
            setData('noExperience', noExperience);
            setData('city', city);
            setCity(city);
            setData('minSalary', minSalary);
            setMinSalary(minSalary)
            setData('specialization', specialization);
            setSpecialization(specialization);
        }
    }, []);

    const handleSearch = () => {
        get('/announcements', {preserveScroll: true, preserveState: true });
    };
    const resetSearch = () => {
        setData({
            searchKeyword: '',
            specialization: '',
            city: '',
            minSalary: '',
            isSalary: false,
            noExperience: false,
        });

        setAnnouncementType('all');
        setSearchCity('');
        setSpecialization(['']); // Reset to "All Specializations"
        setCity('');
        setMinSalary('');
        setIsSalary(false);
        setNoExperience(false);
        setPublicTime('');
        setSelectedSpecialization([]);

        get('/announcements', {
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

    const cascaderOptions = [
        {
            value: '',
            label: t('all_specializations', { ns: 'announcements' }), // Default option
        },
        ...specializations.map(category => ({
            value: category.id,
            label: i18n.language === 'ru' ? category.name_ru : category.name_kz,
            children: category.specialization.map(spec => ({
                value: spec.id,
                label: i18n.language === 'ru' ? spec.name_ru : spec.name_kz
            }))
        }))
    ];


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
                            <div className='text-xl font-bold'>{t('filters', { ns: 'announcements' })}</div>
                            <CgClose
                                onClick={() => setIsFilterOpen(false)}
                                className='ml-auto text-2xl inline-block cursor-pointer'
                            />
                        </div>
                        <input
                            type="text"
                            value={data.searchKeyword}
                            onChange={handleSearchKeywordChange}
                            placeholder={t('search', { ns: 'announcements' })}
                            className='block mt-5 border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                        />

                        <div className='text-gray-500 mt-5'>{t('specialization', { ns: 'announcements' })}</div>
                        <Cascader
                            options={cascaderOptions}
                            placeholder={t('select_specialization', { ns: 'announcements' })}
                            onChange={handleSpecializationChange}
                            value={specialization} // Use array value directly
                            className="block mt-2 w-full text-base"
                        />

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

                        <div className='mt-5 flex items-center'>
                            <div>{t('specified_income', { ns: 'announcements' })}</div>
                            <Switch className='ml-auto' checked={isSalary} onChange={handleIsSalaryChange} />
                        </div>

                        <div className='mt-5 flex items-center'>
                            <div>{t('no_experience', { ns: 'announcements' })}</div>
                            <Switch className='ml-auto' checked={noExperience} onChange={handleNoExperienceChange} />
                        </div>

                        <div className='bottom-10'>
                            <div onClick={handleSearch} className='w-full bg-blue-600 text-white font-semibold py-2 text-center rounded-lg mt-10 cursor-pointer'>
                                {t('apply', { ns: 'announcements' })}
                            </div>
                        </div>
                    </div>
                )}
                <div className='grid md:grid-cols-7 grid-cols-1'>
                    <div className='col-span-5'>
                        <Carousel>
                        <div className='block flex bg-gradient-to-r md:mx-5 mx-3 p-5 from-orange-500 via-orange-700 to-orange-800 mt-2 rounded-lg md:px-10 md:py-7 text-white'>
                            <div>
                                <div className='font-bold text-lg md:text-xl'>
                                    {t('get_free_training', { ns: 'announcements' })}
                                </div>
                                <div className='font-light md:mt-3'>{t('for_blue_collar_jobs', { ns: 'announcements' })}</div>
                                <div className='flex gap-x-5 mt-3 items-center'>
                                    <div
                                        onClick={() => setIsOpen(true)}
                                        className='px-3 cursor-pointer md:text-sm block md:px-10 py-2 font-bold md:text-md text-sm rounded-lg bg-white text-orange-500 hover:bg-white transition-all duration-150 hover:text-black'
                                    >
                                        {t('submit_an_application', { ns: 'announcements' })}
                                    </div>
                                    <a
                                        href='https://www.instagram.com/joltap.kz'
                                        className='block text-white text-sm font-light md:text-sm'
                                    >
                                        {t('detail', { ns: 'announcements' })}
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
                            <div className='font-semibold text-lg md:text-xl text-white'>{t('find_jobs_for_yourself', { ns: 'announcements' })}</div>
                            <div className='font-light mt-2 text-white'>{t('fill_out_the_form_and_find_suitable_jobs', { ns: 'announcements' })}</div>
                            {auth.user ? (
                                <div
                                    className='text-blue-500 px-10 py-2 text-sm mt-4 cursor-pointer bg-white rounded-lg font-bold inline-block'
                                    onClick={() => setIsInfoOpen(true)}
                                >
                                    {t('fill_out', { ns: 'announcements' })}
                                </div>
                            ):(
                                <Link
                                    className='text-blue-500 px-10 py-2 text-sm mt-4 cursor-pointer bg-white rounded-lg font-bold inline-block'
                                    href='/login'
                                >
                                    {t('fill_out', { ns: 'announcements' })}
                                </Link>
                            )}
                        </div>
                        </Carousel>
                        <div className='mt-5 flex items-center px-3 md:px-5 md:mb-5 gap-x-2'>
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
                        {announcements.data.map((anonce, index) => (
                            <Link href={`/announcement/${anonce.id}`} key={index} className={`block px-5 py-5 border rounded-lg hover:border-blue-500 transition-all duration-150 border-gray-200 md:mx-5 mx-3 mt-3`}>
                                <div className='flex items-center'>
                                    <div className={`flex gap-x-1 ${anonce.city == 'Астана' ? ('text-blue-400'):('text-gray-400')} items-center`}>
                                        <CiLocationOn />
                                        <div className='text-[10pt] md:text-sm'>{anonce.city}</div>
                                    </div>
                                    {/*<div className='ml-auto md:text-sm text-[10pt] text-right text-gray-500'>*/}
                                    {/*    {i18n.language == 'ru' ? ('Размещено') : ('')} {`${formatDistanceToNow(new Date(anonce.published_at), { locale: i18n.language === 'ru' ? ru : kz, addSuffix: true })}`} {i18n.language == 'kz' && ('')}*/}
                                    {/*</div>*/}
                                </div>
                                <div className='mt-5 text-lg font-bold'>
                                    {anonce.title}
                                </div>

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
                                    {auth.user ? (
                                        <>
                                            <a
                                                href={`/connect/${auth.user.id}/${anonce.id}`}
                                                onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                                className='text-blue-500 text-center rounded-lg text-sm text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                                <span className='font-bold'>{t('contact', { ns: 'announcements' })}</span>
                                            </a>
                                            {auth.user.email === 'admin@example.com' && (
                                                <a
                                                    href={`/announcements/update/${anonce.id}`}
                                                    onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                                    className='text-blue-500 text-center rounded-lg text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                                    <span className='font-bold'>{t('edit', { ns: 'announcements' })}</span>
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href='/login'
                                            onClick={(e) => e.stopPropagation()} // Prevents click propagation to Link
                                            className='text-blue-500 text-center rounded-lg text-center items-center md:w-[400px] w-full block border-2 border-blue-500 py-2 px-5 md:px-10'>
                                            <span className='font-bold'>{t('contact', { ns: 'announcements' })}</span>
                                        </Link>
                                    )}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents click propagation to Link
                                            handleShare(anonce.id);
                                        }}
                                        className={`border-2 border-blue-500 rounded-lg inline-block px-3 py-2 cursor-pointer transition-all duration-150`}>
                                        <MdIosShare className='text-blue-500 text-xl' />
                                    </div>
                                </div>
                            </Link>
                        ))}

                        <Pagination links={announcements.links} searchKeyword={data.searchKeyword} />
                    </div>
                    <div className='col-span-2 border-l border-gray-200 h-screen sticky top-0 md:block hidden'>
                        <div>
                            <div className='font-bold p-3 text-sm border-b border-gray-200'>{t('filters', { ns: 'announcements' })}</div>
                        </div>
                        <div className='flex px-3 flex-col md:flex-col'>
                            <div className='text-gray-500 mt-5'>{t('specialization', { ns: 'announcements' })}</div>
                            <Cascader
                                options={cascaderOptions}
                                placeholder={t('select_specialization', { ns: 'announcements' })}
                                onChange={handleSpecializationChange}
                                value={specialization} // Use array value directly
                                className="block mt-2 w-full text-base"
                            />

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

                            <div className='mt-5 flex items-center'>
                                <div>{t('specified_income', { ns: 'announcements' })}</div>
                                <Switch className='ml-auto' checked={isSalary} onChange={handleIsSalaryChange} />
                            </div>

                            <div className='mt-5 flex items-center'>
                                <div>{t('no_experience', { ns: 'announcements' })}</div>
                                <Switch className='ml-auto' checked={noExperience} onChange={handleNoExperienceChange} />
                            </div>

                            <div className='bottom-10'>
                                <div onClick={handleSearch} className='w-full bg-blue-600 text-white font-semibold py-2 text-center rounded-lg mt-10 cursor-pointer'>
                                    {t('apply', { ns: 'announcements' })}
                                </div>
                            </div>
                            <div className="mt-2">
                                <div onClick={resetSearch} className='text-blue-500 rounded-lg text-center items-center  w-full block border-2 border-blue-500 py-2 px-5 md:px-10 cursor-pointer'>
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
