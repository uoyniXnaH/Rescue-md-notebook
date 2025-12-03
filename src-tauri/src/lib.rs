use std::fs::{File};
use std::io::{BufReader, BufWriter};
use serde_json::{Value, json, from_reader, to_writer};

mod exceptions;
mod gconfig;

fn init_config() {
    // Define the config file path (in the same directory as the executable)
    let mut config_path = std::env::current_exe().expect("Failed to get current exe path");
    config_path.pop(); // remove the executable name
    config_path.push("config.json");

    // Check if the config file exists
    if !config_path.exists() {
        println!("Config file not found. Creating a new one...");

        // Create a default config
        let default_config: Value = json!({
            "md_path": "dummy"
        });

        // Write the default config to the file
        let mut file = File::create(&config_path).expect("Failed to create config file");
        to_writer(&mut file, &default_config).expect("Failed to write to config file");
    }
}

#[tauri::command]
fn get_config_by_key(key: &str) -> Result<String, String> {
    let mut config_path = std::env::current_exe().expect("Failed to get current exe path");
    config_path.pop(); // remove the executable name
    config_path.push("config.json");
    if !config_path.exists() {
        return Err("Config file not found".to_string());
    }
    let file = File::open(&config_path).unwrap();
    let reader = BufReader::new(file);
    let config: Value = from_reader(reader).expect("Failed to read config file");
    
    match config.get(key) {
        Some(value) => {
            Ok(value.to_string())
        }
        None => {
            Err(format!("Key '{}' not found in config", key))
        }
    }
}

#[tauri::command]
fn set_config_by_key(key: &str, value: &str) -> Result<(), String> {
    let mut config_path = std::env::current_exe().expect("Failed to get current exe path");
    config_path.pop(); // remove the executable name
    config_path.push("config.json");
    if !config_path.exists() {
        return Err("Config file not found".to_string());
    }
    
    let file = File::open(&config_path).unwrap();
    let reader = BufReader::new(file);
    let mut config: Value = from_reader(reader).expect("Failed to read config file");

    // Update the value for the given key
    config[key] = json!(value);

    // Write the updated config back to the file
    let file = File::create(&config_path).expect("Failed to create config file");
    let writer = BufWriter::new(file);
    to_writer(writer, &config).expect("Failed to write to config file");

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            // Initialize the config file
            init_config();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_config_by_key, set_config_by_key])
        .invoke_handler(tauri::generate_handler![gconfig::get_gconfig])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
