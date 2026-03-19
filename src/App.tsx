import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";

function App() {
  const [content, setContent] = useState("");
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    // Tauri環境かWebブラウザかを判定
    setIsWeb(!(window as any).__TAURI_INTERNALS__);
  }, []);

  // 【本気ポイント】保存処理の共通化
  const handleSave = async () => {
    if (isWeb) {
      // Web版: ブラウザのダウンロードとして保存
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "note.txt";
      a.click();
    } else {
      // Native版: OS標準の保存ダイアログを表示
      const path = await save({ filters: [{ name: "Text", extensions: ["txt"] }] });
      if (path) await writeTextFile(path, content);
    }
  };

  return (
    <div className="container">
      <nav className="toolbar">
        <button onClick={handleSave}>保存</button>
        <span>OxidizedPad {isWeb ? "(Web Mode)" : ""}</span>
      </nav>
      <textarea
        className="editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="ここにメモを入力..."
      />
    </div>
  );
}

export default App;
