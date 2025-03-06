import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['X-Locale'] = localStorage.getItem('i18nextLng') === 'kz' ? 'kk' : 'ru';
