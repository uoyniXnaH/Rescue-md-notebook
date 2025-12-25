// use std::fs::{File};
use std::path::PathBuf;
use uuid::Uuid;
use trash::delete;

use crate::gconfig::{get_gconfig_item};
use crate::rconfig::{get_rconfig, set_rconfig};
use crate::utils::file_tree_handler::{TreeData, ParentId, TreeNode, TreeNodeData};
use crate::exceptions::{*};

#[tauri::command]
pub fn move_to_trash(node_id: Uuid) -> Result<(), BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let node = rconfig.get_node_by_id(&node_id).ok_or_else(|| {
        return BaseException::new("Node ID not found", INVALID_PARAMETER);
    })?;
    delete(PathBuf::from(&node.data.file_path)).map_err(|_| {
        return BaseException::new("Failed to move file to trash", CANNOT_DELETE_FILE);
    })?;
    return Ok(());
}

#[tauri::command]
pub fn move_node(node_id: Uuid, new_parent_id: ParentId, mut new_file_tree: TreeData) -> Result<TreeData, BaseException> {
    let root_path = get_gconfig_item("current_root")?;
    let node = new_file_tree.get_node_by_id(&node_id).ok_or_else(|| {
        return BaseException::new("Invalid node id", INVALID_PARAMETER);
    })?;
    let new_path = match new_parent_id {
        ParentId::Root(0) => {
            let mut path = PathBuf::from(&root_path);
            path.push(PathBuf::from(&node.text));
            path
        },
        ParentId::Id(id) => {
            let parent_node = new_file_tree.get_node_by_id(&id).ok_or_else(|| {
                return BaseException::new("Invalid new parent id", INVALID_PARAMETER);
            })?;
            let mut path = PathBuf::from(&parent_node.data.file_path);
            path.push(PathBuf::from(&node.text));
            path
        },
        _ => {
            return Err(BaseException::new("Invalid parent ID", INVALID_PARAMETER));
        }
    };
    if new_file_tree.get_node_by_path(&new_path.to_string_lossy()).is_some() {
        return Err(BaseException::new("Already exists", INVALID_OPERATION));
    }
    std::fs::rename(&node.data.file_path, &new_path).map_err(|_| {
        return BaseException::new("Failed to move file", INVALID_OPERATION);
    })?;
    new_file_tree.update_node(TreeNode {
        id: node.id,
        parent: new_parent_id,
        droppable: node.droppable,
        text: node.text.clone(),
        data: TreeNodeData {
            file_type: node.data.file_type.clone(),
            file_path: new_path.to_string_lossy().to_string(),
            is_open: node.data.is_open
        }
    })?;
    set_rconfig(new_file_tree.clone())?;
    return Ok(new_file_tree);
}

pub fn init_folder(path: &PathBuf) -> () {
    let mut config_path = path.clone();
    let name = path.file_name().and_then(|s| s.to_str()).unwrap_or("");
    config_path.push(format!("__rsn-folder.{}.md", name));
    if config_path.exists() {
        return;
    }
    std::fs::File::create(&config_path).map_err(|_| {
        return;
    }).unwrap();
}