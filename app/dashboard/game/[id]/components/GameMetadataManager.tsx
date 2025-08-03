"use client";

import { useState } from "react";
import type { Game } from "../types";
import GameInfoFacet from "@/contracts/abi/GameInfoFacet.json";
import { ethers } from "ethers";

interface GameMetadataManagerProps {
  game: Game;
  onGameUpdate: (updatedGame: Game) => void;
}

export default function GameMetadataManager({
  game,
  onGameUpdate,
}: GameMetadataManagerProps) {
  const [form, setForm] = useState({
    name: game.name || "",
    description: game.description || "",
    genre: game.genre || "",
    imageURI: game.coverImageUrl || "",
    gameLinkUrl: game.gameLinkUrl || "",
    websiteUrl: game.websiteUrl || "",
    supportEmail: game.supportEmail || "",
    twitter: game.twitter || "",
    discord: game.discord || "",
    telegram: game.telegram || "",
    youtube: game.youtube || "",
    tiktok: game.tiktok || "",
    instagram: game.instagram || "",
  });

  const [authorizedAdmins, setAuthorizedAdmins] = useState<string[]>(
    game.pubKeys && game.pubKeys.length > 0 ? game.pubKeys : [""],
  );

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpdateBasicMetadata = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const gameinfo = new ethers.Contract(game.id, GameInfoFacet.abi, signer);

    try {
      await gameinfo.setBasicGameMetadata(
        form.name,
        form.description,
        form.genre,
        form.imageURI,
      );
      onGameUpdate({ ...game, ...form });
      alert("Basic Game Metadata updated");
    } catch (err) {
      console.error("Error updating basic metadata", err);
    }
  };

  const handleUpdateGroup = async (type: "gameLinks" | "socialLinks") => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const gameinfo = new ethers.Contract(game.id, GameInfoFacet.abi, signer);
    try {
      if (type === "gameLinks") {
        await gameinfo.setGameLinks(
          form.gameLinkUrl,
          form.websiteUrl,
          form.supportEmail,
        );
      } else {
        await gameinfo.setSocialLinks(
          form.twitter,
          form.discord,
          form.telegram,
          form.youtube,
          form.tiktok,
          form.instagram,
        );
      }
      onGameUpdate({ ...game, ...form });
      alert(`${type === "gameLinks" ? "Game Links" : "Social Links"} updated`);
    } catch (err) {
      console.error("Error updating links", err);
    }
  };

  const handleUpdateAdmins = async () => {
    const cleaned = authorizedAdmins.filter((a) => a.trim() !== "");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const gameinfo = new ethers.Contract(game.id, GameInfoFacet.abi, signer);

    try {
      await gameinfo.addAuthorizedUser(cleaned[0]);
      onGameUpdate({ ...game, pubKeys: cleaned });
      alert("Authorized Admins Updated");
    } catch (err) {
      console.error("Error updating admins", err);
    }
  };

  const renderFormWithCurrent = (
    label: string,
    key: keyof typeof form,
    type: "text" | "url" | "email" | "textarea" = "text",
  ) => (
    <div key={key} className="form-group" style={{ marginBottom: "1rem" }}>
      <label className="form-label">{label}</label>
      <div className="flex-container" style={{ display: "flex", gap: "1rem" }}>
        <div className="current-value" style={{ flex: 1 }}>
          <strong>Current:</strong>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>
            {game[key] || "—"}
          </div>
        </div>
        <div className="input-field" style={{ flex: 2 }}>
          {type === "textarea" ? (
            <textarea
              className="form-input"
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
            />
          ) : (
            <input
              className="form-input"
              type={type}
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card">
      <h3>Game Metadata Configuration</h3>

      <h4 style={{ marginTop: "1.5rem" }}>Basic Metadata</h4>
      {renderFormWithCurrent("Name", "name")}
      {renderFormWithCurrent("Description", "description", "textarea")}
      {renderFormWithCurrent("Genre", "genre")}
      {renderFormWithCurrent("Cover Image URL", "imageURI", "url")}
      <button className="btn btn-primary" onClick={handleUpdateBasicMetadata}>
        Update Basic Metadata
      </button>

      <h4 style={{ marginTop: "2rem" }}>Game Links</h4>
      {renderFormWithCurrent("Game Link", "gameLinkUrl", "url")}
      {renderFormWithCurrent("Website", "websiteUrl", "url")}
      {renderFormWithCurrent("Support Email", "supportEmail", "email")}
      <button
        className="btn btn-primary"
        onClick={() => handleUpdateGroup("gameLinks")}
      >
        Update Game Links
      </button>

      <h4 style={{ marginTop: "2rem" }}>Social Links</h4>
      {["twitter", "discord", "telegram", "youtube", "tiktok", "instagram"].map(
        (platform) =>
          renderFormWithCurrent(
            platform.charAt(0).toUpperCase() + platform.slice(1),
            platform as keyof typeof form,
            "url",
          ),
      )}
      <button
        className="btn btn-primary"
        onClick={() => handleUpdateGroup("socialLinks")}
      >
        Update Social Links
      </button>

      <h4 style={{ marginTop: "2rem" }}>Authorized Admins</h4>
      {authorizedAdmins.map((admin, index) => (
        <div
          className="form-group"
          key={index}
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <input
            className="form-input"
            value={admin}
            placeholder="0x..."
            onChange={(e) => {
              const copy = [...authorizedAdmins];
              copy[index] = e.target.value;
              setAuthorizedAdmins(copy);
            }}
          />
          {authorizedAdmins.length > 1 && (
            <button
              className="btn btn-secondary"
              onClick={() =>
                setAuthorizedAdmins((prev) =>
                  prev.filter((_, i) => i !== index),
                )
              }
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          className="btn btn-secondary"
          onClick={() => setAuthorizedAdmins((prev) => [...prev, ""])}
        >
          + Add Admin
        </button>
        <button className="btn btn-primary" onClick={handleUpdateAdmins}>
          Save Admins
        </button>
      </div>
    </div>
  );
}
