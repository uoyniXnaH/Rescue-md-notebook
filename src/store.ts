import { create } from "zustand";

import { settingStoreType } from "./types";

export const useSettingStore = create<settingStoreType>()((set) => ({
    theme: "dark",
    language: "en",
    setTheme: (theme: "light" | "dark") => set({ theme }),
    setLanguage: (language: "en" | "sc" | "ja") => set({ language }),
}));