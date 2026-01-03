use tauri_plugin_log::{Target, TargetKind};

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
        .plugin(tauri_plugin_log::Builder::new()
            .clear_targets()
            .target(Target::new(
                TargetKind::Stdout
            ))
            .build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_gconfig,
            set_gconfig,
            get_rconfig,
            set_rconfig,
            update_rconfig_node,
            insert_rconfig_node,
            remove_rconfig_node,
            move_node_to_trash,
            move_node,
            get_node_contents,
            update_node_contents,
            get_node_by_id,
            rename_node,
            create_node,
        ])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
