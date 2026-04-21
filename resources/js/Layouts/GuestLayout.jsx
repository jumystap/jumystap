import {useEffect, useState} from "react";
import {router} from '@inertiajs/react';
import ApplicationLogo from "@/Components/ApplicationLogo";
import {IoChatbubblesOutline} from "react-icons/io5";
import {
    CgClose, CgMenuRight, CgShoppingBag, CgChevronDown,
} from "react-icons/cg";
import {Head, Link, usePage} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
import {HiOutlineHome, HiOutlineUserGroup} from "react-icons/hi2";
import {RiHome2Line} from "react-icons/ri";
import {
    MdLanguage, MdOutlineBookmarks, MdOutlineCloud, MdOutlineGroupAdd, MdOutlineLogout, MdOutlineWorkOutline,
} from "react-icons/md";
import {IoSchoolOutline} from "react-icons/io5";
import {Button, Dropdown, Space} from "antd";
import {HiOutlineDotsCircleHorizontal} from "react-icons/hi";

import {FaInstagram, FaYoutube, FaTelegram} from "react-icons/fa";
import MobileHeader from "@/Components/Welcome/MobileHeader";
import MobileBottomNav from "@/Components/Welcome/MobileBottomNav";

export default function Guest({
    children,
    hideMobileHeader = false,
    hideMobileBottomNav = false,
    mobileContentClassName = "",
}) {
    const {t, i18n} = useTranslation();
    const {auth, url} = usePage().props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [source, setSource] = useState("");

    const items = [
        {
            key: "1",
            label: t("profile", {ns: "header"}),
            onClick: () => router.visit('/profile'),
        },
        {
            key: "2",
            label: t("favorite", {ns: "header"}),
            onClick: () => router.visit('/fav'),
        },
        {
            key: "3",
            label: t("nav_for_about", {ns: "header"}),
            onClick: () => router.visit('/faq'),
        },
        {
            key: "4",
            label: t("nav_for_employers", {ns: "header"}),
            onClick: () => router.visit('/employees'),
        },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("i18nextLng", lng);
        const locale = lng === 'kz' ? 'kk' : lng;
        document.querySelector('meta[name="locale"]')?.setAttribute('content', locale);
        document.cookie = `locale=${locale}; path=/; SameSite=Lax`;
        window.axios.defaults.headers.common['X-Locale'] = locale;

        router.get(window.location.pathname, {}, {
            headers: {'X-Locale': lng}, // или query param ?lang=lng
            replace: true, preserveScroll: true, preserveState: false,
        });
    };

    useEffect(() => {
        let savedLanguage = localStorage.getItem("i18nextLng") || "ru";
        if (savedLanguage !== "ru" && savedLanguage !== "kz") {
            savedLanguage = "ru";
        }
        i18n.changeLanguage(savedLanguage);

        const params = new URLSearchParams(location.search);
        const sourceParam = params.get("source") || "";
        if (sourceParam != "") {
            setSource(sourceParam);
            localStorage.setItem("source", sourceParam);
        }
    }, [i18n]);

    const handleLogout = () => {
        axios.post("/logout").then(() => {
            window.location.reload();
        });
    };

    const currentPath =
        typeof window !== "undefined"
            ? window.location.pathname
            : new URL(url, "https://jumystap.kz").pathname;

    const isActive = (path) => currentPath === path;

    const mobileContentClasses = [
        "jt-mobile-page-shell",
        hideMobileBottomNav ? "jt-mobile-page-shell--no-nav" : "",
        mobileContentClassName,
    ]
        .filter(Boolean)
        .join(" ");

    return (<>
            <div className="jt-mobile-app md:hidden">
                <div className="jt-mobile-app__inner">
                    {!hideMobileHeader ? (
                        <MobileHeader
                            auth={auth}
                            language={i18n.language}
                            onLanguageToggle={() =>
                                changeLanguage(i18n.language === "ru" ? "kz" : "ru")
                            }
                            t={t}
                        />
                    ) : null}
                    <div className={mobileContentClasses}>{children}</div>
                </div>
                {!hideMobileBottomNav ? (
                    <MobileBottomNav currentPath={currentPath} t={t} />
                ) : null}
            </div>
            <div className="jt-desktop-shell hidden md:flex font-regular">
                <div className="jt-desktop-shell__grid mx-auto grid w-full max-w-[1350px] grid-cols-10 gap-10 px-5">
                    <aside className="jt-desktop-sidebar col-span-2 border-r border-gray-100 pr-5">
                        <div className="jt-desktop-sidebar__scroll">
                        <Link
                            className={`block ${isActive("/") ? "text-blue-500 font-semibold" : ""}`}
                            href="/"
                        >
                            <ApplicationLogo/>
                        </Link>
                        <Link
                            href="/ads"
                            className="block mt-5 overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                        >
                            {i18n.language === 'ru' ? (
                                <img src="/images/marketplace_ru.png" className="w-full h-auto object-cover" />
                            ) : (
                                <img src="/images/marketplace_kz.png" className="w-full h-auto object-cover" />
                            )}
                        </Link>
                        <Link
                            className={`flex items-center text-l gap-x-4 font-regular mt-5 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/") ? "text-black" : "text-gray-500"}`}
                            href="/"
                        >
                            <svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4 19V10C4 9.68333 4.071 9.38333 4.213 9.1C4.355 8.81667 4.55067 8.58333 4.8 8.4L10.8 3.9C11.15 3.63333 11.55 3.5 12 3.5C12.45 3.5 12.85 3.63333 13.2 3.9L19.2 8.4C19.45 8.58333 19.646 8.81667 19.788 9.1C19.93 9.38333 20.0007 9.68333 20 10V19C20 19.55 19.804 20.021 19.412 20.413C19.02 20.805 18.5493 21.0007 18 21H15C14.7167 21 14.4793 20.904 14.288 20.712C14.0967 20.52 14.0007 20.2827 14 20V15C14 14.7167 13.904 14.4793 13.712 14.288C13.52 14.0967 13.2827 14.0007 13 14H11C10.7167 14 10.4793 14.096 10.288 14.288C10.0967 14.48 10.0007 14.7173 10 15V20C10 20.2833 9.904 20.521 9.712 20.713C9.52 20.905 9.28267 21.0007 9 21H6C5.45 21 4.97933 20.8043 4.588 20.413C4.19667 20.0217 4.00067 19.5507 4 19Z"
                                    fill="currentColor"
                                />
                            </svg>
                            {t("home", {ns: "header"})}
                        </Link>
                        <Link
                            className={`flex items-center text-l gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/announcements") ? "text-black" : "text-gray-500"}`}
                            href="/announcements"
                        >
                            <svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7H16ZM14 7H10V5H14V7Z"
                                    fill="currentColor"
                                />
                            </svg>

                            {t("nav_for_announcements", {ns: "header"})}
                        </Link>
                        <Link
                            className={`flex items-center text-l gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/employees") ? "text-black" : "text-gray-500"}`}
                            href="/employees"
                        >
                            <svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12.306 14.0171C13.0447 14.0929 13.7291 14.4399 14.2268 14.9911C14.7244 15.5423 14.9999 16.2585 15 17.0011C15 18.5431 14.06 19.8191 12.796 20.6611C11.526 21.5091 9.826 22.0011 8 22.0011C6.174 22.0011 4.474 21.5091 3.204 20.6611C1.938 19.8211 1 18.5431 1 17.0011C1 16.2055 1.31607 15.4424 1.87868 14.8798C2.44129 14.3172 3.20435 14.0011 4 14.0011H12L12.306 14.0171ZM20.006 14.0011C20.8016 14.0011 21.5647 14.3172 22.1273 14.8798C22.6899 15.4424 23.006 16.2055 23.006 17.0011C23.006 18.3911 22.142 19.4231 21.04 20.0571C19.944 20.6871 18.51 21.0011 17.006 21.0011C16.4993 20.9998 16.0053 20.9625 15.524 20.8891C16.39 19.8651 17.002 18.5571 17.002 17.0011C16.9997 15.9184 16.646 14.8656 15.994 14.0011H20.006ZM8.004 2.99315C8.6036 2.98078 9.19963 3.08823 9.75716 3.3092C10.3147 3.53017 10.8225 3.86022 11.2508 4.27998C11.6791 4.69975 12.0194 5.2008 12.2515 5.75376C12.4837 6.30672 12.6032 6.90046 12.6029 7.50019C12.6026 8.09991 12.4827 8.69355 12.25 9.2463C12.0173 9.79905 11.6767 10.2998 11.248 10.7192C10.8193 11.1386 10.3112 11.4682 9.75344 11.6886C9.19571 11.9091 8.59958 12.016 8 12.0031C6.82164 11.9783 5.69991 11.4928 4.87532 10.6506C4.05073 9.80848 3.58893 8.67677 3.58893 7.49815C3.58893 6.31952 4.05073 5.18781 4.87532 4.34566C5.69991 3.50352 6.82164 3.01798 8 2.99315M17.5 4.99515C17.9596 4.99515 18.4148 5.08568 18.8394 5.26157C19.264 5.43746 19.6499 5.69527 19.9749 6.02027C20.2999 6.34528 20.5577 6.73111 20.7336 7.15575C20.9095 7.58039 21 8.03552 21 8.49515C21 8.95477 20.9095 9.4099 20.7336 9.83454C20.5577 10.2592 20.2999 10.645 19.9749 10.97C19.6499 11.295 19.264 11.5528 18.8394 11.7287C18.4148 11.9046 17.9596 11.9951 17.5 11.9951C16.5717 11.9951 15.6815 11.6264 15.0251 10.97C14.3687 10.3136 14 9.4234 14 8.49515C14 7.56689 14.3687 6.67665 15.0251 6.02027C15.6815 5.36389 16.5717 4.99515 17.5 4.99515Z"
                                    fill="currentColor"
                                />
                            </svg>

                            {t("nav_for_employers", {ns: "header"})}
                        </Link>
                        <Link
                            className={`flex items-center text-l gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/faq") ? "text-black" : "text-gray-500"}`}
                            href="/faq"
                        >
                            <svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.2169 3.49947C13.5241 3.17061 12.7668 3 11.9999 3C11.233 3 10.4757 3.17061 9.78293 3.49947L3.09193 6.63647C2.01593 7.14047 1.73493 8.56347 2.24993 9.54647V14.4995C2.24993 14.6984 2.32895 14.8892 2.4696 15.0298C2.61025 15.1705 2.80102 15.2495 2.99993 15.2495C3.19884 15.2495 3.38961 15.1705 3.53026 15.0298C3.67091 14.8892 3.74993 14.6984 3.74993 14.4995V10.6715L9.78293 13.4995C10.4757 13.8283 11.233 13.9989 11.9999 13.9989C12.7668 13.9989 13.5241 13.8283 14.2169 13.4995L20.9079 10.3625C22.3639 9.68047 22.3639 7.31847 20.9079 6.63647L14.2169 3.49947Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M5 12.9141V16.6241C5 17.6321 5.503 18.5761 6.385 19.0641C7.854 19.8791 10.204 20.9991 12 20.9991C13.796 20.9991 16.146 19.8781 17.615 19.0651C18.497 18.5761 19 17.6321 19 16.6251V12.9141L14.854 14.8581C13.9618 15.2804 12.9871 15.4995 12 15.4995C11.0129 15.4995 10.0382 15.2804 9.146 14.8581L5 12.9141Z"
                                    fill="currentColor"
                                />
                            </svg>

                            {t("nav_for_about", {ns: "header"})}
                        </Link>
                        <Link
                            className={`flex items-center text-l gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 ${isActive("/fav") ? "text-black" : "text-gray-500"}`}
                            href="/fav"
                        >
                            <svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.1241 4H5.87594C5.39474 4 5 4.36562 5 4.81914V19.6957C5 20.5706 6.04405 21.0236 6.68303 20.4261L11.317 16.0926C11.7014 15.7332 12.2986 15.7332 12.683 16.0926L17.317 20.4261C17.956 21.0237 19 20.5706 19 19.6957V4.81914C19 4.36562 18.609 4 18.1241 4Z"
                                    fill="currentColor"
                                />
                            </svg>

                            {t("favorites", {ns: "header"})}
                        </Link>
                        <Button
                            className="flex items-center text-lg gap-x-4 mt-2 py-2 hover:px-5 hover:bg-gray-100 rounded-full transition-all duration-150 text-gray-500 w-full"
                            onClick={() => changeLanguage(i18n.language === "ru" ? "kz" : "ru")}
                        >
                            <svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.7219 22.66C19.1689 21.53 22.5339 17.689 22.9559 13H17.9749C17.7889 16.547 16.6189 19.847 14.7219 22.66ZM22.9559 11C22.5339 6.30997 19.1659 2.46797 14.7179 1.33797C16.6159 4.15197 17.7879 7.45197 17.9749 11H22.9559ZM9.28492 1.33797C4.83492 2.46797 1.46892 6.30997 1.04492 11H6.02692C6.21392 7.45197 7.38592 4.15197 9.28492 1.33797ZM1.04592 13C1.25361 15.2631 2.15652 17.4064 3.63075 19.136C5.10498 20.8655 7.0783 22.0965 9.27992 22.66C7.38292 19.847 6.21292 16.547 6.02692 13H1.04592ZM12.0009 22.962C9.69392 20.177 8.24892 16.741 8.03092 13H15.9719C15.7519 16.74 14.3079 20.177 12.0019 22.962M12.0009 1.04297C14.3079 3.82697 15.7509 7.26197 15.9709 11H8.03092C8.25092 7.26197 9.69492 3.82697 12.0009 1.04297Z"
                                    fill="currentColor"
                                />
                            </svg>

                            {i18n.language == "ru" ? "Tілді өзгерту" : "Поменять язык"}
                        </Button>

                        {!auth.user ? (<>
                                <Link
                                    className="text-center block px-10 mt-10 text-white font-bold py-1 text-l bg-blue-500 border-[3px] hover:bg-white hover:text-blue-500 transition-all duration-300 border-blue-500 rounded-full"
                                    href="/register"
                                >
                                    {t("register", {ns: "header"})}
                                </Link>
                                <Link
                                    className="text-center hover:bg-blue-500 hover:text-white transition-all duration-300 block w-full mt-3 text-blue-500 font-bold py-1 text-l border-[3px] border-blue-500 rounded-full"
                                    href="/login"
                                >
                                    {t("login", {ns: "header"})}
                                </Link>
                            </>) : (<>
                                {auth?.user?.role?.name === 'employer' ? (<Link
                                        className="text-center hover:bg-blue-500 hover:text-white transition-all duration-300 block w-full mt-3 text-blue-500 font-bold py-1 text-lg border-[3px] border-blue-500 rounded-full"
                                        href="/announcements/create"
                                    >
                                        {t("create_announcement", {ns: "header"})}
                                    </Link>) : null}
                                <Link
                                    href="/profile"
                                    className="flex gap-x-3 py-3 mt-5 hover:px-3 items-center transition-all duration-300 hover:bg-gray-100 rounded-full"
                                >
                                    <img
                                        src={auth.user.image_url ? `/storage/${auth.user.image_url}` : '/images/default-avatar.png'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/default-avatar.png';
                                        }}
                                        className="w-[50px] h-[50px] rounded-full object-cover"
                                    />
                                    <div className="">
                                        <div className="font-bold">{auth.user.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {auth.user.email}
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-lg flex items-center gap-x-4 mt-2 font-regular transition-all duration-150 py-2 hover:bg-gray-100 w-full text-left rounded-full hover:px-5"
                                >
                                    <MdOutlineLogout className="text-2xl"/>
                                    {t("logout", {ns: "header"})}
                                </button>
                            </>)}
                        </div>
                        <div className="jt-desktop-sidebar__footer space-y-2 text-sm text-gray-500">
                            <a href="https://t.me/jumystapjobs/" target="_blank" rel="noopener noreferrer"
                               className="flex justify-start">
                                <FaTelegram className="text-xl"/> <span
                                className="ml-1">Получайте вакансии в Telegram!</span>
                            </a>
                            <a href="tel:+77072213131" className="block hover:underline">+7 707 221 31 31</a>
                            <a href="https://www.instagram.com/joltap.kz/" target="_blank" rel="noopener noreferrer"
                               className="flex justify-start">
                                <FaInstagram className="text-xl"/> <span className="ml-1">Instagram JOLTAP</span>
                            </a>
                            {/*<a href="https://www.instagram.com/skillstap.kz/" target="_blank" rel="noopener noreferrer" className="flex justify-start">*/}
                            {/*    <FaInstagram className="text-xl" /> <span className="ml-1">Instagram SkillsTap</span>*/}
                            {/*</a>*/}
                            <a href="https://www.youtube.com/@JOLTAP" target="_blank" rel="noopener noreferrer"
                               className="flex justify-start">
                                <FaYoutube className="text-xl"/> <span className="ml-1">Youtube канал</span>
                            </a>
                        </div>
                    </aside>
                    <main className="jt-desktop-main col-span-7">{children}</main>
                </div>
            </div>
        </>);
}
