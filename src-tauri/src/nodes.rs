// use std::fs::{File};
use std::path::PathBuf;
use uuid::Uuid;
use trash::delete;

use crate::gconfig::{get_gconfig_item};
use crate::rconfig::{get_rconfig, set_rconfig};
use crate::utils::file_tree_handler::{TreeData, ParentId};
use crate::exceptions::{*};

#[tauri::command]
pub fn move_to_trash(node_id: Uuid) -> Result<(), BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let node_path = rconfig.create_path_by_id(&node_id)?;
    delete(PathBuf::from(&node_path)).map_err(|_| {
        return BaseException::new("Failed to move file to trash", CANNOT_DELETE_FILE);
    })?;
    return Ok(());
}

#[tauri::command]
pub fn move_node(node_id: Uuid, new_parent_id: ParentId, new_file_tree: TreeData) -> Result<TreeData, BaseException> {
    let root_path = get_gconfig_item("current_root")?;
    let old_file_tree = get_rconfig()?;
    let node = new_file_tree.get_node_by_id(&node_id).ok_or_else(|| {
        return BaseException::new("Invalid node id", INVALID_PARAMETER);
    })?;

    let siblings = old_file_tree.get_nodes_by_parent(&new_parent_id);
    for sibling in siblings {
        if sibling.data.node_name == node.data.node_name {
            return Err(BaseException::new("Already exists", INVALID_OPERATION));
        }
    }

    let new_path = match &new_parent_id {
        ParentId::Root(0) => {
            let mut path = PathBuf::from(&root_path);
            path.push(PathBuf::from(&node.data.node_name));
            path
        },
        ParentId::Id(id) => {
            let parent_path = new_file_tree.create_path_by_id(&id)?;
            let mut path = PathBuf::from(&parent_path);
            path.push(PathBuf::from(&node.data.node_name));
            path
        },
        _ => {
            return Err(BaseException::new("Invalid parent ID", INVALID_PARAMETER));
        }
    };

    let old_path = old_file_tree.create_path_by_id(&node_id)?;
    std::fs::rename(&old_path, &new_path).map_err(|_| {
        return BaseException::new("Failed to move file", INVALID_OPERATION);
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