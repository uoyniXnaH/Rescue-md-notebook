use std::path::PathBuf;
use uuid::Uuid;
use trash::delete;

use crate::gconfig::{get_gconfig_item};
use crate::rconfig::{get_rconfig, set_rconfig};
use crate::utils::file_tree_handler::{TreeData, TreeNode ,TreeNodeData, ParentId};
use crate::exceptions::{*};

#[tauri::command]
pub fn move_node_to_trash(id: Uuid) -> Result<(), BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let node_path = rconfig.create_path_by_id(&id)?;
    delete(PathBuf::from(&node_path)).map_err(|_| {
        return BaseException::new("Failed to move file to trash", CANNOT_DELETE_FILE);
    })?;
    return Ok(());
}

#[tauri::command]
pub fn move_node(id: Uuid, new_parent_id: ParentId, new_file_tree: TreeData) -> Result<TreeData, BaseException> {
    let root_path = get_gconfig_item("current_root")?;
    let old_file_tree = get_rconfig()?;
    let node = new_file_tree.get_node_by_id(&id).ok_or_else(|| {
        return BaseException::new("Invalid node id", INVALID_PARAMETER);
    })?;

    let siblings = old_file_tree.get_nodes_by_parent(&new_parent_id);
    for sibling in siblings {
        if sibling.data.node_name == node.data.node_name {
            return Err(BaseException::new("Already exists", ALREADY_EXISTS));
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

    let old_path = old_file_tree.create_path_by_id(&id)?;
    std::fs::rename(&old_path, &new_path).map_err(|_| {
        return BaseException::new("Failed to move file", INVALID_OPERATION);
    })?;

    set_rconfig(new_file_tree.clone())?;
    return Ok(new_file_tree);
}

#[tauri::command]
pub fn get_node_contents(id: Uuid) -> Result<String, BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let node = rconfig.get_node_by_id(&id).ok_or_else(|| {
        return BaseException::new("Invalid node id", INVALID_PARAMETER);
    })?;
    let node_path = match node.data.node_type.as_str() {
        "folder" => {
            let mut path = PathBuf::from(rconfig.create_path_by_id(&node.id)?);
            let name = &node.data.node_name;
            path.push(format!("__rsn-folder.{}.md", name));
            path
        },
        "calendar" => {
            return Err(BaseException::new("Calendar feature coming soon :)", COMMING_SOON));
        }
        _ => {
            PathBuf::from(rconfig.create_path_by_id(&node.id)?)
        }
    };
    let contents = std::fs::read_to_string(&node_path).map_err(|_| {
        return BaseException::new("Failed to read file contents", READ_ERROR);
    })?;
    return Ok(contents);
}

#[tauri::command]
pub fn update_node_contents(id: Uuid, new_contents: String) -> Result<(), BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let node_path = match rconfig.get_node_by_id(&id) {
        Some(node) => {
            match node.data.node_type.as_str() {
                "folder" => {
                    let mut path = PathBuf::from(rconfig.create_path_by_id(&node.id)?);
                    let name = &node.data.node_name;
                    path.push(format!("__rsn-folder.{}.md", name));
                    path
                },
                "calendar" => {
                    return Err(BaseException::new("Calendar feature coming soon :)", COMMING_SOON));
                }
                _ => {
                    PathBuf::from(rconfig.create_path_by_id(&node.id)?)
                }
            }
        },
        None => {
            return Err(BaseException::new("Invalid node id", INVALID_PARAMETER));
        }
    };
    if !node_path.exists() {
        return Err(BaseException::new("File does not exist", FILE_NOT_FOUND));
    }
    std::fs::write(&node_path, new_contents).map_err(|_| {
        return BaseException::new("Failed to write file contents", WRITE_ERROR);
    })?;
    return Ok(());
}

#[tauri::command]
pub fn get_node_by_id(id: Uuid) -> Result<TreeNode, BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let node = rconfig.get_node_by_id(&id).ok_or_else(|| {
        return BaseException::new("Invalid node id", INVALID_PARAMETER);
    })?;
    return Ok(node.clone());
}

