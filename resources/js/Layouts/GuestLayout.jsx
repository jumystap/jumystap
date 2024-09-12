import { useEffect, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { CgClose, CgMenuRight, CgShoppingBag, CgChevronDown } from "react-icons/cg";
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiHome2Line } from "react-icons/ri";
import { MdOutlineBookmarks, MdOutlineCloud, MdOutlineGroupAdd, MdOutlineLogout, MdOutlineWorkOutline } from "react-icons/md";
import { IoSchoolOutline } from 'react-icons/io5';

export default function Guest({ children }) {
    const { t, i18n } = useTranslation();
    const { auth, url } = usePage().props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [source, setSource] = useState('');

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };

    useEffect(() => {
        let savedLanguage = localStorage.getItem('i18nextLng') || 'ru';
        if (savedLanguage !== 'ru' && savedLanguage !== 'kz') {
            savedLanguage = 'ru';
        }
        i18n.changeLanguage(savedLanguage);

        const params = new URLSearchParams(location.search);
        const sourceParam = params.get('source') || '';
        if (sourceParam != '') {
            setSource(sourceParam);
            localStorage.setItem('source', sourceParam);
        }
    }, [i18n]);

    const handleLogout = () => {
        axios.post('/logout').then(() => {
            window.location.reload();
        });
    };

    const currentPath = new URL(url, window.location.origin);
    console.log(window.location.pathname)
    console.log(currentPath);

    const isActive = (path) => window.location.pathname === path;

    return (
        <>
        <Head title="JUMYSTAP – программа возможностей">
            <meta name="description" content="Найдите работу и вакансии в Казахстане на Жумыстап. Биржа труда с актуальными вакансиями для соискателей." />
        </Head>
        <div className='md:hidden block'>
            <div className='sticky top-0 bg-white z-30 flex py-5 px-3 items-center'>
                <Link
                    className={`block ${isActive('/') ? 'text-blue-500 font-semibold' : ''}`}
                    href='/'
                >
                    <img src='/images/Лого.png' className='w-[150px]'/>
                </Link>
                <div className='ml-auto flex gap-x-4 items-center'>
                    <div
                        className="items-center gap-1 px-7 py-2 border rounded-full text-gray-500 border-gray-300 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 cursor-pointer"
                        onClick={() => changeLanguage(i18n.language === 'ru' ? 'kz' : 'ru')}
                    >
                        {i18n.language == 'ru' ? 'Рус' : 'Қаз'}
                    </div>
                    <button className="md:hidden text-2xl ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <CgMenuRight />
                    </button>
                </div>
            </div>
            <div className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="bg-black bg-opacity-0 flex-grow" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="bg-white w-4/5 h-full mt-2 p-4 shadow-lg">
                    <div className='flex w-full'>
                    <button className="text-2xl ml-auto mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                        <CgClose />
                    </button>
                    </div>
                    <Link href='/reviews' className="block py-3 border-b hover:font-semibold transition-all px-2 w-full text-left ease-in-out duration-100">
                        {t('feeback', { ns: 'header'})}
                    </Link>
                    <Link href="/employees?job-type=vacancy" className="block py-3 px-2 border-b hover:font-semibold transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav_for_employers', { ns: 'header'})}
                    </Link>
                    <Link href="/employees?job-type=project" className="block py-3 px-2 border-b hover:font-semibold transition-all ease-in-out duration-100" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav_for_clients', { ns: 'header'})}
                    </Link>
                    <Link href="/announcements" className="block py-3 border-b px-2  hover:font-semibold transition-all ease-in-out duration-100" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav_for_graduates', { ns: 'header'})}
                    </Link>
                    <Link href="/faq" className="block py-3 border-b hover:font-semibold px-2 transition-all ease-in-out duration-100" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav_about_training', { ns: 'header'})}
                    </Link>
                    <Link href="/fav" className="block py-3 border-b hover:font-semibold px-2 transition-all ease-in-out duration-100" onClick={() => setIsMobileMenuOpen(false)}>
                        Избранные
                    </Link>
                    <Link href="/about" className="block py-3  hover:font-semibold px-2 transition-all ease-in-out duration-100" onClick={() => setIsMobileMenuOpen(false)}>
                        О платформе
                    </Link>

                    {auth.user ? (
                        <>
                            <Link href="/profile" className="block py-2 border px-2 text-center mt-2 rounded-lg hover:font-semibold transition-all ease-in-out duration-100" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('my_profile', { ns: 'header' })}
                            </Link>
                            <button onClick={handleLogout} className="block py-3 border-b hover:font-semibold transition-all ease-in-out duration-100 w-full text-left">
                                {t('logout', { ns: 'header' })}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/register" className="block border-bm mt-2 hover:font-semibold transition-all ease-in-out duration-100 bg-blue-500 w-full text-center py-2 text-white rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('register', { ns: 'header' })}
                            </Link>
                            <Link href="/login" className="block border mt-2 hover:font-semibold transition-all ease-in-out duration-100 border-blue-500 w-full text-center py-2 text-blue-500 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('login', { ns: 'header' })}
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
        <div className='md:flex hidden font-regular'>
            <div className="mx-auto min-h-[650px] max-w-[1400px] grid grid-cols-9 md:min-w-[1400px] px-5">
                <div className='sticky top-0 pt-5 items-center col-span-2 h-screen border-r pr-5 border-gray-200'>
                    <Link
                        className={`block ${isActive('/') ? 'text-blue-500 font-semibold' : ''}`}
                        href='/'
                    >
                        <ApplicationLogo/>
                    </Link>
                    <Link
                        className={`flex items-center text-xl gap-x-4 mt-5 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive('/') ? 'text-blue-500 font-semibold' : ''}`}
                        href='/'
                    >
                        <RiHome2Line className='text-3xl'/>
                        Главная
                    </Link>
                    <Link
                        className={`flex items-center text-xl gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive('/employees') ? 'text-blue-500 font-semibold' : ''}`}
                        href='/employees'
                    >
                        <HiOutlineUserGroup className='text-3xl'/>
                        {t('nav_for_employers', { ns: 'header'})}
                    </Link>
                    <Link
                        className={`flex items-center text-xl gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive('/announcements') ? 'text-blue-500 font-semibold' : ''}`}
                        href='/announcements'
                    >
                        <MdOutlineWorkOutline className='text-3xl'/>
                        Вакансии
                    </Link>
                    <Link
                        className={`flex items-center text-xl gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive('/about') ? 'text-blue-500 font-semibold' : ''}`}
                        href='/about'
                    >
                        <MdOutlineCloud className='text-3xl'/>
                        О платформе
                    </Link>
                    <Link
                        className={`flex items-center text-xl gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive('/faq') ? 'text-blue-500 font-semibold' : ''}`}
                        href='/faq'
                    >
                        <IoSchoolOutline className='text-3xl'/>
                        Об обучении
                    </Link>
                    <Link
                        className={`flex items-center text-xl gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive('/fav') ? 'text-blue-500 font-semibold' : ''}`}
                        href='/fav'
                    >
                        <MdOutlineBookmarks className='text-3xl'/>
                        Избранные
                    </Link>
                    {!auth.user ? (
                        <>
                            <Link
                                className='text-center block px-10 mt-10 text-white font-bold py-1 text-lg bg-blue-500 border-[3px] hover:bg-white hover:text-blue-500 transition-all duration-300 border-blue-500 rounded-full'
                                href='/register'
                            >
                                {t('register', { ns: 'header'})}
                            </Link>
                            <Link
                                className='text-center hover:bg-blue-500 hover:text-white transition-all duration-300 block w-full mt-3 text-blue-500 font-bold py-1 text-lg border-[3px] border-blue-500 rounded-full'
                                href='/login'
                            >
                                Войти
                            </Link>
                        </>
                    ):(
                        <>
                        <Link href='/profile' className='flex gap-x-3 py-3 mt-5 hover:px-3 items-center transition-all duration-300 hover:bg-gray-100 rounded-full'>
                            <img src={`/storage/${auth.user.image_url}`} className='w-[50px] h-[50px] rounded-full'/>
                            <div className=''>
                                <div className='font-bold'>{auth.user.name}</div>
                                <div className='text-sm text-gray-500'>{auth.user.email}</div>
                            </div>
                        </Link>
                        <button onClick={handleLogout} className="text-xl flex items-center gap-x-4 mt-2 font-regular transition-all duration-150 py-2 hover:bg-gray-100 w-full text-left rounded-full hover:px-5">
                            <MdOutlineLogout className='text-3xl'/>
                            {t('logout', { ns: 'header' })}
                        </button>
                        </>
                    )}
                    <div>
                    </div>
                </div>
                <div className='col-span-7'>
                    {children}
                </div>
            </div>
        </div>
        </>
    );
}
