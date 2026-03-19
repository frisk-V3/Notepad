use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("OxidizedPad: Hello, {}! Rust backend is ready.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())     // ファイルアクセス許可
        .plugin(tauri_plugin_dialog::init()) // ダイアログ許可
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools(); // デバッグ時はDevTools自動起動
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
