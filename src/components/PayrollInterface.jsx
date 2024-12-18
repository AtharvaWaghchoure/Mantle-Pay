import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import { usePayrollContract } from "../hooks/usePayrollContract";
import { DepositForm } from "./DepositForm";

export function PayrollInterface() {
  const { account } = useWallet();

  const {
    contract,
    isInitialized,
    error: contractError,
    getBalance,
    getActivePayments,
  } = usePayrollContract(account);

  const [balance, setBalance] = useState("0");
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPayment, setNewPayment] = useState({
    recipient: "",
    amount: "",
    interval: "",
  });

  // Load initial data when component mounts
  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [isInitialized]);

  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} days`);
    if (hours > 0) parts.push(`${hours} hours`);
    if (minutes > 0) parts.push(`${minutes} minutes`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds} seconds`);

    return parts.join(", ");
  };

  // Function to load contract data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [currentBalance, activePayments] = await Promise.all([
        getBalance(),
        getActivePayments(),
      ]);
      setBalance(currentBalance);
      setPayments(activePayments);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle setting up new recurring payment
  const handleSetupPayment = async (e) => {
    e.preventDefault();
    const { recipient, amount, interval } = newPayment;

    if (!recipient || !amount || !interval) return;
    if (!ethers.utils.isAddress(recipient)) {
      console.error("Invalid recipient address");
      return;
    }

    try {
      const amountInWei = ethers.utils.parseEther(amount);
      // Use the interval directly as it's already in seconds
      const tx = await contract.setupRecurringPayment(recipient, amountInWei, interval);
      await tx.wait();
      await loadData();
      setNewPayment({
        recipient: "",
        amount: "",
        interval: "",
      });
    } catch (err) {
      console.error("Failed to setup payment:", err);
    }
  };

  // Handle processing a payment
  const handleProcessPayment = async (paymentId) => {
    try {
      const tx = await contract.processRecurringPayment(paymentId);
      await tx.wait();
      await loadData(); // Reload data after processing
    } catch (err) {
      console.error("Failed to process payment:", err);
    }
  };

  if (!isInitialized) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Initializing payroll system...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Balance Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Contract Balance</h2>
        <p className="text-3xl font-medium text-blue-600">{balance} MNT</p>
      </div>

      {/* Deposit Form */}
      <DepositForm account={account} />

      {/* New Payment Setup Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Setup New Payment</h2>
        <form onSubmit={handleSetupPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
            <input
              type="text"
              value={newPayment.recipient}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  recipient: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0x..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (MNT)</label>
            <input
              type="number"
              step="0.000000000000000001"
              value={newPayment.amount}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  amount: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interval (Seconds)</label>
            <input
              type="number"
              value={newPayment.interval}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  interval: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter interval in seconds"
            />
            {/* Display human-readable interval */}
            {newPayment.interval && (
              <p className="mt-1 text-sm text-gray-500">
                {formatDuration(parseInt(newPayment.interval))}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!newPayment.recipient || !newPayment.amount || !newPayment.interval}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md
              hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Setup Payment
          </button>
        </form>
      </div>

      {/* Active Payments List - Updated to show interval in human-readable format */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Active Payments</h2>
        {isLoading ? (
          <p className="text-center py-4 text-gray-600">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-center py-4 text-gray-600">No active payments found</p>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Recipient:</span> {payment.recipient}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Amount:</span> {payment.amount} MNT
                </p>
                <p className="text-sm">
                  <span className="font-medium">Interval:</span>{" "}
                  {formatDuration(Number(payment.interval) * 24 * 60 * 60)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Last Payment:</span>{" "}
                  {payment.lastPayment.toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleProcessPayment(payment.id)}
                  disabled={!payment.canProcess}
                  className={`w-full py-2 px-4 rounded-md text-white
                    ${payment.canProcess ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"}
                    disabled:opacity-50`}
                >
                  Process Payment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
