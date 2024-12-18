import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WalletConnection } from "../components/WalletConnection";
import { useWallet } from "../contexts/WalletContext";
import { ethers } from 'ethers';

export function HomePage() {
  const { account } = useWallet(); // Get the wallet address
  const navigate = useNavigate();
  
  const [walletInfo, setWalletInfo] = useState({
    balance: "0",
    networkName: "",
    ensName: null,
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wallet information
  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (!account || !window.ethereum) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get wallet balance
        const balance = await provider.getBalance(account);
        
        // Get network information
        const network = await provider.getNetwork();
        
        // Try to get ENS name if available
        let ensName = null;
        try {
          ensName = await provider.lookupAddress(account);
        } catch (err) {
          console.log("ENS lookup not available");
        }

        setWalletInfo({
          balance: ethers.utils.formatEther(balance),
          networkName: network.name,
          ensName,
        });
      } catch (err) {
        console.error("Error fetching wallet info:", err);
      }
    };

    fetchWalletInfo();
  }, [account]);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!account || !window.ethereum) return;
      setIsLoading(true);

      try {
        // Here you would typically call your preferred blockchain explorer API
        // For example, using Etherscan or similar service for Mantle
        // For this example, we'll use a placeholder
        const mockTransactions = [
          {
            hash: "0x123...",
            timestamp: new Date().getTime(),
            type: "Deposit",
            amount: "1.5",
            status: "Completed",
          },
          // Add more mock transactions as needed
        ];

        setTransactions(mockTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  // Redirect to the dashboard if the account matches a specific address
//   useEffect(() => {
//     if (account === "0x20f015325cec1153956eb98bc68328e6cc12dc57") {
//       navigate("/dashboard");
//     }
//   }, [account, navigate]);

  // Wallet Information Card Component
  function WalletInfoCard() {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium break-all">{account}</p>
          </div>
          {walletInfo.ensName && (
            <div>
              <p className="text-sm text-gray-600">ENS Name</p>
              <p className="font-medium">{walletInfo.ensName}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className="font-medium">{walletInfo.balance} MNT</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Network</p>
            <p className="font-medium">{walletInfo.networkName}</p>
          </div>
        </div>
      </div>
    );
  }

  // Transaction History Component
  function TransactionHistory() {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <p>Loading transactions...</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx, index) => (
                  <tr
                    key={tx.hash}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{tx.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tx.amount} MNT</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Payroll DApp</h1>
          <WalletConnection />
        </div>
      </header>
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
              Welcome to Payroll DApp
            </h1>
            <p className="text-lg text-gray-700">
              Manage your payroll seamlessly with our decentralized application. 
              Get started by navigating to the dashboard.
            </p>
            <div className="mt-8">
              {account === "0x20f015325cec1153956eb98bc68328e6cc12dc57" && (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out text-base font-semibold"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Wallet Information and Transactions */}
          {account && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8">User Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <WalletInfoCard />
                </div>
                <div className="lg:col-span-2">
                  <TransactionHistory />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
