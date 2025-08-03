"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import DashboardLayout from "../layout-dashboard";
import CoreGameFactoryABI from "@/contracts/abi/CoreGameFactory.json";
import { id } from "ethers";

function getUniqueSelectorsFromAbi(abi: any[], seen: Set<string>): string[] {
  const iface = new ethers.Interface(abi);
  const selectors: string[] = [];

  for (const fragment of iface.fragments) {
    if (fragment.type === "function") {
      const selector = id(fragment.format()).slice(0, 10);
      if (!seen.has(selector)) {
        seen.add(selector);
        selectors.push(selector);
      }
    }
  }

  return selectors;
}

const FACTORY_ADDRESS = "0x0F1C75b8aA1A294C52F6F120d73F33A75bd92BDB";

export default function CreateGamePage() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [games, setGames] = useState<string[]>([]);
  const [deploymentStep, setDeploymentStep] = useState(0);

  const totalContracts = 4; // 3 facets + 1 CoreGame

  const router = useRouter();

  const fetchGames = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const factory = new ethers.Contract(
        FACTORY_ADDRESS,
        CoreGameFactoryABI.abi,
        signer,
      );

      const address = await signer.getAddress();
      const createdGames = await factory.getGamesByDeveloper(address);
      setGames(createdGames);
    } catch (err) {
      console.error("Failed to fetch games:", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    setDeploymentStep(1); // Starting first deployment

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const factory = new ethers.Contract(
        FACTORY_ADDRESS,
        CoreGameFactoryABI.abi,
        signer,
      );

      const facetNames = [
        "FacetRegistryFacet",
        "OwnershipFacet",
        "DiamondLoupeFacet",
      ];

      const seenSelectors = new Set<string>();
      const facets: any[] = [];

      for (let i = 0; i < facetNames.length; i++) {
        const name = facetNames[i];
        setDeploymentStep(i + 1); // Update progress

        const artifact = await import(`../../../contracts/abi/${name}.json`);

        const facetFactory = new ethers.ContractFactory(
          artifact.abi,
          artifact.bytecode,
          signer,
        );

        const contract = await facetFactory.deploy();
        await contract.waitForDeployment();

        const facetAddress = await contract.getAddress();
        const selectors = getUniqueSelectorsFromAbi(
          artifact.abi,
          seenSelectors,
        );

        facets.push({
          facetAddress,
          action: 0, // Add
          functionSelectors: selectors,
        });
      }

      setDeploymentStep(4); // Final contract (CoreGame) being deployed

      const tx = await factory.createCoreGame(facets);
      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log: any) => {
          try {
            return factory.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((log) => log?.name === "CoreGameCreated");

      if (event) {
        const newGame = event.args.coreGameDiamond;
        alert("Game created: " + newGame);
        fetchGames();
      } else {
        alert("Game creation failed: Event not found");
      }
    } catch (err) {
      console.error("Game creation error:", err);
      alert("Error creating game. Check console.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setDeploymentStep(0);
    }
  };

  return (
    <DashboardLayout>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Create Game</h1>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowConfirm(true)}
          disabled={loading}
        >
          {loading ? <span className="loading"></span> : "Create Game"}
        </button>

        {showConfirm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              width: "100vw",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#111",
                padding: "2rem",
                borderRadius: "12px",
                maxWidth: "400px",
                textAlign: "center",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              <h3>Confirm Game Deployment</h3>
              <p style={{ margin: "1rem 0" }}>
                This will deploy {totalContracts} contracts. <br />
                Are you sure you want to continue?
              </p>

              {deploymentStep > 0 && (
                <p
                  style={{
                    marginTop: "1rem",
                    fontStyle: "italic",
                    color: "#ccc",
                  }}
                >
                  Deploying contract {deploymentStep} of {totalContracts}...
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? <span className="loading"></span> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card mt-3">
          <h2 className="card-title">Your Games</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Game Address</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan={2}>No games created yet.</td>
                </tr>
              ) : (
                games.map((game, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{game}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
