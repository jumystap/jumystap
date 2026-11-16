import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@inertiajs/react', () => ({ router: { post: vi.fn() } }));
vi.mock('antd', () => ({ notification: { error: vi.fn() } }));

const { router } = await import('@inertiajs/react');
const { notification } = await import('antd');
const { consumePendingConnect, rememberPendingConnect, respondToAnnouncement } = await import('@/utils/announcementConnect');

function openPage(url, state = { component: 'Announcement', url }) {
    window.history.replaceState(state, '', url);
}

describe('respondToAnnouncement', () => {
    beforeEach(() => vi.clearAllMocks());

    it('создаёт отклик POST-запросом, а не переходом по ссылке', () => {
        respondToAnnouncement(5);

        expect(router.post).toHaveBeenCalledWith('/connect/5', {}, expect.objectContaining({ preserveScroll: true }));
    });

    it('показывает ошибку лимита уведомлением', () => {
        respondToAnnouncement(5);
        const { onError } = router.post.mock.calls[0][2];

        onError({ connect: 'Вы достигли лимита' });

        expect(notification.error).toHaveBeenCalledWith({ message: 'Вы достигли лимита' });
    });
});

describe('consumePendingConnect', () => {
    beforeEach(() => sessionStorage.clear());

    it('откликается после логина, если гость сам нажал «Связаться» в этой вкладке', () => {
        rememberPendingConnect(5);
        openPage('/announcement/5?connect=true');

        expect(consumePendingConnect(5)).toBe(true);
    });

    it('не откликается по чужой ссылке с ?connect=true без отметки клика', () => {
        openPage('/announcement/5?connect=true');

        expect(consumePendingConnect(5)).toBe(false);
    });

    it('не откликается на другую вакансию, чем та, где был клик', () => {
        rememberPendingConnect(7);
        openPage('/announcement/5?connect=true');

        expect(consumePendingConnect(5)).toBe(false);
    });

    it('срабатывает один раз: «Назад» с WhatsApp не повторяет отклик', () => {
        rememberPendingConnect(5);
        openPage('/announcement/5?connect=true&page=2');

        expect(consumePendingConnect(5)).toBe(true);
        // connect=true убран и из адреса, и из history.state.url, откуда Inertia восстанавливает URL.
        expect(window.location.search).toBe('?page=2');
        expect(window.history.state.url).toBe('/announcement/5?page=2');
        expect(window.history.state.component).toBe('Announcement');

        // Возврат на ту же запись истории: параметра нет, отметка израсходована.
        expect(consumePendingConnect(5)).toBe(false);
        window.history.replaceState(window.history.state, '', '/announcement/5?connect=true');
        expect(consumePendingConnect(5)).toBe(false);
    });

    it('ничего не делает без ?connect=true', () => {
        rememberPendingConnect(5);
        openPage('/announcement/5');

        expect(consumePendingConnect(5)).toBe(false);
        expect(sessionStorage.getItem('pendingConnect')).toBe('5');
    });
});
