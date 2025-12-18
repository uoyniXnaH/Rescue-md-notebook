use crate::utils::file_tree_handler::*;
use crate::exceptions::{*};

#[tauri::command]
pub fn create_file_tree(path: String) -> Result<TreeData, BaseException> {
    return create_tree_by_path(&path);
}