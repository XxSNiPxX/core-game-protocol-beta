# Core Game Engine Dashboard

This is the **frontend dashboard** for [Core Game Engine](https://github.com/your-org/core-game-engine), a modular, on-chain game protocol framework built using [EIP-2535 Diamonds](https://eips.ethereum.org/EIPS/eip-2535). This dashboard provides a visual interface to interact with deployed games, manage game modules, and demonstrate facet-based extensibility.

> 🌐 **Live URL:** [https://coreengine.site/dashboard](https://coreengine.site/dashboard)

---

## 🕹️ Live Demo Game

**Agario (CoreGameProtocol instance):**

- Fully deployed example game using CoreGameEngine
- On-chain user interaction, identity (passport), and modular logic
- Playable + inspectable via the dashboard

🎮 [Play Agario](https://agar.coreengine.site)

---

## 🚧 Temporary / Experimental Sections

Some parts of the dashboard are experimental or in-progress and **not used in the main demo**, such as:

- **Marketplace Settings**
- **Placeholder Buttons**
- **Module menus with no current backend link**

These are kept in place to show modularity, visual scaffolding, and future roadmap integration (e.g., user inventory trading or asset stores). They do not interfere with core game logic.

---

## ✅ Core Features

- Connect your wallet to interact with deployed games
- View list of all deployed CoreGameProtocol contracts
- Inspect game modules (facets): Passport, Inventory, Roles, etc.
- Deploy a new game using CoreGameFactory
- View and set nickname via Passport system
- Dynamically fetch on-chain metadata
- Demonstrates real EIP-2535 facet wiring

---

## 🧰 Tech Stack

- **Next.js + React** frontend
- **Tailwind CSS** for styling
- **Ethers.js** for blockchain interaction
- **Solana + Phantom integration** (under evaluation for cross-chain support)
- **Deployed Contracts:** Factory + Diamonds on EVM chain
- **Backend:** (Optional FastAPI integration coming for wallet verification / Telegram bot usage)

---

## 🧪 Development

To run locally:

```bash
git clone https://github.com/your-org/coreengine-dashboard.git
cd coreengine-dashboard
npm install
npm run dev
```

---

## 🧱 Related Projects

- [CoreGameEngine (Contracts)](https://github.com/XxSNiPxX/CoreGameProtocol) – Modular on-chain gaming framework
- [CoreGame Agario](https://agar.coreengine.site) – Reference implementation using the engine
- [EIP-2535 Diamonds](https://eips.ethereum.org/EIPS/eip-2535) – Standard behind modular architecture

---

## 🛠️ Future Plans

To make integration with the Core Game Engine even easier, upcoming releases will include:

- 🧰 **Official SDKs** for frontend and backend:
  - Simplified hooks to check passport status, mint, and fetch inventory
  - Plug-and-play wallet connection (EVM & Solana)
  - Game loop utilities for seamless tick/update syncing

- 🕹️ **Game Dev Starter Templates**:
  - React + Ethers + Tailwind template with built-in passport + inventory
  - Integration guides for Unity or Godot (via WebAssembly/JS bridge)

- 🧩 **Dynamic Facet Loader**:
  - Drop-in support for adding modules to your game without writing Solidity

These tools are being designed to let developers **focus on gameplay**, not contracts — so creating an on-chain game will be as easy as importing a library.

Stay tuned.

---

## 📌 Notes

This dashboard is **intended for hackathons, early developer adoption, and demos**. Not all features are polished or intended for production use yet — focus is on demonstrating the **modular facet architecture** in action.

---

## 📜 License

MIT. Use freely, extend responsibly. Contributions welcome.
