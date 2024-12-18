import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { PAYROLL_CONTRACT } from "../config/constants";

export function usePayrollContract(account) {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize contract when account is available
  useEffect(() => {
    const initContract = async () => {
      if (!account || !window.ethereum) {
        setIsInitialized(false);
        return;
      }

      try {
        // Using Web3Provider instead of BrowserProvider for ethers v5
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const newContract = new ethers.Contract(
          PAYROLL_CONTRACT.address,
          PAYROLL_CONTRACT.abi,
          signer,
        );

        setContract(newContract);
        setIsInitialized(true);
        setError("");
      } catch (err) {
        console.error("Contract initialization error:", err);
        setError("Failed to initialize contract");
        setIsInitialized(false);
      }
    };

    initContract();

    return () => {
      setContract(null);
      setIsInitialized(false);
    };
  }, [account]);

  // Helper to check contract initialization before operations
  const checkInitialization = () => {
    if (!isInitialized || !contract) {
      throw new Error("Contract not initialized");
    }
  };

  // Contract interaction methods
  const depositFunds = async (amount) => {
    try {
      checkInitialization();
      const tx = await contract.depositFunds({
        value: ethers.utils.parseEther(amount.toString()), // Changed from ethers.parseEther
      });
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to deposit funds");
      console.error("Deposit error:", err);
      return false;
    }
  };

  const setupRecurringPayment = async (recipient, amount, interval) => {
    try {
      checkInitialization();
      const amountInWei = ethers.utils.parseEther(amount.toString());
      // Use the interval directly without conversion since it's already in seconds
      const tx = await contract.setupRecurringPayment(recipient, amountInWei, interval);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to setup recurring payment");
      console.error("Setup payment error:", err);
      return false;
    }
  };

  const processPayment = async (paymentId) => {
    try {
      checkInitialization();
      const tx = await contract.processRecurringPayment(paymentId);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to process payment");
      console.error("Process payment error:", err);
      return false;
    }
  };

  const getBalance = async () => {
    try {
      checkInitialization();
      const balance = await contract.getContractBalance();
      return ethers.utils.formatEther(balance); // Changed from ethers.formatEther
    } catch (err) {
      setError(err.message || "Failed to fetch balance");
      console.error("Balance fetch error:", err);
      return "0";
    }
  };

  const getActivePayments = async () => {
    try {
      checkInitialization();
      const activeIds = await contract.getActivePaymentIds();
      const payments = await Promise.all(
        activeIds.map(async (id) => {
          const payment = await contract.recurringPayments(id);
          const canProcess = await contract.canProcessPayment(id);
          return {
            id: id.toString(),
            recipient: payment.recipient,
            amount: ethers.utils.formatEther(payment.amount), // Changed from ethers.formatEther
            interval: Number(payment.interval) / (24 * 60 * 60),
            lastPayment: new Date(Number(payment.lastPayment) * 1000),
            isActive: payment.isActive,
            canProcess,
          };
        }),
      );
      return payments;
    } catch (err) {
      setError(err.message || "Failed to fetch active payments");
      console.error("Active payments fetch error:", err);
      return [];
    }
  };

  return {
    contract,
    error,
    isInitialized,
    depositFunds,
    setupRecurringPayment,
    processPayment,
    getBalance,
    getActivePayments,
  };
}
