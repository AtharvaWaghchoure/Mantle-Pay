// src/components/WalletConnection.jsx
import React, { useState, useRef, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import { MANTLE_SEPOLIA_CONFIG } from "../config/constants";

export function WalletConnection() {
  const {
    account,
    chainId,
    isConnecting,
    error,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  // State to control the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle disconnect button click
  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
  };

  // Format account address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Wallet Connection</h2>

        {/* Connection button with dropdown */}
        <div className="relative" ref={dropdownRef}>
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
            // Dropdown button when connected
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="py-2 px-4 rounded-md font-medium transition-colors
                  bg-green-600 text-white hover:bg-green-700
                  flex items-center space-x-2"
              >
                <span>{formatAddress(account)}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">{error}</div>}

      {account && (
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Account:</span> {account}
          </p>
          <p className="text-sm">
            <span className="font-medium">Network:</span>{" "}
            {isCorrectNetwork
              ? MANTLE_SEPOLIA_CONFIG.chainName
              : `Wrong Network (Chain ID: ${chainId})`}
          </p>
        </div>
      )}
    </div>
  );
}
