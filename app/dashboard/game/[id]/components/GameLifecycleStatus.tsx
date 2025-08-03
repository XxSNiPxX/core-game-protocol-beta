"use client";

import type { Game, GameLifecycleStatus, DeployedModules } from "../types";
import { GameState } from "../types";

interface GameLifecycleStatusProps {
  game: Game;
  deployedModules: DeployedModules;
  onModuleDeployment: (module: string) => void;
  onGameDataFacetDeploy: () => void;
  deploymentStep: number;
  setDeploymentStep: (step: number) => void;
}

export default function GameLifecycleComponent({
  game,
  deployedModules,
  onModuleDeployment,
  onGameDataFacetDeploy,
  deploymentStep, // ✅ Add this
  setDeploymentStep, // ✅ And this
}: GameLifecycleStatusProps) {
  const getLifecycleStatus = (): GameLifecycleStatus => {
    const hasMetadata = deployedModules.GameInfoFacet;
    const hasPassport = deployedModules.PassportFacet;
    const hasInventory = deployedModules.InventoryFacet;
    const hasGameDataFacet = deployedModules.GameDataFacetv1;
    console.log(deploymentStep, "deploymentStep");
    let state: GameState;
    let canProgress = false;
    let nextStep = "";

    if (!hasMetadata && !hasPassport && !hasInventory) {
      state = GameState.BARE;
      canProgress = true;
      nextStep = "Deploy core modules to configure your game";
    } else if (
      (hasMetadata || hasPassport || hasInventory) &&
      !hasGameDataFacet
    ) {
      state = GameState.CONFIGURED;
      canProgress = hasMetadata && hasPassport && hasInventory;
      nextStep = canProgress
        ? "Deploy GameDataFacet to activate full dashboard"
        : "Complete module deployment first";
    } else {
      state = GameState.ACTIVE;
      canProgress = false;
      nextStep = "Game is fully active";
    }

    return {
      state,
      hasMetadata,
      hasPassport,
      hasInventory,
      hasGameDataFacet,
      canProgress,
      nextStep,
    };
  };

  const status = getLifecycleStatus();

  const getStatusColor = (state: GameState) => {
    switch (state) {
      case GameState.BARE:
        return "error";
      case GameState.CONFIGURED:
        return "warning";
      case GameState.ACTIVE:
        return "success";
      default:
        return "error";
    }
  };

  const getStatusIcon = (state: GameState) => {
    switch (state) {
      case GameState.BARE:
        return "🕳";
      case GameState.CONFIGURED:
        return "⚙️";
      case GameState.ACTIVE:
        return "📊";
      default:
        return "❓";
    }
  };

  const getStatusText = (state: GameState) => {
    switch (state) {
      case GameState.BARE:
        return "Uninitialized";
      case GameState.CONFIGURED:
        return "Configured";
      case GameState.ACTIVE:
        return "Active";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className="card"
      style={{
        marginBottom: "2rem",
        border: `2px solid var(--${getStatusColor(status.state) === "error" ? "error" : getStatusColor(status.state) === "warning" ? "warning" : "success"})`,
      }}
    >
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "2rem" }}>
            {getStatusIcon(status.state)}
          </span>
          <div>
            <h2 className="card-title">
              {status.state === GameState.ACTIVE && game.name
                ? game.name
                : `Game ${game.contractAddress.slice(0, 8)}...${game.contractAddress.slice(-6)}`}
            </h2>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span className={`text-${getStatusColor(status.state)}`}>
                {status.state === GameState.BARE && "🟥"}
                {status.state === GameState.CONFIGURED && "🟨"}
                {status.state === GameState.ACTIVE && "🟢"} Status:{" "}
                {getStatusText(status.state)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bare Game State */}
      {status.state === GameState.BARE && (
        <div>
          <div
            className="mb-3"
            style={{
              padding: "1rem",
              background: "var(--accent-orange-light)",
              borderRadius: "8px",
              border: "1px solid var(--error)",
            }}
          >
            <h4>🕳 Bare Game / Stub</h4>
            <p className="text-secondary">
              Deployed from factory, just a diamond with no facets yet (or only
              the facet registry). No metadata, passport, or inventory module
              set. Add modules to begin setup.
            </p>
          </div>

          <div className="grid grid-3">
            <button
              onClick={() => onModuleDeployment("GameInfoFacet")}
              className="btn btn-primary"
              style={{ padding: "1rem", height: "auto" }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  📝
                </div>
                <div>Add Metadata Module</div>
                <small className="text-secondary">Game info & settings</small>
              </div>
            </button>

            <button
              onClick={() => onModuleDeployment("PassportFacet")}
              className="btn btn-primary"
              style={{ padding: "1rem", height: "auto" }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  🎫
                </div>
                <div>Add Passport Module</div>
                <small className="text-secondary">Player identities</small>
              </div>
            </button>

            <button
              onClick={() => onModuleDeployment("InventoryFacet")}
              className="btn btn-primary"
              style={{ padding: "1rem", height: "auto" }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  🎒
                </div>
                <div>Add Inventory Module</div>
                <small className="text-secondary">Items & NFTs</small>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Configured Game State */}
      {status.state === GameState.CONFIGURED && (
        <div>
          <div
            className="mb-3"
            style={{
              padding: "1rem",
              background: "var(--accent-orange-light)",
              borderRadius: "8px",
              border: "1px solid var(--warning)",
            }}
          >
            <h4>⚙️ Configured Game (No Data Facet Yet)</h4>
            <p className="text-secondary">
              Metadata, Passport, Inventory are deployed — game is configured,
              but GameDataFacet is not yet deployed, so no snapshot available.
            </p>
          </div>

          <div className="grid grid-2 mb-3">
            <div>
              <h4>Module Status</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {status.hasMetadata ? "✅" : "❌"} Metadata:{" "}
                  {status.hasMetadata ? "Present" : "Missing"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {status.hasInventory ? "✅" : "❌"} Inventory:{" "}
                  {status.hasInventory ? "Present" : "Missing"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {status.hasPassport ? "✅" : "❌"} Passport:{" "}
                  {status.hasPassport ? "Present" : "Missing"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  🟥 Snapshot (GameDataFacet): Missing
                </div>
              </div>
            </div>

            <div>
              <h4>Next Steps</h4>
              {!status.canProgress ? (
                <div>
                  <p className="text-warning mb-2">
                    Complete missing modules first:
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {!status.hasMetadata && (
                      <button
                        onClick={() => onModuleDeployment("GameInfoFacet")}
                        className="btn btn-primary"
                      >
                        Deploy Metadata Module
                      </button>
                    )}
                    {!status.hasPassport && (
                      <button
                        onClick={() => onModuleDeployment("PassportFacet")}
                        className="btn btn-primary"
                      >
                        Deploy Passport Module
                      </button>
                    )}
                    {!status.hasInventory && (
                      <button
                        onClick={() => onModuleDeployment("InventoryFacet")}
                        className="btn btn-primary"
                      >
                        Deploy Inventory Module
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-success mb-2">Ready to activate!</p>
                  <p className="text-secondary mb-3">
                    Deploy GameDataFacet to unlock full dashboard view of your
                    game.
                  </p>
                  <button
                    onClick={onGameDataFacetDeploy}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "1rem" }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}
                      >
                        📊
                      </div>
                      <div>Deploy GameDataFacet</div>
                      <small>Activate full dashboard</small>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Game State */}
      {status.state === GameState.ACTIVE && (
        <div>
          <div
            className="mb-3"
            style={{
              padding: "1rem",
              background: "rgba(0, 255, 136, 0.1)",
              borderRadius: "8px",
              border: "1px solid var(--success)",
            }}
          >
            <h4>📊 Active Game (Fully Initialized)</h4>
            <p className="text-secondary">
              Game has all core modules + GameDataFacet installed. Full
              dashboard and analytics available.
            </p>
          </div>

          <div className="grid grid-2">
            <div>
              <h4>Game Information</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <strong>Name:</strong> {game.name || "Not set"}
                </div>
                <div>
                  <strong>Genre:</strong> {game.genre || "Not set"}
                </div>
                <div>
                  <strong>Description:</strong> {game.description || "Not set"}
                </div>
                {game.coverImageUrl && (
                  <div>
                    <strong>Cover Image:</strong>
                    <img
                      src={game.coverImageUrl || "/placeholder.svg"}
                      alt="Game cover"
                      style={{
                        width: "100px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginLeft: "0.5rem",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4>Module Status</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  ✅ Modules: All present
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  ✅ GameDataFacet: Present
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  🟢 Status: Active
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  ✅ Dashboard: Available
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div
        className="mt-3"
        style={{
          padding: "1rem",
          background: "var(--bg-tertiary)",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span>Game Progress</span>
          <span className="text-secondary">
            {status.state === GameState.BARE && "Step 1 of 3"}
            {status.state === GameState.CONFIGURED && "Step 2 of 3"}
            {status.state === GameState.ACTIVE && "Complete"}
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: "8px",
            background: "var(--border-color)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width:
                status.state === GameState.BARE
                  ? "33%"
                  : status.state === GameState.CONFIGURED
                    ? "66%"
                    : "100%",
              height: "100%",
              background:
                status.state === GameState.ACTIVE
                  ? "var(--success)"
                  : "var(--accent-orange)",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div className="text-secondary mt-1" style={{ fontSize: "0.875rem" }}>
          {status.nextStep}
        </div>
        {deploymentStep > 0 && (
          <div className="deployment-popup-overlay">
            <div className="deployment-popup">
              <h3>🚀 Deployment in Progress</h3>
              <p>
                {deploymentStep === 1 &&
                  "Step 1 of 2: Deploying facet contract..."}
                {deploymentStep === 2 &&
                  "Step 2 of 2: Adding facet to diamond..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
