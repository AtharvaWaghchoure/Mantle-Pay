import React from "react";
import { PayrollInterface } from "../components/PayrollInterface";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Payroll Dashboard</h1>
        <PayrollInterface />
      </div>
    </div>
  );
}
