use std::fs::{read_dir};
use std::path::Path;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use regex::Regex;

use crate::gconfig::{get_gconfig_item};
use crate::nodes::{init_folder};
use crate::exceptions::{*};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
pub struct TreeNodeData {
    pub node_type: String,
    pub node_name: String,
    pub is_open: Option<bool>
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
#[serde(untagged)]
pub enum ParentId {
    Root(u8),
    Id(Uuid)
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TreeNode {
    pub id: Uuid,
    pub parent: ParentId,
    pub droppable: bool,
    pub text: String,
    pub data: TreeNodeData
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TreeData(Vec<TreeNode>);

impl TreeData {
    pub fn get_node_by_id(&self, id: &Uuid) -> Option<&TreeNode> {
        for node in &self.0 {
            if &node.id == id {
                return Some(node);
            }
        }
        return None;
    }

    pub fn get_nodes_by_parent(&self, parent: &ParentId) -> Vec<&TreeNode> {
        let mut result: Vec<&TreeNode> = Vec::new();
        for node in &self.0 {
            if &node.parent == parent {
                result.push(node);
            }
        }
        return result;
    }

    pub fn create_path_by_id(&self, id: &Uuid) -> Result<String, BaseException> {
        let mut path_components: Vec<String> = Vec::new();
        let root = get_gconfig_item("current_root")?;
        let mut current_id = id.clone();
        loop {
            let node = self.get_node_by_id(&current_id).ok_or_else(|| {
                return BaseException::new("Node ID not found", INVALID_PARAMETER);
            })?;
            path_components.push(node.data.node_name.clone());
            match &node.parent {
                ParentId::Root(0) => {
                    path_components.push(root);
                    break;
                },
                ParentId::Id(parent_id) => {
                    current_id = parent_id.clone();
                },
                _ => {
                    return Err(BaseException::new("Invalid parent ID", INVALID_PARAMETER));
                }
            }
        }
        path_components.reverse();
        return Ok(path_components.join(&std::path::MAIN_SEPARATOR.to_string()));
    }

    pub fn update_node(&mut self, updated_node: &TreeNode) -> Result<(), BaseException> {
        for node in &mut self.0 {
            if node.id == updated_node.id {
                *node = updated_node.clone();
                return Ok(());
            }
        }
        return Err(BaseException::new("Node ID not found", INVALID_PARAMETER));
    }
}

fn get_type_and_name(path: &Path) -> (Option<&str>, &str) {
    let re = Regex::new(r"^__rsn-(\w+)\.(.+)$").unwrap();
    let filename = path.file_name()
    .and_then(|s| s.to_str())
    .unwrap_or("");
    let mut node_type = "";
    let mut node_name = "";
    re.captures(filename).map(|caps| {
        node_type = caps.get(1).map(|m| m.as_str()).unwrap_or("");
        node_name = caps.get(2).map(|m| m.as_str()).unwrap_or("");
    });
    if path.is_dir() {
        match node_type {
            "calendar" => (Some("calendar"), node_name),
            _ => (Some("folder"), filename),
        }
    } else {
        match node_type {
            "folder" => (None, node_name),
            _ => (Some("file"), filename),
        }
    }
}

pub fn create_tree_by_path(path: &str) -> Result<TreeData, BaseException> {
    let mut nodes: Vec<TreeNode> = Vec::new();
    const ACCEPTED_EXTENSIONS: [&str; 2] = ["md", "txt"];
    fn visit(path: &Path, parent: ParentId, nodes: &mut Vec<TreeNode>) -> Result<(), BaseException> {
        let rd = read_dir(path).map_err(|e| BaseException::new(&format!("read_dir error: {}", e), READ_ERROR))?;
        for entry_result in rd {
            let entry = entry_result.map_err(|e| BaseException::new(&format!("read_dir entry error: {}", e), READ_ERROR))?;
            let p = entry.path();
            if !p.is_dir() && !ACCEPTED_EXTENSIONS.contains(&p.extension().and_then(|s| s.to_str()).unwrap_or("")) {
                continue;
            }

            if nodes.len() > (u32::MAX as usize) {
                return Err(BaseException::new("too many nodes", TOO_MANY_NODES));
            }
            let id = Uuid::new_v4();

            let (file_type_opt, name) = get_type_and_name(&p);
            let file_type = match file_type_opt {
                Some(t) => t,
                None => {
                    continue;
                }
            };

            let node = TreeNode {
                id: id,
                parent: parent.clone(),
                droppable: file_type == "folder",
                text: name.to_string(),
                data: TreeNodeData {
                    node_type: file_type.to_string(),
                    node_name: p.file_name().and_then(|s| s.to_str()).unwrap_or("").to_string(),
                    is_open: Some(false)
                }
            };

            nodes.push(node);

            if file_type == "folder" {
                init_folder(&p);
                visit(&p, ParentId::Id(id), nodes)?;
            }
        }
        Ok(())
    }

    let root_path = Path::new(path);
    if !root_path.exists() {
        return Err(BaseException::new(&format!("path not found: {}", path), FILE_NOT_FOUND));
    }

    if root_path.is_dir() {
        visit(root_path, ParentId::Root(0), &mut nodes)?;
    }

    return Ok(TreeData(nodes));
}