use std::fs::{File, remove_file, read_to_string};
use std::env::{current_exe};
use std::io::{BufWriter};
use serde_json::{to_writer, Value, from_str};
use serde::{Serialize, Deserialize};

use crate::exceptions::{*};

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "lowercase", deserialize = "lowercase"))]
enum ColorMode {
    Light,
    Dark,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "lowercase", deserialize = "lowercase"))]
enum Language {
    En,
    Ja,
    Sc,
}

#[derive(Serialize, Deserialize)]
pub struct GlobalConfig {
    current_root: String,
    color_mode: ColorMode,
    language: Language
}

fn write_gconfig(config: &GlobalConfig) -> Result<(), BaseException> {
    let config_path = get_gconfig_path()?;
    let file = File::create(&config_path).map_err(|_| {
        return BaseException::new("Failed to create config file", CANNOT_CREATE_FILE);
    })?;
    let writer = BufWriter::new(file);
    to_writer(writer, config).map_err(|_| {
        return BaseException::new("Failed to write config file", WRITE_ERROR);
    })?;
    return Ok(());
}

fn get_gconfig_path() -> Result<std::path::PathBuf, BaseException> {
    let mut config_path = current_exe().map_err(|_| {
        return BaseException::new("Failed to get current exe path", EXE_PATH_NOT_FOUND);
    })?;
    config_path.pop(); // remove the executable name
    config_path.push("config.json");
    return Ok(config_path);
}

pub fn get_gconfig_item(key: &str) -> Result<String, BaseException> {
    let gconfig = get_gconfig()?;
    match key {
        "current_root" => Ok(gconfig.current_root),
        "color_mode" => Ok(match gconfig.color_mode {
            ColorMode::Light => String::from("light"),
            ColorMode::Dark => String::from("dark"),
        }),
        "language" => Ok(match gconfig.language {
            Language::En => String::from("en"),
            Language::Ja => String::from("ja"),
            Language::Sc => String::from("sc"),
        }),
        _ => Err(BaseException::new("Invalid config key", INVALID_PARAMETER))
    }
}

#[tauri::command]
pub fn get_gconfig() -> Result<GlobalConfig, BaseException> {
    let config_path = get_gconfig_path()?;
    let mut gconfig = GlobalConfig {
        current_root: String::from(""),
        color_mode: ColorMode::Dark,
        language: Language::En
    };
    if !config_path.exists() {
        write_gconfig(&gconfig)?;
        return Ok(gconfig);
    }

    let content = read_to_string(&config_path).map_err(|_| {
        return BaseException::new("Failed to read config file", READ_ERROR);
    })?;

    let value: Value = match from_str(&content) {
        Ok(v) => v,
        Err(_) => {
            write_gconfig(&gconfig)?;
            return Ok(gconfig);
        }
    };

    if let Value::Object(map) = value {
        if let Some(v) = map.get("current_root").and_then(|v| v.as_str()) {
            gconfig.current_root = v.to_string();
        }
        if let Some(v) = map.get("color_mode").and_then(|v| v.as_str()) {
            gconfig.color_mode = match v {
                "light" => ColorMode::Light,
                "dark" => ColorMode::Dark,
                _ => ColorMode::Dark
            };
        }
        if let Some(v) = map.get("language").and_then(|v| v.as_str()) {
            gconfig.language = match v {
                "en" => Language::En,
                "ja" => Language::Ja,
                "sc" => Language::Sc,
                _ => Language::En
            };
        }
    } else {
        write_gconfig(&gconfig)?;
        return Ok(gconfig);
    }

    write_gconfig(&gconfig)?;
    return Ok(gconfig);
}

#[tauri::command]
pub fn set_gconfig(config: GlobalConfig) -> Result<(), BaseException> {
    let config_path = get_gconfig_path()?;

    if config_path.exists() {
        remove_file(&config_path).map_err(|_| {
            return BaseException::new("Failed to remove old config file", CANNOT_DELETE_FILE);
        })?;
    }

    return write_gconfig(&config);
}
