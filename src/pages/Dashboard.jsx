import React from "react";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Payroll Dashboard</h1>
          <p className="text-gray-600">
            Here, you can view and manage payroll data for your decentralized app.
          </p>
        </div>

      </main>
    </div>
  );
}
