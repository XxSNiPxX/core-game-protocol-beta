"use client"

import type { Game, DeployedModules } from "../types"

interface GameModulesProps {
  game: Game
  deployedModules: DeployedModules
  onModuleDeployment: (module: string) => void
}

export default function GameModules({ game, deployedModules, onModuleDeployment }: GameModulesProps) {
  const modules = [
    {
      id: "metadata",
      name: "Game Metadata",
      description: "Store and manage game information, social links, and settings on-chain",
      icon: "📝",
      features: ["Game name & description", "Cover image & links", "Social media integration", "Admin management"],
      deployed: deployedModules.metadata,
      alwaysDeployed: true, // Metadata is deployed with the game
    },
    {
      id: "passport",
      name: "Passport System",
      description: "Create universal player identities with customizable attributes and achievements",
      icon: "🎫",
      features: ["Player identity NFTs", "Global attributes", "Cross-game compatibility", "Achievement tracking"],
      deployed: deployedModules.passport,
      contractAddress: game.passportContract,
    },
    {
      id: "inventory",
      name: "Inventory Module",
      description: "Manage in-game items, weapons, and collectibles as NFTs",
      icon: "🎒",
      features: ["Item creation & minting", "Batch operations", "Cross-game items", "Marketplace ready"],
      deployed: deployedModules.inventory,
      contractAddress: game.inventoryContract,
    },
  ]

  return (
    <div>
      <div className="mb-3">
        <h2>Add Modules to Your Game</h2>
        <p className="text-secondary">
          Deploy additional functionality to enhance your game. Each module is a separate smart contract that extends
          your game's capabilities.
        </p>
      </div>

      <div className="grid grid-2">
        {modules.map((module) => (
          <div key={module.id} className="card">
            <div className="card-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{module.icon}</span>
                <div>
                  <h3 className="card-title">{module.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      className={`text-${module.deployed ? "success" : "warning"}`}
                      style={{ fontSize: "0.875rem" }}
                    >
                      {module.deployed ? "✅ Deployed" : "⏳ Not Deployed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-secondary mb-3">{module.description}</p>

            <div className="mb-3">
              <h4 style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>Features:</h4>
              <ul style={{ fontSize: "0.875rem", paddingLeft: "1.5rem", margin: 0 }}>
                {module.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {module.contractAddress && (
              <div className="mb-3">
                <strong style={{ fontSize: "0.875rem" }}>Contract:</strong>
                <code
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    background: "var(--bg-primary)",
                    padding: "0.25rem",
                    borderRadius: "4px",
                    marginTop: "0.25rem",
                  }}
                >
                  {module.contractAddress}
                </code>
              </div>
            )}

            <div style={{ marginTop: "auto" }}>
              {module.alwaysDeployed ? (
                <div className="btn btn-secondary" style={{ width: "100%", cursor: "default", opacity: 0.7 }}>
                  Always Available
                </div>
              ) : module.deployed ? (
                <div className="btn btn-success" style={{ width: "100%", cursor: "default" }}>
                  ✅ Deployed & Active
                </div>
              ) : (
                <button
                  onClick={() => onModuleDeployment(module.id)}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  Deploy Module
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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
                  <td>Passport System</td>
                  <td>~0.5 CORE</td>
                </tr>
                <tr>
                  <td>Inventory Module</td>
                  <td>~0.8 CORE</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>~1.3 CORE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
