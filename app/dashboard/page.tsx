"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "./layout-dashboard";
import { GameState } from "./game/[id]/types";
import { fetchGameFromChain } from "./game/[id]/utils/fetchGameFromChain";
import CoreGameFactoryABI from "@/contracts/abi/CoreGameFactory.json";
import { ethers } from "ethers";

const CORE_GAME_FACTORY_ADDRESS = "0x0F1C75b8aA1A294C52F6F120d73F33A75bd92BDB"; // replace with deployed addr

interface Game {
  id: string;
  contractAddress: string;
  createdAt: string;
  status: "active" | "pending" | "inactive";
  gameState: GameState;
  name?: string;
  description?: string;
  genre?: string;
}

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const REQUIRED_FACETS = {
    metadata: "GameMetadataFacet",
    inventory: "InventoryFacet",
    passport: "PassportFacet", // Example
  };

  function determineGameState(facetNames: string[]): GameState {
    const hasMetadata = facetNames.includes(REQUIRED_FACETS.metadata);
    const hasInventory = facetNames.includes(REQUIRED_FACETS.inventory);
    const hasGameplay = facetNames.includes(REQUIRED_FACETS.gameplay);

    if (hasMetadata && hasInventory && hasGameplay) {
      return GameState.ACTIVE;
    } else if (hasMetadata || hasInventory || hasGameplay) {
      return GameState.CONFIGURED;
    } else {
      return GameState.BARE;
    }
  }

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected");
    if (!walletConnected) {
      router.push("/");
      return;
    }

    fetchGames();
  }, [router]);

  const fetchGames = async () => {
    try {
      const walletAddress = localStorage.getItem("walletAddress");
      if (!walletAddress) {
        console.error("No wallet address found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(
        CORE_GAME_FACTORY_ADDRESS,
        CoreGameFactoryABI.abi,
        signer,
      );

      const gameAddresses: string[] =
        await factory.getGamesByDeveloper(walletAddress);
      console.log(gameAddresses);
      const enrichedGames: Game[] = await Promise.all(
        gameAddresses.map(async (diamondAddress: string, idx: number) => {
          try {
            const game = await fetchGameFromChain(diamondAddress); // facetAddress = diamond in your case

            return {
              id: diamondAddress,
              contractAddress: diamondAddress,
              createdAt: new Date().toISOString(), // If your diamond has on-chain timestamp, use it
              status: "active",
              gameState: game.gameState,
              name: game.name,
              description: game.description,
              genre: game.genre,
            };
          } catch (err) {
            console.warn(
              `Failed to fetch game data from ${diamondAddress}:`,
              err,
            );
            return {
              id: diamondAddress,
              contractAddress: diamondAddress,
              createdAt: new Date().toISOString(),
              status: "active",
              gameState: GameState.BARE,
            };
          }
        }),
      );

      setGames(enrichedGames);
    } catch (error) {
      console.error("Failed to fetch games from CoreGameFactory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = () => {
    router.push("/dashboard/create-game");
  };

  const handleManageGame = (gameId: string) => {
    router.push(`/dashboard/game/${gameId}`);
  };

  const getGameStateDisplay = (gameState: GameState) => {
    switch (gameState) {
      case GameState.BARE:
        return { icon: "🕳", text: "Uninitialized", color: "error" };
      case GameState.CONFIGURED:
        return { icon: "⚙️", text: "Configured", color: "warning" };
      case GameState.ACTIVE:
        return { icon: "📊", text: "Active", color: "success" };
      default:
        return { icon: "❓", text: "Unknown", color: "error" };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <div className="loading"></div>
          <p className="mt-2">Loading your games...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="card-header">
        <h1 className="card-title">My Games</h1>
        <button onClick={handleCreateGame} className="btn btn-primary">
          + New Game
        </button>
      </div>

      {games.length === 0 ? (
        <div className="card text-center">
          <h3>No games yet</h3>
          <p className="text-secondary mb-3">
            Create your first game to get started with the Core Game Protocol
          </p>
          <button onClick={handleCreateGame} className="btn btn-primary">
            Create Your First Game
          </button>
        </div>
      ) : (
        <div className="grid grid-3 gap-4">
          {games.map((game) => {
            const stateDisplay = getGameStateDisplay(game.gameState);

            return (
              <div
                key={game.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "280px",
                }}
              >
                {/* Header */}
                <div>
                  <h3 className="card-title">
                    {game.name?.trim() ||
                      `Game ${game.contractAddress.slice(0, 8)}...${game.contractAddress.slice(-6)}`}
                  </h3>
                  <p className="text-secondary" style={{ minHeight: "48px" }}>
                    {game.description?.trim() ||
                      "No description set yet. Configure metadata to update game info."}
                  </p>

                  <div className="mb-2">
                    <small className="text-secondary">
                      Contract: {game.contractAddress}
                    </small>
                  </div>

                  <div className="mb-2">
                    <small className="text-secondary">
                      Created: {new Date(game.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <div
                    className="mb-3"
                    style={{
                      padding: "0.5rem",
                      background:
                        game.gameState === GameState.ACTIVE
                          ? "rgba(0, 255, 136, 0.1)"
                          : game.gameState === GameState.CONFIGURED
                            ? "rgba(255, 170, 0, 0.1)"
                            : "var(--accent-orange-light)",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {stateDisplay.icon} {stateDisplay.text}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: "auto" }}>
                  <button
                    onClick={() => handleManageGame(game.id)}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    {game.gameState === GameState.ACTIVE
                      ? "Manage & View Stats"
                      : "Configure Game"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
