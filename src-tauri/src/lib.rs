mod exceptions;
mod gconfig;
mod rconfig;
mod nodes;
mod utils;
use gconfig::*;
use rconfig::*;
use nodes::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_gconfig,
            set_gconfig,
            get_rconfig,
            set_rconfig,
            update_rconfig_node,
            move_to_trash,
            move_node,
            get_node_contents
        ])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
