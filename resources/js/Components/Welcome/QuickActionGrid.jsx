import { Link } from "@inertiajs/react";

function QuickActionCard({ item }) {
    const Icon = item.icon;
    const classes =
        "flex min-h-[96px] flex-col items-center justify-center rounded-[18px] border border-[#e5e8f0] bg-white px-2 py-3 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-colors hover:border-[#d7e2ff] hover:bg-[#f8faff]";
    const content = (
        <>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#edf2ff] text-[20px] text-[#4477f2]">
                <Icon />
            </div>
            <div className="text-[10px] font-medium leading-[1.25] text-[#475467]">
                {item.label}
            </div>
        </>
    );

    if (item.href) {
        return (
            <Link href={item.href} className={classes} aria-label={item.label}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" onClick={item.onClick} className={classes} aria-label={item.label}>
            {content}
        </button>
    );
}

export default function QuickActionGrid({ items }) {
    return (
        <section className="grid grid-cols-4 gap-2">
            {items.map((item) => (
                <QuickActionCard key={item.key} item={item} />
            ))}
        </section>
    );
}
