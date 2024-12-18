# Mantle-Pay

A decentralized application built on the Mantle network that simplifies recurring payment management through smart contracts. This solution enables organizations to automate their payment processes with secure, transparent, and customizable payment schedules.

### Features

The application provides essential functionality for managing recurring payments:

* Automated payment scheduling with customizable intervals
* Secure fund deposits and management
* Role-based access control for administrators and users
* Real-time transaction tracking and history
* MetaMask integration for secure wallet connectivity
* Transparent payment processing through smart contracts

### Built With

The application leverages modern web technologies:

* React - Frontend framework
* Tailwind CSS - Styling and UI components
* ethers.js - Ethereum library for blockchain interactions
* MetaMask - Wallet connectivity
* Mantle Network - Blockchain infrastructure
* React Router - Application routing

### Contract Details

* Network: Mantle Sepolia Testnet
* Contract Address: `0x71a3f5Ea034ff39b45dD9912BDFc2C939F7a004F`
* Chain ID: 5003

### Prerequisites

Before installation, ensure you have:

* Node.js (v14.0 or higher)
* MetaMask browser extension
* Mantle Sepolia network configured in MetaMask
* Test MNT tokens for transactions

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AtharvaWaghchoure/Mantle-Pay
cd Mantle-Pay
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

### Project Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Settings.jsx
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── WalletConnection.jsx
│   │   ├── PayrollInterface.jsx
│   │   └── DepositForm.jsx
│   ├── contexts/
│   │   └── WalletContext.jsx
│   ├── hooks/
│   │   └── usePayrollContract.js
│   ├── utils/
│   │   └── chainUtils.js
│   └── config/
│       └── constants.js
├── public/
└── package.json
```

### Usage Guide

[How to use the Mantle-Pay](https://youtu.be/_QVqAgfuq1E)

### Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### License

This project is licensed under the MIT License.

---

*Note: Always maintain a secure backup of your private keys and never share them. This application handles real cryptocurrency transactions.*
