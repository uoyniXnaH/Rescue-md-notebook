export type NodeEnum = "file" | "folder" | "calendar";
export type NodeData = {
    fileType: NodeEnum;
    isOpen?: boolean;
    filePath: string;
};

export type themeEnum = "light" | "dark";
export type languageEnum = "en" | "sc" | "ja";
export type settingStoreType = {
    theme: themeEnum;
    language: languageEnum;
    setTheme: (theme: themeEnum) => void;
    setLanguage: (language: languageEnum) => void;
}

export type displayStoreType = {
    isNavBarShown: boolean;
    isEditAreaShown: boolean;
    isSettingShown: boolean;
    currentFilePath: string | undefined;
    currentFileContents: string | undefined;
    setIsNavBarShown: (isShown: boolean) => void;
    setIsEditAreaShown: (isShown: boolean) => void;
    setIsSettingShown: (isShown: boolean) => void;
    setCurrentFilePath: (filePath: string) => void;
    setCurrentFileContents: (contents: string) => void;
}

export type FileTreeStoreType = {
    selectedNodeId: string | number | null;
    setSelectedNodeId: (id: string | number | null) => void;
}