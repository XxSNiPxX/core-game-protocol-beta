"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGameFromChain } from "./dashboard/game/[id]/utils/fetchGameFromChain";

export default function HomePage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please install it to use this app.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log(chainId);
      // if (chainId !== "0x456") {
      //   try {
      //     await window.ethereum.request({
      //       method: "wallet_switchEthereumChain",
      //       params: [{ chainId: "0x456" }],
      //     });
      //   } catch (switchError: any) {
      //     // If the chain isn't added to MetaMask, prompt to add it
      //     if (switchError.code === 4902) {
      //       try {
      //         await window.ethereum.request({
      //           method: "wallet_addEthereumChain",
      //           params: [
      //             {
      //               chainId: "0x456",
      //               chainName: "Core Chain",
      //               rpcUrls: ["https://rpc.coredao.org"],
      //               nativeCurrency: {
      //                 name: "Core",
      //                 symbol: "CORE",
      //                 decimals: 18,
      //               },
      //               blockExplorerUrls: ["https://scan.coredao.org"],
      //             },
      //           ],
      //         });
      //       } catch (addError) {
      //         alert("Failed to add Core network.");
      //         return;
      //       }
      //     } else {
      //       alert("Please switch to the Core network in MetaMask.");
      //       return;
      //     }
      //   }
      // }

      setWalletAddress(address);
      setWalletConnected(true);
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAddress", address);

      alert("Wallet connected to Core network successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
  };

  useEffect(() => {
    const connected = localStorage.getItem("walletConnected");
    const address = localStorage.getItem("walletAddress");
    if (connected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
    }
  }, []);

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link href="/" className="logo">
              <div className="logo-icon">C</div>
              CORE
            </Link>

            <ul className="nav-links">
              <li>
                <Link href="#developers">Developers</Link>
              </li>
              <li>
                <Link href="#ecosystem">Ecosystem</Link>
              </li>
              <li>
                <Link href="#community">Community</Link>
              </li>
              <li>
                <Link href="#tools">Tools</Link>
              </li>
            </ul>

            <button
              className={`wallet-connect ${walletConnected ? "wallet-connected" : ""}`}
              onClick={walletConnected ? disconnectWallet : connectWallet}
            >
              {walletConnected
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      {/* Demo Mode Banner */}
      <div
        style={{
          background: "linear-gradient(45deg, var(--accent-orange), #ffaa00)",
          color: "white",
          padding: "0.5rem",
          textAlign: "center",
          fontSize: "0.875rem",
        }}
      >
        🚀 Demo Mode - All wallet connections and transactions are simulated
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>The Core Game Protocol</h1>
          <p>
            Build cross-platform games with unified identity, inventory, and
            tokenization. Deploy once, play everywhere on the Core Network.
          </p>
          <div className="cta-buttons">
            {walletConnected ? (
              <Link href="/dashboard" className="btn btn-primary">
                Launch Dashboard
              </Link>
            ) : (
              <button onClick={connectWallet} className="btn btn-primary">
                Connect & Start Building
              </button>
            )}
            <Link href="#docs" className="btn btn-secondary">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Universal Identity</h3>
              <p>
                Create player passports that work across all games in your
                ecosystem. Persistent identity with customizable attributes and
                achievements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎒</div>
              <h3>Cross-Game Inventory</h3>
              <p>
                Items and assets that transfer between games. Build
                interconnected experiences where progress carries forward.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Native Tokenization</h3>
              <p>
                Built-in token support for game economies. Create, mint, and
                manage fungible and non-fungible assets with ease.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Developer Tools</h3>
              <p>
                Comprehensive SDK and APIs for seamless integration. Deploy
                smart contracts and manage game state with simple function
                calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="features">
        <div className="container">
          <h2>Network Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">241,187,032</div>
              <div className="stat-label">CORE Delegated</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">31/36</div>
              <div className="stat-label">Active Validators</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">99</div>
              <div className="stat-label">Bitcoin Blocks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">622 EH/s</div>
              <div className="stat-label">Hash Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
