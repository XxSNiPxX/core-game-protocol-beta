import { ethers } from "ethers";
import GameDataFacetV1 from "@/contracts/abi/GameDataFacetV1.json";
import FacetRegistryFacet from "@/contracts/abi/FacetRegistryFacet.json";
import type { Game } from "../types";
import { GameState } from "../types";

const REQUIRED_FACETS = {
  metadata: "GameInfoFacet",
  inventory: "InventoryFacet",
  passport: "PassportFacet",
  gameplay: "GameDataFacetV1",
};

function determineGameState(facetNames: string[]): GameState {
  const hasMetadata = facetNames.includes(REQUIRED_FACETS.metadata);
  const hasInventory = facetNames.includes(REQUIRED_FACETS.inventory);
  const hasPassport = facetNames.includes(REQUIRED_FACETS.passport);
  const hasGameplay = facetNames.includes(REQUIRED_FACETS.gameplay);

  if (hasMetadata && hasInventory && hasPassport && hasGameplay) {
    return GameState.ACTIVE;
  } else if (hasMetadata || hasInventory || hasPassport) {
    return GameState.CONFIGURED;
  } else {
    return GameState.BARE;
  }
}

function mapTraits(traits: any[]): any[] {
  return traits.map((t: any) => {
    if (Array.isArray(t)) {
      const [trait_type, value, display_type, uri] = t;
      return { trait_type, value, display_type, uri };
    }
    return t;
  });
}

function mapMetadata(metadataArr: any[]): any[] {
  return metadataArr.map((m: any) => {
    if (Array.isArray(m)) {
      const [trait_type, value, uri] = m;
      return { trait_type, value, uri };
    }
    return m;
  });
}

export async function fetchGameFromChain(
  contractAddress: string,
): Promise<Game> {
  const provider = new ethers.BrowserProvider(window.ethereum);

  const dataFacet = new ethers.Contract(
    contractAddress,
    GameDataFacetV1.abi,
    provider,
  );
  const facetRegistry = new ethers.Contract(
    contractAddress,
    FacetRegistryFacet.abi,
    provider,
  );

  let facetMap: Record<string, string> = {};
  let facetNames: string[] = [];
  let gameDataFacet = "";
  let globalInfo: any = {};
  let metadata: any = {};
  let pubKeys: string[] = [];
  let gameState: GameState = GameState.BARE;

  const now = new Date().toISOString();

  try {
    const [addresses, names] = await facetRegistry.getAllFacets();
    facetMap = Object.fromEntries(
      names.map((name: string, i: number) => [name, addresses[i]]),
    );
    facetNames = Object.keys(facetMap);
    gameDataFacet = facetMap[REQUIRED_FACETS.gameplay] || "";
  } catch (err) {
    console.warn("❌ Failed to fetch facets:", err);
  }

  try {
    globalInfo = await dataFacet.getGlobalGameInfo();
    metadata = globalInfo.metadata || {};

    if (globalInfo.deployedFacets?.length > 0) {
      facetMap = Object.fromEntries(
        globalInfo.deployedFacets.map((f: any) => [f.name, f.facetAddress]),
      );
      facetNames = Object.keys(facetMap);
      gameDataFacet = facetMap[REQUIRED_FACETS.gameplay] || "";
    }
  } catch (err) {
    console.warn("❌ Failed to fetch global game info:", err);
  }

  // Determine game state
  gameState = determineGameState(facetNames);

  // Fetch authorized users directly
  try {
    const infoFacet = new ethers.Contract(
      contractAddress,
      ["function getAuthorizedUsers() view returns (address[])"],
      provider,
    );
    pubKeys = await infoFacet.getAuthorizedUsers();
  } catch (e) {
    console.warn("⚠️ Could not fetch authorized users:", e);
  }

  // Socials
  const socials = metadata.socials || {};
  const extractSocial = (key: keyof typeof socials): string =>
    socials[key] || "";

  const game: Game = {
    id: contractAddress,
    name: metadata.name || "",
    description: metadata.description || "",
    genre: metadata.genre || "",
    coverImageUrl: metadata.imageURI || "",
    gameLinkUrl: metadata.gameLink || "",
    supportEmail: metadata.supportEmail || "",
    websiteUrl: metadata.website || "",

    twitter: extractSocial("twitter"),
    discord: extractSocial("discord"),
    telegram: extractSocial("telegram"),
    youtube: extractSocial("youtube"),
    tiktok: extractSocial("tiktok"),
    instagram: extractSocial("instagram"),

    contractAddress,
    passportContract: facetMap[REQUIRED_FACETS.passport] || "",
    inventoryContract: facetMap[REQUIRED_FACETS.inventory] || "",
    gameInfoFacet: facetMap[REQUIRED_FACETS.metadata] || "",
    gameDataFacet,
    pubKeys,

    gameState,
    createdAt: now,
    lastUpdated: now,

    totalPassports: Number(globalInfo.totalPassports || 0),
    totalItems: Number(globalInfo.totalItems || 0),

    allItems: (globalInfo.allItems || []).map((entry: any) => {
      const [tokenId, name, description, imageURI, attributes] = entry;
      return {
        tokenId: Number(tokenId),
        name,
        description,
        uri: imageURI,
        attributes: mapTraits(attributes),
      };
    }),

    globalPassportTraits: mapTraits(globalInfo.globalPassportTraits || []),
    globalUserMetadata: mapMetadata(globalInfo.globalUserMetadata || []),
  };

  return game;
}
