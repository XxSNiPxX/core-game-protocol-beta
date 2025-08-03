"use client"

import { useState } from "react"
import DashboardLayout from "../layout-dashboard"

export default function SDKToolsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("typescript")
  const [apiKey] = useState("cgp_live_1234567890abcdef1234567890abcdef")
  const [privateKey] = useState("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12")

  const codeSnippets = {
    typescript: {
      install: `npm install @coregameprotocol/sdk ethers`,
      init: `import { CoreGameSDK } from '@coregameprotocol/sdk';
import { ethers } from 'ethers';

// Initialize with private key for server-side operations
const provider = new ethers.JsonRpcProvider('https://rpc.coredao.org');
const wallet = new ethers.Wallet('${privateKey}', provider);

const sdk = new CoreGameSDK({
  apiKey: '${apiKey}',
  signer: wallet,
  network: 'mainnet' // or 'testnet'
});`,
      gameOperations: `// Create a new game
const newGame = await sdk.factory.createCoreGame({
  name: "My Awesome Game",
  description: "An epic adventure game",
  genre: "RPG",
  publicKeys: ["0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1"]
});

// Get games by developer
const myGames = await sdk.factory.getGamesByDeveloper(wallet.address);

// Update game metadata
await sdk.game.setGameName(gameId, "Updated Game Name");
await sdk.game.setDescription(gameId, "New description");
await sdk.game.setCoverImageUrl(gameId, "https://example.com/cover.jpg");`,
      passportOperations: `// Create passport contract for game
await sdk.game.createUserPassportContract(gameId);

// Set global attributes for all passports
await sdk.passport.setAttributes(gameId, 
  ["hp", "mana", "level"], 
  ["100", "50", "1"]
);

// Mint passport for user
const passport = await sdk.passport.mint(gameId, userWallet);

// Set user-specific attributes
await sdk.passport.setUserAttributes(gameId, passportId, 
  ["xp", "class"], 
  ["1500", "mage"]
);

// Get passport data
const passportData = await sdk.passport.getPassportData(gameId, passportId);`,
      inventoryOperations: `// Add new item type
await sdk.inventory.addItem(gameId, "1", "weapon");

// Mint single item
await sdk.inventory.mintItem(gameId, {
  to: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
  tokenId: "1",
  amount: 1
});

// Batch mint items
await sdk.inventory.mintBatchItems(gameId, {
  to: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
  tokenIds: ["1", "2", "3"],
  amounts: [1, 2, 5]
});

// Get user inventory
const inventory = await sdk.inventory.getUserInventory(gameId, userWallet);`,
      tokenOperations: `// Create custom token
await sdk.game.createCustomToken(gameId, {
  name: "Game Token",
  symbol: "GT",
  initialSupply: 1000000
});

// Switch to native CORE token
await sdk.game.useNativeToken(gameId);

// Get token info
const tokenInfo = await sdk.game.getTokenInfo(gameId);`,
    },
    python: {
      install: `pip install coregameprotocol-sdk web3`,
      init: `from coregameprotocol import CoreGameSDK
from web3 import Web3

# Initialize with private key for server-side operations
w3 = Web3(Web3.HTTPProvider('https://rpc.coredao.org'))
account = w3.eth.account.from_key('${privateKey}')

sdk = CoreGameSDK(
    api_key='${apiKey}',
    private_key='${privateKey}',
    network='mainnet'  # or 'testnet'
)`,
      gameOperations: `# Create a new game
new_game = sdk.factory.create_core_game(
    name="My Awesome Game",
    description="An epic adventure game",
    genre="RPG",
    public_keys=["0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1"]
)

# Get games by developer
my_games = sdk.factory.get_games_by_developer(account.address)

# Update game metadata
sdk.game.set_game_name(game_id, "Updated Game Name")
sdk.game.set_description(game_id, "New description")
sdk.game.set_cover_image_url(game_id, "https://example.com/cover.jpg")`,
      passportOperations: `# Create passport contract for game
sdk.game.create_user_passport_contract(game_id)

# Set global attributes for all passports
sdk.passport.set_attributes(game_id, 
    ["hp", "mana", "level"], 
    ["100", "50", "1"]
)

# Mint passport for user
passport = sdk.passport.mint(game_id, user_wallet)

# Set user-specific attributes
sdk.passport.set_user_attributes(game_id, passport_id, 
    ["xp", "class"], 
    ["1500", "mage"]
)

# Get passport data
passport_data = sdk.passport.get_passport_data(game_id, passport_id)`,
      inventoryOperations: `# Add new item type
sdk.inventory.add_item(game_id, "1", "weapon")

# Mint single item
sdk.inventory.mint_item(game_id, 
    to="0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
    token_id="1",
    amount=1
)

# Batch mint items
sdk.inventory.mint_batch_items(game_id,
    to="0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
    token_ids=["1", "2", "3"],
    amounts=[1, 2, 5]
)

# Get user inventory
inventory = sdk.inventory.get_user_inventory(game_id, user_wallet)`,
      tokenOperations: `# Create custom token
sdk.game.create_custom_token(game_id,
    name="Game Token",
    symbol="GT",
    initial_supply=1000000
)

# Switch to native CORE token
sdk.game.use_native_token(game_id)

# Get token info
token_info = sdk.game.get_token_info(game_id)`,
    },
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <DashboardLayout>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Developer Tools & SDK</h1>
          <p className="text-secondary">Complete SDK documentation and API reference</p>
        </div>

        <div className="grid grid-2 mb-3">
          <div className="card">
            <h3>API Configuration</h3>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="text" value={apiKey} className="form-input" readOnly />
                <button onClick={() => copyToClipboard(apiKey)} className="btn btn-secondary">
                  Copy
                </button>
              </div>
              <small className="text-secondary">Keep your API key secure and never expose it in client-side code</small>
            </div>

            <div className="form-group">
              <label className="form-label">Private Key (Server-side only)</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="password" value={privateKey} className="form-input" readOnly />
                <button onClick={() => copyToClipboard(privateKey)} className="btn btn-secondary">
                  Copy
                </button>
              </div>
              <small className="text-warning">
                ⚠️ Never expose private keys in client-side code or public repositories
              </small>
            </div>
          </div>

          <div className="card">
            <h3>Network Information</h3>
            <div className="mt-2">
              <p>
                <strong>Network:</strong> Core Mainnet
              </p>
              <p>
                <strong>Chain ID:</strong> 1116
              </p>
              <p>
                <strong>RPC URL:</strong> https://rpc.coredao.org
              </p>
              <p>
                <strong>Explorer:</strong> https://scan.coredao.org
              </p>
              <p>
                <strong>Gas Price:</strong> ~1 gwei
              </p>
              <p>
                <strong>Block Time:</strong> ~3 seconds
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>SDK Documentation</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setSelectedLanguage("typescript")}
                className={`btn ${selectedLanguage === "typescript" ? "btn-primary" : "btn-secondary"}`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setSelectedLanguage("python")}
                className={`btn ${selectedLanguage === "python" ? "btn-primary" : "btn-secondary"}`}
              >
                Python
              </button>
            </div>
          </div>

          <div>
            <h4>Installation</h4>
            <div
              style={{
                background: "var(--bg-primary)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <code>{codeSnippets[selectedLanguage as keyof typeof codeSnippets].install}</code>
              <button
                onClick={() => copyToClipboard(codeSnippets[selectedLanguage as keyof typeof codeSnippets].install)}
                className="btn btn-secondary"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                Copy
              </button>
            </div>

            <h4>Initialize SDK</h4>
            <div
              style={{
                background: "var(--bg-primary)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <pre>
                <code>{codeSnippets[selectedLanguage as keyof typeof codeSnippets].init}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(codeSnippets[selectedLanguage as keyof typeof codeSnippets].init)}
                className="btn btn-secondary"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                Copy
              </button>
            </div>

            <h4>Game Operations</h4>
            <div
              style={{
                background: "var(--bg-primary)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <pre>
                <code>{codeSnippets[selectedLanguage as keyof typeof codeSnippets].gameOperations}</code>
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(codeSnippets[selectedLanguage as keyof typeof codeSnippets].gameOperations)
                }
                className="btn btn-secondary"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                Copy
              </button>
            </div>

            <h4>Passport Operations</h4>
            <div
              style={{
                background: "var(--bg-primary)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <pre>
                <code>{codeSnippets[selectedLanguage as keyof typeof codeSnippets].passportOperations}</code>
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(codeSnippets[selectedLanguage as keyof typeof codeSnippets].passportOperations)
                }
                className="btn btn-secondary"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                Copy
              </button>
            </div>

            <h4>Inventory Operations</h4>
            <div
              style={{
                background: "var(--bg-primary)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <pre>
                <code>{codeSnippets[selectedLanguage as keyof typeof codeSnippets].inventoryOperations}</code>
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(codeSnippets[selectedLanguage as keyof typeof codeSnippets].inventoryOperations)
                }
                className="btn btn-secondary"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                Copy
              </button>
            </div>

            <h4>Token Operations</h4>
            <div
              style={{
                background: "var(--bg-primary)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <pre>
                <code>{codeSnippets[selectedLanguage as keyof typeof codeSnippets].tokenOperations}</code>
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(codeSnippets[selectedLanguage as keyof typeof codeSnippets].tokenOperations)
                }
                className="btn btn-secondary"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-2 mt-3">
          <div className="card">
            <h3>Rate Limits</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Read Operations</td>
                  <td>1000/minute</td>
                </tr>
                <tr>
                  <td>Write Operations</td>
                  <td>100/minute</td>
                </tr>
                <tr>
                  <td>Batch Operations</td>
                  <td>10/minute</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>Error Codes</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>401</td>
                  <td>Invalid API key</td>
                </tr>
                <tr>
                  <td>403</td>
                  <td>Insufficient permissions</td>
                </tr>
                <tr>
                  <td>429</td>
                  <td>Rate limit exceeded</td>
                </tr>
                <tr>
                  <td>500</td>
                  <td>Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
