import React from "react";
import { MANTLE_SEPOLIA_CONFIG } from "../config/constants";

export const WalletInfo = ({ account, chainId, balance }) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <p className="font-medium text-gray-700 mb-1">Connected Account:</p>
        <p className="text-sm text-gray-600 break-all bg-gray-50 p-2 rounded">{account}</p>
      </div>
      <div>
        <p className="font-medium text-gray-700 mb-1">Current Chain ID:</p>
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{chainId}</p>
      </div>
      <div>
        <p className="font-medium text-gray-700 mb-1">Account Balance:</p>
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          {balance} {MANTLE_SEPOLIA_CONFIG.nativeCurrency.symbol}
        </p>
      </div>
    </div>
  );
};
