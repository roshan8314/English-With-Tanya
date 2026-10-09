import AdminDashboard from "./pages/AdminDashboard";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import EbookCheckout from "./pages/EbookCheckout";
import AdminLogin from "./pages/AdminLogin";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<App />} />
  <Route path="/ebook-checkout" element={<EbookCheckout />} />
  <Route path="/admin" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Routes>
    </BrowserRouter>
  </React.StrictMode>
);