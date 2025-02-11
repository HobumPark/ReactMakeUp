import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { APIS, URLS } from '../config/urls';
import { reqGet } from './request';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  keySeparator: false,
  lng: 'kor',
  fallbackLng: 'kor',
  interpolation: { escapeValue: false },
  initImmediate: false, 
});

const fetchUserLanguage = async () => {
  try {
    const url = `${URLS.BACK_DSH}${APIS.userLanguage}`;
    const response = await reqGet(url);

    if (response) {
      localStorage.setItem('userLanguage', response);
      console.log(response);
      
      i18n.changeLanguage(response);
      await fetchTranslation(response);
    }
  } catch (error) {
    console.error('Error fetching user language:', error);
  }
};

const fetchTranslation = async (language) => {
  try {
    const url1 = `${URLS.BACK_DSH}${APIS.language}`;
    const response1 = await reqGet(url1);

    const translations = {};

    if (response1 && Array.isArray(response1)) {
      response1.forEach(item => {
        if (item.key && item.value) {
          translations[item.key] = item.value;
        }
      });
    }

    i18n.addResources(language, 'translation', translations);

    localStorage.setItem('translations', JSON.stringify(translations));
  } catch (error) {
    console.error('Error fetching translations:', error);
  }
};

export default i18n;
export { fetchUserLanguage };

