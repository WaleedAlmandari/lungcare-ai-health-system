import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import XrayPage from "./components/XrayPage"; // تأكد من المسار الصحيح إذا غيرت اسم الملف

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/xray" element={<XrayPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
