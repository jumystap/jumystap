import VacancyCard from "@/Components/Welcome/VacancyCard";

const formatCurrency = (value) => Number(value).toLocaleString("ru-RU");

function formatAnnouncementSalary(announcement, t, language) {
    const isRu = language === "ru";

    if (announcement.salary_type === "exact" && announcement.cost) {
        return `${formatCurrency(announcement.cost)} ₸`;
    }

    if (announcement.salary_type === "min" && announcement.cost_min) {
        return isRu
            ? `от ${formatCurrency(announcement.cost_min)} ₸`
            : `${formatCurrency(announcement.cost_min)} ₸ бастап`;
    }

    if (announcement.salary_type === "max" && announcement.cost_max) {
        return isRu
            ? `до ${formatCurrency(announcement.cost_max)} ₸`
            : `${formatCurrency(announcement.cost_max)} ₸ дейін`;
    }

    if (
        announcement.salary_type === "diapason" &&
        announcement.cost_min &&
        announcement.cost_max
    ) {
        return isRu
            ? `от ${formatCurrency(announcement.cost_min)} ₸ до ${formatCurrency(announcement.cost_max)} ₸`
            : `${formatCurrency(announcement.cost_min)} ₸ бастап ${formatCurrency(
                  announcement.cost_max
              )} ₸ дейін`;
    }

    if (announcement.salary_type === "za_smenu") {
        const perShift = t("per_shift", { ns: "index" });

        if (announcement.cost) {
            return `${formatCurrency(announcement.cost)} ₸ / ${perShift}`;
        }

        if (announcement.cost_min && !announcement.cost_max) {
            return isRu
                ? `от ${formatCurrency(announcement.cost_min)} ₸ / ${perShift}`
                : `${perShift} ${formatCurrency(announcement.cost_min)} ₸ бастап`;
        }

        if (!announcement.cost_min && announcement.cost_max) {
            return isRu
                ? `до ${formatCurrency(announcement.cost_max)} ₸ / ${perShift}`
                : `${perShift} ${formatCurrency(announcement.cost_max)} ₸ дейін`;
        }

        if (announcement.cost_min && announcement.cost_max) {
            return isRu
                ? `от ${formatCurrency(announcement.cost_min)} ₸ до ${formatCurrency(
                      announcement.cost_max
                  )} ₸ / ${perShift}`
                : `${perShift} ${formatCurrency(announcement.cost_min)} ₸ бастап ${formatCurrency(
                      announcement.cost_max
                  )} ₸ дейін`;
        }
    }

    return t("negotiable", { ns: "index" });
}

function getBadgeMeta(type, t) {
    if (type === "urgent") {
        return {
            label: t("urgent", { ns: "index" }),
            tone: "urgent",
        };
    }

    if (type === "top") {
        return {
            label: t("top", { ns: "index" }),
            tone: "top",
        };
    }

    return {
        label: null,
        tone: "default",
    };
}

export default function VacancyList({ announcements, t, language }) {
    if (!announcements.length) {
        return null;
    }

    return (
        <section className="overflow-hidden rounded-[24px] border border-[#e5e8f0] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
            {announcements.map((announcement, index) => {
                const badge = getBadgeMeta(announcement.mobileBadge, t);

                return (
                    <div
                        key={announcement.id}
                        className={index === announcements.length - 1 ? "" : "border-b border-[#edf1f7]"}
                    >
                        <VacancyCard
                            announcement={announcement}
                            badgeLabel={badge.label}
                            badgeTone={badge.tone}
                            salaryText={formatAnnouncementSalary(announcement, t, language)}
                            t={t}
                        />
                    </div>
                );
            })}
        </section>
    );
}
