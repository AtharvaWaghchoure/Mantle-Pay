import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Dashboard as the default route */}
            <Route index element={<Dashboard />} />

            {/* Catch all route - redirects to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
