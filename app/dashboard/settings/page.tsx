"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../layout-dashboard"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [walletAddress, setWalletAddress] = useState("")

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: "developer@example.com",
    name: "Game Developer",
    company: "Awesome Games Studio",
    notifications: {
      email: true,
      webhook: false,
      sms: false,
    },
  })

  // API settings
  const [apiSettings, setApiSettings] = useState({
    currentKey: "cgp_live_1234567890abcdef1234567890abcdef",
    webhookUrl: "https://yourgame.com/webhook",
    rateLimit: "standard",
    network: "mainnet",
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    ipWhitelist: ["192.168.1.1", "10.0.0.1"],
    sessionTimeout: 24,
  })

  // Usage stats
  const [usageStats] = useState({
    apiCalls: {
      thisMonth: 15420,
      limit: 100000,
    },
    gasUsed: {
      thisMonth: 12.45,
      limit: 100,
    },
    games: {
      active: 3,
      limit: 10,
    },
  })

  useEffect(() => {
    const address = localStorage.getItem("walletAddress")
    if (address) {
      setWalletAddress(address)
    }
  }, [])

  const handleAccountUpdate = () => {
    alert("Account settings updated successfully!")
  }

  const handleGenerateNewApiKey = () => {
    const newKey = `cgp_live_${Math.random().toString(36).substr(2, 32)}`
    setApiSettings((prev) => ({ ...prev, currentKey: newKey }))
    alert("New API key generated! Make sure to update your applications.")
  }

  const handleRevokeApiKey = () => {
    if (confirm("Are you sure you want to revoke this API key? This will break all applications using it.")) {
      alert("API key revoked successfully!")
    }
  }

  const handleEnable2FA = () => {
    setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
    alert(`Two-factor authentication ${securitySettings.twoFactorEnabled ? "disabled" : "enabled"}!`)
  }

  const addIpToWhitelist = () => {
    const ip = prompt("Enter IP address to whitelist:")
    if (ip) {
      setSecuritySettings((prev) => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, ip],
      }))
    }
  }

  const removeIpFromWhitelist = (ip: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter((item) => item !== ip),
    }))
  }

  return (
    <DashboardLayout>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Settings</h1>
          <p className="text-secondary">Manage your account, API keys, and security settings</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <ul className="tab-list">
            <li>
              <button
                className={`tab-button ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                Account
              </button>
            </li>
            <li>
              <button
                className={`tab-button ${activeTab === "api" ? "active" : ""}`}
                onClick={() => setActiveTab("api")}
              >
                API & Keys
              </button>
            </li>
            <li>
              <button
                className={`tab-button ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
            </li>
            <li>
              <button
                className={`tab-button ${activeTab === "billing" ? "active" : ""}`}
                onClick={() => setActiveTab("billing")}
              >
                Usage & Billing
              </button>
            </li>
            <li>
              <button
                className={`tab-button ${activeTab === "preferences" ? "active" : ""}`}
                onClick={() => setActiveTab("preferences")}
              >
                Preferences
              </button>
            </li>
          </ul>
        </div>

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="grid grid-2">
            <div className="card">
              <h3>Profile Information</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={accountSettings.name}
                  onChange={(e) => setAccountSettings((prev) => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) => setAccountSettings((prev) => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company/Studio</label>
                <input
                  type="text"
                  value={accountSettings.company}
                  onChange={(e) => setAccountSettings((prev) => ({ ...prev, company: e.target.value }))}
                  className="form-input"
                />
              </div>
              <button onClick={handleAccountUpdate} className="btn btn-primary">
                Update Profile
              </button>
            </div>

            <div className="card">
              <h3>Connected Wallet</h3>
              <div className="mt-2">
                <p>
                  <strong>Address:</strong>
                </p>
                <code
                  style={{
                    background: "var(--bg-primary)",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    display: "block",
                    marginBottom: "1rem",
                  }}
                >
                  {walletAddress}
                </code>
                <p>
                  <strong>Network:</strong> Core Mainnet
                </p>
                <p>
                  <strong>Balance:</strong> 156.78 CORE
                </p>
              </div>

              <h4 className="mt-3">Notification Preferences</h4>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={accountSettings.notifications.email}
                    onChange={(e) =>
                      setAccountSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: e.target.checked },
                      }))
                    }
                  />
                  Email notifications
                </label>
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={accountSettings.notifications.webhook}
                    onChange={(e) =>
                      setAccountSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, webhook: e.target.checked },
                      }))
                    }
                  />
                  Webhook notifications
                </label>
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === "api" && (
          <div className="grid grid-2">
            <div className="card">
              <h3>API Key Management</h3>
              <div className="form-group">
                <label className="form-label">Current API Key</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="password" value={apiSettings.currentKey} className="form-input" readOnly />
                  <button
                    onClick={() => navigator.clipboard.writeText(apiSettings.currentKey)}
                    className="btn btn-secondary"
                  >
                    Copy
                  </button>
                </div>
                <small className="text-secondary">Created: December 15, 2024 | Last used: 2 hours ago</small>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button onClick={handleGenerateNewApiKey} className="btn btn-primary">
                  Generate New Key
                </button>
                <button onClick={handleRevokeApiKey} className="btn btn-secondary">
                  Revoke Current Key
                </button>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Webhook URL</label>
                <input
                  type="url"
                  value={apiSettings.webhookUrl}
                  onChange={(e) => setApiSettings((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                  className="form-input"
                  placeholder="https://yourgame.com/webhook"
                />
                <small className="text-secondary">Receive notifications about game events</small>
              </div>
            </div>

            <div className="card">
              <h3>Network Configuration</h3>
              <div className="form-group">
                <label className="form-label">Default Network</label>
                <select
                  value={apiSettings.network}
                  onChange={(e) => setApiSettings((prev) => ({ ...prev, network: e.target.value }))}
                  className="form-select"
                >
                  <option value="mainnet">Core Mainnet</option>
                  <option value="testnet">Core Testnet</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rate Limit Tier</label>
                <select
                  value={apiSettings.rateLimit}
                  onChange={(e) => setApiSettings((prev) => ({ ...prev, rateLimit: e.target.value }))}
                  className="form-select"
                >
                  <option value="standard">Standard (1000 req/min)</option>
                  <option value="premium">Premium (5000 req/min)</option>
                  <option value="enterprise">Enterprise (Unlimited)</option>
                </select>
              </div>

              <h4 className="mt-3">Webhook Events</h4>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" defaultChecked />
                  Game created
                </label>
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" defaultChecked />
                  Passport minted
                </label>
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" defaultChecked />
                  Item minted
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="grid grid-2">
            <div className="card">
              <h3>Authentication</h3>
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>Two-Factor Authentication</strong>
                    <div className="text-secondary">Add an extra layer of security</div>
                  </div>
                  <button
                    onClick={handleEnable2FA}
                    className={`btn ${securitySettings.twoFactorEnabled ? "btn-secondary" : "btn-primary"}`}
                  >
                    {securitySettings.twoFactorEnabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Session Timeout (hours)</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      sessionTimeout: Number.parseInt(e.target.value),
                    }))
                  }
                  className="form-input"
                />
              </div>
            </div>

            <div className="card">
              <h3>IP Whitelist</h3>
              <p className="text-secondary mb-2">Restrict API access to specific IP addresses</p>

              {securitySettings.ipWhitelist.map((ip, index) => (
                <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input type="text" value={ip} className="form-input" readOnly />
                  <button onClick={() => removeIpFromWhitelist(ip)} className="btn btn-secondary">
                    Remove
                  </button>
                </div>
              ))}

              <button onClick={addIpToWhitelist} className="btn btn-primary mt-2">
                + Add IP Address
              </button>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div>
            <div className="stats-grid mb-3">
              <div className="stat-card">
                <div className="stat-value">{usageStats.apiCalls.thisMonth.toLocaleString()}</div>
                <div className="stat-label">API Calls This Month</div>
                <div className="text-secondary">
                  {((usageStats.apiCalls.thisMonth / usageStats.apiCalls.limit) * 100).toFixed(1)}% of limit
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{usageStats.gasUsed.thisMonth} CORE</div>
                <div className="stat-label">Gas Used This Month</div>
                <div className="text-secondary">
                  {((usageStats.gasUsed.thisMonth / usageStats.gasUsed.limit) * 100).toFixed(1)}% of budget
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{usageStats.games.active}</div>
                <div className="stat-label">Active Games</div>
                <div className="text-secondary">{usageStats.games.limit - usageStats.games.active} remaining</div>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="card">
                <h3>Current Plan</h3>
                <div className="mt-2">
                  <h4>Developer Plan - $29/month</h4>
                  <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
                    <li>100,000 API calls/month</li>
                    <li>10 active games</li>
                    <li>100 CORE gas budget</li>
                    <li>Email support</li>
                    <li>Standard rate limits</li>
                  </ul>
                  <button className="btn btn-primary mt-3">Upgrade Plan</button>
                </div>
              </div>

              <div className="card">
                <h3>Usage History</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>API Calls</th>
                      <th>Gas Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>December 2024</td>
                      <td>15,420</td>
                      <td>12.45 CORE</td>
                    </tr>
                    <tr>
                      <td>November 2024</td>
                      <td>23,891</td>
                      <td>18.92 CORE</td>
                    </tr>
                    <tr>
                      <td>October 2024</td>
                      <td>19,234</td>
                      <td>15.67 CORE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="grid grid-2">
            <div className="card">
              <h3>Developer Preferences</h3>
              <div className="form-group">
                <label className="form-label">Default Programming Language</label>
                <select className="form-select">
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Code Style</label>
                <select className="form-select">
                  <option value="camelCase">camelCase</option>
                  <option value="snake_case">snake_case</option>
                  <option value="kebab-case">kebab-case</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" defaultChecked />
                  Show gas estimates in UI
                </label>
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" defaultChecked />
                  Auto-save form data
                </label>
              </div>
            </div>

            <div className="card">
              <h3>Export Data</h3>
              <p className="text-secondary mb-3">Download your game data and configurations</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button className="btn btn-secondary">Export Game Configurations</button>
                <button className="btn btn-secondary">Export User Data</button>
                <button className="btn btn-secondary">Export API Usage Logs</button>
                <button className="btn btn-secondary">Export All Data</button>
              </div>

              <div className="mt-3" style={{ padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "8px" }}>
                <h4>Data Retention</h4>
                <p className="text-secondary">
                  Your data is retained for 2 years after account deletion. Contact support for immediate data deletion
                  requests.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
