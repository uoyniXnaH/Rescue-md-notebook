import { create } from "zustand";

import { settingStoreType, themeEnum, languageEnum, displayStoreType } from "./types";
import { dummyContents } from "./dummy";

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
    currentFilePath: "undefined",
    currentFileContents: dummyContents,
    setIsNavBarShown: (isShown) => set({ isNavBarShown: isShown }),
    setIsEditAreaShown: (isShown) => set({ isEditAreaShown: isShown }),
    setIsSettingShown: (isShown) => set({ isSettingShown: isShown }),
    setCurrentFilePath: (filePath) => set({ currentFilePath: filePath }),
    setCurrentFileContents: (contents) => set({ currentFileContents: contents }),
}));