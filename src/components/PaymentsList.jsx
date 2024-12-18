import React from "react";

export const PaymentsList = ({ payments, onProcess, isLoading }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Active Payments</h3>
      {isLoading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No active payments found</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border rounded-md p-4 space-y-2">
              <p>
                <span className="font-medium">Recipient:</span> {payment.recipient}
              </p>
              <p>
                <span className="font-medium">Amount:</span> {payment.amount} ETH
              </p>
              <p>
                <span className="font-medium">Interval:</span> {payment.interval} days
              </p>
              <p>
                <span className="font-medium">Last Payment:</span>{" "}
                {payment.lastPayment.toLocaleDateString()}
              </p>
              <button
                onClick={() => onProcess(payment.id)}
                disabled={!payment.canProcess}
                className={`w-full py-2 px-4 rounded-md text-white ${
                  payment.canProcess ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
                }`}
              >
                Process Payment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
