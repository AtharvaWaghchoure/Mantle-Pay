// src/pages/UserPage.jsx
import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { useWallet } from '../contexts/WalletContext';

// Wallet Information Card Component
function WalletInfoCard({ walletInfo, account }) {
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
function TransactionHistory({ transactions, isLoading }) {
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
                <tr key={tx.hash} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tx.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tx.amount} MNT
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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

// Main User Page Component
export function UserPage() {
  const { account } = useWallet();
  const { walletInfo, transactions, isLoading } = useUserData();

  if (!account) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please connect your wallet to view user information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wallet Information Section */}
        <div className="lg:col-span-1">
          <WalletInfoCard walletInfo={walletInfo} account={account} />
        </div>

        {/* Transaction History Section */}
        <div className="lg:col-span-2">
          <TransactionHistory 
            transactions={transactions} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}



// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';

export function useUserData() {
  const { account } = useWallet();
  const [walletInfo, setWalletInfo] = useState({
    balance: '0',
    networkName: '',
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
          console.log('ENS lookup not available');
        }

        setWalletInfo({
          balance: ethers.utils.formatEther(balance),
          networkName: network.name,
          ensName,
        });
      } catch (err) {
        console.error('Error fetching wallet info:', err);
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
            hash: '0x123...',
            timestamp: new Date().getTime(),
            type: 'Deposit',
            amount: '1.5',
            status: 'Completed'
          },
          // Add more mock transactions as needed
        ];

        setTransactions(mockTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  return {
    walletInfo,
    transactions,
    isLoading
  };
}