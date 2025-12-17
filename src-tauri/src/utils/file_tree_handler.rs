use std::fs::{read_dir};
use std::path::Path;
use serde::{Serialize, Deserialize};

use crate::exceptions::{*};

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase"))]
struct TreeNodeData {
    file_type: String,
    file_path: String,
    is_open: Option<bool>
}

#[derive(Serialize, Deserialize)]
struct TreeNode {
    id: u16,
    parent: u16,
    droppable: bool,
    text: String,
    data: TreeNodeData
}

#[derive(Serialize, Deserialize)]
pub struct TreeData(Vec<TreeNode>);

impl TreeData {
    pub fn create_tree_by_path(path: &str) -> Result<TreeData, BaseException> {
        let mut nodes: Vec<TreeNode> = Vec::new();

        fn visit(path: &Path, parent: u16, nodes: &mut Vec<TreeNode>) -> Result<(), BaseException> {
            let rd = read_dir(path).map_err(|e| BaseException::new(&format!("read_dir error: {}", e), READ_ERROR))?;
            for entry_result in rd {
                let entry = entry_result.map_err(|e| BaseException::new(&format!("read_dir entry error: {}", e), READ_ERROR))?;
                let p = entry.path();
                let name = p.file_name()
                    .and_then(|s| s.to_str())
                    .unwrap_or("")
                    .to_string();

                let is_dir = p.is_dir();

                let id = nodes.len() + 1;
                if id > (u16::MAX as usize) {
                    return Err(BaseException::new("too many nodes", TOO_MANY_NODES));
                }
                let id_u16 = id as u16;

                let node = TreeNode {
                    id: id_u16,
                    parent: parent,
                    droppable: is_dir,
                    text: name,
                    data: TreeNodeData {
                        file_type: if is_dir { "folder".to_string() } else { "file".to_string() },
                        file_path: p.to_string_lossy().into_owned(),
                        is_open: Some(false)
                    }
                };

                nodes.push(node);

                if is_dir {
                    visit(&p, id_u16, nodes)?;
                }
            }
            Ok(())
        }

        let root_path = Path::new(path);
        if !root_path.exists() {
            return Err(BaseException::new(&format!("path not found: {}", path), FILE_NOT_FOUND));
        }

        if root_path.is_dir() {
            visit(root_path, 0, &mut nodes)?;
        }

        return Ok(TreeData(nodes));
    }
}