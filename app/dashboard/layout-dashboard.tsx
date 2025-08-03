"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MockWalletSelector from "../../components/mock-wallet-selector";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const address = localStorage.getItem("walletAddress");
    if (address) {
      setWalletAddress(address);
    } else {
      router.push("/");
    }
  }, [router]);

  const disconnectWallet = () => {
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <div>
      {/* Top Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link href="/dashboard" className="logo">
              <div className="logo-icon">C</div>
              CORE Dashboard
            </Link>

            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <MockWalletSelector
                currentAddress={walletAddress}
                onWalletSelect={(address) => {
                  setWalletAddress(address);
                  localStorage.setItem("walletAddress", address);
                }}
              />
              <button
                className="wallet-connect wallet-connected"
                onClick={disconnectWallet}
              >
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-nav">
            <li>
              <Link
                href="/dashboard"
                className={
                  isActive("/dashboard") && pathname === "/dashboard"
                    ? "active"
                    : ""
                }
              >
                <span>🏠</span>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={
                  isActive("/dashboard") && pathname === "/dashboard"
                    ? "active"
                    : ""
                }
              >
                <span>🎮</span>
                My Games
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/marketplace"
                className={isActive("/dashboard/marketplace") ? "active" : ""}
              >
                <span>🛒</span>
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/create-game"
                className={isActive("/dashboard/create-game") ? "active" : ""}
              >
                <span>➕</span>
                Create Game
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/sdk-tools"
                className={isActive("/dashboard/sdk-tools") ? "active" : ""}
              >
                <span>🔧</span>
                Developer Tools
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className={isActive("/dashboard/settings") ? "active" : ""}
              >
                <span>⚙️</span>
                Settings
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
