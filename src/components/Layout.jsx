import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { WalletConnection } from "./WalletConnection";

export function Layout() {
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo/Brand */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Payroll DApp</h1>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    ${
                      isActiveLink("/")
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center">
              <WalletConnection />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
