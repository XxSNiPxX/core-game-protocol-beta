"use client";

import { useState } from "react";
import { mockWallets } from "../utils/mockWallets";

interface MockWalletSelectorProps {
  onWalletSelect: (address: string) => void;
  currentAddress: string;
}

export default function MockWalletSelector({
  onWalletSelect,
  currentAddress,
}: MockWalletSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "0.5rem",
            minWidth: "300px",
            zIndex: 1000,
            marginTop: "0.5rem",
          }}
        >
          <h4 style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
            Select Mock Wallet:
          </h4>
          {mockWallets.map((wallet, index) => (
            <button
              key={wallet}
              onClick={() => {
                onWalletSelect(wallet);
                setIsOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem",
                background:
                  wallet === currentAddress
                    ? "var(--accent-orange-light)"
                    : "transparent",
                border: "none",
                color: "var(--text-primary)",
                textAlign: "left",
                borderRadius: "4px",
                marginBottom: "0.25rem",
                cursor: "pointer",
                fontSize: "0.75rem",
              }}
            >
              Wallet {index + 1}: {wallet.slice(0, 8)}...{wallet.slice(-6)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
