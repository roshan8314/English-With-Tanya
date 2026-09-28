import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import EbookCheckout from "./pages/EbookCheckout";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ebook-checkout" element={<EbookCheckout />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);