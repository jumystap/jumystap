import { router } from '@inertiajs/react';
import { notification } from 'antd';

const PENDING_KEY = 'pendingConnect';

// Отклик создаётся POST-запросом с CSRF-токеном: при GET-ссылке чужой сайт мог бы
// откликаться от имени залогиненного пользователя и расходовать его суточный лимит.
// Сервер отвечает Inertia::location на wa.me, при исчерпанном лимите — ошибкой `connect`.
export function respondToAnnouncement(announcementId) {
    router.post(`/connect/${announcementId}`, {}, {
        preserveScroll: true,
        preserveState: true,
        onError: (errors) => {
            if (errors.connect) {
                notification.error({ message: errors.connect });
            }
        },
    });
}

// Гость нажал «Связаться» и ушёл на логин: запоминаем это в sessionStorage текущей вкладки.
export function rememberPendingConnect(announcementId) {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.setItem(PENDING_KEY, String(announcementId));
    } catch (e) {
        // sessionStorage may be unavailable (private mode) — ignore
    }
}

// Вернувшись с логина на /announcement/{id}?connect=true, страница откликается сама, но только
// если отметку оставил клик в этой же вкладке: одна ссылка с ?connect=true с чужого сайта иначе
// запускала бы отклик от имени залогиненного пользователя. connect=true убирается и из адреса,
// и из history.state.url (Inertia восстанавливает URL оттуда), чтобы «Назад» с WhatsApp не
// запускал отклик повторно.
export function consumePendingConnect(announcementId) {
    if (typeof window === 'undefined') return false;

    const params = new URLSearchParams(window.location.search);
    if (params.get('connect') !== 'true') return false;

    params.delete('connect');
    const query = params.toString();
    const url = window.location.pathname + (query ? `?${query}` : '');
    const state = window.history.state;
    window.history.replaceState(state?.url ? { ...state, url } : state, '', url);

    try {
        const pending = sessionStorage.getItem(PENDING_KEY);
        sessionStorage.removeItem(PENDING_KEY);

        return pending === String(announcementId);
    } catch (e) {
        return false;
    }
}
