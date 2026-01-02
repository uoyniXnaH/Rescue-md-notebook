import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";

import { useFocusStore, useDisplayStore, useFileTreeStore } from "@store/store";
import { useTranslation } from "react-i18next";
import * as Tauri from "./TauriCmd";
import { NodeEnum } from "@type/types";

export function useGlobalShortcuts() {
    const focusArea = useFocusStore((state) => state.focusArea);
    const currentFileContents = useDisplayStore((state) => state.currentFileContents);
    const { saveFile } = useFileActions();

    useEffect(() => {
        const handler = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                if (focusArea === "editArea") {
                    await saveFile();
                }
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [focusArea, currentFileContents]);
}

export function useFileActions() {
    const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
    const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
    const currentFileContents = useDisplayStore((state) => state.currentFileContents);
    const setIsChanged = useDisplayStore((state) => state.setIsChanged);

    const saveFile = async () => {
        if (selectedNodeId) {
            await invoke("update_node_contents", { id: selectedNodeId, newContents: currentFileContents })
            .then(() => {
                setIsChanged(false);
            })
            .catch((error) => {
                console.error("Failed to save file contents:", error);
            });
        }
    };

    const renameNode = async (id: string | number, newName: string) => {
        await Tauri.renameNode(id, newName)
        .then((updatedFileTree) => {
            setFileTreeData(updatedFileTree);
        })
        .catch((error) => {
            console.error("Failed to rename node:", error);
        });
    }

    const createNode = async (parent: string | number, nodeName: string, nodeType: NodeEnum) => {
        await Tauri.createNode(parent, nodeName, nodeType)
        .then((updatedFileTree) => {
            setFileTreeData(updatedFileTree);
        })
        .catch((error) => {
            console.error("Failed to create node:", error);
        });
    }

    return { saveFile, renameNode, createNode };
}

export function useContextMenu() {
    const focusArea = useFocusStore((state) => state.focusArea);
    const setCtxMenuId = useFileTreeStore((state) => state.setCtxMenuId);
    const { showModal } = useModal();
    const { t } = useTranslation();

    const popUpCtxMenu = async (event: React.MouseEvent) => {
        event.preventDefault();
        const target_id = (event.target as HTMLElement).attributes.getNamedItem("data-testid")?.value;

        const copy = await PredefinedMenuItem.new({
            text: t("context_menu.copy"),
            item: 'Copy',
        });
        const cut = await PredefinedMenuItem.new({
            text: t("context_menu.cut"),
            item: 'Cut',
        });
        const paste = await PredefinedMenuItem.new({
            text: t("context_menu.paste"),
            item: 'Paste',
        });
        const select_all = await PredefinedMenuItem.new({
            text: t("context_menu.select_all"),
            item: 'SelectAll',
        });
        const undo = await PredefinedMenuItem.new({
            text: t("context_menu.undo"),
            item: 'Undo',
        });
        const redo = await PredefinedMenuItem.new({
            text: t("context_menu.redo"),
            item: 'Redo',
        });
        const separator = await PredefinedMenuItem.new({
            item: 'Separator',
        });

        const rename = await MenuItem.new({
            text: t("context_menu.rename"),
            accelerator: "F2",
            action: () => {
                console.log("Rename action triggered");
            }
        });
        const move_to_trash = await MenuItem.new({
            text: t("context_menu.delete"),
            accelerator: "Delete",
            action: () => {
                showModal({
                    contents: "Are you sure you want to delete this item?"
                })
            }
        });

        let items: Array<PredefinedMenuItem | MenuItem> = [];
        if (focusArea == "editArea") {
            items = [cut, copy, paste, select_all, separator, undo, redo];
        } else if (target_id) {
            setCtxMenuId(target_id);
            items = [rename, move_to_trash]
        }

        const menu = await Menu.new({
            items: items,
        });
        menu.popup();
    }
    return { popUpCtxMenu };
}