import { NodeModel } from "@minoru/react-dnd-treeview";
import { invoke } from "@tauri-apps/api/core";

import { NodeData, NodeEnum } from "@type/types";

export async function renameNode(id: NodeModel["id"], newName: string): Promise<NodeModel<NodeData>[]> {
    return await invoke<NodeModel<NodeData>>("rename_node", { id: id, newName: newName })
    .then(async (updatedNode) => {
        return await invoke<NodeModel<NodeData>[]>("update_rconfig_node", { updatedNode: updatedNode });
    });
}

export async function createNode(parent: NodeModel["id"], nodeName: string, nodeType: NodeEnum): Promise<NodeModel<NodeData>[]> {
    return await invoke<NodeModel<NodeData>>("create_node", { parent: parent, nodeName: nodeName, nodeType: nodeType })
    .then(async (newNode) => {
        return await invoke<NodeModel<NodeData>[]>("insert_rconfig_node", { parent: parent, newNode: newNode });
    });
}

export async function deleteNode(id: NodeModel["id"]): Promise<NodeModel<NodeData>[]> {
    return await invoke<void>("move_node_to_trash", { id: id })
    .then(async () => {
        return await invoke<NodeModel<NodeData>[]>("remove_rconfig_node", { id: id });
    });
}

export async function getNodeById(id: NodeModel["id"]): Promise<NodeModel<NodeData>> {
    return await invoke<NodeModel<NodeData>>("get_node_by_id", { id: id });
}