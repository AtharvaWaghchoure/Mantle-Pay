import { useState } from "react";
import { isValidAddress, toWei } from "../utils/web3Utils";

export const useTransaction = (account, fetchBalance) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  const sendMNT = async () => {
    if (!isValidAddress(recipientAddress)) {
      setError("Invalid recipient address");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Invalid amount");
      return;
    }

    setIsSending(true);
    setError("");
    setTransactionHash("");

    try {
      const transactionParameters = {
        to: recipientAddress,
        from: account,
        value: toWei(amount),
      };

      const gasEstimate = await window.ethereum.request({
        method: "eth_estimateGas",
        params: [transactionParameters],
      });

      transactionParameters.gas = gasEstimate;

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      await fetchBalance(account);

      // Clear form
      setAmount("");
      setRecipientAddress("");
    } catch (err) {
      setError(err.message || "Transaction failed");
    } finally {
      setIsSending(false);
    }
  };

  return {
    recipientAddress,
    setRecipientAddress,
    amount,
    setAmount,
    isSending,
    transactionHash,
    error,
    sendMNT,
  };
};
