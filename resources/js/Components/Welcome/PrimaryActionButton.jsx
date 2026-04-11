import { Link } from "@inertiajs/react";

export default function PrimaryActionButton({ href, icon: Icon, children, ariaLabel }) {
    return (
        <Link
            href={href}
            aria-label={ariaLabel}
            className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[18px] bg-[#4477f2] px-4 py-4 text-base font-semibold text-white shadow-[0_14px_28px_rgba(68,119,242,0.3)] transition-transform duration-150 hover:translate-y-[-1px]"
        >
            <span className="text-[22px]">
                <Icon />
            </span>
            <span>{children}</span>
        </Link>
    );
}
