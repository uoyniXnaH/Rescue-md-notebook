/**
 * Used in frontend
 */
import { NodeModel } from "@minoru/react-dnd-treeview";

export type NodeEnum = "file" | "folder" | "calendar";
export type NodeData = {
    fileType: NodeEnum;
    isOpen?: boolean;
    filePath: string;
};

export type themeEnum = "light" | "dark";
export type languageEnum = "en" | "sc" | "ja";
export type settingStoreType = {
    settings: GlobalConfig;
    getSettings: () => GlobalConfig;
    setCurrentRoot: (root: String) => void;
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
    fileTreeData: NodeModel<NodeData>[];
    getFileTreeData: () => NodeModel<NodeData>[];
    setFileTreeData: (data: NodeModel<NodeData>[]) => void;
    selectedNodeId: string | number | null;
    setSelectedNodeId: (id: string | number | null) => void;
}

/**
 * Used in commands
 */
export type BaseException = {
    code: number;
    message: String;
}

export type GlobalConfig = {
    current_root: String;
    color_mode: themeEnum;
    language: languageEnum;
}