import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function Employees({ auth, employees, professions, errors }) {
    const { t, i18n } = useTranslation();
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const jobTypeParam = searchParams.get('job-type');
    const professionParam = searchParams.get('profession');

    const [jobType, setJobType] = useState(jobTypeParam || 'all');
    const [profession, setProfession] = useState(professionParam || '');
    const [graduateStatus, setGraduateStatus] = useState('all');

    function toDoubleString(value) {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }

    const handleJobTypeChange = (event) => {
        setJobType(event.target.value);
    };

    const handleProfessionChange = (event) => {
        setProfession(event.target.value);
    };

    const handleGraduateStatusChange = (event) => {
        setGraduateStatus(event.target.value);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const shuffledEmployees = shuffleArray([...employees.data]);

    const filteredEmployees = shuffledEmployees
        .filter((employee) => {
            const jobTypeMatches =
                jobType === 'all' ||
                (jobType === 'vacancy' && employee.work_status === 'Ищет работу') ||
                (jobType === 'project' && employee.work_status === 'Ищет заказы');
            const professionMatches =
                profession === '' ||
                (employee.professions && employee.professions.some(prof => prof.profession_name === profession));
            const graduateStatusMatches =
                graduateStatus === 'all' ||
                (graduateStatus === 'graduate' && employee.is_graduate) ||
                (graduateStatus === 'non-graduate' && !employee.is_graduate);

            return jobTypeMatches && professionMatches && graduateStatusMatches;
        })
        .reverse();

    return (
        <>
            <GuestLayout>
                <div className='grid md:grid-cols-7 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  py-10 mt-5 rounded-lg flex'>
                    <div className='pl-5 pr-5 md:pl-20 my-auto col-span-3'>
                        <div className='text-xl text-center md:text-left uppercase mb-2 font-bold text-white'>{t('for_everyone', {ns: 'index'})}</div>
                        <div className='md:flex-row flex flex-col gap-2 md:gap-5 mt-4'>
                            <Link href="/create_announcement" className='px-3 block md:px-5 py-2 text-white md:text-md text-sm rounded-lg border-2 border-white hover:bg-white transition-all duration-150 hover:text-black'>{t('post_ad', { ns: 'carousel' })}</Link>
                            <Link href="/employees" className='px-3 md:px-5 inline-block py-2 text-white md:text-md text-sm rounded-lg border-2 border-white hover:bg-white transition-all duration-150 hover:text-black'>{t('find_employee', { ns: 'carousel' })}</Link>
                        </div>
                    </div>
                    <div className='md:flex hidden text-white gap-x-20 col-span-4'>
                        <div>
                            <div className='font-bold text-4xl'>100+</div>
                            <div className='font-light text-sm'>мобилографов</div>
                        </div>
                        <div>
                            <div className='font-bold text-4xl'>100+</div>
                            <div className='font-light text-sm'>СММщиков</div>
                        </div>
                        <div>
                            <div className='font-bold text-4xl'>150+</div>
                            <div className='font-light text-sm'>Швей</div>
                        </div>
                        <div>
                            <div className='font-bold text-4xl'>70+</div>
                            <div className='font-light text-sm'>Барист</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <select
                        name="jobType"
                        value={jobType}
                        onChange={handleJobTypeChange}
                        className={`block border rounded-lg w-full md:w-auto ${
                            jobType === 'all'
                                ? 'border-gray-300 text-gray-500'
                                : 'font-bold border-[#f36706]'
                        }`}
                    >
                        <option value="all">
                            {jobType === 'all'
                                ? t('any_job_default', { ns: 'employees' })
                                : t('any_job', { ns: 'employees' })}
                        </option>
                        <option value="vacancy">{t('search_job', { ns: 'employees' })}</option>
                        <option value="project">{t('search_project', { ns: 'employees' })}</option>
                    </select>
                    <select
                        name="profession"
                        value={profession}
                        onChange={handleProfessionChange}
                        className={`block border rounded-lg w-full md:w-auto ${
                            profession === ''
                                ? 'border-gray-300 text-gray-500'
                                : 'font-bold border-[#f36706]'
                        }`}
                        placeholder="Направление"
                    >
                        <option value="">
                            {profession === ''
                                ? t('any_work_default', { ns: 'employees' })
                                : t('any_work', { ns: 'employees' })}
                        </option>
                        {professions.map((profession, index) => (
                            <option key={index} value={profession.name_ru}>
                                {i18n.language === 'ru' ? profession.name_ru : profession.name_kz}
                            </option>
                        ))}
                    </select>
                    <select
                        name="graduateStatus"
                        value={graduateStatus}
                        onChange={handleGraduateStatusChange}
                        className={`block border rounded-lg w-full md:w-auto ${
                            graduateStatus === 'all'
                                ? 'border-gray-300 text-gray-500'
                                : 'font-bold border-[#f36706]'
                        }`}
                    >
                        <option value="all">
                            {graduateStatus === 'all'
                                ? t('any_graduate_default', { ns: 'employees' })
                                : t('any_graduate', { ns: 'employees' })}
                        </option>
                        <option value="graduate">{t('graduate', { ns: 'employees' })}</option>
                        <option value="non-graduate">{t('non_graduate', { ns: 'employees' })}</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-5">
                    {filteredEmployees.map((employee, index) => (
                        <Link href={`/user/${employee.id}`} key={index} className="p-3 border border-gray-300 rounded-lg hover:border-orange-500 transition-all duration-150">
                            <div className="flex gap-3">
                                <div>
                                    <img
                                        src={`/storage/${employee.image_url}`}
                                        alt=""
                                        className="w-[40px] h-[40px] object-cover rounded-full"
                                    />
                                    <div className="text-sm font-bold text-white bg-orange-500 rounded text-center relative w-[40px] bottom-[10px]">
                                        {toDoubleString(employee.rating)}
                                    </div>
                                </div>
                                <div className='font-bold mb-auto gap-2 items-center flex'>{employee.name}<span style={{ display: 'inline-flex', alignItems: 'center' }}>{employee.is_graduate ? (<RiVerifiedBadgeFill className='fiex-star text-xl items-center text-orange-500' />):('')}</span></div>
                            </div>
                            <div className="mt-2 text-sm">
                                {employee.professions.length > 0 && (
                                    <>
                                        {employee.professions.map((profession, index) => (
                                            <div key={index}>{i18n.language == 'ru' ? (profession.profession_name) : (profession.profession_name_kz)}</div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
                <Pagination links={employees.links} />
            </GuestLayout>
        </>
    );
}

