import React, { useState } from "react";

export const PaymentSetupForm = ({ onSetup }) => {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    interval: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    await onSetup(formData.recipient, formData.amount, formData.interval);
    setFormData({ recipient: "", amount: "", interval: "" });
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Setup Recurring Payment</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
        <input
          type="text"
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount (ETH)</label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Interval (Days)</label>
        <input
          type="number"
          value={formData.interval}
          onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        {isProcessing ? "Processing..." : "Setup Payment"}
      </button>
    </form>
  );
};
