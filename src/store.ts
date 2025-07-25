import { create } from "zustand";

import { settingStoreType, themeEnum, languageEnum, displayStoreType } from "./types";

export const useSettingStore = create<settingStoreType>()((set) => ({
    theme: "dark",
    language: "en",
    setTheme: (theme: themeEnum) => set({ theme }),
    setLanguage: (language: languageEnum) => set({ language }),
}));

export const useDisplayStore = create<displayStoreType>()((set) => ({
    isNavBarShown: true,
    isEditAreaShown: true,
    isSettingShown: false,
    currentFile: "",
    setIsNavBarShown: (isShown) => set({ isNavBarShown: isShown }),
    setIsEditAreaShown: (isShown) => set({ isEditAreaShown: isShown }),
    setIsSettingShown: (isShown) => set({ isSettingShown: isShown }),
    setCurrentFile: (filePath) => set({ currentFile: filePath }),
}));