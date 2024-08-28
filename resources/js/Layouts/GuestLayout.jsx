import { useEffect, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, usePage } from '@inertiajs/react';
import { TbMessage2Plus } from "react-icons/tb";
import { GrLanguage } from "react-icons/gr";
import { FaPhoneAlt, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaTelegram } from "react-icons/fa";
import FeedbackModal from '@/Components/FeedbackModal'; // Import the modal
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import { CgClose, CgMenuRight, CgShoppingBag, CgChevronDown } from "react-icons/cg";

export default function Guest({ children }) {
    const { t, i18n } = useTranslation();
    const { auth } = usePage().props;
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
        if(sourceParam != ''){
            setSource(sourceParam);
            localStorage.setItem('source', sourceParam);
        }
    }, [i18n]);

    const handleLogout = () => {
        axios.post('/logout').then(() => {
            window.location.reload();
        });
    };

    const handleFeedbackSubmit = (feedback) => {
        axios.post('/send-feedback', { feedback }).then((response) => {
            console.log((t('feedback_sent', { ns: 'header' })));
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <>
        <Head title="JUMYSTAP – программа возможностей" />
        <div className="flex flex-col md:flex-row justify-center min-w-full md:px-[100px]">
            <div className="pt-5 flex flex-col items-center md:items-start w-full">
                <div className="flex flex-wrap gap-4 md:gap-8 text-[12pt] justify-between items-center w-full px-4 md:px-0">
                    <div className="flex justify-between w-full md:w-auto">
                        <Link href="/">
                            <ApplicationLogo />
                        </Link>
                        <div className="flex items-center gap-5 ">
                            <div className="flex items-center gap-1 cursor-pointer md:hidden" onClick={() => changeLanguage(i18n.language === 'ru' ? 'kz' : 'ru')}>
                                <GrLanguage className="text-xl"/>
                                <div>{i18n.language.toUpperCase()}</div>
                            </div>
                            <button className="md:hidden text-2xl ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <CgClose /> : <CgMenuRight />}
                            </button>
                        </div>
                    </div>
                    <div className={`flex-col md:flex-row font-light md:flex ${isMobileMenuOpen ? 'hidden' : 'hidden'} md:flex items-center w-64 md:w-auto`}>
                        <Link href="/employees?job-type=vacancy" className="hover:border-b-2 hover:border-[#F36706] py-3 hover:font-semibold block transition-all ease-in-out duration-100 md:mx-2">
                            {t('nav_for_employers', { ns: 'header'})}
                        </Link>
                        <Link href="/employees?job-type=project" className="hover:border-b-2 hover:border-[#F36706] py-3 hover:font-semibold block transition-all ease-in-out duration-100 md:mx-2">
                            {t('nav_for_clients', { ns: 'header'})}
                        </Link>
                        <Link href="/announcements" className="hover:border-b-2 hover:border-[#F36706] py-3 hover:font-semibold block transition-all ease-in-out duration-100 md:mx-2">
                            {t('nav_for_graduates', { ns: 'header'})}
                        </Link>
                        <Link href="/faq" className="hover:border-b-2 hover:border-[#F36706] py-3 hover:font-semibold block transition-all ease-in-out duration-100 md:mx-2">
                            {t('nav_about_training', { ns: 'header'})}
                        </Link>
                        <Link href="/about" className="hover:border-b-2 hover:border-[#F36706] py-3 hover:font-semibold block transition-all ease-in-out duration-100 md:mx-2">
                            О платформе
                        </Link>
                        <button className="md:mx-2 hover:border-b-2 hover:border-[#F36706] py-3 hover:font-semibold block transition-all ease-in-out duration-100" onClick={() => setIsFeedbackModalOpen(true)}>
                            {t('feeback', { ns: 'header'})}
                        </button>
                        <a href="tel:+77072213131" className="flex items-center gap-2 bg-[#F36706] py-2 px-4 text-white rounded-lg md:mx-2 mt-2 md:mt-0">
                            <FaPhoneAlt />
                            +7 707 221-31-31
                        </a>
                        {auth.user ? (
                            <div className="flex flex-col md:flex-row items-center md:hidden mt-2">
                                <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                                    {t('my_profile', { ns: 'header' })}
                                </Link>
                                <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
                                    {t('logout', { ns: 'header' })}
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="md:mx-2 mt-2 md:mt-0">
                                {t('login', { ns: 'header' })}
                            </Link>
                        )}
                    </div>
                    <div className="hidden md:flex items-center gap-1 cursor-pointer md:mx-2" onClick={() => changeLanguage(i18n.language === 'ru' ? 'kz' : 'ru')}>
                        <GrLanguage className="text-xl"/>
                        <div>{i18n.language.toUpperCase()}</div>
                    </div>
                    {auth.user && (
                        <div className="relative md:ml-2 hidden md:block">
                            <FaUserCircle className="text-2xl cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
                            {showDropdown && (
                                <div className="absolute z-30 right-0 mt-4 bg-white border rounded shadow-lg w-48">
                                    <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">{t('my_profile', { ns: 'header' })}</Link>
                                    <Link href="/fav" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Избранные</Link>
                                    <button onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">{t('logout', { ns: 'header' })}</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="min-h-[650px] w-full mt-4 md:px-[0px] px-5">
                    {children}
                </div>
                <div className="flex flex-col md:flex-row items-center rounded-t-lg w-full bg-gray-200 px-4 md:px-10 py-10 mt-20">
                    <div className="mb-4 md:mb-0">
                        <ApplicationLogo/>
                        <div className="text-sm mt-2 w-full md:w-[600px]">
                            {t('footer_description', { ns: 'header' })}
                        </div>
                    </div>
                    <div className="md:ml-auto mr-auto flex flex-row md:flex-row items-center">
                        <div className="border-r border-gray-300 pr-5 md:mb-0">
                            <div className="font-bold">{t('call_center_number', { ns: 'header' })}</div>
                            <a className="block text-sm px-3 py-2 text-white bg-[#F36706] rounded-lg text-center mt-2">+7 (707) 221 31-31</a>
                        </div>
                        <div className="pl-5 mr-auto">
                            <div className="font-bold">{t('social_media', { ns: 'header' })}</div>
                            <div className="flex gap-2">
                                <a href="https://www.instagram.com/joltap.kz/" className="mx-auto block text-white bg-orange-500 p-1 rounded-lg text-2xl mt-1">
                                    <FaInstagram />
                                </a>
                                <a href="https://t.me/jobsjoltap" className="block text-white mx-auto bg-orange-500 p-1 rounded-lg text-2xl mt-1">
                                    <FaTelegram />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                onSubmit={handleFeedbackSubmit}
            />
        </div>
        <div className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="bg-black bg-opacity-0 flex-grow" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="bg-white w-4/5 h-full mt-2 p-4 shadow-lg">
                <div className='flex w-full'>
                <button className="text-2xl ml-auto mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <CgClose />
                </button>
                </div>
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
                <Link href="/about" className="block py-3 border-b hover:font-semibold px-2 transition-all ease-in-out duration-100" onClick={() => setIsMobileMenuOpen(false)}>
                    О платформе
                </Link>
                <button className="block py-3 border-b hover:font-semibold transition-all px-2 w-full text-left ease-in-out duration-100" onClick={() => {
                    setIsFeedbackModalOpen(true);
                    setIsMobileMenuOpen(false);
                }}>
                    {t('feeback', { ns: 'header'})}
                </button>
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
                    <Link href="/login" className="block border-b hover:font-semibold transition-all ease-in-out duration-100 bg-orange-500 w-full text-center py-2 text-white rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('login', { ns: 'header' })}
                    </Link>
                )}

                <a href="tel:+77072213131" className="block py-3 border-b hover:font-semibold transition-all ease-in-out duration-100">
                    <FaPhoneAlt className="inline mr-2" />
                    +7 707 221-31-31
                </a>
            </div>
        </div>
        </>
    );
}

