import { NextRequest } from "next/server";

export const ResponseCodes = {
    INVALID_SERVER_CREDENTIALS: 0,
    PLAYER_LOOKUP_FAILED: 1
}

const query: string = `
query playerData($player1: String!, $player2: String!) {
  player1: playerByUsername(username: $player1) {
    crownLevel {
      skill_trophies: trophies(category: SKILL) {
        obtained
        obtainable
      }
      style_trophies: trophies(category: STYLE) {
        obtained
        obtainable
      }
      angler_trophies: trophies(category: ANGLER) {
        obtained
        obtainable
      }
    }
  }

  player2: playerByUsername(username: $player2) {
    crownLevel {
      skill_trophies: trophies(category: SKILL) {
        obtained
        obtainable
      }
      style_trophies: trophies(category: STYLE) {
        obtained
        obtainable
      }
      angler_trophies: trophies(category: ANGLER) {
        obtained
        obtainable
      }
    }
  }
}
`

export async function GET(_req: NextRequest, ctx: RouteContext<"/compare/[user1]/[user2]/api">) {
    const { user1, user2 } = await ctx.params
    const response = await getData(user1, user2)

    return Response.json(response)
}

async function getData(user1: string, user2: string): Promise<{ success: boolean } & ({ code: number } | { data: object })> {
    if(!process.env.NOXCREW_API_KEY) {
        return { success: false, code: ResponseCodes.INVALID_SERVER_CREDENTIALS }
    }

    let mccIslandData
    try {
        mccIslandData = await fetch("https://api.mccisland.net/graphql", {
            method: "POST",
            headers: {
                "X-API-Key": process.env.NOXCREW_API_KEY,
                "User-Agent": "MCCIslandPlayerCompare (discord/@devcmb)",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "query": query,
                "variables": {
                    "player1": user1,
                    "player2": user2
                }
            })
        }).then(d => d.json())
    } catch(err) {
        console.error(`An error occurred when trying to get player data: ${err}`)
        return { success: false, code: ResponseCodes.PLAYER_LOOKUP_FAILED }
    }

    return { success: true, data: mccIslandData }
}