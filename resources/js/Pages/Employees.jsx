import React, {useCallback, useState, memo, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import {Head, Link, router, useForm} from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import { RiVerifiedBadgeFill, RiSearch2Line } from "react-icons/ri";
import FeedbackModal from "@/Components/FeedbackModal.jsx";
import {Select, Switch} from "antd";
import {IoSearch} from "react-icons/io5";
import {CgArrowsExchangeAltV, CgClose} from "react-icons/cg";

export default function Employees({ auth, employees, professions, filters = {} }) {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [profession, setProfession] = useState('');
    const [isLookingWork, setIsLookingWork] = useState(false);
    const [withCertificate, setWithCertificate] = useState(false);
    const [withResume, setWithResume] = useState(false);

    const { data, setData, get } = useForm({
        search: '',
        profession: '',
        isLookingWork: false,
        withCertificate: false,
        withResume: false,
    });

    const handleFeedbackSubmit = (feedback) => {
        axios.post('/send-feedback', { feedback }).then((response) => {
            console.log(t('feedback_sent', { ns: 'header' }));
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleSearch = () => {
        setIsFilterOpen(false)
        get('/employees', { preserveScroll: true, preserveState: true });
    };

    const resetSearch = () => {
        setData({
            search: '',
            profession: '',
            isLookingWork: false,
            withCertificate: false,
            withResume: false,
        });
        setSearch('');
        setProfession('');
        setIsLookingWork(false);
        setWithResume(false);
        setWithCertificate(false);
        get('/employees', {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search');
        const profession = params.get('profession');
        const isLookingWork = params.get('isLookingWork');
        const withCertificate = params.get('withCertificate');
        const withResume = params.get('withResume');
        if (search || profession || isLookingWork || withCertificate || withResume) {
            setData({
                search: search || '',
                profession: profession || '',
                isLookingWork: isLookingWork === 'true',
                withCertificate: withCertificate === 'true',
                withResume: withResume === 'true',
            });
            setSearch(search || '');
            setProfession(profession || '');
            setIsLookingWork(isLookingWork === 'true');
            setWithCertificate(withCertificate === 'true');
            setWithResume(withResume === 'true');
        }
    }, []);

    const toDoubleString = useCallback((value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }, []);

    return (
        <GuestLayout>
            <Head title="Биржа фрилансеров в Астане | Поиск работы и услуг фрилансеров">
                <meta name="description" content="Найдите специалиста или разместите свои услуги на бирже фрилансеров Жумыстап в Астане. Удобный поиск работы и специалистов в различных сферах" />
            </Head>
            <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleFeedbackSubmit} />
            {/* Mobile Filter Modal */}
            {isFilterOpen && (
                <div className='fixed top-0 left-0 w-full h-screen bg-white z-40 px-5 py-7'>
                    <div className='flex w-full items-center'>
                        <div className='text-xl font-bold'>{t('filters', { ns: 'employees' })}</div>
                        <CgClose
                            onClick={() => setIsFilterOpen(false)}
                            className='ml-auto text-2xl inline-block cursor-pointer'
                        />
                    </div>
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
                    <div className="space-y-4 mt-6">
                        {employees.data.map((employee, index) => (
                            <Link
                                href={`/user/${employee.id}`}
                                key={index}
                                className="block bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                            >
                                <div className="p-6 flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={employee.image_url ? `/storage/${employee.image_url}` : '/images/default-avatar.png'}
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-avatar.png'; }}
                                            alt=""
                                            className="w-14 h-14 object-cover rounded-full ring-2 ring-gray-100"
                                        />
                                        <div className="mt-1 px-2 py-0.5 text-sm font-medium text-gray-600 bg-gray-100 rounded">
                                            {toDoubleString(employee.rating)}
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold text-gray-900">
                                                {employee.name}
                                            </h2>
                                            {employee.is_graduate === 1 && (
                                                <RiVerifiedBadgeFill className="text-xl text-blue-500" />
                                            )}
                                        </div>

                                        <div className="text-gray-500">
                                            @{employee.email.split('@')[0]}
                                        </div>

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

                                        <div className="mt-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                                {employee.status}
                                            </span>
                                        </div>
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
                            <Pagination links={employees.links} />
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
