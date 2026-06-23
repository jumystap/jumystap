import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { getLastSearch } from '@/utils/lastSearch';

export default function BackToSearch({ section, className }) {
    const { t } = useTranslation();
    const target = getLastSearch(section);

    if (!target) {
        return null;
    }

    return (
        <Link
            href={target}
            className={className || 'inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800'}
        >
            <span>←</span>
            {t('back_to_last_search', { ns: 'header' })}
        </Link>
    );
}
