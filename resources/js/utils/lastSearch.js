const PREFIX = 'lastSearch:';

export function rememberSearch(section, url) {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.setItem(PREFIX + section, url);
    } catch (e) {
        // sessionStorage may be unavailable (private mode) — ignore
    }
}

export function getLastSearch(section) {
    if (typeof window === 'undefined') return null;
    try {
        return sessionStorage.getItem(PREFIX + section);
    } catch (e) {
        return null;
    }
}
