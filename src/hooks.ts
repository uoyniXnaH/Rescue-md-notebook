import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";

import { useFocusStore, useDisplayStore, useFileTreeStore } from "@store/store";
import { useModal } from "./components/Modal";
import useTauriCmd from "@tauri/TauriCmd";
import { NodeData, NodeEnum } from "@type/types";
import { NodeModel } from "@minoru/react-dnd-treeview";

export function useGlobalShortcuts() {
    const focusArea = useFocusStore((state) => state.focusArea);
    const currentFileContents = useDisplayStore((state) => state.currentFileContents);
    const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
    const editAreaEl = useDisplayStore((state) => state.editAreaEl);
    const editNodeId = useFileTreeStore((state) => state.editNodeId);
    const setCurrentFileContents = useDisplayStore((state) => state.setCurrentFileContents);
    const setIsChanged = useDisplayStore((state) => state.setIsChanged);
    const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
    const setSelectedNodeId = useFileTreeStore((state) => state.setSelectedNodeId);
    const setEditNodeId = useFileTreeStore((state) => state.setEditNodeId);
    const { showBasicModal } = useModal();
    const { saveFile } = useFileActions();
    const { deleteNode, getNodeById } = useTauriCmd();
    const { t } = useTranslation();
    const desiredCaretRef = useRef<number | null>(null);

    useLayoutEffect(() => {
        if (desiredCaretRef.current !== null && editAreaEl) {
            try {
                editAreaEl.setSelectionRange(desiredCaretRef.current, desiredCaretRef.current);
            } catch (e) {}
            desiredCaretRef.current = null;
        }
    }, [currentFileContents, editAreaEl]);
    useLayoutEffect(() => {
        if (desiredCaretRef.current !== null && editAreaEl) {
            try {
                editAreaEl.setSelectionRange(desiredCaretRef.current, desiredCaretRef.current);
            } catch (e) {}
            desiredCaretRef.current = null;
        }
    }, [currentFileContents, editAreaEl]);

    useEffect(() => {
        const handler = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                if (focusArea === "editArea") {
                    await saveFile();
                }
            }
            if (e.key === "F2") {
                e.preventDefault();
                if (focusArea === "navBar" && selectedNodeId && editNodeId === null) {
                    setEditNodeId(selectedNodeId);
                }
            }
            if (e.key === "Escape") {
                if (focusArea === "navBar" && editNodeId !== null) {
                    setEditNodeId(null);
                }
            }
            if (e.key === "Delete") {
                if (focusArea === "navBar" && selectedNodeId && editNodeId === null) {
                    const targetNode = await getNodeById(selectedNodeId);
                    if (!targetNode) return;
                    showBasicModal({
                        contents: [t("modal.confirm_delete"), targetNode.text],
                        leftButtonText: t("modal.cancel"),
                        rightButtonText: t("modal.delete"),
                        onLeftButtonClick: () => {},
                        onRightButtonClick: () => {
                            deleteNode(selectedNodeId)
                            .then((updatedFileTree) => {
                                setFileTreeData(updatedFileTree);
                                if (selectedNodeId === selectedNodeId) {
                                    setSelectedNodeId(null);
                                }
                            });
                        }
                    })
                }
            }
            if (e.key === "Tab") {
                if (focusArea === "editArea") {
                    e.preventDefault();
                    console.log(editAreaEl);
                    if (editAreaEl && currentFileContents) {
                        const start = editAreaEl.selectionStart;
                        const end = editAreaEl.selectionEnd;
                        const newValue = currentFileContents.substring(0, start) + "    " + currentFileContents.substring(end);
                        const newPos = start + 4;
                        desiredCaretRef.current = newPos;
                        setCurrentFileContents(newValue);
                        setIsChanged(true);
                        // editAreaEl.focus();
                    }
                } else if (focusArea === null) {
                    e.preventDefault();
                }
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [focusArea, currentFileContents, selectedNodeId, editNodeId, editAreaEl]);
}

export function useFileActions() {
    const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
    const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
    const currentFileContents = useDisplayStore((state) => state.currentFileContents);
    const setIsChanged = useDisplayStore((state) => state.setIsChanged);
    const Tauri = useTauriCmd();

    const saveFile = async () => {
        if (selectedNodeId) {
            await Tauri.updateNodeContents(selectedNodeId, currentFileContents)
            .then(() => {
                setIsChanged(false);
            });
        }
    };

    const renameNode = async (id: string | number, newName: string) => {
        await Tauri.renameNode(id, newName)
        .then((updatedFileTree) => {
            setFileTreeData(updatedFileTree);
        });
    }

    const createNode = async (parent: string | number, nodeName: string, nodeType: NodeEnum) => {
        await Tauri.createNode(parent, nodeName, nodeType)
        .then((updatedFileTree) => {
            setFileTreeData(updatedFileTree);
        });
    }

    return { saveFile, renameNode, createNode };
}

export function useContextMenu() {
    const focusArea = useFocusStore((state) => state.focusArea);
    const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
    const setCtxMenuId = useFileTreeStore((state) => state.setCtxMenuId);
    const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
    const setSelectedNodeId = useFileTreeStore((state) => state.setSelectedNodeId);
    const setEditNodeId = useFileTreeStore((state) => state.setEditNodeId);
    const { showBasicModal } = useModal();
    const { getNodeById, deleteNode, openInExplorer, fixFolder } = useTauriCmd();
    const { t } = useTranslation();

    const popUpCtxMenu = async (event: React.MouseEvent) => {
        event.preventDefault();
        const target_id = (event.target as HTMLElement).attributes.getNamedItem("data-testid")?.value;
        let target_node: NodeModel<NodeData> | null = null;
        if (target_id) {
            target_node = await getNodeById(target_id as string | number);
        }

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

        const open_in_explorer = await MenuItem.new({
            text: t("context_menu.open_in_explorer"),
            action: async () => {
                await openInExplorer(target_id as string | number);
            }
        });
        const fix_node = await MenuItem.new({
            text: t("context_menu.fix_node"),
            action: async () => {
                showBasicModal({
                    contents: t("modal.confirm_fix_folder"),
                    leftButtonText: t("modal.cancel"),
                    rightButtonText: t("modal.ok"),
                    onLeftButtonClick: () => {},
                    onRightButtonClick: () => {
                        fixFolder(target_id as string | number)
                        .then(() => {
                            setCtxMenuId(null);
                        });
                    }
                })
            }
        });
        const rename = await MenuItem.new({
            text: t("context_menu.rename"),
            accelerator: "F2",
            action: () => {
                setEditNodeId(target_id as string | number);
            }
        });
        const move_to_trash = await MenuItem.new({
            text: t("context_menu.delete"),
            accelerator: "Delete",
            action: () => {
                showBasicModal({
                    contents: [t("modal.confirm_delete"), target_node!.text],
                    leftButtonText: t("modal.cancel"),
                    rightButtonText: t("modal.delete"),
                    onLeftButtonClick: () => {},
                    onRightButtonClick: () => {
                        deleteNode(target_id as string | number)
                        .then((updatedFileTree) => {
                            setCtxMenuId(null);
                            setFileTreeData(updatedFileTree);
                            if (selectedNodeId === target_id) {
                                setSelectedNodeId(null);
                            }
                        });
                    }
                })
            }
        });

        let items: Array<PredefinedMenuItem | MenuItem> = [];
        if (target_id) {
            setCtxMenuId(target_id);
            items = [rename, move_to_trash, separator, open_in_explorer];
            if (target_node?.droppable) {
                items.push(fix_node);
            }
        } else if (focusArea == "editArea") {
            items = [cut, copy, paste, select_all, separator, undo, redo];
        }

        const menu = await Menu.new({
            items: items,
        });
        menu.popup();
    }
    return { popUpCtxMenu };
}

export function useWindowSize() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        let timerId: number | null = null;
        const handleResize = () => {
            if (timerId) return;
            timerId = window.setTimeout(() => {
                setWidth(window.innerWidth);
                setHeight(window.innerHeight);
                timerId = null;
            }, 200);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, []);

    return { width, height };
}