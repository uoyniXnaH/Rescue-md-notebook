use std::fs::{read_dir};
use std::path::Path;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::exceptions::{*};

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
struct TreeNodeData {
    file_type: String,
    file_path: String,
    is_open: Option<bool>
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(untagged)]
enum ParentId {
    Root(u8),
    Id(Uuid)
}

#[derive(Serialize, Deserialize)]
struct TreeNode {
    id: Uuid,
    parent: ParentId,
    droppable: bool,
    text: String,
    data: TreeNodeData
}

#[derive(Serialize, Deserialize)]
pub struct TreeData(Vec<TreeNode>);

fn get_file_type(path: &Path) -> String {
    if path.is_dir() {
        return "folder".to_string();
    } else {
        return "file".to_string();
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
            let is_dir = p.is_dir();
            if !is_dir && !ACCEPTED_EXTENSIONS.contains(&p.extension().and_then(|s| s.to_str()).unwrap_or("")) {
                continue;
            }

            let name = p.file_name()
                .and_then(|s| s.to_str())
                .unwrap_or("")
                .to_string();

            let is_dir = p.is_dir();

            if nodes.len() > (u16::MAX as usize) {
                return Err(BaseException::new("too many nodes", TOO_MANY_NODES));
            }
            let id = Uuid::new_v4();

            let node = TreeNode {
                id: id,
                parent: parent.clone(),
                droppable: is_dir,
                text: name,
                data: TreeNodeData {
                    file_type: get_file_type(&p),
                    file_path: p.to_string_lossy().into_owned(),
                    is_open: Some(false)
                }
            };

            nodes.push(node);

            if is_dir {
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