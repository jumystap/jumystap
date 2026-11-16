import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const locale = localStorage.getItem('i18nextLng') === 'kz' ? 'kk' : 'ru';
window.axios.defaults.headers.common['X-Locale'] = locale;
// Обычные переходы (не axios) сервер локализует по cookie `locale`. Синхронизируем её с
// localStorage на каждом запуске и храним год: без срока она пропадала при закрытии браузера,
// и сервер отвечал по-русски при казахском интерфейсе.
document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
