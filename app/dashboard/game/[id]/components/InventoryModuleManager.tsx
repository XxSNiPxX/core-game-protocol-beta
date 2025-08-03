"use client";

import type React from "react";
import { useState } from "react";
import type { Game, InventoryItem, User } from "../types";
import InventoryFacet from "@/contracts/abi/InventoryFacet.json";
import { ethers } from "ethers";
import AllItemsList from "./AllItemsList"; // Adjust path as needed

interface InventoryModuleManagerProps {
  game: Game;
  inventoryItems: InventoryItem[];
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  users: User[];
  onDataRefresh: () => void;
}

export default function InventoryModuleManager({
  game,
  inventoryItems,
  setInventoryItems,
  users,
  onDataRefresh,
}: InventoryModuleManagerProps) {
  const [newItem, setNewItem] = useState({
    tokenId: "",
    name: "",
    description: "",
    imageURI: "",
    attributes: [
      {
        trait_type: "",
        value: "",
        display_type: "",
      },
    ],
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const inventory = new ethers.Contract(game.id, InventoryFacet.abi, signer);

    try {
      const formattedAttributes = newItem.attributes.map((attr) => ({
        trait_type: attr.trait_type,
        value: attr.value,
        display_type: attr.display_type,
      }));

      console.log("Calling addItem with:", {
        tokenId: newItem.tokenId,
        name: newItem.name,
        description: newItem.description,
        imageURI: newItem.imageURI,
        attributes: formattedAttributes,
      });

      const tx = await inventory.addItem(
        newItem.tokenId,
        newItem.name,
        newItem.description,
        newItem.imageURI,
        formattedAttributes,
      );

      await tx.wait();

      alert(`Item "${newItem.name}" added successfully!`);

      setInventoryItems((prev) => [
        ...prev,
        {
          tokenId: newItem.tokenId,
          name: newItem.name,
          description: newItem.description,
          uri: newItem.imageURI,
          attribute: newItem.attributes[0]?.trait_type || "", // show first trait
        },
      ]);

      setNewItem({
        tokenId: "",
        name: "",
        description: "",
        imageURI: "",
        attributes: [
          {
            trait_type: "",
            value: "",
            display_type: "",
          },
        ],
      });

      onDataRefresh?.();
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Transaction failed: " + (error as any)?.reason ?? "Unknown error");
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: "1.5rem" }}>Manage Inventory System</h3>
      <div className="grid grid-2">
        <div>
          <div className="card">
            <h4>Add New Item Type</h4>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label className="form-label">Token ID</label>
                <input
                  type="text"
                  value={newItem.tokenId}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, tokenId: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="form-input"
                  placeholder="e.g., Magic Potion"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="form-input"
                  placeholder="e.g., Restores health by 50 points"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URI</label>
                <input
                  type="text"
                  value={newItem.imageURI}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      imageURI: e.target.value,
                    }))
                  }
                  className="form-input"
                  placeholder="e.g., https://example.com/potion.png"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newItem.attribute}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      attribute: e.target.value,
                    }))
                  }
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
              <h5>Attributes</h5>
              {newItem.attributes.map((attr, index) => (
                <div
                  key={index}
                  className="form-group"
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "1rem",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Trait Type (e.g. Damage)"
                    value={attr.trait_type}
                    onChange={(e) => {
                      const updated = [...newItem.attributes];
                      updated[index].trait_type = e.target.value;
                      setNewItem({ ...newItem, attributes: updated });
                    }}
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 10)"
                    value={attr.value}
                    onChange={(e) => {
                      const updated = [...newItem.attributes];
                      updated[index].value = e.target.value;
                      setNewItem({ ...newItem, attributes: updated });
                    }}
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Display Type (e.g. number)"
                    value={attr.display_type}
                    onChange={(e) => {
                      const updated = [...newItem.attributes];
                      updated[index].display_type = e.target.value;
                      setNewItem({ ...newItem, attributes: updated });
                    }}
                    className="form-input"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setNewItem((prev) => ({
                    ...prev,
                    attributes: [
                      ...prev.attributes,
                      { trait_type: "", value: "", display_type: "" },
                    ],
                  }))
                }
                className="btn btn-secondary"
              >
                Add Another Attribute
              </button>

              <button type="submit" className="btn btn-primary">
                Add Item Type
              </button>
            </form>
          </div>
        </div>

        <AllItemsList allItems={game.allItems} />
      </div>
    </div>
  );
}
