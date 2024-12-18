import React from "react";
import { WalletProvider } from "./contexts/WalletContext";
import { AppContent } from "./components/AppContent";

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
