import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { URLS, APIS } from "../config/urls";
import { reqGet } from './request'; 

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'kor', 
  fallbackLng: 'kor',
  interpolation: {
    escapeValue: false, 
  },
});

const fetchTranslation = async () => {
  try {
    const url = `${URLS.BACK_DSH}${APIS.language}`; 
    const response = await reqGet(url); 

    if (response && Array.isArray(response)) {
      const translations = {};


      response.forEach(item => {
        if (item.key && item.value) {
          translations[item.key] = item.value;
        }
      });

      i18n.addResources('kor', 'translation', translations);
    }
  } catch (error) {
    console.error('Error fetching translations:', error);
  }
};

fetchTranslation();

export default i18n;
