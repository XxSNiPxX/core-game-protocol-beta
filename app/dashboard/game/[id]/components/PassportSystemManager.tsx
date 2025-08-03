"use client";

import type React from "react";
import { useState } from "react";
import type { Game, User } from "../types";
import PassportFacet from "@/contracts/abi/PassportFacet.json";
import { ethers } from "ethers";

interface PassportSystemManagerProps {
  game: Game;
  users: User[];
  onUserSelect: (user: User) => void;
  onDataRefresh: () => void;
}

export default function PassportSystemManager({
  game,
  users,
  onUserSelect,
  onDataRefresh,
}: PassportSystemManagerProps) {
  const [globalAttributes, setGlobalAttributes] = useState({
    keys: [""],
    values: [""],
    displayTypes: [""],
    uris: [""],
  });
  const [globalMetadata, setGlobalMetadata] = useState({
    keys: [""],
    values: [""],
    uris: [""],
  });

  const handleSetGlobalAttributes = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const passport = new ethers.Contract(game.id, PassportFacet.abi, signer);
    try {
      const keys = globalAttributes.keys.map((k) => k.trim());
      const values = globalAttributes.values.map((v) => v.trim());
      const displayTypes = globalAttributes.displayTypes.map((d) => d.trim());
      const uris = globalAttributes.uris.map((u) => u.trim());

      try {
        const result = await passport.setGlobalAttributes(
          keys,
          values,
          displayTypes,
          uris,
        );
        console.log("passprt metadata:", result);
      } catch (err) {
        console.error("Failed to set global attributes:", err);
      }
      console.log(
        `Calling setGlobalAttributes([${keys}], [${values}], [${displayTypes}], [${uris}])`,
      );
      alert("Global attributes set successfully");

      setGlobalAttributes({
        keys: [""],
        values: [""],
        displayTypes: [""],
        uris: [""],
      });
    } catch (error) {
      console.error("Failed to set global attributes:", error);
    }
  };

  const handleSetGlobalMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const passport = new ethers.Contract(game.id, PassportFacet.abi, signer);
    try {
      const keys = globalMetadata.keys.map((k) => k.trim());
      const values = globalMetadata.values.map((v) => v.trim());
      const uris = globalMetadata.uris.map((u) => u.trim());

      try {
        const result = await passport.setGlobalUserMetadataTemplate(
          keys,
          values,
          uris,
        );
        console.log("user pasport metadata:", result);
      } catch (err) {
        console.error("Error calling set pasport metadata:", err);
      }
      console.log(
        `Calling setGlobalUserMetadataTemplate([${keys}], [${values}], [${uris}])`,
      );
      alert("Global user metadata set successfully");

      setGlobalMetadata({ keys: [""], values: [""], uris: [""] });
    } catch (error) {
      console.error("Failed to set global user metadata:", error);
    }
  };

  const addGlobalAttributeField = () => {
    setGlobalAttributes((prev) => ({
      keys: [...prev.keys, ""],
      values: [...prev.values, ""],
      displayTypes: [...prev.displayTypes, ""],
      uris: [...prev.uris, ""],
    }));
  };

  const addGlobalMetadataField = () => {
    setGlobalMetadata((prev) => ({
      keys: [...prev.keys, ""],
      values: [...prev.values, ""],
      uris: [...prev.uris, ""],
    }));
  };

  return (
    <div>
      <h3 style={{ marginBottom: "1.5rem" }}>Manage Passport System</h3>
      <div className="grid grid-2">
        <div>
          <div className="card">
            <h4>Set Global Attributes</h4>
            <form onSubmit={handleSetGlobalAttributes}>
              {globalAttributes.keys.map((key, index) => (
                <div key={index} className="form-group">
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const keys = [...globalAttributes.keys];
                        keys[index] = e.target.value;
                        setGlobalAttributes((prev) => ({ ...prev, keys }));
                      }}
                      className="form-input"
                      placeholder="Key (e.g., hp)"
                    />
                    <input
                      type="text"
                      value={globalAttributes.values[index] || ""}
                      onChange={(e) => {
                        const values = [...globalAttributes.values];
                        values[index] = e.target.value;
                        setGlobalAttributes((prev) => ({ ...prev, values }));
                      }}
                      className="form-input"
                      placeholder="Value (e.g., 100)"
                    />
                    <input
                      type="text"
                      value={globalAttributes.displayTypes[index] || ""}
                      onChange={(e) => {
                        const displayTypes = [...globalAttributes.displayTypes];
                        displayTypes[index] = e.target.value;
                        setGlobalAttributes((prev) => ({
                          ...prev,
                          displayTypes,
                        }));
                      }}
                      className="form-input"
                      placeholder="Display Type (e.g., number)"
                    />
                    <input
                      type="text"
                      value={globalAttributes.uris[index] || ""}
                      onChange={(e) => {
                        const uris = [...globalAttributes.uris];
                        uris[index] = e.target.value;
                        setGlobalAttributes((prev) => ({ ...prev, uris }));
                      }}
                      className="form-input"
                      placeholder="URI (optional)"
                    />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={addGlobalAttributeField}
                  className="btn btn-secondary"
                >
                  + Add Attribute
                </button>
                <button type="submit" className="btn btn-primary">
                  Set Global Attributes
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <h4>Set Global User Metadata (for editable user profile fields)</h4>
            <p
              style={{
                fontSize: "0.875rem",
                marginBottom: "1rem",
                color: "#666",
              }}
            >
              These are the user-editable fields shown in passports. You define
              the <strong>key</strong> (e.g., "username"), a{" "}
              <strong>default value</strong> (e.g., "anon"), and an optional{" "}
              <strong>URI</strong>.
            </p>
            <form onSubmit={handleSetGlobalMetadata}>
              {globalMetadata.keys.map((key, index) => (
                <div key={index} className="form-group">
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const keys = [...globalMetadata.keys];
                        keys[index] = e.target.value;
                        setGlobalMetadata((prev) => ({ ...prev, keys }));
                      }}
                      className="form-input"
                      placeholder='Key (e.g., "username", "bio", "email")'
                    />
                    <input
                      type="text"
                      value={globalMetadata.values[index] || ""}
                      onChange={(e) => {
                        const values = [...globalMetadata.values];
                        values[index] = e.target.value;
                        setGlobalMetadata((prev) => ({ ...prev, values }));
                      }}
                      className="form-input"
                      placeholder='Default (e.g., "anon", "no bio", "")'
                    />
                    <input
                      type="text"
                      value={globalMetadata.uris[index] || ""}
                      onChange={(e) => {
                        const uris = [...globalMetadata.uris];
                        uris[index] = e.target.value;
                        setGlobalMetadata((prev) => ({ ...prev, uris }));
                      }}
                      className="form-input"
                      placeholder='URI (optional, e.g., "https://...")'
                    />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={addGlobalMetadataField}
                  className="btn btn-secondary"
                >
                  + Add Metadata
                </button>
                <button type="submit" className="btn btn-primary">
                  Set Global User Metadata
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <h4>Global Passport Traits ({game.globalPassportTraits.length})</h4>
          {game.globalPassportTraits.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {game.globalPassportTraits.map((trait, index) => (
                <div
                  key={`trait-${index}`}
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-tertiary)",
                    borderRadius: "8px",
                  }}
                >
                  <strong>{trait.trait_type}</strong>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Value: {trait.value} | Type: {trait.display_type || "N/A"}
                  </div>
                  {trait.uri && (
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>
                      URI: {trait.uri}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary">No global passport traits defined.</p>
          )}

          <hr
            style={{ margin: "1.5rem 0", border: "0.5px solid var(--border)" }}
          />

          <h4>Global User Metadata ({game.globalUserMetadata.length})</h4>
          {game.globalUserMetadata.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {game.globalUserMetadata.map((field, index) => (
                <div
                  key={`metadata-${index}`}
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-tertiary)",
                    borderRadius: "8px",
                  }}
                >
                  <strong>{field.trait_type}</strong>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Default: {field.value}
                  </div>
                  {field.uri && (
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>
                      URI: {field.uri}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary">No global user metadata defined.</p>
          )}
        </div>
      </div>
    </div>
  );
}
