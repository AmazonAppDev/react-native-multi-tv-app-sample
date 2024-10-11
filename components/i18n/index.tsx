import i18next from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        compatibilityJSON: 'v3', // If you face any version-related warnings
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
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language in case of missing translations
        interpolation: {
          escapeValue: false, // React already escapes values, so this is safe
        },
      });
    
    export default i18n;