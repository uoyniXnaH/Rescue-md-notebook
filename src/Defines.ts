import { NodeModel } from "@minoru/react-dnd-treeview";

import { NodeEnum, GlobalConfig, NodeData } from "@type/types";

export const VERSION = "0.2.2";

export const LANGUAGE = {
    sc: "简体中文",
    ja: "日本語",
    en: "English",
};

export const NODE_TYPE: NodeEnum[] = [
    "folder",
    "file",
    "calendar"
]

export const defaultGlobalConfig: GlobalConfig = {
    current_root: "",
    color_mode: "dark",
    language: "en",
};

export const emptyNode: NodeModel<NodeData> = {
    id: "",
    parent: 0,
    droppable: false,
    text: "",
    data: {
        nodeType: "file",
        nodeName: "",
        isOpen: false,
    },
}

export const MINI_NAV_WIDTH = 1600;
export const FLOATING_NAV_WIDTH = 1100;