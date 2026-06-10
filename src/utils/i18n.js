// src/utils/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // optional, detects user language
  .use(initReactI18next) // connects i18n to React
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          // more keys...
        }
      },
      ur: {
        translation: {
          welcome: "خوش آمدید",
          // more keys...
        }
      }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
