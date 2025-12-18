mod exceptions;
mod gconfig;
mod rconfig;
mod utils;
use gconfig::*;
use rconfig::*;

#[tauri::command]
fn test_command() -> String {
    return String::from("Hello from Tauri!");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            test_command,
            get_gconfig_path,
            get_gconfig,
            set_gconfig,
            create_rconfig,
            get_rconfig
        ])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
