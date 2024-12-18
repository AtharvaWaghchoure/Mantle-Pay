import React, { createContext, useContext, useState, useEffect } from "react";
import { MANTLE_SEPOLIA_CONFIG } from "../config/constants";
import { chainUtils } from "../utils/chainUtils";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkIfMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const switchToMantleSepolia = async () => {
    try {
      setError("");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MANTLE_SEPOLIA_CONFIG.chainIdHex }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          const configForProvider = {
            ...MANTLE_SEPOLIA_CONFIG,
            chainId: MANTLE_SEPOLIA_CONFIG.chainIdHex,
          };
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [configForProvider],
          });
        } catch (addError) {
          setError("Failed to add Mantle Sepolia network");
        }
      } else {
        setError("Failed to switch network");
      }
    }
  };

  const connectWallet = async () => {
    if (!checkIfMetaMaskInstalled()) {
      setError("Please install MetaMask first");
      return;
    }

    try {
      setIsConnecting(true);
      setError("");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      await switchToMantleSepolia();

      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      const decimalChainId = chainUtils.toDecimal(currentChainId);
      setChainId(decimalChainId);
      setIsCorrectNetwork(chainUtils.chainsMatch(decimalChainId, MANTLE_SEPOLIA_CONFIG.chainId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
        }
      });

      window.ethereum.on("chainChanged", (newChainId) => {
        const decimalChainId = chainUtils.toDecimal(newChainId);
        setChainId(decimalChainId);
        setIsCorrectNetwork(chainUtils.chainsMatch(decimalChainId, MANTLE_SEPOLIA_CONFIG.chainId));
      });

      // Check initial connection
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      // Check initial chain
      window.ethereum.request({ method: "eth_chainId" }).then((currentChainId) => {
        const decimalChainId = chainUtils.toDecimal(currentChainId);
        setChainId(decimalChainId);
        setIsCorrectNetwork(chainUtils.chainsMatch(decimalChainId, MANTLE_SEPOLIA_CONFIG.chainId));
      });
    }

    const disconnectWallet = () => {
      setAccount("");
      setChainId(null);
      setIsCorrectNetwork(false);
      setError("");
    };

    const value = {
      account,
      chainId,
      isConnecting,
      error,
      isCorrectNetwork,
      connectWallet,
      disconnectWallet, // Add this
      switchToMantleSepolia,
    };

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  const value = {
    account,
    chainId,
    isConnecting,
    error,
    isCorrectNetwork,
    connectWallet,
    switchToMantleSepolia,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
