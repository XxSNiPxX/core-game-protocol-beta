export interface Game {
  id: string;
  name: string;
  description: string;
  genre: string;
  coverImageUrl: string;
  gameLinkUrl: string;
  supportEmail: string;
  socialMediaLinks: string[];
  contractAddress: string;
  passportContract: string;
  inventoryContract: string;
  gameDataFacet: string;
  gameInfoFacet: string;
  pubKeys: string[];
  gameState: GameState;
  createdAt: string;
  lastUpdated: string;
  twitter: string;
  discord: string;
  telegram: string;
  youtube: string;
  tiktok: string;
  instagram: string;
  websiteUrl: string;

  // 🆕 new fields
  totalPassports: number;
  totalItems: number;
  allItems: any[]; // replace `any` with actual ItemAttribute type
  globalPassportTraits: any[]; // replace with `Attribute` type
  globalUserMetadata: any[]; // replace with `MetadataField` type
}

export enum GameState {
  BARE = "bare", // Just deployed from factory
  CONFIGURED = "configured", // Has modules but no GameDataFacet
  ACTIVE = "active", // Fully initialized with GameDataFacet
}

export interface User {
  wallet: string;
  passportId: string;
  passportAttributes: Array<{
    trait_type: string;
    value: string;
    display_type: string;
    uri: string;
  }>;
  userMetadata: Array<{
    trait_type: string;
    value: string;
    uri: string;
  }>;
  inventory: Array<{
    tokenId: string;
    amount: number;
  }>;
}

export interface InventoryItem {
  tokenId: string;
  name: string;
  attribute: string;
  uri: string;
}

export interface DeployedModules {
  GameInfoFacet: boolean;
  PassportFacet: boolean;
  InventoryFacet: boolean;
  GameDataFacetv1: boolean;
}

export interface GameLifecycleStatus {
  state: GameState;
  hasMetadata: boolean;
  hasPassport: boolean;
  hasInventory: boolean;
  hasGameDataFacet: boolean;
  canProgress: boolean;
  nextStep: string;
}
