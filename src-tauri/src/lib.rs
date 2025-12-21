mod exceptions;
mod gconfig;
mod rconfig;
mod utils;
use gconfig::*;
use rconfig::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_gconfig,
            set_gconfig,
            create_rconfig,
            get_rconfig,
            set_rconfig
        ])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
