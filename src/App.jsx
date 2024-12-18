import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { HomePage } from "./pages/HomePage";
import { Dashboard } from "./pages/Dashboard";
import { PayrollInterface } from "./components/PayrollInterface"

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          {/* HomePage as the root route */}
          <Route path="/" element={<HomePage />} />

          {/* Dashboard as a separate route */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<PayrollInterface />} />

          {/* Catch-all route - redirects to the homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
