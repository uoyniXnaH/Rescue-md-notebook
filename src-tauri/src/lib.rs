use std::fs::{File};
use std::io::{Write, BufReader};

fn init_config() {
    // Define the config file path (in the same directory as the executable)
    let mut config_path = std::env::current_exe().expect("Failed to get current exe path");
    config_path.pop(); // remove the executable name
    config_path.push("config.json");

    // Check if the config file exists
    if !config_path.exists() {
        println!("Config file not found. Creating a new one...");

        // Create a default config
        let default_config = r#"{
            "md_path": "dummy"
        }"#;

        // Write the default config to the file
        let mut file = File::create(&config_path).expect("Failed to create config file");
        file.write_all(default_config.as_bytes()).expect("Failed to write to config file");
    }
}

// remember to call `.manage(MyState::default())`
#[tauri::command]
fn get_config_by_key(key: &str) -> Result<String, String> {
    let mut config_path = std::env::current_exe().expect("Failed to get current exe path");
    println!("command called");
    config_path.pop(); // remove the executable name
    config_path.push("config.json");
    if !config_path.exists() {
        return Err("Config file not found".to_string());
    }
    let file = File::open(&config_path).unwrap();
    let reader = BufReader::new(file);
    let config: serde_json::Value = serde_json::from_reader(reader).expect("Failed to read config file");
    
    match config.get(key) {
        Some(value) => {
            Ok(value.to_string())
        }
        None => {
            Err(format!("Key '{}' not found in config", key))
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            // Initialize the config file
            init_config();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_config_by_key])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
