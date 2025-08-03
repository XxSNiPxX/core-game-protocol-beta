"use client"

import type { User } from "../types"

interface UserDetailsModalProps {
  user: User
  onClose: () => void
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div className="card" style={{ maxWidth: "600px", width: "90%", maxHeight: "80vh", overflow: "auto" }}>
        <div className="card-header">
          <h3>Passport Details</h3>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>

        <div>
          <p>
            <strong>Wallet:</strong> {user.wallet}
          </p>
          <p>
            <strong>Passport ID:</strong> {user.passportId}
          </p>

          <h4 className="mt-3 mb-2">Attributes</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(user.attributes).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="mt-3 mb-2">Inventory</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {user.inventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
