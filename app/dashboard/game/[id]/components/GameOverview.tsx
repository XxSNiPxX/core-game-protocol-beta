"use client";

import type React from "react";

import { useState } from "react";
import ModuleCard from "./ModuleCard";
import type { Game, User, InventoryItem, DeployedModules } from "../types";

interface GameOverviewProps {
  game: Game;
  users: User[];
  inventoryItems: InventoryItem[];
  deployedModules: DeployedModules;
  onUserSelect: (user: User) => void;
  onModuleDeployment: (module: string) => void;
  onGameUpdate: (game: Game) => void;
  onDataRefresh: () => void;
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

export default function GameOverview({
  game,
  users,
  inventoryItems,
  deployedModules,
  onUserSelect,
  onModuleDeployment,
  onGameUpdate,
  onDataRefresh,
  setInventoryItems,
}: GameOverviewProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const modules = [
    {
      id: "metadata",
      name: "Game Metadata",
      description:
        "Store and manage game information, social links, and settings on-chain",
      icon: "📝",
      features: [
        "Game name & description",
        "Cover image & links",
        "Social media integration",
        "Admin management",
      ],
      deployed: deployedModules.GameInfoFacet,
      contractAddress: deployedModules.GameInfoFacet
        ? game.contractAddress
        : undefined,
    },
    {
      id: "passport",
      name: "Passport System",
      description:
        "Create universal player identities with customizable attributes and achievements",
      icon: "🎫",
      features: [
        "Player identity NFTs",
        "Global attributes",
        "Cross-game compatibility",
        "Achievement tracking",
      ],
      deployed: deployedModules.PassportFacet,
      contractAddress: game.passportContract,
    },
    {
      id: "inventory",
      name: "Inventory Module",
      description: "Manage in-game items, weapons, and collectibles as NFTs",
      icon: "🎒",
      features: [
        "Item creation & minting",
        "Batch operations",
        "Cross-game items",
        "Marketplace ready",
      ],
      deployed: deployedModules.InventoryFacet,
      contractAddress: game.inventoryContract,
    },
  ];

  return (
    <div>
      {/* Module Cards */}
      <div className="mb-3">
        <h2>Game Modules</h2>
        <p className="text-secondary mb-3">
          Deploy modules to add functionality to your game. Click on deployed
          modules to configure them.
        </p>
      </div>

      <div className="grid grid-1">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            game={game}
            users={users}
            inventoryItems={inventoryItems}
            isExpanded={expandedModule === module.id}
            onToggle={() => toggleModule(module.id)}
            onDeploy={() => onModuleDeployment(module.id)}
            onGameUpdate={onGameUpdate}
            onUserSelect={onUserSelect}
            onDataRefresh={onDataRefresh}
            setInventoryItems={setInventoryItems}
          />
        ))}
      </div>

      {/* Deployment Information */}
      <div className="card mt-3">
        <h3>Deployment Information</h3>
        <div className="grid grid-2">
          <div>
            <h4>What happens when you deploy a module?</h4>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>Smart contract deployed to Core Network</li>
              <li>Module linked to your game contract</li>
              <li>Admin permissions configured</li>
              <li>Ready for immediate use</li>
            </ul>
          </div>
          <div>
            <h4>Deployment Costs</h4>
            <table className="table">
              <tbody>
                <tr>
                  <td>Game Metadata</td>
                  <td>~0.3 CORE</td>
                </tr>
                <tr>
                  <td>Passport System</td>
                  <td>~0.5 CORE</td>
                </tr>
                <tr>
                  <td>Inventory Module</td>
                  <td>~0.8 CORE</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>~1.6 CORE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
