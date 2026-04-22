import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
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
    onOpenScam,
    onPromoCtaClick,
    onSearchAnnouncements,
    onSearchKeywordChange,
    searchKeyword,
    supportHref,
    t,
}) {
    const [activePromo, setActivePromo] = useState(0);
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const canCreateResume = !auth?.user || auth.user.role?.name === "employee";

    const promoSlides = [
        {
            key: "free-course",
            title: t("free_course", { ns: "index" }).replace("курс!", "курсы!"),
            description: t("take_training_with_joltap", { ns: "index" }),
            primaryAction: {
                label: t("sign_up_now", { ns: "index" }),
                onClick: onPromoCtaClick,
            },
            imageSrc: "/images/logo.png",
            imageAlt: "JUMYSTAP",
        },
        {
            key: "telegram-channel",
            containerClassName:
                "overflow-hidden rounded-[24px] border border-[#e5e8f0] bg-white p-0 shadow-[0_14px_32px_rgba(15,23,42,0.07)]",
            customContent: (
                <a
                    href="https://t.me/jumystapjobs"
                    aria-label={t("go_to_channel", { ns: "index" })}
                    className="group block h-full px-5 py-4"
                >
                        <div className="flex h-full min-h-[168px] flex-col justify-between gap-5">
                        <div className="max-w-[295px] text-[22px] font-extrabold leading-[1.02] tracking-[-0.03em] text-[#3778e5]">
                            {t("telegram_banner_title", { ns: "index" })}
                        </div>

                        <div className="flex items-end justify-between gap-3">
                            <div className="inline-flex min-h-[64px] items-center rounded-[20px] bg-[#3778e5] px-5 py-3 text-center text-[14px] font-semibold leading-[16px] text-white shadow-[0_10px_24px_rgba(55,120,229,0.24)] transition-transform duration-150 group-active:scale-[0.98]">
                                {t("go_to_channel", { ns: "index" })}
                            </div>

                            <div className="flex shrink-0 items-center gap-2 rounded-[18px] border border-[#edf4ff] bg-[#f8fbff] px-3 py-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ff] text-[22px] text-[#1d9bf0]">
                                    <FaTelegramPlane />
                                </span>
                                <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#111827]">
                                    Telegram
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            ),
        },
        {
            key: "scam-alert",
            title: t("beware_of_scammers", { ns: "index" }),
            description: t("scam_report", { ns: "index" }),
            containerClassName:
                "relative overflow-hidden rounded-[24px] border border-[#14315f] bg-gradient-to-r from-[#102454] to-[#0a1d45] px-4 py-4 shadow-[0_14px_32px_rgba(10,29,69,0.28)]",
            contentClassName: "relative flex min-h-[154px] flex-col justify-between gap-3",
            accentClassName:
                "pointer-events-none absolute -right-8 top-2 h-24 w-24 rounded-full bg-[rgba(255,255,255,0.14)] blur-2xl",
            textContainerClassName: "max-w-none pr-16",
            titleClassName: "max-w-[240px] text-[18px] font-bold leading-5 text-white",
            descriptionClassName: "mt-1 max-w-[250px] text-[12px] leading-[15px] text-[#d7e3ff]",
            actionsRowClassName: "flex items-end gap-2",
            actionsContainerClassName: "grid flex-1 grid-cols-2 gap-2",
            primaryAction: {
                label: t("write_whatsapp", { ns: "index" }),
                href: supportHref,
                target: "_blank",
                rel: "noopener noreferrer",
            },
            primaryActionClassName:
                "inline-flex min-h-[42px] w-full items-center justify-center rounded-[16px] bg-[#ef4444] px-3 py-2 text-center text-[12px] font-semibold leading-[14px] text-white shadow-[0_10px_24px_rgba(239,68,68,0.28)] transition-opacity hover:opacity-95",
            secondaryAction: {
                label: t("write_site", { ns: "index" }),
                onClick: onOpenScam,
            },
            secondaryActionClassName:
                "inline-flex min-h-[42px] w-full items-center justify-center rounded-[16px] bg-white px-3 py-2 text-center text-[12px] font-semibold leading-[14px] text-[#ef4444] shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-opacity hover:opacity-95",
            imageSrc: "/images/scam.png",
            imageAlt: "Scam alert",
            imageWrapperClassName:
                "absolute right-0 top-0 shrink-0 rounded-[18px] bg-[rgba(255,255,255,0.08)] px-2 py-2",
            imageClassName: "h-9 w-auto object-contain",
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
            href: supportHref,
            external: true,
            target: "_blank",
            rel: "noopener noreferrer",
            icon: RiCustomerService2Line,
        },
        ...(canCreateResume
            ? [
                  {
                      key: "resume",
                      label: t("mobile_create_resume", { ns: "index" }),
                      href: auth?.user ? "/resumes/create" : "/login",
                      icon: HiOutlineDocumentText,
                  },
              ]
            : []),
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
                        slides={promoSlides}
                        onPrev={() =>
                            setActivePromo(
                                (current) => (current - 1 + promoSlides.length) % promoSlides.length
                            )
                        }
                        onNext={() =>
                            setActivePromo((current) => (current + 1) % promoSlides.length)
                        }
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
