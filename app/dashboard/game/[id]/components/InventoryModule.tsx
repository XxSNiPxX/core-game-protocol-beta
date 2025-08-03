"use client"

import type React from "react"
import { useState } from "react"
import type { Game, InventoryItem, User, DeployedModules } from "../types"

interface InventoryModuleProps {
  game: Game
  inventoryItems: InventoryItem[]
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>
  users: User[]
  selectedUser: User | null
  deployedModules: DeployedModules
  onDataRefresh: () => void
}

export default function InventoryModule({
  game,
  inventoryItems,
  setInventoryItems,
  users,
  selectedUser,
  deployedModules,
  onDataRefresh,
}: InventoryModuleProps) {
  const [newItem, setNewItem] = useState({ tokenId: "", name: "", attribute: "" })
  const [mintItemData, setMintItemData] = useState({
    to: "",
    tokenId: "",
    amount: 1,
  })
  const [batchMintData, setBatchMintData] = useState({
    to: "",
    tokenIds: [""],
    amounts: [1],
  })

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(`Calling InventoryModule.addItem(${newItem.tokenId}, "${newItem.attribute}")`)
      alert(`Item "${newItem.name}" added successfully!`)

      setInventoryItems((prev) => [
        ...prev,
        {
          ...newItem,
          uri: `https://example.com/${newItem.name.toLowerCase().replace(/\s+/g, "")}.json`,
        },
      ])
      setNewItem({ tokenId: "", name: "", attribute: "" })
    } catch (error) {
      console.error("Failed to add item:", error)
    }
  }

  const handleRemoveItem = async (tokenId: string) => {
    try {
      console.log(`Calling InventoryModule.removeItem(${tokenId})`)
      alert(`Item ${tokenId} removed successfully!`)

      setInventoryItems((prev) => prev.filter((item) => item.tokenId !== tokenId))
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  const handleMintItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(
        `Calling InventoryModule.mintItem("${mintItemData.to}", ${mintItemData.tokenId}, ${mintItemData.amount})`,
      )
      alert(`Minted ${mintItemData.amount} of token ${mintItemData.tokenId} to ${mintItemData.to}`)

      setMintItemData({ to: "", tokenId: "", amount: 1 })
      onDataRefresh()
    } catch (error) {
      console.error("Failed to mint item:", error)
    }
  }

  const handleBatchMintItems = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tokenIds = batchMintData.tokenIds.filter((id) => id.trim() !== "")
      const amounts = batchMintData.amounts.filter((amount) => amount > 0)

      console.log(
        `Calling InventoryModule.mintBatchItems("${batchMintData.to}", [${tokenIds.join(", ")}], [${amounts.join(", ")}])`,
      )
      alert(`Batch minted items to ${batchMintData.to}`)

      setBatchMintData({ to: "", tokenIds: [""], amounts: [1] })
      onDataRefresh()
    } catch (error) {
      console.error("Failed to batch mint items:", error)
    }
  }

  const addBatchMintField = () => {
    setBatchMintData((prev) => ({
      ...prev,
      tokenIds: [...prev.tokenIds, ""],
      amounts: [...prev.amounts, 1],
    }))
  }

  if (!deployedModules.inventory) {
    return (
      <div className="text-center" style={{ padding: "4rem" }}>
        <h3>Inventory Module Not Deployed</h3>
        <p className="text-secondary mb-3">
          Deploy the Inventory module from the Modules tab to start managing in-game items and NFTs.
        </p>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎒</div>
        <p className="text-secondary">
          The Inventory system allows you to create, mint, and manage in-game items as NFTs that can be traded and used
          across games.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-2">
      <div>
        <div className="card">
          <h3>Add New Item Type</h3>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label className="form-label">Token ID</label>
              <input
                type="text"
                value={newItem.tokenId}
                onChange={(e) => setNewItem((prev) => ({ ...prev, tokenId: e.target.value }))}
                className="form-input"
                placeholder="e.g., 5"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                className="form-input"
                placeholder="e.g., Magic Potion"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Attribute/Category</label>
              <select
                value={newItem.attribute}
                onChange={(e) => setNewItem((prev) => ({ ...prev, attribute: e.target.value }))}
                className="form-select"
                required
              >
                <option value="">Select category</option>
                <option value="weapon">Weapon</option>
                <option value="armor">Armor</option>
                <option value="consumable">Consumable</option>
                <option value="accessory">Accessory</option>
                <option value="material">Material</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Item Type
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Mint Single Item</h3>
          <form onSubmit={handleMintItem}>
            <div className="form-group">
              <label className="form-label">Recipient Address</label>
              <input
                type="text"
                value={mintItemData.to}
                onChange={(e) => setMintItemData((prev) => ({ ...prev, to: e.target.value }))}
                className="form-input"
                placeholder="0x..."
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Item</label>
              <select
                value={mintItemData.tokenId}
                onChange={(e) => setMintItemData((prev) => ({ ...prev, tokenId: e.target.value }))}
                className="form-select"
                required
              >
                <option value="">Select item</option>
                {inventoryItems.map((item) => (
                  <option key={item.tokenId} value={item.tokenId}>
                    {item.name} (ID: {item.tokenId})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                min="1"
                value={mintItemData.amount}
                onChange={(e) => setMintItemData((prev) => ({ ...prev, amount: Number.parseInt(e.target.value) }))}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Mint Item
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Batch Mint Items</h3>
          <form onSubmit={handleBatchMintItems}>
            <div className="form-group">
              <label className="form-label">Recipient Address</label>
              <input
                type="text"
                value={batchMintData.to}
                onChange={(e) => setBatchMintData((prev) => ({ ...prev, to: e.target.value }))}
                className="form-input"
                placeholder="0x..."
                required
              />
            </div>
            {batchMintData.tokenIds.map((tokenId, index) => (
              <div key={index} className="form-group">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    value={tokenId}
                    onChange={(e) => {
                      const newTokenIds = [...batchMintData.tokenIds]
                      newTokenIds[index] = e.target.value
                      setBatchMintData((prev) => ({ ...prev, tokenIds: newTokenIds }))
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">Select item</option>
                    {inventoryItems.map((item) => (
                      <option key={item.tokenId} value={item.tokenId}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={batchMintData.amounts[index] || 1}
                    onChange={(e) => {
                      const newAmounts = [...batchMintData.amounts]
                      newAmounts[index] = Number.parseInt(e.target.value)
                      setBatchMintData((prev) => ({ ...prev, amounts: newAmounts }))
                    }}
                    className="form-input"
                    placeholder="Amount"
                    style={{ width: "100px" }}
                    required
                  />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" onClick={addBatchMintField} className="btn btn-secondary">
                + Add Item
              </button>
              <button type="submit" className="btn btn-primary">
                Batch Mint Items
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <div className="card">
          <h3>All Item Types</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.tokenId}>
                  <td>{item.tokenId}</td>
                  <td>{item.name}</td>
                  <td>{item.attribute}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(item.tokenId)}
                      className="btn btn-secondary"
                      style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>User Inventory</h3>
          {selectedUser ? (
            <div>
              <h4>
                {selectedUser.wallet.slice(0, 8)}...{selectedUser.wallet.slice(-6)}
              </h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.inventory.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-secondary">Select a user from the Passport System tab to view their inventory</p>
          )}
        </div>
      </div>
    </div>
  )
}
