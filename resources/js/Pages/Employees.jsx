import { useCallback, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination.jsx';
import { RiVerifiedBadgeFill, RiSearch2Line } from "react-icons/ri";

// Мемоизация компонента FilterSelect для предотвращения лишних рендеров
const FilterSelect = memo(({ name, options, value, onChange }) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
    >
        {options.map((option, index) => (
            <option key={index} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
));

// Мемоизация компонента FilterSection
const FilterSection = memo(({ children, className = "", searchTerm, onSearchChange, onSearch }) => {
    const { t } = useTranslation("employees"); // Загружаем namespace "employees"

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder={t("search_by_name")}
                    className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button
                    onClick={onSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                    <RiSearch2Line className="text-xl" />
                </button>
            </div>
            {children}
        </div>
    );
});


export default function Employees({ auth, employees, professions, filters = {} }) {
    const { t, i18n } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterValues, setFilterValues] = useState({
        jobType: filters.jobType || 'all',
        profession: filters.profession || '',
        graduateStatus: filters.graduateStatus || 'all',
    });

    // Используем useCallback для мемоизации обработчиков
    const handleSearch = useCallback(() => {
        router.get('/employees', {
            ...filterValues,
            search: searchTerm
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    }, [filterValues, searchTerm]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilterValues(prev => ({
            ...prev,
            [name]: value
        }));

        router.get('/employees', {
            ...filterValues,
            [name]: value,
            search: searchTerm
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    }, [filterValues, searchTerm]);

    const toDoubleString = useCallback((value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    }, []);

    return (
        <GuestLayout>
            <Head title="Биржа фрилансеров в Астане | Поиск работы и услуг фрилансеров">
                <meta name="description" content="Найдите специалиста или разместите свои услуги на бирже фрилансеров Жумыстап в Астане. Удобный поиск работы и специалистов в различных сферах" />
            </Head>

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

                    <FilterSection
                        className="md:hidden px-5"
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        onSearch={handleSearch}
                    >
                        <FilterSelect
                            name="jobType"
                            value={filterValues.jobType}
                            onChange={handleFilterChange}
                            options={[
                                { value: 'all', label: t('any_job_default', { ns: 'employees' }) },
                                { value: 'Ищет работу', label: t('search_job', { ns: 'employees' }) },
                                { value: 'Ищет заказы', label: t('search_project', { ns: 'employees' }) }
                            ]}
                        />
                        <FilterSelect
                            name="profession"
                            value={filterValues.profession}
                            onChange={handleFilterChange}
                            options={[
                                { value: '', label: t('any_work_default', { ns: 'employees' }) },
                                ...professions.map(prof => ({
                                    value: prof.id,
                                    label: i18n.language === 'ru' ? prof.name_ru : prof.name_kz
                                }))
                            ]}
                        />
                        <FilterSelect
                            name="graduateStatus"
                            value={filterValues.graduateStatus}
                            onChange={handleFilterChange}
                            options={[
                                { value: 'all', label: t('any_graduate_default', { ns: 'employees' }) },
                                { value: 'graduate', label: t('graduate', { ns: 'employees' }) },
                                { value: 'non-graduate', label: t('non_graduate', { ns: 'employees' }) }
                            ]}
                        />
                    </FilterSection>

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
                                            {employee.is_graduate && (
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

                <div className='col-span-2 hidden md:block'>
                    <div className="sticky top-5 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <FilterSection
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            onSearch={handleSearch}
                        >
                            <FilterSelect
                                name="jobType"
                                value={filterValues.jobType}
                                onChange={handleFilterChange}
                                options={[
                                    { value: 'all', label: t('any_job_default', { ns: 'employees' }) },
                                    { value: 'vacancy', label: t('search_job', { ns: 'employees' }) },
                                    { value: 'project', label: t('search_project', { ns: 'employees' }) }
                                ]}
                            />
                            <FilterSelect
                                name="profession"
                                value={filterValues.profession}
                                onChange={handleFilterChange}
                                options={[
                                    { value: '', label: t('any_work_default', { ns: 'employees' }) },
                                    ...professions.map(prof => ({
                                        value: prof.id,
                                        label: i18n.language === 'ru' ? prof.name_ru : prof.name_kz
                                    }))
                                ]}
                            />
                            <FilterSelect
                                name="graduateStatus"
                                value={filterValues.graduateStatus}
                                onChange={handleFilterChange}
                                options={[
                                    { value: 'all', label: t('any_graduate_default', { ns: 'employees' }) },
                                    { value: 'graduate', label: t('graduate', { ns: 'employees' }) },
                                    { value: 'non-graduate', label: t('non_graduate', { ns: 'employees' }) }
                                ]}
                            />
                        </FilterSection>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
