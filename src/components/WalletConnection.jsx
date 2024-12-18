import React from "react";
import { useWallet } from "../contexts/WalletContext";

export function WalletConnection() {
  const {
    account,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  // Format account address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div>
      {!account ? (
        // Connect button when not connected
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="py-2 px-4 rounded-md font-medium transition-colors
            bg-blue-600 text-white hover:bg-blue-700
            disabled:opacity-50"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        // Disconnect button when connected
        <button
          onClick={disconnectWallet}
          className="py-2 px-4 rounded-md font-medium transition-colors
            bg-red-600 text-white hover:bg-red-700"
        >
          {formatAddress(account)}
        </button>
      )}
    </div>
  );
}
