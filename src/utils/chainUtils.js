// src/utils/chainUtils.js
// This file contains utility functions for chain ID conversions and comparisons
export const chainUtils = {
  // Convert decimal to hex format for provider requests
  toHex: (decimal) => {
    return `0x${decimal.toString(16)}`;
  },

  // Convert hex to decimal format for our comparisons
  toDecimal: (hex) => {
    return typeof hex === "string" ? parseInt(hex, 16) : hex;
  },

  // Compare chain IDs regardless of format (hex or decimal)
  chainsMatch: (chain1, chain2) => {
    const decimal1 =
      typeof chain1 === "string" && chain1.startsWith("0x") ? parseInt(chain1, 16) : Number(chain1);
    const decimal2 =
      typeof chain2 === "string" && chain2.startsWith("0x") ? parseInt(chain2, 16) : Number(chain2);
    return decimal1 === decimal2;
  },
};
