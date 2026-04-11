import { Link } from "@inertiajs/react";
import { IoSearch } from "react-icons/io5";

export default function VacancySearch({
    value,
    onChange,
    onSearch,
    t,
}) {
    return (
        <section className="space-y-3">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSearch();
                }}
                className="flex items-center gap-2"
            >
                <input
                    type="search"
                    value={value}
                    onChange={onChange}
                    placeholder={t("vacancy_search_placeholder", { ns: "index" })}
                    className="min-h-[48px] w-full min-w-0 rounded-[16px] border border-[#d9deea] bg-white px-4 text-sm text-[#1f2937] placeholder:text-[#98a2b3] shadow-[0_8px_20px_rgba(15,23,42,0.04)] outline-none transition-colors focus:border-[#5a7cf3]"
                    aria-label={t("vacancy_search_placeholder", { ns: "index" })}
                />
                <button
                    type="submit"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#4477f2] text-[20px] text-white shadow-[0_12px_24px_rgba(68,119,242,0.28)] transition-opacity hover:opacity-95"
                    aria-label={t("search", { ns: "announcements" })}
                >
                    <IoSearch />
                </button>
            </form>

            <Link
                href="/ads"
                className="flex min-h-[52px] items-center justify-center rounded-[16px] bg-[#edf1f7] px-4 text-sm font-semibold text-[#7a8599] transition-colors hover:bg-[#e5ebf5]"
            >
                {t("find_product_or_service", { ns: "index" })}
            </Link>
        </section>
    );
}
