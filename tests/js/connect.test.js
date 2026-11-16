import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@inertiajs/react', () => ({ router: { post: vi.fn() } }));
vi.mock('antd', () => ({ notification: { error: vi.fn() } }));

const { router } = await import('@inertiajs/react');
const { notification } = await import('antd');
const { consumePendingConnect, postConnect, rememberPendingConnect } = await import('@/utils/connect');

function openPage(url, state = { component: 'Announcement', url }) {
    window.history.replaceState(state, '', url);
}

describe('postConnect', () => {
    beforeEach(() => vi.clearAllMocks());

    it('создаёт отклик и обращение POST-запросом, а не переходом по ссылке', () => {
        postConnect('/connect/5');
        postConnect('/ad/connect/7');

        expect(router.post).toHaveBeenCalledWith('/connect/5', {}, expect.objectContaining({ preserveScroll: true }));
        expect(router.post).toHaveBeenCalledWith('/ad/connect/7', {}, expect.objectContaining({ preserveScroll: true }));
    });

    it('показывает ошибку лимита уведомлением', () => {
        postConnect('/connect/5');
        const { onError } = router.post.mock.calls[0][2];

        onError({ connect: 'Вы достигли лимита' });

        expect(notification.error).toHaveBeenCalledWith({ message: 'Вы достигли лимита' });
    });
});

describe('consumePendingConnect', () => {
    beforeEach(() => sessionStorage.clear());

    it('откликается после логина, если гость сам нажал «Связаться» в этой вкладке', () => {
        rememberPendingConnect('announcement:5');
        openPage('/announcement/5?connect=true');

        expect(consumePendingConnect('announcement:5')).toBe(true);
    });

    it('не откликается по чужой ссылке с ?connect=true без отметки клика', () => {
        openPage('/announcement/5?connect=true');

        expect(consumePendingConnect('announcement:5')).toBe(false);
    });

    it('не откликается на другую вакансию, чем та, где был клик', () => {
        rememberPendingConnect('announcement:7');
        openPage('/announcement/5?connect=true');

        expect(consumePendingConnect('announcement:5')).toBe(false);
    });

    it('срабатывает один раз: «Назад» с WhatsApp не повторяет отклик', () => {
        rememberPendingConnect('announcement:5');
        openPage('/announcement/5?connect=true&page=2');

        expect(consumePendingConnect('announcement:5')).toBe(true);
        // connect=true убран и из адреса, и из history.state.url, откуда Inertia восстанавливает URL.
        expect(window.location.search).toBe('?page=2');
        expect(window.history.state.url).toBe('/announcement/5?page=2');
        expect(window.history.state.component).toBe('Announcement');

        // Возврат на ту же запись истории: параметра нет, отметка израсходована.
        expect(consumePendingConnect('announcement:5')).toBe(false);
        window.history.replaceState(window.history.state, '', '/announcement/5?connect=true');
        expect(consumePendingConnect('announcement:5')).toBe(false);
    });

    it('клик по объявлению не запускает отклик на вакансию с тем же id', () => {
        rememberPendingConnect('ad:5');
        openPage('/announcement/5?connect=true');

        expect(consumePendingConnect('announcement:5')).toBe(false);
    });

    it('ничего не делает без ?connect=true', () => {
        rememberPendingConnect('announcement:5');
        openPage('/announcement/5');

        expect(consumePendingConnect('announcement:5')).toBe(false);
        expect(sessionStorage.getItem('pendingConnect')).toBe('announcement:5');
    });
});
