import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ['header', 'index', 'employees', 'profession', 'announcements', 'login', 'carousel', 'register', 'faq', 'updateNonEmployee', 'createAnnouncement'],
    defaultNS: 'header',
    detection: {
      order: ['querystring', 'localStorage', 'cookie', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    backend: {
      loadPath: '/locale/{{lng}}/{{ns}}.json'
    },
    debug: false,
    cache: false,
    react: { useSuspense: false },
  });

// Log the initial language to help with debugging
// console.log('Initial language:', i18n.language);

export default i18n;
