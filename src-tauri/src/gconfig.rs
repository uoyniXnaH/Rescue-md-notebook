use std::fs::{File, remove_file};
use std::env::{current_exe};
use std::io::{BufReader, BufWriter};
use serde_json::{from_reader, to_writer};
use serde::{Serialize, Deserialize};

use crate::exceptions::{*};

// #[derive(Serialize, Deserialize)]
// enum ColorMode {
//     Light,
//     Dark,
// }

// #[derive(Serialize, Deserialize)]
// enum Language {
//     En,
//     Ja,
//     Sc,
// }

#[derive(Serialize, Deserialize)]
pub struct GlobalConfig {
    current_root: String,
    color_mode: String,
    language: String
}

#[tauri::command]
pub fn get_gconfig_path() -> Result<std::path::PathBuf, BaseException> {
    let mut config_path = current_exe().map_err(|_| {
        return BaseException::new("Failed to get current exe path", EXE_PATH_NOT_FOUND);
    })?;
    config_path.pop(); // remove the executable name
    config_path.push("config.json");
    return Ok(config_path);
}

#[tauri::command]
pub fn get_gconfig() -> Result<GlobalConfig, BaseException> {
    let config_path = get_gconfig_path()?;
    let gconfig: GlobalConfig;
    if !config_path.exists() {
        gconfig = GlobalConfig {
            current_root: String::from(""),
            color_mode: String::from("dark"),
            language: String::from("en")
        };
        let file = File::create(&config_path).map_err(|_| {
            return BaseException::new("Failed to create config file", CANNOT_CREATE_FILE);
        })?;
        let writer = BufWriter::new(file);
        to_writer(writer, &gconfig).map_err(|_| {
            return BaseException::new("Failed to write config file", WRITE_ERROR);
        })?;
        return Ok(gconfig);
    }

    let file = File::open(&config_path).map_err(|_| {
        return BaseException::new("Failed to open config file", CANNOT_OPEN_FILE);
    })?;
    let reader = BufReader::new(file);
    gconfig = from_reader(reader).map_err(|_| {
        return BaseException::new("Failed to read config file", READ_ERROR);
    })?;

    return Ok(gconfig);
}

#[tauri::command]
pub fn set_gconfig(config: GlobalConfig) -> Result<bool, BaseException> {
    let config_path = get_gconfig_path()?;

    if config_path.exists() {
        remove_file(&config_path).map_err(|_| {
            return BaseException::new("Failed to remove old config file", CANNOT_DELETE_FILE);
        })?;
    }

    let file = File::create(&config_path).map_err(|_| {
        return BaseException::new("Failed to create config file", CANNOT_CREATE_FILE);
    })?;
    let writer = BufWriter::new(file);
    to_writer(writer, &config).map_err(|_| {
        return BaseException::new("Failed to write config file", WRITE_ERROR);
    })?;

    return Ok(true);
}
