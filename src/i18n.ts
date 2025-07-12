import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sc from "./locales/sc.json";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

const resources = {
    sc: {
      translation: sc
    },
    ja: {
      translation: ja
    },
    en: {
      translation: en
    }
  };

  i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    lng: "en", 
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;