import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Mantle Sepolia Configuration
const MANTLE_SEPOLIA_CONFIG = {
  chainId: "0x138B",
  chainName: "Mantle Sepolia",
  nativeCurrency: {
    name: "MNT",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
  blockExplorerUrls: ["https://explorer.sepolia.mantle.xyz"],
};

// const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

const PayrollDashboard = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [networkStatus, setNetworkStatus] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [newPayment, setNewPayment] = useState({
    recipient: "",
    amount: "",
    interval: "",
  });

  // Network checking function
  const checkNetwork = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return false;

      const chainId = await ethereum.request({ method: "eth_chainId" });
      return chainId === MANTLE_SEPOLIA_CONFIG.chainId;
    } catch (err) {
      console.error("Error checking network:", err);
      return false;
    }
  };

  // Network switching function
  const switchToMantleSepolia = async () => {
    const { ethereum } = window;
    if (!ethereum) return false;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MANTLE_SEPOLIA_CONFIG.chainId }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MANTLE_SEPOLIA_CONFIG],
          });
          return true;
        } catch (addError) {
          setError("Could not add Mantle Sepolia network");
          return false;
        }
      }
      setError("Could not switch to Mantle Sepolia network");
      return false;
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        setError("Please install MetaMask!");
        return;
      }

      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        setNetworkStatus("Switching to Mantle Sepolia...");
        const switched = await switchToMantleSepolia();
        if (!switched) return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(contract);
      setNetworkStatus("Connected to Mantle Sepolia");

      await loadContractData();
    } catch (err) {
      setError("Error connecting wallet: " + err.message);
    }
  };

  // Load contract data
  const loadContractData = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const balance = await contract.getContractBalance();
      setBalance(ethers.utils.formatEther(balance));

      // Add your contract data loading logic here
    } catch (err) {
      setError("Error loading contract data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deposit
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!contract || !depositAmount) return;

    try {
      setLoading(true);
      const tx = await contract.depositFunds({
        value: ethers.utils.parseEther(depositAmount),
      });
      setNetworkStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      setNetworkStatus("Transaction confirmed!");
      await loadContractData();
      setDepositAmount("");
    } catch (err) {
      setError(
        err.code === "INSUFFICIENT_FUNDS"
          ? "Insufficient MNT balance"
          : "Error making deposit: " + err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mantle Sepolia Payroll Dashboard</h1>
          {account ? (
            <div className="flex items-center gap-4">
              <span className="text-green-500">
                {networkStatus || "Connected to Mantle Sepolia"}
              </span>
              <span>
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Connect to Mantle Sepolia
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contract Balance: {balance} MNT</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deposit Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Deposit Funds</h3>
            <form onSubmit={handleDeposit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount (MNT)</label>
                <input
                  type="number"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="0.0"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Deposit"}
              </button>
            </form>
          </div>

          {/* Add more components as needed */}
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;
