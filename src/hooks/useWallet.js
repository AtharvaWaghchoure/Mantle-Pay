import { useState, useEffect, useCallback } from "react";
import { MANTLE_SEPOLIA_CONFIG } from "../config/constants";
import { formatBalance } from "../utils/web3Utils";

export const useWallet = () => {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const checkIfMetaMaskInstalled = useCallback(() => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }, []);

  const switchToMantleSepolia = async () => {
    try {
      setError("");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MANTLE_SEPOLIA_CONFIG.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MANTLE_SEPOLIA_CONFIG],
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

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(chainId);
      console.log("hooks: ", chainId);
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
        setChainId(newChainId);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return {
    account,
    chainId,
    error,
    isConnecting,
    connectWallet,
  };
};
