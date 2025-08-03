"use client";

import { useState, useEffect } from "react";
import type { Game } from "../types";

interface GameStatsProps {
  game: Game;
}

export default function GameStats({ game }: GameStatsProps) {
  const [loading, setLoading] = useState(true);
  const [recentPassports, setRecentPassports] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    fetchSubgraphData();
  }, [game.id]);

  const fetchSubgraphData = async () => {
    setLoading(true);

    const subgraphURL =
      "https://thegraph.test2.btcs.network/subgraphs/name/snip/coregameengine";

    if (!game?.contractAddress) {
      console.error("Missing contract address for query.");
      setLoading(false);
      return;
    }

    const contract = game.contractAddress.toLowerCase();

    const query = `
      query GetRecentMints {
        passportMinteds(
          first: 10,
          orderBy: timestamp,
          orderDirection: desc,
          where: { coreGameDiamond: "${contract}" }
        ) {
          id
          user
          tokenId
          timestamp
        }

        itemMinteds(
          first: 10,
          orderBy: timestamp,
          orderDirection: desc,
          where: { coreGameDiamond: "${contract}" }
        ) {
          id
          to
          tokenId
          amount
          timestamp
        }
      }
    `;

    try {
      const response = await fetch(subgraphURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          operationName: "GetRecentMints",
        }),
      });

      const raw = await response.text();
      console.log("🔥 RAW RESPONSE:", raw);

      let data;
      try {
        const json = JSON.parse(raw);
        data = json.data;
      } catch (jsonErr) {
        console.error("❌ Invalid JSON from server:", raw);
        throw new Error("Invalid JSON response");
      }

      setRecentPassports(data?.passportMinteds ?? []);
      setRecentItems(data?.itemMinteds ?? []);
    } catch (err) {
      console.error("❌ Error fetching subgraph data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading game statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        {game.coverImageUrl && (
          <img
            src={game.coverImageUrl}
            alt="Game Cover"
            className="w-24 h-24 rounded shadow"
          />
        )}
        <div>
          <h2 className="text-2xl font-semibold">{game.name}</h2>
          <p className="text-sm text-muted-foreground">{game.genre}</p>
          <p className="text-xs text-muted-foreground">
            Created: {new Date(game.createdAt).toLocaleDateString()} • Last
            Updated: {new Date(game.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="stat-value">{game.totalPassports}</div>
          <div className="stat-label">Total Passports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{game.totalItems}</div>
          <div className="stat-label">Total Items Minted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{game.allItems.length}</div>
          <div className="stat-label">Unique Item Types</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{game.pubKeys.length}</div>
          <div className="stat-label">Authorized Admins</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-2">Recent Passport Mints</h3>
        {recentPassports.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Token ID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentPassports.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 group text-gray-800 dark:text-gray-200">
                      <span className="text-sm align-middle" title={p.id}>
                        {p.id.slice(0, 6)}...
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(p.id)}
                        className="p-0 m-0 bg-transparent border-none outline-none opacity-30 group-hover:opacity-100 transition-opacity"
                        title="Copy full ID"
                      >
                        <svg
                          viewBox="0 0 352.804 352.804"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 352.804 352.804"
                          fill="currentColor"
                          className="w-4 h-4 text-inherit align-middle"
                        >
                          <path
                            d="M318.54,57.282h-47.652V15c0-8.284-6.716-15-15-15H34.264
                              c-8.284,0-15,6.716-15,15v265.522c0,8.284,6.716,15,15,15h47.651
                              v42.281c0,8.284,6.716,15,15,15H318.54c8.284,0,15-6.716,15-15V72.282
                              C333.54,63.998,326.824,57.282,318.54,57.282z
                              M49.264,265.522V30h191.623v27.282H96.916c-8.284,0-15,6.716-15,15
                              v193.24H49.264z
                              M303.54,322.804H111.916V87.282H303.54V322.804z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>

                  <td className="text-sm text-gray-800" title={p.user}>
                    {p.user}
                  </td>

                  <td>{p.tokenId}</td>

                  <td>
                    {new Date(parseInt(p.timestamp) * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent passport mints found.</p>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-2">Recent Item Mints</h3>
        {recentItems.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Recipient</th>
                <th>Token ID</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((i) => (
                <tr key={i.id}>
                  <td className="whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 group text-gray-800 dark:text-gray-200">
                      <span className="text-sm" title={i.id}>
                        {i.id.slice(0, 6)}...
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(i.id)}
                        className="p-0 m-0 bg-transparent border-none outline-none hover:opacity-100 opacity-30 group-hover:opacity-100 transition-opacity"
                        title="Copy full ID"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 352.804 352.804"
                          fill="currentColor"
                          className="block"
                        >
                          <path
                            d="M318.54,57.282h-47.652V15c0-8.284-6.716-15-15-15H34.264
                              c-8.284,0-15,6.716-15,15v265.522c0,8.284,6.716,15,15,15h47.651
                              v42.281c0,8.284,6.716,15,15,15H318.54c8.284,0,15-6.716,15-15V72.282
                              C333.54,63.998,326.824,57.282,318.54,57.282z
                              M49.264,265.522V30h191.623v27.282H96.916c-8.284,0-15,6.716-15,15
                              v193.24H49.264z
                              M303.54,322.804H111.916V87.282H303.54V322.804z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>

                  <td className="text-sm text-gray-800">{i.to}</td>

                  <td>{i.tokenId}</td>
                  <td>{i.amount}</td>
                  <td>
                    {new Date(parseInt(i.timestamp) * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent item mints found.</p>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-2">Game Metadata</h3>
        <table className="table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{game.name}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{game.description || "N/A"}</td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>{game.genre}</td>
            </tr>
            <tr>
              <td>Support Email</td>
              <td>{game.supportEmail}</td>
            </tr>
            <tr>
              <td>Website</td>
              <td>{game.websiteUrl}</td>
            </tr>
            <tr>
              <td>Game Link</td>
              <td>{game.gameLinkUrl}</td>
            </tr>
            <tr>
              <td>Twitter</td>
              <td>{game.twitter}</td>
            </tr>
            <tr>
              <td>Discord</td>
              <td>{game.discord}</td>
            </tr>
            <tr>
              <td>Telegram</td>
              <td>{game.telegram}</td>
            </tr>
            <tr>
              <td>YouTube</td>
              <td>{game.youtube}</td>
            </tr>
            <tr>
              <td>Instagram</td>
              <td>{game.instagram}</td>
            </tr>
            <tr>
              <td>TikTok</td>
              <td>{game.tiktok}</td>
            </tr>
            <tr>
              <td>Contract</td>
              <td>{game.contractAddress}</td>
            </tr>
            <tr>
              <td>Passport Contract</td>
              <td>{game.passportContract}</td>
            </tr>
            <tr>
              <td>Inventory Contract</td>
              <td>{game.inventoryContract}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {game.pubKeys.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Authorized Admins</h3>
          <ul className="list-disc list-inside">
            {game.pubKeys.map((k, idx) => (
              <li key={idx}>
                <code>{k}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
