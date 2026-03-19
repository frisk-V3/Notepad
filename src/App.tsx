import { useEffect, useState } from "react";
// Tauri 2.0 APIのインポート
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";

function App() {
  const [content, setContent] = useState("");
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    // Tauri環境（Native）かWebかを判定
    setIsTauri(!!(window as any).__TAURI_INTERNALS__);
  }, []);

  // ファイルを開く
  const handleOpen = async () => {
    if (isTauri) {
      try {
        const selected = await open({
          multiple: false,
          filters: [{ name: "Text", extensions: ["txt", "md"] }]
        });
        if (selected && typeof selected === "string") {
          const data = await readTextFile(selected);
          setContent(data);
        }
      } catch (err) {
        console.error("Open error:", err);
      }
    } else {
      alert("Web版ではブラウザのファイル選択機能を使用してください（実装中）");
    }
  };

  // 保存する
  const handleSave = async () => {
    if (isTauri) {
      try {
        const path = await save({
          filters: [{ name: "Text", extensions: ["txt"] }]
        });
        if (path) {
          await writeTextFile(path, content);
          alert("保存完了！");
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    } else {
      // Web版: ダウンロードとして処理
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "memo.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.title}>OxidizedPad</div>
        <div style={styles.btnGroup}>
          <button onClick={handleOpen} style={styles.button}>開く</button>
          <button onClick={handleSave} style={styles.buttonPrimary}>保存</button>
        </div>
      </header>
      <main style={styles.main}>
        <textarea
          style={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ここに入力..."
          spellCheck={false}
        />
      </main>
    </div>
  );
}

// 本気でシンプルかつモダンなCSS in JS
const styles: { [key: string]: React.CSSProperties } = {
  container: { height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#1e1e1e", color: "#fff", fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", background: "#2d2d2d", borderBottom: "1px solid #444" },
  title: { fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "1px" },
  btnGroup: { display: "flex", gap: "10px" },
  button: { padding: "6px 12px", borderRadius: "4px", border: "1px solid #666", background: "transparent", color: "#ccc", cursor: "pointer" },
  buttonPrimary: { padding: "6px 12px", borderRadius: "4px", border: "none", background: "#007acc", color: "#fff", cursor: "pointer" },
  main: { flex: 1, padding: "10px" },
  textarea: { width: "100%", height: "100%", background: "transparent", color: "#d4d4d4", border: "none", outline: "none", fontSize: "16px", lineHeight: "1.5", resize: "none" }
};

export default App;
