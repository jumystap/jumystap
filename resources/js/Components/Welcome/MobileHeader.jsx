import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Drawer } from "antd";
import { CgMenuRight, CgShoppingBag } from "react-icons/cg";
import { HiOutlineHome, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlineLogout, MdOutlineWorkOutline } from "react-icons/md";
import { RiQuestionLine } from "react-icons/ri";

const matchesPath = (currentPath, prefixes) =>
    prefixes.some((prefix) =>
        prefix === "/"
            ? currentPath === "/"
            : currentPath === prefix || currentPath.startsWith(`${prefix}/`)
    );

export default function MobileHeader({ auth, language, onLanguageToggle, t }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const languageLabel = language === "ru" ? "Тілді өзгерту" : "Поменять язык";
    const openMenuLabel = language === "ru" ? "Открыть меню" : "Мәзірді ашу";

    const handleLogout = () => {
        setIsMenuOpen(false);
        router.post("/logout", {}, {
            onSuccess: () => window.location.reload(),
        });
    };

    const menuItems = [
        {
            key: "home",
            href: "/",
            label: t("home", { ns: "header" }),
            icon: HiOutlineHome,
            match: ["/"],
        },
        {
            key: "work",
            href: "/announcements",
            label: t("nav_for_announcements", { ns: "header" }),
            icon: MdOutlineWorkOutline,
            match: ["/announcements", "/announcement"],
        },
        {
            key: "job-seekers",
            href: "/employees",
            label: t("nav_for_employers", { ns: "header" }),
            icon: HiOutlineUserGroup,
            match: ["/employees", "/user"],
        },
        {
            key: "marketplace",
            href: "/ads",
            label: t("marketplace", { ns: "header" }),
            icon: CgShoppingBag,
            match: ["/ads", "/ad"],
        },
        {
            key: "about",
            href: "/faq",
            label: t("nav_for_about", { ns: "header" }),
            icon: RiQuestionLine,
            match: ["/faq", "/about"],
        },
    ];

    return (
        <>
            <div className="sticky top-0 z-30 bg-[#f7f8fc]/95 px-3 pb-4 pt-4 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="min-w-0 flex-1 rounded-[18px] border border-[#e6eaf2] bg-white px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                        aria-label="JUMYSTAP"
                    >
                        <img
                            src="/images/logo.png"
                            alt="JUMYSTAP powered by JOLTAP"
                            className="h-7 w-auto max-w-full object-contain"
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={onLanguageToggle}
                        className="min-h-[42px] rounded-full border border-[#d9deea] bg-white px-3 text-[11px] font-medium text-[#657188] shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-[#5a7cf3] hover:text-[#3052c8]"
                        aria-label={languageLabel}
                    >
                        {languageLabel}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#d9deea] bg-white text-[22px] text-[#667085] shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-[#5a7cf3] hover:text-[#3052c8]"
                        aria-label={openMenuLabel}
                    >
                        <CgMenuRight />
                    </button>
                </div>
            </div>

            <Drawer
                title={t("more", { ns: "header" })}
                placement="right"
                onClose={() => setIsMenuOpen(false)}
                open={isMenuOpen}
                width={292}
            >
                <div className="space-y-3">
                    {auth?.user ? (
                        <Link
                            href="/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-[20px] border border-[#e5e8f0] bg-[#f8faff] px-4 py-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8eefc] text-[22px] text-[#4167e8]">
                                <HiOutlineUserCircle />
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-[#1f2937]">
                                    {auth.user.name}
                                </div>
                                <div className="truncate text-xs text-[#667085]">
                                    {t("profile", { ns: "header" })}
                                </div>
                            </div>
                        </Link>
                    ) : null}

                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = matchesPath(currentPath, item.match);

                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-[18px] border px-4 py-3 transition-colors ${
                                        isActive
                                            ? "border-[#d7e2ff] bg-[#edf2ff] text-[#3052c8]"
                                            : "border-[#e5e8f0] bg-white text-[#475467] hover:border-[#d7e2ff] hover:bg-[#f8faff]"
                                    }`}
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-[20px] ${
                                            isActive
                                                ? "bg-white text-[#3052c8]"
                                                : "bg-[#f1f4fa] text-[#667085]"
                                        }`}
                                    >
                                        <Icon />
                                    </div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {!auth?.user ? (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-full bg-[#4477f2] px-4 py-3 text-center text-sm font-semibold text-white"
                            >
                                {t("register", { ns: "header" })}
                            </Link>
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-full border border-[#d7e2ff] bg-white px-4 py-5 text-center text-sm font-semibold text-[#3052c8]"
                            >
                                {t("login", { ns: "header" })}
                            </Link>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-[18px] border border-[#fde2e2] bg-white px-4 py-3 text-[#d92d20] transition-colors hover:bg-[#fff5f5]"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[20px] text-[#d92d20]">
                                <MdOutlineLogout />
                            </div>
                            <span className="text-sm font-medium">{t("logout", { ns: "header" })}</span>
                        </button>
                    )}
                </div>
            </Drawer>
        </>
    );
}
