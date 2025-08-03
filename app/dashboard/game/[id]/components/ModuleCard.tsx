"use client"

import type React from "react"

import { useState } from "react"
import GameMetadataManager from "./GameMetadataManager"
import PassportSystemManager from "./PassportSystemManager"
import InventoryModuleManager from "./InventoryModuleManager"
import type { Game, User, InventoryItem } from "../types"

interface Module {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
  deployed: boolean
  alwaysDeployed?: boolean
  contractAddress?: string
}

interface ModuleCardProps {
  module: Module
  game: Game
  users: User[]
  inventoryItems: InventoryItem[]
  isExpanded: boolean
  onToggle: () => void
  onDeploy: () => void
  onGameUpdate: (game: Game) => void
  onUserSelect: (user: User) => void
  onDataRefresh: () => void
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>
}

export default function ModuleCard({
  module,
  game,
  users,
  inventoryItems,
  isExpanded,
  onToggle,
  onDeploy,
  onGameUpdate,
  onUserSelect,
  onDataRefresh,
  setInventoryItems,
}: ModuleCardProps) {
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = async () => {
    setIsDeploying(true)
    await onDeploy()
    setIsDeploying(false)
  }

  const renderModuleManager = () => {
    if (!module.deployed) return null

    switch (module.id) {
      case "metadata":
        return <GameMetadataManager game={game} onGameUpdate={onGameUpdate} />
      case "passport":
        return (
          <PassportSystemManager game={game} users={users} onUserSelect={onUserSelect} onDataRefresh={onDataRefresh} />
        )
      case "inventory":
        return (
          <InventoryModuleManager
            game={game}
            inventoryItems={inventoryItems}
            setInventoryItems={setInventoryItems}
            users={users}
            onDataRefresh={onDataRefresh}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <div
        className="card-header"
        style={{ cursor: module.deployed ? "pointer" : "default" }}
        onClick={module.deployed ? onToggle : undefined}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
          <span style={{ fontSize: "2rem" }}>{module.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <h3 className="card-title">{module.name}</h3>
              <span className={`text-${module.deployed ? "success" : "warning"}`} style={{ fontSize: "0.875rem" }}>
                {module.deployed ? "✅ Deployed" : "⏳ Not Deployed"}
              </span>
              {module.deployed && (
                <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {isExpanded ? "▼ Click to collapse" : "▶ Click to manage"}
                </span>
              )}
            </div>
            <p className="text-secondary" style={{ margin: 0 }}>
              {module.description}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Features:</div>
              <ul style={{ fontSize: "0.75rem", margin: 0, paddingLeft: "1rem" }}>
                {module.features.slice(0, 2).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
                {module.features.length > 2 && <li>+{module.features.length - 2} more...</li>}
              </ul>
            </div>
            <div style={{ minWidth: "120px" }}>
              {module.deployed ? (
                <div className="btn btn-success" style={{ cursor: "default" }}>
                  ✅ Active
                </div>
              ) : (
                <button onClick={handleDeploy} className="btn btn-primary" disabled={isDeploying}>
                  {isDeploying ? <span className="loading"></span> : "Deploy Module"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {module.contractAddress && (
        <div style={{ padding: "0 1.5rem", marginBottom: "1rem" }}>
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

      {/* Expanded Management Interface */}
      {isExpanded && module.deployed && (
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            padding: "1.5rem",
            background: "var(--bg-primary)",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {renderModuleManager()}
        </div>
      )}
    </div>
  )
}
