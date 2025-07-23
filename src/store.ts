import { create } from "zustand";

import { settingStoreType, themeEnum, languageEnum } from "./types";

export const useSettingStore = create<settingStoreType>()((set) => ({
    theme: "dark",
    language: "en",
    setTheme: (theme: themeEnum) => set({ theme }),
    setLanguage: (language: languageEnum) => set({ language }),
}));