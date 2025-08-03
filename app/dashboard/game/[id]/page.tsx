"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../../layout-dashboard";
import GameLifecycleStatus from "./components/GameLifecycleStatus";
import GameOverview from "./components/GameOverview";
import GameStats from "./components/GameStats";
import UserDetailsModal from "./components/UserDetailsModal";
import type { Game, User, InventoryItem } from "./types";
import { GameState } from "./types";
import { ethers } from "ethers";
import GameInfoFacet from "@/contracts/abi/GameInfoFacet.json";
import InventoryFacet from "@/contracts/abi/InventoryFacet.json";
import PassportFacet from "@/contracts/abi/PassportFacet.json";
import CoreGameDiamond from "@/contracts/abi/CoreGameDiamond.json";
import GameDataFacetV1 from "@/contracts/abi/GameDataFacetV1.json"; // Add this to your imports if not done already
import { fetchGameFromChain } from "./utils/fetchGameFromChain";

export default function GameDashboardPage() {
  const params = useParams();
  const gameId = params.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [deploymentStep, setDeploymentStep] = useState<number>(0);

  // Module deployment states
  const [deployedModules, setDeployedModules] = useState({
    GameInfoFacet: false,
    PassportFacet: false,
    InventoryFacet: false,
    GameDataFacetv1: false,
  });

  function getUniqueSelectorsFromAbi(
    targetAbi: any[],
    otherAbis: any[][],
  ): string[] {
    const targetInterface = new ethers.Interface(targetAbi);
    const targetSelectors: Set<string> = new Set();

    for (const fragment of targetInterface.fragments) {
      if (fragment.type === "function") {
        const selector = ethers.id(fragment.format()).slice(0, 10);
        targetSelectors.add(selector);
      }
    }

    // Collect all selectors from other ABIs
    const otherSelectors: Set<string> = new Set();
    for (const abi of otherAbis) {
      const iface = new ethers.Interface(abi);
      for (const fragment of iface.fragments) {
        if (fragment.type === "function") {
          const selector = ethers.id(fragment.format()).slice(0, 10);
          otherSelectors.add(selector);
        }
      }
    }

    // Return only selectors unique to targetAbi
    return [...targetSelectors].filter((s) => !otherSelectors.has(s));
  }

  useEffect(() => {
    fetchGameData();
    fetchUsers();
    fetchInventoryItems();
  }, [gameId]);
  function getFacetAddressByName(
    facets: { name: string; address: string }[],
    targetName: string,
  ): string | null {
    const found = facets.find((f) => f.name === targetName);
    return found ? found.address : null;
  }

  const fetchGameData = async () => {
    try {
      const contractAddress = gameId;

      const provider = new ethers.BrowserProvider(window.ethereum);

      const gameFromChain = await fetchGameFromChain(contractAddress);
      console.log(gameFromChain, "gameFromChain");
      const updatedModules = {
        GameInfoFacet: !!gameFromChain.gameInfoFacet,
        InventoryFacet: !!gameFromChain.inventoryContract,
        PassportFacet: !!gameFromChain.passportContract,
        GameDataFacetv1: !!gameFromChain.gameDataFacet,
      };

      setDeployedModules(updatedModules);
      setGame(gameFromChain);
      return;

      // Create the game object
    } catch (error) {
      console.error("Failed to fetch game:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      if (!deployedModules.PassportFacet) {
        setUsers([]);
        return;
      }

      const mockUsers: User[] = [
        {
          wallet: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
          passportId: "1",
          attributes: {
            hp: 100,
            mana: 50,
            level: 5,
            xp: 1250,
            class: "warrior",
          },
          inventory: [
            { tokenId: "1", name: "Plasma Sword", amount: 1 },
            { tokenId: "2", name: "Energy Shield", amount: 1 },
            { tokenId: "3", name: "Health Potion", amount: 5 },
          ],
        },
        {
          wallet: "0x8ba1f109551bD432803012645Hac136c5c2e2e2e",
          passportId: "2",
          attributes: { hp: 80, mana: 75, level: 3, xp: 750, class: "mage" },
          inventory: [
            { tokenId: "1", name: "Plasma Sword", amount: 1 },
            { tokenId: "4", name: "Cyber Armor", amount: 1 },
          ],
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      if (!deployedModules.InventoryFacet) {
        setInventoryItems([]);
        return;
      }

      const mockItems: InventoryItem[] = [
        {
          tokenId: "1",
          name: "Plasma Sword",
          attribute: "weapon",
          uri: "https://example.com/sword.json",
        },
        {
          tokenId: "2",
          name: "Energy Shield",
          attribute: "armor",
          uri: "https://example.com/shield.json",
        },
        {
          tokenId: "3",
          name: "Health Potion",
          attribute: "consumable",
          uri: "https://example.com/potion.json",
        },
        {
          tokenId: "4",
          name: "Cyber Armor",
          attribute: "armor",
          uri: "https://example.com/armor.json",
        },
      ];

      setInventoryItems(mockItems);
    } catch (error) {
      console.error("Failed to fetch inventory items:", error);
    }
  };

  const updateGameState = () => {
    if (!game) return;

    const { GameInfoFacet, PassportFacet, InventoryFacet, GameDataFacetv1 } =
      deployedModules;

    let newState: GameState;
    if (!GameInfoFacet && !PassportFacet && !InventoryFacet) {
      newState = GameState.BARE;
    } else if (
      (GameInfoFacet || PassportFacet || InventoryFacet) &&
      !GameDataFacetv1
    ) {
      newState = GameState.CONFIGURED;
    } else {
      newState = GameState.ACTIVE;
    }

    setGame((prev) =>
      prev
        ? {
            ...prev,
            gameState: newState,
            lastUpdated: new Date().toISOString(),
          }
        : null,
    );
  };

  const handleModuleDeployment = async (module: string) => {
    try {
      setDeploymentStep(1);
      console.log(`Deploying ${module} module...`);
      console.log(module, "module is");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const seenSelectors = new Set<string>();

      const diamondAddress = gameId;
      console.log(diamondAddress);

      const diamond = new ethers.Contract(
        diamondAddress,
        CoreGameDiamond.abi,
        signer,
      );
      console.log(diamond);

      let facetAbi: any[], facetBytecode: string;
      console.log(module);
      switch (module) {
        case "GameInfoFacet":
          facetAbi = GameInfoFacet.abi;
          facetBytecode = GameInfoFacet.bytecode;
          break;
        case "InventoryFacet":
          facetAbi = InventoryFacet.abi;
          facetBytecode = InventoryFacet.bytecode;
          break;
        case "PassportFacet":
          facetAbi = PassportFacet.abi;
          facetBytecode = PassportFacet.bytecode;
          break;
        default:
          throw new Error("Unknown module");
      }
      console.log(module, "module");

      // Deploy facet
      const factory = new ethers.ContractFactory(
        facetAbi,
        facetBytecode,
        signer,
      );
      const facet = await factory.deploy();
      await facet.waitForDeployment();
      setDeploymentStep(2);

      const facetAddress = await facet.getAddress();
      // Extract selectors
      // Filter out other facet ABIs to avoid overlapping selectors
      const allAbis = {
        GameInfoFacet: GameInfoFacet.abi,
        InventoryFacet: InventoryFacet.abi,
        PassportFacet: PassportFacet.abi,
      };

      const otherAbis = Object.entries(allAbis)
        .filter(([name]) => name !== module)
        .map(([_, abi]) => abi);

      const selectors = getUniqueSelectorsFromAbi(facetAbi, otherAbis);
      console.log(selectors, facetAddress, "here");
      // Call diamondCut
      const tx = await diamond.deployFacet(
        [
          {
            facetAddress: facetAddress,
            action: 0, // ADD
            functionSelectors: selectors,
          },
        ],
        [module],
      );

      await tx.wait();
      console.log(`${module} facet added: ${facetAddress}`);
      setDeploymentStep(0);

      // Update state and UI
      setDeployedModules((prev) => ({ ...prev, [module]: true }));

      if (module === "PassportFacet") {
        setGame((g) => g && { ...g, passportContract: facetAddress });
        fetchUsers();
      } else if (module === "InventoryFacet") {
        setGame((g) => g && { ...g, inventoryContract: facetAddress });
        fetchInventoryItems();
      } else if (module === "GameInfoFacet") {
        setGame((g) => g && { ...g, gameInfoFacet: facetAddress });
        fetchUsers();
      }

      alert(`${module} module deployed successfully!`);
    } catch (error) {
      setDeploymentStep(0);

      console.error(`Failed to deploy ${module} module:`, error);
      alert(`Failed to deploy ${module} module. Check console.`);
    }
  };

  const handleGameDataFacetDeploy = async () => {
    try {
      setDeploymentStep(1);

      console.log("Deploying GameDataFacet...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const diamondAddress = gameId;

      const diamond = new ethers.Contract(
        diamondAddress,
        CoreGameDiamond.abi,
        signer,
      );

      const facetAbi = GameDataFacetV1.abi;
      const facetBytecode = GameDataFacetV1.bytecode;

      // All other ABIs (excluding GameDataFacet for uniqueness check)
      const allAbis = [
        GameInfoFacet.abi,
        InventoryFacet.abi,
        PassportFacet.abi,
        // Do NOT include GameDataFacet.abi here
      ];

      const selectors = getUniqueSelectorsFromAbi(facetAbi, allAbis);

      const factory = new ethers.ContractFactory(
        facetAbi,
        facetBytecode,
        signer,
      );

      const facet = await factory.deploy();
      await facet.waitForDeployment(); // crucial!
      setDeploymentStep(2);

      const facetAddress = await facet.getAddress();
      console.log(facetAddress, selectors);
      const tx = await diamond.deployFacet(
        [
          {
            facetAddress: facetAddress,
            action: 0, // ADD
            functionSelectors: selectors,
          },
        ],
        ["GameDataFacetV1"],
      );

      await tx.wait();
      setDeploymentStep(0);

      console.log(`GameDataFacet facet added: ${facetAddress}`);

      setDeployedModules((prev) => ({ ...prev, GameDataFacetv1: true }));

      if (game) {
        setGame({
          ...game,
          gameDataFacet: facetAddress,
          gameState: GameState.ACTIVE,
          lastUpdated: new Date().toISOString(),
        });
      }

      alert(
        "🎉 GameDataFacet deployed! Your game is now fully active with complete dashboard access!",
      );
    } catch (error) {
      setDeploymentStep(0);

      console.error("Failed to deploy GameDataFacet:", error);
      alert("Failed to deploy GameDataFacet module. Check console.");
    }
  };

  const handleGameUpdate = (updatedGame: Game) => {
    setGame(updatedGame);
  };

  if (loading || !game) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <div className="loading"></div>
          <p className="mt-2">Loading game dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const showFullDashboard = game.gameState === GameState.ACTIVE;
  console.log(showFullDashboard, game.gameState, GameState.ACTIVE, "LOLOLo");
  return (
    <DashboardLayout>
      <div>
        {/* Game Lifecycle Status - Always shown */}
        <GameLifecycleStatus
          game={game}
          deployedModules={deployedModules}
          onModuleDeployment={handleModuleDeployment}
          onGameDataFacetDeploy={handleGameDataFacetDeploy}
          deploymentStep={deploymentStep} // ❌ Missing
          setDeploymentStep={setDeploymentStep}
        />

        {/* Full Dashboard - Only shown for ACTIVE games */}
        {showFullDashboard && (
          <div className="card">
            {/* Tabs */}
            <div className="tabs">
              <ul className="tab-list">
                <li>
                  <button
                    className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview & Management
                  </button>
                </li>
                <li>
                  <button
                    className={`tab-button ${activeTab === "stats" ? "active" : ""}`}
                    onClick={() => setActiveTab("stats")}
                  >
                    Statistics & Analytics
                  </button>
                </li>
              </ul>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                {/* Contract Addresses */}
                <div className="card mb-3">
                  <h3>Contract Information</h3>
                  <div className="mt-2">
                    <div className="mb-1">
                      <strong>Game Contract:</strong>{" "}
                      <code>{game.contractAddress}</code>
                    </div>
                    <div className="mb-1">
                      <strong>Passport Contract:</strong>{" "}
                      <code>{game.passportContract}</code>
                    </div>
                    <div className="mb-1">
                      <strong>Inventory Contract:</strong>{" "}
                      <code>{game.inventoryContract}</code>
                    </div>
                    <div>
                      <strong>GameData Facet:</strong>{" "}
                      <code>{game.gameDataFacet}</code>
                    </div>
                  </div>
                </div>

                <GameOverview
                  game={game}
                  users={users}
                  inventoryItems={inventoryItems}
                  deployedModules={deployedModules}
                  onUserSelect={setSelectedUser}
                  onModuleDeployment={handleModuleDeployment}
                  onGameUpdate={handleGameUpdate}
                  onDataRefresh={fetchUsers}
                  setInventoryItems={setInventoryItems}
                />
              </div>
            )}

            {activeTab === "stats" && (
              <GameStats
                game={game}
                users={users}
                inventoryItems={inventoryItems}
                deployedModules={deployedModules}
              />
            )}
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
