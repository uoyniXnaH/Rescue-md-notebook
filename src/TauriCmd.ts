import { NodeModel } from "@minoru/react-dnd-treeview";
import { invoke } from "@tauri-apps/api/core";

import { NodeData } from "@type/types";

export async function renameNode(id: NodeModel["id"], newName: string): Promise<NodeModel<NodeData>[]> {
    return await invoke<NodeModel<NodeData>>("rename_node", { id: id, newName: newName })
    .then(async (updatedNode) => {
        return await invoke<NodeModel<NodeData>[]>("update_rconfig_node", { updatedNode: updatedNode });
    });
}