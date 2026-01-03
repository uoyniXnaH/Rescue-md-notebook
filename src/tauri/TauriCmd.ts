import { invoke } from "@tauri-apps/api/core";
import { NodeModel } from "@minoru/react-dnd-treeview";

import { useModal } from "@src/components/Modal";
import { useFileTreeStore } from "@store/store";
import { defaultGlobalConfig, emptyNode } from "@src/Defines";

import * as Types from "@type/types";

function useTauriCmd() {
    const { showMessageModal } = useModal();
    const fileTreeData = useFileTreeStore((state) => state.fileTreeData);

    const getGlobalConfig = async (): Promise<Types.GlobalConfig> => {
        return new Promise((resolve) => {
            invoke<Types.GlobalConfig>("get_gconfig")
            .then((config) => {
                resolve(config);
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error getting global config: ${error}`,
                });
                resolve(defaultGlobalConfig);
            });
        });
    }

    const setGlobalConfig = async (config: Types.GlobalConfig): Promise<void> => {
        return new Promise((resolve) => {
            invoke<void>("set_gconfig", { config: config })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error setting global config: ${error}`,
                });
                resolve();
            });
        });
    }

    const getRootConfig = async (): Promise<NodeModel<Types.NodeData>[]> => {
        return new Promise((resolve) => {
            invoke<NodeModel<Types.NodeData>[]>("get_rconfig")
            .then((config) => {
                resolve(config);
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error getting root config: ${error}`,
                });
                resolve([]);
            });
        });
    }

    const setRootConfig = async (config: NodeModel<Types.NodeData>[]): Promise<void> => {
        return new Promise((resolve) => {
            invoke<void>("set_rconfig", { rconfig: config })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error setting root config: ${error}`,
                });
                resolve();
            });
        });
    }

    const updateRootConfigNode = async (updatedNode: NodeModel<Types.NodeData>): Promise<NodeModel<Types.NodeData>[]> => {
        return new Promise((resolve) => {
            invoke<NodeModel<Types.NodeData>[]>("update_rconfig_node", { updatedNode: updatedNode })
            .then((config) => {
                resolve(config);
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error updating root config node: ${error}`,
                });
                resolve(fileTreeData);
            });
        });
    }

    const renameNode = async (id: NodeModel["id"], newName: string): Promise<NodeModel<Types.NodeData>[]> => {
        return new Promise((resolve) => {
            invoke<NodeModel<Types.NodeData>>("rename_node", { id: id, newName: newName })
            .then(async (updatedNode) => {
                await invoke<NodeModel<Types.NodeData>[]>("update_rconfig_node", { updatedNode: updatedNode })
                .then((filetree) => {
                    resolve(filetree);
                })
                .catch((error) => {
                    showMessageModal({
                        contents: `Error updating root config node after renaming: ${error}`,
                    });
                    resolve(fileTreeData);
                });
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error renaming node: ${error}`,
                });
                resolve(fileTreeData);
            });
        });
    }

    const createNode = async (parent: NodeModel["id"], nodeName: string, nodeType: Types.NodeEnum): Promise<NodeModel<Types.NodeData>[]> => {
        return new Promise((resolve) => {
            invoke<NodeModel<Types.NodeData>>("create_node", { parent: parent, nodeName: nodeName, nodeType: nodeType })
            .then(async (newNode) => {
                await invoke<NodeModel<Types.NodeData>[]>("insert_rconfig_node", { parent: parent, newNode: newNode })
                .then((filetree) => {
                    resolve(filetree);
                })
                .catch((error) => {
                    showMessageModal({
                        contents: `Error inserting new node into root config: ${error}`,
                    });
                    resolve(fileTreeData);
                });
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error creating node: ${error}`,
                });
                resolve(fileTreeData);
            });
        });
    }

    const deleteNode = async (id: NodeModel["id"]): Promise<NodeModel<Types.NodeData>[]> => {
        return new Promise((resolve) => {
            invoke<void>("move_node_to_trash", { id: id })
            .then(async () => {
                await invoke<NodeModel<Types.NodeData>[]>("remove_rconfig_node", { id: id })
                .then((filetree) => {
                    resolve(filetree);
                })
                .catch((error) => {
                    showMessageModal({
                        contents: `Error removing node from root config: ${error}`,
                    });
                    resolve(fileTreeData);
                });
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error deleting node: ${error}`,
                });
                resolve(fileTreeData);
            });
        });
    }

    const moveNode = async (id: NodeModel["id"], newParentId: NodeModel["id"], newFileTree: NodeModel<Types.NodeData>[]): Promise<NodeModel<Types.NodeData>[]> => {
        return new Promise((resolve) => {
            invoke<NodeModel<Types.NodeData>[]>("move_node", { id: id, newParentId: newParentId, newFileTree: newFileTree })
            .then((filetree) => {
                resolve(filetree);
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error moving node: ${error}`,
                });
                resolve(fileTreeData);
            });
        });
    }

    const getNodeById = async (id: NodeModel["id"]): Promise<NodeModel<Types.NodeData>> => {
        return new Promise((resolve) => {
            invoke<NodeModel<Types.NodeData>>("get_node_by_id", { id: id })
            .then((node) => {
                resolve(node);
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error getting node by id: ${error}`,
                });
                resolve(emptyNode);
            });
        });
    }

    const getNodeContents = async (id: NodeModel["id"]): Promise<string> => {
        return new Promise((resolve) => {
            invoke<string>("get_node_contents", { id: id })
            .then((contents) => {
                resolve(contents);
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error getting node contents: ${error}`,
                });
                resolve("");
            });
        });
    }

    const updateNodeContents = async (id: NodeModel["id"], newContents: string | undefined): Promise<void> => {
        return new Promise((resolve) => {
            invoke<void>("update_node_contents", { id: id, newContents: newContents || "" })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                showMessageModal({
                    contents: `Error updating node contents: ${error}`,
                });
                resolve();
            });
        });
    }

    return {
        getGlobalConfig,
        setGlobalConfig,
        getRootConfig,
        setRootConfig,
        updateRootConfigNode,
        renameNode,
        createNode,
        deleteNode,
        moveNode,
        getNodeById,
        getNodeContents,
        updateNodeContents,
    };
}

export default useTauriCmd;