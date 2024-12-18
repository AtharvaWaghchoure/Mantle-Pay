import React from "react";
import { useWallet } from "../contexts/WalletContext";
import { WalletConnection } from "./WalletConnection";
import { PayrollInterface } from "./PayrollInterface";

export function AppContent() {
  const { account, isCorrectNetwork, error } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mantle Payroll DApp</h1>

        <WalletConnection />

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-md my-4">{error}</div>}

        {account && !isCorrectNetwork && (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md my-4">
            Please switch to Mantle Sepolia network
          </div>
        )}

        {account && isCorrectNetwork && <PayrollInterface />}
      </div>
    </div>
  );
}
