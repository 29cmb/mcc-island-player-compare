import * as fs from 'fs'

export const ResponseCodes = {
    INVALID_SERVER_CREDENTIALS: 0,
    PLAYER_LOOKUP_FAILED: 1,
    INVALID_PLAYERS: 2
}

const query: string = `
query playerData($player1: String!, $player2: String!) {
  player1: playerByUsername(username: $player1) {
    ...PlayerFields
  }

  player2: playerByUsername(username: $player2) {
    ...PlayerFields
  }
}

fragment PlayerFields on Player {
  ranks
  mccPlusStatus {
    evolution
  }
  badges {
    badge {
      goal {
        ... on Statistic {
          key
        }
      }
      name
      stages {
        trophies
      }
    }
    stageProgress {
      stage
      progress {
        obtainable
        obtained
      }
    }
  }
  collections {
    cosmetics {
      owned
      chromaPacks
      donationsMade
      cosmetic {
        colorable
        collection
        trophies
        isBonusTrophies
        royalReputation {
          donationLimit
          reputationAmount
        }
      }
    }
  }
  crownLevel {
    levelData {
      level
    }
    overall_trophies: trophies {
      ...TrophyCounts
    }
    
    skill_trophies: trophies(category: SKILL) {
      ...TrophyCounts
    }
    style_trophies: trophies(category: STYLE) {
      ...TrophyCounts
    }
    angler_trophies: trophies(category: ANGLER) {
      ...TrophyCounts
    }
  }
}

fragment TrophyCounts on TrophyData {
  obtained
  obtainable
}
`

const TEST_DATA = JSON.parse(fs.readFileSync("test_data.json", "utf-8"))
const USE_PRODUCTION_DATA_IN_DEV = false

export default async function getData(user1: string, user2: string): Promise<{ success: boolean } & ({ code: number } | { data: ComparisonData })> {
    if(!process.env.NOXCREW_API_KEY) {
        return { success: false, code: ResponseCodes.INVALID_SERVER_CREDENTIALS }
    }

    let mccIslandData
    try {
        if(process.env.NODE_ENV == "development" && !USE_PRODUCTION_DATA_IN_DEV) {
            mccIslandData = TEST_DATA
        } else {
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
        }
    } catch(err) {
        console.error(`An error occurred when trying to get player data: ${err}`)
        return { success: false, code: ResponseCodes.PLAYER_LOOKUP_FAILED }
    }

    if(mccIslandData.errors) {
        console.error(`An error occurred when trying to get player data:`, mccIslandData.errors)
        return { success: false, code: ResponseCodes.PLAYER_LOOKUP_FAILED }
    }

    if(!mccIslandData.data.player1 || !mccIslandData.data.player2) {
        return { success: false, code: ResponseCodes.INVALID_PLAYERS }
    }

    return { success: true, ...mccIslandData }
}

export type SuccessfulComparisonDataResponse = {
    success: true,
    data: ComparisonData
}

export type UnsuccessfulComparisonDataResponse = {
    success: false,
    code: number
}

export type ComparisonData = {
    player1: PlayerComparisonData,
    player2: PlayerComparisonData
}

export type PlayerComparisonData = {
    ranks: Rank[]
    badges: Badge[]
    mccPlusStatus?: {
        evolution: number
    }
    collections: {
        cosmetics: CosmeticOwnershipState[]
    }
    crownLevel: {
        levelData: {
            level: number
        },
        overall_trophies: {
            obtained: number,
            obtainable: number,
        },
        skill_trophies: {
            obtained: number,
            obtainable: number,
        },
        style_trophies: {
            obtained: number,
            obtainable: number,
        },
        angler_trophies: {
            obtained: number,
            obtainable: number,
        }
    }
}

export type Badge = {
    badge: {
        goal: {
            key?: string
        },
        stages: {
            trophies: number
        }[]
    },
    stageProgress: {
        stage: number,
        progress: {
            obtainable: number,
            obtained: number
        }
    }[]
}

export type CosmeticOwnershipState = {
    owned: boolean,
    chromaPacks: string[]
    donationsMade: number
    cosmetic: {
        colorable: boolean
        collection: string,
        trophies: number,
        isBonusTrophies: number,
        royalReputation?: {
            donationLimit: number,
            reputationAmount: number
        }
    }
}

type Rank = "NOXCREW" | "GRAND_CHAMP_SUPREME" | "GRAND_CHAMP_ROYALE" | "GRAND_CHAMP" | "CHAMP" | "CONTESTANT" | "CREATOR"