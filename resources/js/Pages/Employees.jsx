import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function Employees({ auth, employees, professions, errors }) {
    const { t, i18n } = useTranslation();

    function toDoubleString(value) {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }

    return (
        <>
            <GuestLayout>
                <Head title="Биржа фрилансеров в Астане | Поиск работы и услуг фрилансеров">
                    <meta name="description" content="Найдите специалиста или разместите свои услуги на бирже фрилансеров Жумыстап в Астане. Удобный поиск работы и специалистов в различных сферах" />
                </Head>
                <div className='grid grid-cols-1 md:grid-cols-7'>
                    <div className='col-span-5'>
                        <div className='grid m-5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  py-10 mt-5 rounded-lg flex'>
                            <div className='pl-5 pr-5 my-auto'>
                                <div className='text-xl text-center md:text-left uppercase mb-2 font-bold text-white'>{t('for_everyone', { ns: 'index' })}</div>
                                <div className='md:flex-row flex flex-col gap-2 md:gap-5 mt-4'>
                                    <Link href="/create_announcement" className='px-3 block md:px-5 py-2 text-white md:text-md text-sm rounded-lg border-2 border-white hover:bg-white transition-all duration-150 hover:text-black'>{t('post_ad', { ns: 'carousel' })}</Link>
                                    <Link href="/employees" className='px-3 md:px-5 inline-block py-2 text-white md:text-md text-sm rounded-lg border-2 border-white hover:bg-white transition-all duration-150 hover:text-black'>{t('find_employee', { ns: 'carousel' })}</Link>
                                </div>
                            </div>
                        </div>
                        <div className='block md:hidden px-5 gap-y-3 flex flex-col'>
                            <select
                                name="jobType"
                                className={`block border rounded-lg w-full md:w-auto`}
                            >
                                <option value="all">
                                    {t('any_job_default', { ns: 'employees' })}
                                </option>
                                <option value="vacancy">{t('search_job', { ns: 'employees' })}</option>
                                <option value="project">{t('search_project', { ns: 'employees' })}</option>
                            </select>
                            <select
                                name="profession"
                                className={`block border rounded-lg w-full md:w-auto`}
                                placeholder="Направление"
                            >
                                <option value="">
                                    {t('any_work_default', { ns: 'employees' })}
                                </option>
                                {professions.map((profession, index) => (
                                    <option key={index} value={profession.name_ru}>
                                        {i18n.language === 'ru' ? profession.name_ru : profession.name_kz}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="graduateStatus"
                                className={`block border rounded-lg w-full md:w-auto`}
                            >
                                <option value="all">
                                    {t('any_graduate_default', { ns: 'employees' })}
                                </option>
                                <option value="graduate">{t('graduate', { ns: 'employees' })}</option>
                                <option value="non-graduate">{t('non_graduate', { ns: 'employees' })}</option>
                            </select>
                        </div>
                        <div className="gap-5 mt-5">
                            {employees.data.map((employee, index) => (
                                <Link href={`/user/${employee.id}`} key={index} className="hover:bg-gray-100 block px-5 py-2 transition-all duration-150">
                                    <div className="flex gap-3">
                                        <div>
                                            <img
                                                src={`/storage/${employee.image_url}`}
                                                alt=""
                                                className="w-[40px] h-[40px] object-cover rounded-full"
                                            />
                                            <div className="text-sm font-bold text-gray-500 bg-gray-200 rounded text-center relative w-[40px] bottom-[10px]">
                                                {toDoubleString(employee.rating)}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <div className='font-bold mb-auto gap-2 items-center flex'>{employee.name}<span style={{ display: 'inline-flex', alignItems: 'center' }}>{employee.is_graduate ? (<RiVerifiedBadgeFill className='fiex-star text-xl items-center text-blue-500' />) : ('')}</span></div>
                                                <div className='text-gray-500'>@{employee.email.split('@')[0]}</div>
                                                <div className="mt-2 text-sm">
                                                    {employee.professions.length > 0 && (
                                                        <>
                                                            {employee.professions.map((profession, index) => (
                                                                <div key={index}>{i18n.language == 'ru' ? (profession.profession_name) : (profession.profession_name_kz)}</div>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                                <div className='inline-block'>
                                                    <div className='text-sm bg-green-100 text-green-500 py-1 px-2 rounded-lg mt-3'>{employee.status}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='ml-auto md:block hidden'>
                                            <div className='px-5 py-2 rounded-full bg-blue-700 hover:bg-blue-500 transition-all duration-150 text-white text-sm inline-block font-semibold'>
                                                Подробнее
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <Pagination links={employees.links} />
                        </div>
                    </div>
                    <div className='col-span-2 hidden md:block px-3 border-l h-screen sticky top-0 border-gray-200'>
                        <div className="flex flex-col md:flex-col gap-2 mt-5">
                            <select
                                name="jobType"
                                className={`block border rounded-lg w-full md:w-auto`}
                            >
                                <option value="all">
                                    {t('any_job_default', { ns: 'employees' })}
                                </option>
                                <option value="vacancy">{t('search_job', { ns: 'employees' })}</option>
                                <option value="project">{t('search_project', { ns: 'employees' })}</option>
                            </select>
                            <select
                                name="profession"
                                className={`block border rounded-lg w-full md:w-auto`}
                                placeholder="Направление"
                            >
                                <option value="">
                                    {t('any_work_default', { ns: 'employees' })}
                                </option>
                                {professions.map((profession, index) => (
                                    <option key={index} value={profession.name_ru}>
                                        {i18n.language === 'ru' ? profession.name_ru : profession.name_kz}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="graduateStatus"
                                className={`block border rounded-lg w-full md:w-auto`}
                            >
                                <option value="all">
                                    {t('any_graduate_default', { ns: 'employees' })}
                                </option>
                                <option value="graduate">{t('graduate', { ns: 'employees' })}</option>
                                <option value="non-graduate">{t('non_graduate', { ns: 'employees' })}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </>
    );
}

