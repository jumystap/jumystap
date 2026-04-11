import { Link } from "@inertiajs/react";
import { FaStar } from "react-icons/fa";
import { MdAccessTime, MdOutlinePayments } from "react-icons/md";
import { SiFireship } from "react-icons/si";

const badgeClasses = {
    urgent: "bg-[#e54937] text-white",
    top: "bg-[#5c7cf6] text-white",
};

const salaryIconClasses = {
    urgent: "text-[#e54937]",
    top: "text-[#5c7cf6]",
    default: "text-[#98a2b3]",
};

const salaryIcons = {
    urgent: SiFireship,
    top: FaStar,
    default: MdOutlinePayments,
};

export default function VacancyCard({ announcement, badgeLabel, badgeTone, salaryText, t }) {
    const SalaryIcon = salaryIcons[badgeTone] || salaryIcons.default;

    return (
        <Link
            href={`/announcement/${announcement.id}`}
            className="block px-4 py-4 transition-colors hover:bg-[#f8faff]"
        >
            <div className="flex items-start gap-2">
                <h2 className="min-w-0 flex-1 text-[15px] font-semibold leading-[1.25] text-[#1f2937]">
                    {announcement.title}
                </h2>

                {badgeLabel ? (
                    <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase leading-none ${
                            badgeClasses[badgeTone]
                        }`}
                    >
                        {badgeLabel}
                    </span>
                ) : null}
            </div>

            <div className="mt-2 flex items-center gap-2 text-[15px] font-semibold text-[#344054]">
                <SalaryIcon className={salaryIconClasses[badgeTone] || salaryIconClasses.default} />
                <span>{salaryText}</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#667085]">
                <MdAccessTime className="text-[15px] text-[#98a2b3]" />
                <span>
                    {t("working_hours", { ns: "index" })}: {announcement.work_time}
                </span>
            </div>
        </Link>
    );
}
