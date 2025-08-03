import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate processing time for contract deployment
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock game creation response matching CoreGameFactory.createCoreGame
    const mockGame = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      description: body.description,
      genre: body.genre,
      coverImageUrl: body.coverImageUrl || "",
      gameLinkUrl: body.gameLinkUrl || "",
      supportEmail: body.supportEmail || "",
      socialMediaLinks: body.socialMediaLinks?.filter((link: string) => link.trim() !== "") || [],
      publicKeys: body.publicKeys?.filter((key: string) => key.trim() !== "") || [],
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      passportContract: `0x${Math.random().toString(16).substr(2, 40)}`,
      inventoryContract: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenContract: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenType: "native",
      createdAt: new Date().toISOString(),
      status: "active",
    }

    return NextResponse.json(mockGame)
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 })
  }
}

export async function GET() {
  // Mock games list - simulates CoreGameFactory.getGamesByDeveloper() and getAllGames()
  const mockGames = [
    {
      id: "1",
      name: "CyberWar 2099",
      description: "Futuristic battle royale with NFT weapons",
      genre: "Action",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Dragon Realm",
      description: "Fantasy RPG with collectible dragons",
      genre: "RPG",
      contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      createdAt: "2024-02-20",
      status: "active",
    },
  ]

  return NextResponse.json(mockGames)
}
