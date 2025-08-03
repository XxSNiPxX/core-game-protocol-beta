export const mockWallets = [
  "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
  "0x8ba1f109551bD432803012645Hac136c5c2e2e2e",
  "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
]

export const getRandomMockWallet = () => {
  return mockWallets[Math.floor(Math.random() * mockWallets.length)]
}

export const generateMockContractAddress = () => {
  return `0x${Math.random().toString(16).substr(2, 40)}`
}
