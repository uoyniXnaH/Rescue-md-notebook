/**
 * Used in frontend
 */
import { NodeModel } from "@minoru/react-dnd-treeview";

export type NodeEnum = "file" | "folder" | "calendar";
export type NodeData = {
    nodeType: NodeEnum;
    isOpen?: boolean;
    nodeName: string;
    date?: Date[];
};

export type themeEnum = "light" | "dark";
export type languageEnum = "en" | "sc" | "ja";
export type settingStoreType = {
    settings: GlobalConfig;
    getSettings: () => GlobalConfig;
    setSettings: (settings: GlobalConfig) => void;
    setCurrentRoot: (root: string) => void;
    setTheme: (theme: themeEnum) => void;
    setLanguage: (language: languageEnum) => void;
}

export type displayStoreType = {
    isNavBarShown: boolean;
    isEditAreaShown: boolean;
    isSettingShown: boolean;
    isChanged: boolean;
    currentFileContents: string | undefined;
    editAreaEl: HTMLTextAreaElement | null;
    setIsNavBarShown: (isShown: boolean) => void;
    setIsEditAreaShown: (isShown: boolean) => void;
    setIsSettingShown: (isShown: boolean) => void;
    setCurrentFileContents: (contents: string) => void;
    setIsChanged: (changed: boolean) => void;
    setEditAreaEl: (el: HTMLTextAreaElement) => void;
}

export type FileTreeStoreType = {
    fileTreeData: NodeModel<NodeData>[];
    selectedNodeId: string | number | null;
    selectedDate: Date | null;
    editNodeId: string | number | null;
    ctxMenuId: string | number | null;
    getFileTreeData: () => NodeModel<NodeData>[];
    setFileTreeData: (data: NodeModel<NodeData>[]) => void;
    setSelectedNodeId: (id: string | number | null) => void;
    setSelectedDate: (date: Date | null) => void;
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
    message: string;
}

export type GlobalConfig = {
    current_root: string;
    color_mode: themeEnum;
    language: languageEnum;
}

export type TauriCmdEnum = 
    "get_gconfig" |
    "set_gconfig" |
    "get_rconfig" |
    "set_rconfig" |
    "update_rconfig_node" |
    "insert_rconfig_node" |
    "remove_rconfig_node" |
    "reset_rconfig" |
    "move_node_to_trash" |
    "move_node" |
    "get_node_contents" |
    "update_node_contents" |
    "get_node_by_id" |
    "rename_node" |
    "create_node" |
    "open_in_explorer" |
    "get_rsn_entries_by_id" |
    "fix_folder";