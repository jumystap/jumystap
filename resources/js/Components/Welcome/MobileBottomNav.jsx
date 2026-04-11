import { Link } from "@inertiajs/react";
import { CgShoppingBag } from "react-icons/cg";
import { HiOutlineHome, HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlineWorkOutline } from "react-icons/md";

const navItems = [
    {
        key: "home",
        href: "/",
        icon: HiOutlineHome,
        labelKey: "home",
        namespace: "header",
        match: ["/"],
    },
    {
        key: "work",
        href: "/announcements",
        icon: MdOutlineWorkOutline,
        labelKey: "work_short",
        namespace: "header",
        match: ["/announcements", "/announcement"],
    },
    {
        key: "job-seekers",
        href: "/employees",
        icon: HiOutlineUserGroup,
        labelKey: "job_seekers_short",
        namespace: "header",
        match: ["/employees", "/user"],
    },
    {
        key: "marketplace",
        href: "/ads",
        icon: CgShoppingBag,
        labelKey: "products_services_short",
        namespace: "header",
        match: ["/ads", "/ad"],
    },
];

const matchesPath = (currentPath, prefixes) =>
    prefixes.some((prefix) =>
        prefix === "/"
            ? currentPath === "/"
            : currentPath === prefix || currentPath.startsWith(`${prefix}/`)
    );

export default function MobileBottomNav({ currentPath, t }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30">
            <div
                className="mx-auto w-full max-w-[414px] px-3"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
            >
                <nav className="grid grid-cols-4 gap-1 rounded-t-[26px] border border-[#e5e8f0] bg-white/95 px-2 py-2 shadow-[0_-10px_28px_rgba(15,23,42,0.1)] backdrop-blur">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = matchesPath(currentPath, item.match);

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                aria-label={t(item.labelKey, { ns: item.namespace })}
                                className={`flex min-h-[58px] flex-col items-center justify-center rounded-[18px] px-2 py-2 text-center transition-colors ${
                                    isActive
                                        ? "bg-[#edf2ff] text-[#3052c8]"
                                        : "text-[#667085]"
                                }`}
                            >
                                <span className="text-[20px]">
                                    <Icon />
                                </span>
                                <span className="mt-1 text-[10px] font-medium leading-none">
                                    {t(item.labelKey, { ns: item.namespace })}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
