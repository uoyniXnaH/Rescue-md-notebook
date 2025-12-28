import { create } from "zustand";

import * as types from "@type/types";

export const useSettingStore = create<types.settingStoreType>()((set, get) => ({
    settings: {
        current_root: "",
        color_mode: "dark",
        language: "en"
    },
    setSettings: (settings) => set({ settings: settings }),
    getSettings: () => get().settings,
    setCurrentRoot: (path: String) => set((state) => ({ settings: { ...state.settings, current_root: path } })),
    setTheme: (theme: types.themeEnum) => set((state) => ({ settings: { ...state.settings, color_mode: theme } })),
    setLanguage: (language: types.languageEnum) => set((state) => ({ settings: { ...state.settings, language: language } })),
}));

export const useDisplayStore = create<types.displayStoreType>()((set) => ({
    isNavBarShown: true,
    isEditAreaShown: true,
    isSettingShown: false,
    currentFileContents: "",
    isChanged: false,
    setIsNavBarShown: (isShown) => set({ isNavBarShown: isShown }),
    setIsEditAreaShown: (isShown) => set({ isEditAreaShown: isShown }),
    setIsSettingShown: (isShown) => set({ isSettingShown: isShown }),
    setCurrentFileContents: (contents) => set({ currentFileContents: contents }),
    setIsChanged: (changed) => set({ isChanged: changed }),
}));

export const useFileTreeStore = create<types.FileTreeStoreType>()((set, get) => ({
    fileTreeData: [],
    getFileTreeData: () => get().fileTreeData,
    setFileTreeData: (data) => set({ fileTreeData: data }),
    selectedNodeId: null,
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));

export const useFocusStore = create<types.FocusStoreType>()((set) => ({
    focusArea: null,
    setFocusArea: (area: types.FocusAreaEnum) => set({ focusArea: area }),
}));