import React, { useState } from "react";
import { usePayrollContract } from "../hooks/usePayrollContract";

export function DepositForm({ account }) {
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState("");
  const [txSuccess, setTxSuccess] = useState(false);

  const { depositFunds, isInitialized } = usePayrollContract(account);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setTxError("");
    setTxSuccess(false);
    setIsProcessing(true);

    try {
      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const success = await depositFunds(depositAmount);

      if (success) {
        setTxSuccess(true);
        setDepositAmount(""); // Clear the input on success
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      setTxError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Deposit Funds to Contract</h2>

      <form onSubmit={handleDeposit}>
        <div className="mb-4">
          <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (MNT)
          </label>

          <input
            id="depositAmount"
            type="number"
            step="0.000000000000000001" // Allow for 18 decimal places (full MNT precision)
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount of MNT"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 
              focus:border-blue-500 disabled:bg-gray-100"
            disabled={!isInitialized || isProcessing}
          />
        </div>

        {txError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{txError}</div>}

        {txSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            Funds successfully deposited to contract!
          </div>
        )}

        <button
          type="submit"
          disabled={!isInitialized || isProcessing || !depositAmount}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md 
            hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Deposit Funds"}
        </button>
      </form>
    </div>
  );
}
