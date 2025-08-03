"use client";

import type React from "react";
import { useState } from "react";
import type { Game, DeployedModules } from "../types";

interface GameMetadataProps {
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
  deployedModules: DeployedModules;
}

export default function GameMetadata({ game, setGame }: GameMetadataProps) {
  const [gameMetadata, setGameMetadata] = useState({
    name: game.name || "",
    description: game.description || "",
    genre: game.genre || "",
    coverImageUrl: game.coverImageUrl || "",
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

  const handleUpdateLinks = async () => {
    try {
      console.log("Calling setGameLinks", {
        gameLink: gameMetadata.gameLinkUrl,
        website: gameMetadata.websiteUrl,
        supportEmail: gameMetadata.supportEmail,
      });
      alert("Game links updated!");
    } catch (err) {
      console.error("Error updating game links", err);
    }
  };

  const handleUpdateSocials = async () => {
    try {
      console.log("Calling setSocialLinks", {
        twitter: gameMetadata.twitter,
        discord: gameMetadata.discord,
        telegram: gameMetadata.telegram,
        youtube: gameMetadata.youtube,
        tiktok: gameMetadata.tiktok,
        instagram: gameMetadata.instagram,
      });
      alert("Social links updated!");
    } catch (err) {
      console.error("Error updating social links", err);
    }
  };

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>Game Info</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            className="form-input"
            value={gameMetadata.name}
            onChange={(e) =>
              setGameMetadata({ ...gameMetadata, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            value={gameMetadata.description}
            onChange={(e) =>
              setGameMetadata({ ...gameMetadata, description: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <select
            className="form-select"
            value={gameMetadata.genre}
            onChange={(e) =>
              setGameMetadata({ ...gameMetadata, genre: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="Action">Action</option>
            <option value="RPG">RPG</option>
            <option value="Strategy">Strategy</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Sports">Sports</option>
            <option value="Racing">Racing</option>
            <option value="Simulation">Simulation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cover Image URL</label>
          <input
            className="form-input"
            value={gameMetadata.coverImageUrl}
            onChange={(e) =>
              setGameMetadata({
                ...gameMetadata,
                coverImageUrl: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="card">
        <h3>Links</h3>
        <input
          placeholder="Game Link"
          className="form-input"
          value={gameMetadata.gameLinkUrl}
          onChange={(e) =>
            setGameMetadata({ ...gameMetadata, gameLinkUrl: e.target.value })
          }
        />
        <input
          placeholder="Website"
          className="form-input"
          value={gameMetadata.websiteUrl}
          onChange={(e) =>
            setGameMetadata({ ...gameMetadata, websiteUrl: e.target.value })
          }
        />
        <input
          placeholder="Support Email"
          className="form-input"
          value={gameMetadata.supportEmail}
          onChange={(e) =>
            setGameMetadata({ ...gameMetadata, supportEmail: e.target.value })
          }
        />
        <button className="btn btn-primary" onClick={handleUpdateLinks}>
          Update Game Links
        </button>

        <h4>Social Media</h4>
        {[
          "twitter",
          "discord",
          "telegram",
          "youtube",
          "tiktok",
          "instagram",
        ].map((platform) => (
          <input
            key={platform}
            placeholder={platform}
            className="form-input"
            value={gameMetadata[platform as keyof typeof gameMetadata]}
            onChange={(e) =>
              setGameMetadata({ ...gameMetadata, [platform]: e.target.value })
            }
          />
        ))}
        <button className="btn btn-primary" onClick={handleUpdateSocials}>
          Update Social Links
        </button>
      </div>
    </div>
  );
}
