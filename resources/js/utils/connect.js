import { router } from '@inertiajs/react';
import { notification } from 'antd';

const PENDING_KEY = 'pendingConnect';

// Отклик на вакансию (/connect/{id}) и обращение по объявлению (/ad/connect/{id}) создаются
// POST-запросом с CSRF-токеном: при GET-ссылке чужой сайт мог бы делать их от имени
// залогиненного пользователя и расходовать его суточный лимит. Сервер отвечает
// Inertia::location на wa.me, при исчерпанном лимите — ошибкой `connect`.
export function postConnect(url) {
    router.post(url, {}, {
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
// key различает вакансии и объявления: 'announcement:5', 'ad:5'.
export function rememberPendingConnect(key) {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.setItem(PENDING_KEY, key);
    } catch (e) {
        // sessionStorage may be unavailable (private mode) — ignore
    }
}

// Вернувшись с логина на страницу с ?connect=true, она откликается сама, но только
// если отметку оставил клик в этой же вкладке: одна ссылка с ?connect=true с чужого сайта иначе
// запускала бы отклик от имени залогиненного пользователя. connect=true убирается и из адреса,
// и из history.state.url (Inertia восстанавливает URL оттуда), чтобы «Назад» с WhatsApp не
// запускал отклик повторно.
export function consumePendingConnect(key) {
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

        return pending === key;
    } catch (e) {
        return false;
    }
}
