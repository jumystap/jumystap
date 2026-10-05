// Work periods are stored like "28 янв. 2004 - 30 янв. 2006" (always Russian
// month abbreviations — they're formatted with locale: ru on save).
const RU_MONTHS = {
    янв: 0, фев: 1, мар: 2, апр: 3, май: 4, мая: 4, июн: 5,
    июл: 6, авг: 7, сен: 8, окт: 9, ноя: 10, дек: 11,
};

const parsePeriodDate = (token) => {
    const parts = (token || '').trim().split(/\s+/);
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const month = RU_MONTHS[parts[1].toLowerCase().replace(/[^а-яё]/g, '').slice(0, 3)];
    const year = parseInt(parts[2], 10);
    if (Number.isNaN(day) || month === undefined || Number.isNaN(year)) return null;
    return new Date(year, month, day);
};

const pluralRu = (n, forms) => {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
    return forms[2];
};

// Sums the duration of all work periods and returns a localized label like
// "5 лет 3 месяца" / "5 жыл 3 ай". Empty string when there's no experience.
export const getTotalExperience = (organizations, isRussian = true) => {
    if (!organizations || organizations.length === 0) return '';

    let totalMonths = 0;
    organizations.forEach((org) => {
        const start = parsePeriodDate((org.period || '').split(' - ')[0]);
        if (!start) return;
        const end = parsePeriodDate((org.period || '').split(' - ')[1]) || new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (months > 0) totalMonths += months;
    });

    if (totalMonths <= 0) return '';

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const parts = [];

    if (isRussian) {
        if (years > 0) parts.push(`${years} ${pluralRu(years, ['год', 'года', 'лет'])}`);
        if (months > 0) parts.push(`${months} ${pluralRu(months, ['месяц', 'месяца', 'месяцев'])}`);
    } else {
        if (years > 0) parts.push(`${years} жыл`);
        if (months > 0) parts.push(`${months} ай`);
    }

    return parts.join(' ');
};
