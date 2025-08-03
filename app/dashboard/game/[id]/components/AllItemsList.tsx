import React, { useState } from "react";
import type { Game } from "../types";

type Props = {
  allItems: Game["allItems"];
};

export default function AllItemsList({ allItems }: Props) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleExpand = (tokenId: number) => {
    setExpandedItem((prev) => (prev === tokenId ? null : tokenId));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">All Game Items</h2>
      {allItems.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        allItems.map((item) => (
          <div
            key={item.tokenId}
            className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow"
            onClick={() => toggleExpand(item.tokenId)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              {item.uri && (
                <img
                  src={item.uri}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
            </div>

            {expandedItem === item.tokenId && (
              <div className="mt-3">
                <h4 className="font-medium">Attributes:</h4>
                {item.attributes.length === 0 ? (
                  <p className="text-sm text-gray-500">No attributes.</p>
                ) : (
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {item.attributes.map((attr, idx) => (
                      <li key={idx}>
                        <strong>{attr.trait_type}:</strong> {attr.value}{" "}
                        {attr.display_type && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({attr.display_type})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
