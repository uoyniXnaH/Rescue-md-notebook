/**
 * Used in frontend
 */
import { NodeModel } from "@minoru/react-dnd-treeview";

export type NodeEnum = "file" | "folder" | "calendar";
export type NodeData = {
    nodeType: NodeEnum;
    isOpen?: boolean;
    nodeName: string;
};

export type themeEnum = "light" | "dark";
export type languageEnum = "en" | "sc" | "ja";
export type settingStoreType = {
    settings: GlobalConfig;
    getSettings: () => GlobalConfig;
    setSettings: (settings: GlobalConfig) => void;
    setCurrentRoot: (root: String) => void;
    setTheme: (theme: themeEnum) => void;
    setLanguage: (language: languageEnum) => void;
}

export type displayStoreType = {
    isNavBarShown: boolean;
    isEditAreaShown: boolean;
    isSettingShown: boolean;
    isChanged: boolean;
    currentFileContents: string | undefined;
    setIsNavBarShown: (isShown: boolean) => void;
    setIsEditAreaShown: (isShown: boolean) => void;
    setIsSettingShown: (isShown: boolean) => void;
    setCurrentFileContents: (contents: string) => void;
    setIsChanged: (changed: boolean) => void;
}

export type FileTreeStoreType = {
    fileTreeData: NodeModel<NodeData>[];
    selectedNodeId: string | number | null;
    editNodeId: string | number | null;
    ctxMenuId: string | number | null;
    getFileTreeData: () => NodeModel<NodeData>[];
    setFileTreeData: (data: NodeModel<NodeData>[]) => void;
    setSelectedNodeId: (id: string | number | null) => void;
    setEditNodeId: (id: string | number | null) => void;
    setCtxMenuId: (id: string | number | null) => void;
}

export type FocusAreaEnum = "navBar" | "editArea" | "viewArea" | null;
export type FocusStoreType = {
    focusArea: FocusAreaEnum;
    setFocusArea: (area: FocusAreaEnum) => void;
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