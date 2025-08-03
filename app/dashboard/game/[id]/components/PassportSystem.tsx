"use client"

import type React from "react"
import { useState } from "react"
import type { Game, User, DeployedModules } from "../types"

interface PassportSystemProps {
  game: Game
  users: User[]
  deployedModules: DeployedModules
  onUserSelect: (user: User) => void
  onDataRefresh: () => void
}

export default function PassportSystem({
  game,
  users,
  deployedModules,
  onUserSelect,
  onDataRefresh,
}: PassportSystemProps) {
  const [globalAttributes, setGlobalAttributes] = useState({ keys: [""], values: [""] })
  const [userAttributes, setUserAttributes] = useState({ tokenId: "", keys: [""], values: [""] })
  const [mintPassportWallet, setMintPassportWallet] = useState("")

  const handleSetGlobalAttributes = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const keys = globalAttributes.keys.filter((k) => k.trim() !== "")
      const values = globalAttributes.values.filter((v) => v.trim() !== "")

      console.log(`Calling UserPassports.setAttributes([${keys.join(", ")}], [${values.join(", ")}])`)
      alert(`Global attributes set: ${keys.join(", ")}`)

      setGlobalAttributes({ keys: [""], values: [""] })
    } catch (error) {
      console.error("Failed to set global attributes:", error)
    }
  }

  const handleRemoveGlobalAttribute = async (key: string) => {
    try {
      console.log(`Calling UserPassports.removeAttribute("${key}")`)
      alert(`Attribute "${key}" removed from all passports`)
    } catch (error) {
      console.error("Failed to remove attribute:", error)
    }
  }

  const handleSetUserAttributes = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const keys = userAttributes.keys.filter((k) => k.trim() !== "")
      const values = userAttributes.values.filter((v) => v.trim() !== "")

      console.log(
        `Calling UserPassports.setUserAttributes(${userAttributes.tokenId}, [${keys.join(", ")}], [${values.join(", ")}])`,
      )
      alert(`User attributes updated for passport ${userAttributes.tokenId}`)

      setUserAttributes({ tokenId: "", keys: [""], values: [""] })
      onDataRefresh()
    } catch (error) {
      console.error("Failed to set user attributes:", error)
    }
  }

  const handleMintPassport = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(`Calling UserPassports.mint() for wallet ${mintPassportWallet}`)
      alert(`Passport minted for ${mintPassportWallet}`)

      setMintPassportWallet("")
      onDataRefresh()
    } catch (error) {
      console.error("Failed to mint passport:", error)
    }
  }

  const addGlobalAttributeField = () => {
    setGlobalAttributes((prev) => ({
      keys: [...prev.keys, ""],
      values: [...prev.values, ""],
    }))
  }

  const addUserAttributeField = () => {
    setUserAttributes((prev) => ({
      ...prev,
      keys: [...prev.keys, ""],
      values: [...prev.values, ""],
    }))
  }

  if (!deployedModules.passport) {
    return (
      <div className="text-center" style={{ padding: "4rem" }}>
        <h3>Passport System Not Deployed</h3>
        <p className="text-secondary mb-3">
          Deploy the Passport module from the Modules tab to start managing player identities and attributes.
        </p>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎫</div>
        <p className="text-secondary">
          The Passport system allows you to create universal player identities with customizable attributes that work
          across all your games.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-2">
      <div>
        <div className="card">
          <h3>Set Global Attributes</h3>
          <form onSubmit={handleSetGlobalAttributes}>
            {globalAttributes.keys.map((key, index) => (
              <div key={index} className="form-group">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newKeys = [...globalAttributes.keys]
                      newKeys[index] = e.target.value
                      setGlobalAttributes((prev) => ({ ...prev, keys: newKeys }))
                    }}
                    className="form-input"
                    placeholder="Attribute key (e.g., hp)"
                  />
                  <input
                    type="text"
                    value={globalAttributes.values[index] || ""}
                    onChange={(e) => {
                      const newValues = [...globalAttributes.values]
                      newValues[index] = e.target.value
                      setGlobalAttributes((prev) => ({ ...prev, values: newValues }))
                    }}
                    className="form-input"
                    placeholder="Default value (e.g., 100)"
                  />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" onClick={addGlobalAttributeField} className="btn btn-secondary">
                + Add Attribute
              </button>
              <button type="submit" className="btn btn-primary">
                Set Global Attributes
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h3>Mint Passport</h3>
          <form onSubmit={handleMintPassport}>
            <div className="form-group">
              <label className="form-label">Wallet Address</label>
              <input
                type="text"
                value={mintPassportWallet}
                onChange={(e) => setMintPassportWallet(e.target.value)}
                className="form-input"
                placeholder="0x..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Mint Passport
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Set User Attributes</h3>
          <form onSubmit={handleSetUserAttributes}>
            <div className="form-group">
              <label className="form-label">Passport Token ID</label>
              <select
                value={userAttributes.tokenId}
                onChange={(e) => setUserAttributes((prev) => ({ ...prev, tokenId: e.target.value }))}
                className="form-select"
                required
              >
                <option value="">Select passport</option>
                {users.map((user) => (
                  <option key={user.passportId} value={user.passportId}>
                    ID {user.passportId} - {user.wallet.slice(0, 8)}...{user.wallet.slice(-6)}
                  </option>
                ))}
              </select>
            </div>
            {userAttributes.keys.map((key, index) => (
              <div key={index} className="form-group">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newKeys = [...userAttributes.keys]
                      newKeys[index] = e.target.value
                      setUserAttributes((prev) => ({ ...prev, keys: newKeys }))
                    }}
                    className="form-input"
                    placeholder="Attribute key"
                  />
                  <input
                    type="text"
                    value={userAttributes.values[index] || ""}
                    onChange={(e) => {
                      const newValues = [...userAttributes.values]
                      newValues[index] = e.target.value
                      setUserAttributes((prev) => ({ ...prev, values: newValues }))
                    }}
                    className="form-input"
                    placeholder="Value"
                  />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" onClick={addUserAttributeField} className="btn btn-secondary">
                + Add Attribute
              </button>
              <button type="submit" className="btn btn-primary">
                Update User Attributes
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <h3>All Users & Passports</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Passport ID</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.wallet}>
                <td>
                  {user.wallet.slice(0, 8)}...{user.wallet.slice(-6)}
                </td>
                <td>{user.passportId}</td>
                <td>{user.attributes.level || "N/A"}</td>
                <td>
                  <button
                    onClick={() => onUserSelect(user)}
                    className="btn btn-secondary"
                    style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3">
          <h4>Global Attribute Management</h4>
          <p className="text-secondary mb-2">Remove global attributes from all passports:</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["hp", "mana", "level", "xp", "class"].map((attr) => (
              <button
                key={attr}
                onClick={() => handleRemoveGlobalAttribute(attr)}
                className="btn btn-secondary"
                style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
              >
                Remove "{attr}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