#[tauri::command]
pub fn rename_node(id: Uuid, new_name: String) -> Result<TreeNode, BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let node = rconfig.get_node_by_id(&id).ok_or_else(|| {
        return BaseException::new("Invalid node id", INVALID_PARAMETER);
    })?;

    if node.data.node_type == "calendar" {
        return Err(BaseException::new("Calendar feature coming soon :)", COMMING_SOON));
    }

    let siblings = rconfig.get_nodes_by_parent(&node.parent);
    for sibling in siblings {
        if sibling.data.node_name == new_name {
            return Err(BaseException::new("Already exists", ALREADY_EXISTS));
        }
    }

    let node_path = PathBuf::from(rconfig.create_path_by_id(&id)?);
    let mut new_path = node_path.clone();
    let ext = node_path.extension().and_then(|s| s.to_str()).unwrap_or("");
    if ext != "" && node.data.node_type != "folder" {
        new_path.set_file_name(format!("{}.{}", &new_name, ext));
    } else {
        new_path.set_file_name(&new_name);
    }

    std::fs::rename(&node_path, &new_path).map_err(|_| {
        return BaseException::new("Failed to rename file", INVALID_OPERATION);
    })?;

    if node.data.node_type == "folder" {
        let mut new_attach_path = new_path.clone();
        new_path.push(format!("__rsn-folder.{}.md", &node.data.node_name));
        new_attach_path.push(format!("__rsn-folder.{}.md", &new_name));

        std::fs::rename(&new_path, &new_attach_path).map_err(|_| {
            return BaseException::new("Failed to rename folder metadata file", INVALID_OPERATION);
        })?;
        new_path.pop();
    }
    let mut updated_node = node.clone();
    updated_node.data.node_name = new_path.file_name().and_then(|s| s.to_str()).unwrap_or("").to_string();
    updated_node.text = new_name;

    return Ok(updated_node);
}

#[tauri::command]
pub fn create_node(parent: ParentId, mut node_name: String, node_type: String) -> Result<TreeNode, BaseException> {
    let rconfig: TreeData = get_rconfig()?;
    let root_path = get_gconfig_item("current_root")?;

    if node_type == "calendar" {
        return Err(BaseException::new(
            "Calendar feature coming soon :)",
            COMMING_SOON,
        ));
    }

    let siblings = rconfig.get_nodes_by_parent(&parent);
    let mut sibling_names: Vec<String> = Vec::new();
    let mut order: u32 = 1;
    let old_name = node_name.clone();
    for sibling in siblings {
        sibling_names.push(sibling.text.clone());
    }
    while sibling_names.contains(&node_name) {
        node_name = format!("{} ({})", &old_name, order);
        order += 1;
    }

    let mut new_path = match &parent {
        ParentId::Root(0) => {
            let mut path = PathBuf::from(&root_path);
            path.push(PathBuf::from(&node_name));
            path
        }
        ParentId::Id(id) => {
            let parent_path = rconfig.create_path_by_id(&id)?;
            let mut path = PathBuf::from(&parent_path);
            path.push(PathBuf::from(&node_name));
            path
        }
        _ => {
            return Err(BaseException::new("Invalid parent ID", INVALID_PARAMETER));
        }
    };

    if node_type == "folder" {
        std::fs::create_dir(&new_path).map_err(|_| {
            return BaseException::new("Failed to create folder", CANNOT_CREATE_FILE);
        })?;
        init_folder(&new_path);
    } else {
        new_path.set_extension("md");
        std::fs::File::create(&new_path).map_err(|_| {
            return BaseException::new("Failed to create file", CANNOT_CREATE_FILE);
        })?;
    }

    let new_node = TreeNode {
        id: Uuid::new_v4(),
        parent: parent,
        droppable: node_type == "folder",
        text: node_name.clone(),
        data: TreeNodeData {
            node_name: new_path.file_name().and_then(|s| s.to_str()).unwrap_or("").to_string(),
            node_type: node_type,
            is_open: Some(false),
        },
    };
    return Ok(new_node);
}

pub fn init_folder(path: &PathBuf) -> () {
    let mut config_path = path.clone();
    let name = path.file_name().and_then(|s| s.to_str()).unwrap_or("");
    config_path.push(format!("__rsn-folder.{}.md", name));
    if config_path.exists() {
        return;
    }
    std::fs::File::create(&config_path)
        .map_err(|_| {
            return;
        })
        .unwrap();
}
