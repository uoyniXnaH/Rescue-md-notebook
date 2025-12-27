use std::fs::{File, remove_file, read_to_string};
use std::io::{BufWriter};
use std::path::PathBuf;
use serde_json::{to_writer, from_str};

use crate::gconfig::{get_gconfig_item};
use crate::utils::file_tree_handler::*;
use crate::exceptions::{*};

fn get_rconfig_path(base_path: &String) -> PathBuf {
    let mut config_path = PathBuf::from(base_path);
    config_path.push("rconfig.json");
    return config_path;
}

fn write_rconfig(path: &String, rconfig: &TreeData) -> Result<(), BaseException> {
    let config_path = get_rconfig_path(path);
    if config_path.exists() {
        remove_file(&config_path).map_err(|_| {
            return BaseException::new("Failed to remove old config file", CANNOT_DELETE_FILE);
        })?;
    }
    let file = File::create(&config_path).map_err(|_| {
        return BaseException::new("Failed to create root config file", CANNOT_CREATE_FILE);
    })?;
    let writer = BufWriter::new(file);
    to_writer(writer, rconfig).map_err(|_| {
        return BaseException::new("Failed to write root config file", WRITE_ERROR);
    })?;
    return Ok(());
}

#[tauri::command]
pub fn get_rconfig() -> Result<TreeData, BaseException> {
    let path = get_gconfig_item("current_root")?;
    let config_path = get_rconfig_path(&path);
    if !config_path.exists() {
        match create_tree_by_path(&path) {
            Ok(file_tree) => {
                write_rconfig(&path, &file_tree)?;
                return Ok(file_tree);
            },
            Err(e) => {
                return Err(e);
            }
        }
    }
    let file_content = read_to_string(&config_path).map_err(|_| {
        return BaseException::new("Failed to read root config file", READ_ERROR);
    })?;
    let rconfig: TreeData = from_str(&file_content).map_err(|e| {
        return BaseException::new(&e.to_string(), READ_ERROR);
    })?;
    return Ok(rconfig);
}

#[tauri::command]
pub fn set_rconfig(rconfig: TreeData) -> Result<(), BaseException> {
    let path = get_gconfig_item("current_root")?;
    return write_rconfig(&path, &rconfig);
}

#[tauri::command]
pub fn update_rconfig_node(updated_node: TreeNode) -> Result<TreeData, BaseException> {
    let path = get_gconfig_item("current_root")?;
    let mut rconfig = get_rconfig()?;
    rconfig.update_node(&updated_node)?;
    write_rconfig(&path, &rconfig)?;
    return Ok(rconfig);
}