import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // あとで空ファイルでも良いので作成してください

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
