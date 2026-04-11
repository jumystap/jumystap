import { useState } from "react";
import { HiOutlineDocumentText, HiOutlineUserCircle } from "react-icons/hi2";
import { MdOutlineCampaign, MdOutlineWorkOutline } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import MobileBottomNav from "@/Components/Welcome/MobileBottomNav";
import MobileHeader from "@/Components/Welcome/MobileHeader";
import PrimaryActionButton from "@/Components/Welcome/PrimaryActionButton";
import PromoBanner from "@/Components/Welcome/PromoBanner";
import QuickActionGrid from "@/Components/Welcome/QuickActionGrid";
import SocialPromoGrid from "@/Components/Welcome/SocialPromoGrid";
import VacancyList from "@/Components/Welcome/VacancyList";
import VacancySearch from "@/Components/Welcome/VacancySearch";

export default function MobileWelcomeHome({
    auth,
    featuredAnnouncements,
    i18n,
    onLanguageToggle,
    onOpenFeedback,
    onPromoCtaClick,
    onSearchAnnouncements,
    onSearchKeywordChange,
    searchKeyword,
    t,
}) {
    const [activePromo, setActivePromo] = useState(0);
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

    const promoSlides = [
        {
            key: "free-course",
            title: t("free_course", { ns: "index" }).replace("курс!", "курсы!"),
            description: t("take_training_with_joltap", { ns: "index" }),
            ctaLabel: t("sign_up_now", { ns: "index" }),
        },
    ];

    const quickActions = [
        {
            key: "profile",
            label: t("mobile_profile", { ns: "index" }),
            href: auth?.user ? "/profile" : "/login",
            icon: HiOutlineUserCircle,
        },
        {
            key: "support",
            label: t("mobile_support", { ns: "index" }),
            href:  "https://api.whatsapp.com/send?phone=+77072213131&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%20%D0%BF%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20JUMYSTAP",
            icon: RiCustomerService2Line,
        },
        {
            key: "resume",
            label: t("mobile_create_resume", { ns: "index" }),
            href: auth?.user ? "/resumes/create" : "/login",
            icon: HiOutlineDocumentText,
        },
        {
            key: "vacancy",
            label: t("mobile_post_vacancy", { ns: "index" }),
            href: auth?.user ? "/announcements/create" : "/login",
            icon: MdOutlineCampaign,
        },
    ];

    const socialPromos = [
        {
            key: "telegram",
            label: t("telegram_daily_vacancies", { ns: "index" }),
            href: "https://t.me/jumystapjobs",
            tone: "telegram",
        },
        {
            key: "instagram",
            label: t("instagram_about_project", { ns: "index" }),
            href: "https://www.instagram.com/joltap.kz/",
            tone: "instagram",
        },
    ];

    return (
        <div className="bg-[#f7f8fc] md:hidden">
            <div
                className="mx-auto w-full max-w-[414px] overflow-x-hidden"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 92px)" }}
            >
                <MobileHeader
                    auth={auth}
                    language={i18n.language}
                    onLanguageToggle={onLanguageToggle}
                    t={t}
                />

                <main className="space-y-4 px-3 pb-4">
                    <PromoBanner
                        slide={promoSlides[activePromo]}
                        onPrev={() =>
                            setActivePromo(
                                (current) => (current - 1 + promoSlides.length) % promoSlides.length
                            )
                        }
                        onNext={() =>
                            setActivePromo((current) => (current + 1) % promoSlides.length)
                        }
                        onCtaClick={onPromoCtaClick}
                    />

                    <PrimaryActionButton
                        href="/announcements"
                        icon={MdOutlineWorkOutline}
                        ariaLabel={t("nav_for_announcements", { ns: "header" })}
                    >
                        {t("nav_for_announcements", { ns: "header" })}
                    </PrimaryActionButton>

                    <VacancySearch
                        value={searchKeyword}
                        onChange={onSearchKeywordChange}
                        onSearch={onSearchAnnouncements}
                        t={t}
                    />

                    <QuickActionGrid items={quickActions} />

                    <VacancyList
                        announcements={featuredAnnouncements}
                        language={i18n.language}
                        t={t}
                    />

                    <SocialPromoGrid items={socialPromos} />
                </main>
            </div>

            <MobileBottomNav currentPath={currentPath} t={t} />
        </div>
    );
}
