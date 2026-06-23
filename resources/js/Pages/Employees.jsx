import React, {useCallback, useEffect, useState, memo} from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import {Head, Link, router, useForm, usePage} from '@inertiajs/react';
import { rememberSearch } from '@/utils/lastSearch';
import Pagination from '@/Components/Pagination.jsx';
import { RiVerifiedBadgeFill, RiSearch2Line, RiStarFill } from "react-icons/ri";
import FeedbackModal from "@/Components/FeedbackModal.jsx";
import {Select, Switch} from "antd";
import {IoSearch} from "react-icons/io5";
import {CgArrowsExchangeAltV} from "react-icons/cg";
import MobileFilterSheet from "@/Components/Mobile/MobileFilterSheet";

export default function Employees({ auth, employees, professions, filters = {} }) {
    const { t, i18n } = useTranslation();
    const toBoolean = (value) => value === true || value === 'true';
    const initialFilters = {
        search: filters.search || '',
        profession: filters.profession || '',
        isLookingWork: toBoolean(filters.isLookingWork),
        withCertificate: toBoolean(filters.withCertificate),
        withResume: toBoolean(filters.withResume),
    };
    const [isOpen, setIsOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [profession, setProfession] = useState(initialFilters.profession);
    const [isLookingWork, setIsLookingWork] = useState(initialFilters.isLookingWork);
    const [withCertificate, setWithCertificate] = useState(initialFilters.withCertificate);
    const [withResume, setWithResume] = useState(initialFilters.withResume);

    const { data, setData } = useForm(initialFilters);

    const { url } = usePage();
    useEffect(() => {
        rememberSearch('employees', url);
    }, [url]);

    const reloadEmployees = (params = data) => {
        router.get('/employees', params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ['employees', 'filters'],
        });
    };

    const handleFeedbackSubmit = (feedback) => {
        axios.post('/send-feedback', { feedback }).then((response) => {
            console.log(t('feedback_sent', { ns: 'header' }));
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleSearch = () => {
        setIsFilterOpen(false)
        reloadEmployees();
    };

    const resetSearch = () => {
        const emptyFilters = {
            search: '',
            profession: '',
            isLookingWork: false,
            withCertificate: false,
            withResume: false,
        };

        setData(emptyFilters);
        setProfession('');
        setIsLookingWork(false);
        setWithResume(false);
        setWithCertificate(false);
        reloadEmployees(emptyFilters);
    };

    const handleSearchChange = (event) => {
        setData('search', event.target.value);
    };
    const handleProfessionChange = (event) => {
        setProfession(event.target.value);
        setData('profession', event.target.value);
    };

    const handleIsLookingWorkChange = (checked) => {
        setIsLookingWork(checked);
        setData('isLookingWork', checked);
    };

    const handleWithCertificateChange = (checked) => {
        setWithCertificate(checked);
        setData('withCertificate', checked);
    };

    const handleWithResumeChange = (checked) => {
        setWithResume(checked);
        setData('withResume', checked);
    };

    const toDoubleString = useCallback((value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }, []);

    return (
        <GuestLayout hideMobileBottomNav={isFilterOpen}>
            <Head title="Биржа фрилансеров в Астане | Поиск работы и услуг фрилансеров">
                <meta name="description" content="Найдите специалиста или разместите свои услуги на бирже фрилансеров Жумыстап в Астане. Удобный поиск работы и специалистов в различных сферах" />
            </Head>
            <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleFeedbackSubmit} />
            {/* Mobile Filter Modal */}
            {isFilterOpen && (
                <MobileFilterSheet
                    title={t('filters', { ns: 'employees' })}
                    onClose={() => setIsFilterOpen(false)}
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={handleSearch}
                                className='w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white shadow-sm'
                            >
                                {t('apply', { ns: 'employees' })}
                            </button>
                            <button
                                type="button"
                                onClick={resetSearch}
                                className='mt-3 w-full rounded-xl border-2 border-blue-500 py-3 text-center font-semibold text-blue-500'
                            >
                                {t('reset', { ns: 'employees' })}
                            </button>
                        </>
                    }
                >
                    <div className='text-gray-500 mt-3'>{t('any_work_default', { ns: 'employees' })}</div>
                    <select
                        value={profession}
                        onChange={handleProfessionChange}
                        className='block mt-1 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                    >
                        <option value="">{t('select', { ns: 'employees' })}</option>
                        {professions.map(prof => (
                            <option key={prof.id} value={prof.id}>
                                {prof.name_ru}
                            </option>
                        ))}
                    </select>
                    <div className='jt-mobile-filter-toggle'>
                        <div className='jt-mobile-filter-toggle__label'>{t('looking_work', { ns: 'employees' })}</div>
                        <Switch checked={isLookingWork} onChange={handleIsLookingWorkChange} />
                    </div>
                    <div className='jt-mobile-filter-toggle'>
                        <div className='jt-mobile-filter-toggle__label'>{t('with_certificate', { ns: 'employees' })}</div>
                        <Switch checked={withCertificate} onChange={handleWithCertificateChange} />
                    </div>
                    <div className='jt-mobile-filter-toggle'>
                        <div className='jt-mobile-filter-toggle__label'>{t('with_resume', { ns: 'employees' })}</div>
                        <Switch checked={withResume} onChange={handleWithResumeChange} />
                    </div>
                </MobileFilterSheet>
            )}
            <div className='grid grid-cols-1 md:grid-cols-7 gap-6'>
                <div className='col-span-5'>
                    <div className='m-5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg'>
                        <div className='p-8'>
                            <h1 className='text-2xl font-bold text-white mb-4 text-center md:text-left'>
                                {t('for_everyone', { ns: 'index' })}
                            </h1>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <Link
                                    href="/announcements/create"
                                    className='px-6 py-3 text-white text-center rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium'
                                >
                                    {t('post_announcement', { ns: 'carousel' })}
                                </Link>
                                <Link
                                    href="/employees"
                                    className='px-6 py-3 text-white text-center rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium'
                                >
                                    {t('find_employee', { ns: 'carousel' })}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5 flex items-center px-3 md:px-5 md:mb-5 gap-x-2'>
                        <input
                            type="text"
                            value={data.search}
                            onChange={handleSearchChange}
                            placeholder={t('search', { ns: 'employees' })}
                            className='block border rounded-lg w-full text-base border-gray-300 px-5 p-2'
                        />
                        <button
                            className='md:block hidden text-white rounded-lg bg-blue-500 py-2 px-5'
                            onClick={handleSearch}
                        >
                            {t('search', { ns: 'employees' })}
                        </button>
                        <button
                            className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500 p-0 text-2xl leading-none text-white md:hidden'
                            onClick={handleSearch}
                            aria-label={t('search', { ns: 'employees' })}
                        >
                            <IoSearch />
                        </button>
                        <div
                            onClick={() => setIsFilterOpen(true)}
                            className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-blue-500 p-0 text-3xl leading-none text-blue-500 md:hidden'
                            role="button"
                            aria-label={t('filters', { ns: 'employees' })}
                        >
                            <CgArrowsExchangeAltV />
                        </div>
                    </div>
                    <div className="space-y-4 mt-6">
                        {employees.data.map((employee, index) => (
                            <Link
                                href={`/user/${employee.id}`}
                                key={index}
                                className="block bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                            >
                                <div className="p-6 flex items-start gap-4">
                                    <img
                                        src={employee.image_url ? `/storage/${employee.image_url}` : '/images/default-avatar.png'}
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-avatar.png'; }}
                                        alt=""
                                        className="w-14 h-14 object-cover rounded-full ring-2 ring-gray-100 shrink-0"
                                    />

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="font-bold text-gray-900">
                                                {employee.name}
                                            </h2>
                                            {employee.is_graduate === 1 ? (
                                                <RiVerifiedBadgeFill className="text-xl text-blue-500" />
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                                    {t('non_graduate_label', { ns: 'employees' })}
                                                </span>
                                            )}
                                            {parseFloat(employee.rating) > 0 && (
                                                <span className="inline-flex items-center gap-0.5 text-sm font-medium text-amber-500">
                                                    <RiStarFill className="text-base" />
                                                    {toDoubleString(employee.rating)}
                                                </span>
                                            )}
                                        </div>

                                        {employee.resume_position && (
                                            <div className="mt-1 text-base font-medium text-gray-800">
                                                {employee.resume_position}
                                            </div>
                                        )}

                                        {employee.professions.length > 0 && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                {employee.professions.map((profession, index) => (
                                                    <div key={index}>
                                                        {i18n.language === 'ru' ?
                                                            profession.profession_name :
                                                            profession.profession_name_kz
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(!employee.has_resume || employee.status === 'В активном поиске') && (
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                {!employee.has_resume && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                                        {t('no_resume', { ns: 'employees' })}
                                                    </span>
                                                )}
                                                {employee.status === 'В активном поиске' && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                                        {i18n.language === 'ru' ? employee.status : (employee.status_kz || employee.status)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="hidden md:block">
                                        <button className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200">
                                            { t('detail', { ns: 'employees' })}
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        <div className="mt-6">
                            <Pagination
                                links={employees.links}
                                only={['employees', 'filters']}
                                preserveState
                            />
                        </div>
                    </div>
                </div>
                {/* Desktop Filter Sidebar */}
                <div className='col-span-2 border-l border-gray-200 h-screen sticky top-0 md:block hidden'>
                    <div>
                        <div className='font-bold p-3 text-sm border-b border-gray-200'>{t('filters', { ns: 'employees' })}</div>
                    </div>
                    <div className='flex px-3 flex-col md:flex-col'>
                        <div className='text-gray-500 mt-3'>{t('any_work_default', { ns: 'employees' })}</div>
                        <select
                            value={profession}
                            onChange={handleProfessionChange}
                            className='block mt-1 w-full text-base border-gray-300 px-5 py-2 rounded-lg'
                        >
                            <option value="">{t('select', { ns: 'employees' })}</option>
                            {professions.map(prof => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.name_ru}
                                </option>
                            ))}
                        </select>
                        <div className='mt-5 flex items-center'>
                            <div>{t('looking_work', { ns: 'employees' })}</div>
                            <Switch className='ml-auto' checked={isLookingWork} onChange={handleIsLookingWorkChange} />
                        </div>
                        <div className='mt-5 flex items-center'>
                            <div>{t('with_certificate', { ns: 'employees' })}</div>
                            <Switch className='ml-auto' checked={withCertificate} onChange={handleWithCertificateChange} />
                        </div>
                        <div className='mt-5 flex items-center'>
                            <div>{t('with_resume', { ns: 'employees' })}</div>
                            <Switch className='ml-auto' checked={withResume} onChange={handleWithResumeChange} />
                        </div>
                        <div className='bottom-10'>
                            <div onClick={handleSearch} className='w-full bg-blue-600 text-white font-semibold py-2 text-center rounded-lg mt-10 cursor-pointer'>
                                {t('apply', { ns: 'employees' })}
                            </div>
                            <div onClick={resetSearch} className='w-full text-blue-500 border-2 border-blue-500 font-semibold py-2 text-center rounded-lg mt-2 cursor-pointer'>
                                {t('reset', { ns: 'employees' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
