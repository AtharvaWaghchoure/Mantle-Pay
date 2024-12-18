import React from "react";
import { Send } from "lucide-react";
import { MANTLE_SEPOLIA_CONFIG } from "../config/constants";

export const TransactionForm = ({
  recipientAddress,
  setRecipientAddress,
  amount,
  setAmount,
  isSending,
  transactionHash,
  error,
  sendMNT,
}) => {
  return (
    <div className="space-y-4 mt-6 border-t pt-6">
      <h3 className="text-lg font-medium text-gray-800">Send MNT</h3>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="0x..."
          className="w-full p-2 border rounded-md text-sm"
          disabled={isSending}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (MNT)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          step="0.000000000000000001"
          min="0"
          className="w-full p-2 border rounded-md text-sm"
          disabled={isSending}
        />
      </div>

      <button
        onClick={sendMNT}
        disabled={isSending || !amount || !recipientAddress}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium
          hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors flex items-center justify-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>{isSending ? "Sending..." : "Send MNT"}</span>
      </button>

      {transactionHash && (
        <div className="mt-4">
          <p className="font-medium text-gray-700 mb-1">Transaction Hash:</p>
          <a
            href={`${MANTLE_SEPOLIA_CONFIG.blockExplorerUrls[0]}/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 break-all hover:underline"
          >
            {transactionHash}
          </a>
        </div>
      )}
    </div>
  );
};
