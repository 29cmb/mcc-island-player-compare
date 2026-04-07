export const ResponseCodes = {
    INVALID_SERVER_CREDENTIALS: 0,
    PLAYER_LOOKUP_FAILED: 1
}

const query: string = `
query playerData($player1: String!, $player2: String!) {
  player1: playerByUsername(username: $player1) {
    crownLevel {
      overall_trophies: trophies {
        obtained
        obtainable
      }

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
      overall_trophies: trophies {
        obtained
        obtainable
      }
      
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

const USE_TEST_DATA = false

export default async function getData(user1: string, user2: string): Promise<{ success: boolean } & ({ code: number } | { data: ComparisonData })> {
    if(!process.env.NOXCREW_API_KEY) {
        return { success: false, code: ResponseCodes.INVALID_SERVER_CREDENTIALS }
    }

    let mccIslandData
    try {
        if(USE_TEST_DATA) {
            mccIslandData = {
                data: {
                    player1: {
                        crownLevel: {
                            overall_trophies: {
                                obtained: 1,
                                obtainable: 2
                            },
                            skill_trophies: {
                                obtained: 1,
                                obtainable: 2,
                            },
                            style_trophies: {
                                obtained: 1,
                                obtainable: 2,
                            },
                            angler_trophies: {
                                obtained: 1,
                                obtainable: 2,
                            }
                        }
                    },
                    player2: {
                        crownLevel: {
                            overall_trophies: {
                                obtained: 2,
                                obtainable: 2
                            },
                            skill_trophies: {
                                obtained: 2,
                                obtainable: 2,
                            },
                            style_trophies: {
                                obtained: 2,
                                obtainable: 2,
                            },
                            angler_trophies: {
                                obtained: 2,
                                obtainable: 2,
                            }
                        }
                    }
                }
            }
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

    return { success: true, ...mccIslandData }
}

export type SuccessfulComparisonDataResponse = {
    success: true,
    data: ComparisonData
}

export type ComparisonData = {
    player1: PlayerComparisonData,
    player2: PlayerComparisonData
}

export type PlayerComparisonData = {
    crownLevel: {
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