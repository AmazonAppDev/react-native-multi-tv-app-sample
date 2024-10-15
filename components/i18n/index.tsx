import i18next from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import es from './es.json';
import fr from './fr.json';

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        compatibilityJSON: 'v3',
        resources: {
          en: {
            translation: en,
          },
          es: {
            translation: es,
          },
          fr: {
            translation: fr,
          },
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
      });
    
    export default i18n;