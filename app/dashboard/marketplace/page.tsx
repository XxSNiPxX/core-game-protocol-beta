"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../layout-dashboard"
import type { Game } from "../game/[id]/types"
import { MOCK_GAMES } from "@/lib/mock-data"

interface TradeablePassport {
  id: string
  owner: string
  price: number
  attributes: Record<string, any>
}

interface TradeableItem {
  id: string
  name: string
  owner: string
  price: number
  amount: number
  category: string
}

export default function MarketplacePage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [stCoreBalance, setStCoreBalance] = useState(100.0) // Mock stCore balance

  useEffect(() => {
    // Use static mock games data directly
    setGames(MOCK_GAMES)
    setLoading(false)
  }, [])

  const mockTradePassport = (gameId: string, passport: TradeablePassport) => {
    if (stCoreBalance >= passport.price) {
      setStCoreBalance((prev) => prev - passport.price)
      alert(
        `Successfully traded Passport #${passport.id} for ${passport.price} stCore in ${gameId}! Your new balance is ${
          stCoreBalance - passport.price
        } stCore.`,
      )
    } else {
      alert(`Insufficient stCore balance to trade Passport #${passport.id}.`)
    }
  }

  const mockTradeItem = (gameId: string, item: TradeableItem) => {
    if (stCoreBalance >= item.price) {
      setStCoreBalance((prev) => prev - item.price)
      alert(
        `Successfully traded ${item.amount}x ${item.name} for ${item.price} stCore in ${gameId}! Your new balance is ${
          stCoreBalance - item.price
        } stCore.`,
      )
    } else {
      alert(`Insufficient stCore balance to trade ${item.name}.`)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <div className="loading"></div>
          <p className="mt-2">Loading marketplace...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="card-header">
        <h1 className="card-title">Game Marketplace</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>Your stCore Balance:</span>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--accent-orange)" }}>
            {stCoreBalance.toFixed(2)} stCore
          </span>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="card text-center">
          <h3>No games available in the marketplace</h3>
          <p className="text-secondary">Check back later for new listings!</p>
        </div>
      ) : (
        <div className="grid grid-1">
          {games.map((game) => (
            <div key={game.id} className="card">
              <div className="card-header">
                <h2 className="card-title">{game.name}</h2>
                <span className="text-secondary">{game.genre}</span>
              </div>
              <p className="text-secondary mb-3">{game.description}</p>

              {/* Tradeable Passports */}
              <h3 style={{ marginBottom: "1rem" }}>Tradeable Passports ({game.totalPassports})</h3>
              {game.totalPassports > 0 ? (
                <div className="grid grid-3" style={{ marginBottom: "1.5rem" }}>
                  {/* Mock tradeable passports */}
                  {Array.from({ length: Math.min(game.totalPassports, 3) }).map((_, index) => {
                    const mockPassport: TradeablePassport = {
                      id: `${game.id}-${index + 1}`,
                      owner: `0x${Math.random().toString(16).substr(2, 10)}...`,
                      price: Number.parseFloat((Math.random() * 10 + 1).toFixed(2)), // 1 to 11 stCore
                      attributes: { level: Math.floor(Math.random() * 10) + 1, class: "Warrior" },
                    }
                    return (
                      <div
                        key={mockPassport.id}
                        className="card"
                        style={{ padding: "1rem", background: "var(--bg-tertiary)" }}
                      >
                        <h4>Passport #{mockPassport.id.split("-")[1]}</h4>
                        <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
                          Owner: {mockPassport.owner.slice(0, 8)}...
                        </p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--accent-orange)" }}>
                          {mockPassport.price} stCore
                        </p>
                        <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
                          Level: {mockPassport.attributes.level}, Class: {mockPassport.attributes.class}
                        </p>
                        <button
                          onClick={() => mockTradePassport(game.id, mockPassport)}
                          className="btn btn-primary mt-2"
                          style={{ width: "100%" }}
                        >
                          Trade
                        </button>
                      </div>
                    )
                  })}
                  {game.totalPassports > 3 && (
                    <p className="text-secondary text-center" style={{ gridColumn: "1 / -1" }}>
                      +{game.totalPassports - 3} more passports...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-secondary mb-3">No passports listed for trade in this game.</p>
              )}

              {/* Tradeable Items */}
              <h3 style={{ marginBottom: "1rem" }}>Tradeable Items ({game.totalItems})</h3>
              {game.totalItems > 0 ? (
                <div className="grid grid-3">
                  {/* Mock tradeable items */}
                  {Array.from({ length: Math.min(game.totalItems, 3) }).map((_, index) => {
                    const mockItem: TradeableItem = {
                      id: `${game.id}-item-${index + 1}`,
                      name: game.allItems[index % game.allItems.length]?.name || `Item ${index + 1}`,
                      owner: `0x${Math.random().toString(16).substr(2, 10)}...`,
                      price: Number.parseFloat((Math.random() * 5 + 0.5).toFixed(2)), // 0.5 to 5.5 stCore
                      amount: Math.floor(Math.random() * 5) + 1,
                      category: game.allItems[index % game.allItems.length]?.category || "misc",
                    }
                    return (
                      <div
                        key={mockItem.id}
                        className="card"
                        style={{ padding: "1rem", background: "var(--bg-tertiary)" }}
                      >
                        <h4>
                          {mockItem.name} ({mockItem.amount}x)
                        </h4>
                        <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
                          Owner: {mockItem.owner.slice(0, 8)}...
                        </p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--accent-orange)" }}>
                          {mockItem.price} stCore
                        </p>
                        <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
                          Category: {mockItem.category}
                        </p>
                        <button
                          onClick={() => mockTradeItem(game.id, mockItem)}
                          className="btn btn-primary mt-2"
                          style={{ width: "100%" }}
                        >
                          Trade
                        </button>
                      </div>
                    )
                  })}
                  {game.totalItems > 3 && (
                    <p className="text-secondary text-center" style={{ gridColumn: "1 / -1" }}>
                      +{game.totalItems - 3} more items...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-secondary">No items listed for trade in this game.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
