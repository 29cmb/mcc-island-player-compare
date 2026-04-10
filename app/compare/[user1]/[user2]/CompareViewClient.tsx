"use client"
import Skin from "@/components/Skin"
import SkinOverride from "@/components/SkinOverride"
import { ComparisonData, PlayerComparisonData } from "@/lib/getData"
import Image from "next/image"
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react"
import { redirect } from "next/navigation"

const RankPriorities = {
    "NOXCREW": 1,
    "CONTESTANT": 2,
    "MODERATOR": 3,
    "CREATOR": 4,
    "GRAND_CHAMP_SUPREME": 5,
    "GRAND_CHAMP_ROYALE": 6,
    "GRAND_CHAMP": 7,
    "CHAMP": 8
}

const SkinEasterEggs: { [name: string]: string } = {
    "fanojug": "/FanojuygPlush.gif",
    "nibbl_z": "/RalseiPlush.gif"
}

export default function CompareViewClient({ user1, user2, data }: { user1: string, user2: string, data: ComparisonData }) {
    const playerSearchBoxState = useState<number | null>(null)

    return <>
        <div className="flex justify-center bg-[#202020] w-[60em] h-15 rounded-2xl my-3 mx-auto"> 
            <TopbarBox username={user1} state={playerSearchBoxState} index={1} otherUser={user2}/>
            <TopbarBox username={user2} state={playerSearchBoxState} index={2} otherUser={user1}/>
        </div>
        <div className="flex flex-col mx-auto items-center">
            <div className="flex flex-row">
                <PlayerComparisonBox username={user1} data={data.player1}/>
                <PlayerComparisonBox username={user2} data={data.player2}/>
            </div>
            <ComparisonBreakdown user1={user1} user2={user2} data={data}/>
        </div>
    </>
}

function TopbarBox({ username, state, index, otherUser }: { username: string, state: [number | null, Dispatch<SetStateAction<number | null>>], index: number, otherUser: string }) {
    const [openTopbarBox, setOpenTopbarBox] = state
    const inputRef = useRef<HTMLInputElement>(null)

    return <div className="relative flex justify-center m-2 w-[50%]">
        <button className="bg-[#3c3c3c] rounded-2xl w-full hover:bg-[#4c4c4c] transition-all" onClick={() => {
            inputRef.current!.value = ""
            setOpenTopbarBox(openTopbarBox == index ? 0 : index)
        }}>
            <div className="flex m-auto items-center">
                <img className="w-8 h-8 mx-2 ml-4" src={`https://minotar.net/helm/${username}/100.png`} alt="Player head"/>
                <p className="font-bold text-2xl mx-2">{username}</p>
            </div>
        </button>

        <div className="absolute w-full h-13 bg-[#181818] rounded-2xl top-full mt-3" style={{ display: openTopbarBox == index ? "block" : "none" }}>
            <form className="w-full h-full rounded-2xl bg-[#101010]" onSubmit={(event) => {
                event.preventDefault()
                redirect(index == 1 ? 
                    `/compare/${inputRef.current!.value}/${otherUser}` 
                    : `/compare/${otherUser}/${inputRef.current!.value}`
                )
            }}>
                <input className="w-full h-full rounded-2xl p-3 focus:outline-none border-2 border-[#3e3e3e] focus:border-[#8a8a8a]" ref={inputRef} placeholder="New player"/>
            </form>
        </div>
    </div>
}

function PlayerComparisonBox({ username, data }: { username: string, data: PlayerComparisonData }) {
    const icons = []
    if(data.ranks.length == 0) {
        icons.push("https://islandcdn.themysterys.com/ranks/default.png")
    } else {
        const highestRank = data.ranks.reduce((lowest, current) =>
            RankPriorities[current] < RankPriorities[lowest] ? current : lowest
        )
        icons.push(`https://islandcdn.themysterys.com/ranks/${highestRank.toLowerCase()}.png`)
    }
    icons.push(`https://islandcdn.themysterys.com/icons/crowns/${Math.min(Math.floor(data.crownLevel.levelData.level / 10), 10)}.png`)
    const mccPlusIcon = data.mccPlusStatus ? `https://islandcdn.themysterys.com/ranks/plus_${data.mccPlusStatus.evolution + 1}_simple.png` : null

    return <div className="flex flex-col m-2">
        {SkinEasterEggs[username] ? <SkinOverride image={SkinEasterEggs[username]}/> : <Skin username={username} />}
        <div className="bg-[#060606] rounded-2xl flex flex-col pb-2">
            <div className="flex flex-row m-auto">
                <div className="flex flex-row items-center gap-1 shrink-0">
                    {icons.map((item, index) => 
                        // using regular images because nextjs ones don't have good pixel upscaling
                        <img
                            src={item}
                            key={index}
                            alt="Username icon"
                            className="w-7.5 object-contain flex-none"
                        />
                    )}
                </div>
                <p className="text-center font-inter font-bold text-3xl m-2">{username}</p>
                {mccPlusIcon && 
                    <div className="flex flex-row items-center gap-1 shrink-0">
                        <img src={mccPlusIcon} alt="MCC+ Icon" className="w-7.5 object-contain flex-none"/>
                    </div>
                }
            </div>
            <TrophyDisplay amount={data.crownLevel.overall_trophies.obtained} total={data.crownLevel.overall_trophies.obtainable} color="yellow"/>
            <TrophyDisplay amount={data.crownLevel.skill_trophies.obtained} total={data.crownLevel.skill_trophies.obtainable} color="red"/>
            <TrophyDisplay amount={data.crownLevel.style_trophies.obtained} total={data.crownLevel.style_trophies.obtainable} color="purple"/>
            <TrophyDisplay amount={data.crownLevel.angler_trophies.obtained} total={data.crownLevel.angler_trophies.obtainable} color="blue"/>
        </div>
    </div>
}

function TrophyDisplay({ amount, total, color }: { amount: number, total: number, color: string }) {
    return <div className="flex flex-row m-auto items-center">
        <Image 
            src={`https://islandcdn.themysterys.com/icons/trophies/${color}.png`}
            height={35} 
            width={35}
            alt = "Skill Trophies"
            className="m-1"
        />
        <div className="flex flex-row items-baseline">
            <p className="font-bold">{amount}&nbsp;</p>
            <p className="text-gray-600 text-[10px]">/ {total}</p>
        </div>
    </div>
}

const Tabs: { [id: string]: (user1: string, user2: string, data: ComparisonData) => ReactNode } = {
    ["skill"]: (user1, user2, data) => {
        return <div className="grid grid-cols-2 gap-3 p-4 h-full overflow-x-hidden overflow-y-scroll recolored-scrollbar">
            <GameCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box" badgeKey="battle_box_quads"/>
            <GameCard image="https://islandcdn.themysterys.com/games/sky_battle/icon.png" user1={user1} user2={user2} data={data} name="Sky Battle" badgeKey="sky_battle_quads"/>
            <GameCard image="https://islandcdn.themysterys.com/games/parkour_warrior/icon.png" user1={user1} user2={user2} data={data} name="Parkour Warrior" badgeKey="pw"/>
            <GameCard image="https://islandcdn.themysterys.com/games/dynaball/icon.png" user1={user1} user2={user2} data={data} name="Dynaball" badgeKey="dynaball"/>
            <GameCard image="https://islandcdn.themysterys.com/games/tgttos/icon.png" user1={user1} user2={user2} data={data} name="TGTTOS" badgeKey="tgttos"/>
            <GameCard image="https://islandcdn.themysterys.com/games/hitw/icon.png" user1={user1} user2={user2} data={data} name="Hole In The Wall" badgeKey="hole_in_the_wall"/>
            <GameCard image="https://islandcdn.themysterys.com/games/rocket_spleef/icon.png" user1={user1} user2={user2} data={data} name="Rocket Spleef Rush" badgeKey="rocket_spleef"/>
        </div>
    },
    ["style"]: (user1, user2, data) => {
        return <div className="grid grid-cols-2 gap-3 p-4 h-full overflow-x-hidden overflow-y-scroll recolored-scrollbar">
            {getCollections(data.player1).map((element, index) => {
                const snakeCaseCollection = element.toLowerCase().replaceAll(" ", "_")
                return <StyleCard image={`https://islandcdn.themysterys.com/icons/wardrobe/${snakeCaseCollection}.png`} key={index} name={element} user1={user1} user2={user2} data={data} />
            })}
            {/* <StyleCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box"/>
            <StyleCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box"/>
            <StyleCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box"/>
            <StyleCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box"/>
            <StyleCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box"/>
            <StyleCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box"/>
            <StyleCard image="https://islandcdn.themysterys.com/games/battle_box/icon.png" user1={user1} user2={user2} data={data} name="Battle Box"/> */}
        </div>
    },
    ["fishing"]: () => {
        return <div className="flex flex-col items-center">
            <p className="font-bold mt-2">Coming Soon™️</p>
        </div>
    }
}

function ComparisonBreakdown({ user1, user2, data }: { user1: string, user2: string, data: ComparisonData }) {
    const tabState = useState<string>("style")
    const [selectedTab] = tabState

    return <div className="flex flex-col mx-auto w-full h-auto rounded-2xl">
        <div className="w-full flex flex-row h-14 items-end">
            <TrophyTabIcon id="skill" trophyColor="red" tabState={tabState}/>
            <TrophyTabIcon id="style" trophyColor="purple" tabState={tabState}/>
            <TrophyTabIcon id="fishing" trophyColor="blue" tabState={tabState}/>
        </div>
        <div className="w-full h-[33vh] mb-10 rounded-b-2xl rounded-tr-2xl bg-[#060606]">
            {Tabs[selectedTab](user1, user2, data)}
        </div>
    </div>
}

function TrophyTabIcon({ id, trophyColor, tabState }: { id: string, trophyColor: string, tabState: [string, Dispatch<SetStateAction<string>>] }) {
    const [selectedTab, setSelectedTab] = tabState

    return <button className="rounded-t-2xl transition-all" style={{ backgroundColor: selectedTab == id ? "#060606" : "#030303" }} onClick={() => setSelectedTab(id)}>
        <img alt="Trophy Icon" className="p-2 transition-all" style={{ width: selectedTab == id ? "56px" : "48px", filter: selectedTab != id ? "brightness(50%)": "none" }} src={`https://islandcdn.themysterys.com/icons/trophies/${trophyColor}.png`}/>
    </button>
}

function GameCard({ image, name, user1, user2, data, badgeKey }: { image: string, name: string, user1: string, user2: string, data: ComparisonData, badgeKey: string }) {
    const [player1Trophies, totalGameTrophies] = getPlayerTrophies(data.player1, badgeKey)
    const [player2Trophies] = getPlayerTrophies(data.player2, badgeKey)

    return <StandardComparisonCard 
        image={image}
        name={name} 
        trophyColor="red" 
        totalTrophies={totalGameTrophies}
    >
        <div className="flex flex-row items-center gap-1">
            <div className="flex flex-row items-center">
                <div className="bg-[#2f2f2f] rounded-full">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(transparent 0% ${(1 - (player1Trophies / totalGameTrophies)) * 100}%, lime ${(1 - (player1Trophies / totalGameTrophies)) * 100}% 100%)` }}>
                        <img className="justify-center m-auto border border-black" src={`https://minotar.net/helm/${user1}/20.png`} alt="Player head"/>
                    </div>
                </div>
                <img src={`https://islandcdn.themysterys.com/icons/trophies/red.png`} className="w-5 ml-1" alt="Skill trophy icon"/>
                <p className="m-1">{player1Trophies}</p>
            </div>
            <div className="flex flex-row items-center">
                <div className="bg-[#2f2f2f] rounded-full">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(transparent 0% ${(1 - (player2Trophies / totalGameTrophies)) * 100}%, lime ${(1 - (player2Trophies / totalGameTrophies)) * 100}% 100%)` }}>
                        <img className="justify-center m-auto border border-black" src={`https://minotar.net/helm/${user2}/20.png`} alt="Player head"/>
                    </div>
                </div>
                <img src={`https://islandcdn.themysterys.com/icons/trophies/red.png`} className="w-5 ml-1" alt="Skill trophy icon"/>
                <p className="m-1">{player2Trophies}</p>
            </div>
        </div>
    </StandardComparisonCard>
}

function StyleCard({ image, name, user1, user2, data }: { image: string, name: string, user1: string, user2: string, data: ComparisonData }) {
    const styleTrophies = getCollectionTotalStyleTrophies(data.player1, name)
    const bonusTrophies = getCollectionTotalBonusTrophies(data.player1, name)
    const reputation = getCollectionTotalReputation(data.player1, name)
    const chromas = getCollectionTotalChromaTrophies(data.player1, name)

    const isBonus = styleTrophies == 0

    const [player1StyleTrophies, player1Rep, player1Chromas, player1BonusTrophies] = getPlayerStyleTrophies(data.player1, name)
    const [player2StyleTrophies, player2Rep, player2Chromas, player2BonusTrophies] = getPlayerStyleTrophies(data.player2, name)

    const player1StyleTrophyPercentage = player1StyleTrophies / styleTrophies
    const player2StyleTrophyPercentage = player2StyleTrophies / styleTrophies

    const player1ReputationPercentage = player1Rep / reputation
    const player2ReputationPercentage = player2Rep / reputation

    const player1BonusTrophyPercentage = player1BonusTrophies / bonusTrophies
    const player2BonusTrophyPercentage = player2BonusTrophies / bonusTrophies

    return <StandardComparisonCard 
        image={image}
        name={name} 
        trophyColor={!isBonus ? "purple" : "silver"}
        totalTrophies={!isBonus ? styleTrophies + reputation + chromas : bonusTrophies}
    >
        <div className="flex flex-row items-center gap-1">
            <div className="flex flex-row items-center">
                <div className="bg-[#2f2f2f] rounded-full">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(transparent 0% ${(1 - (isBonus ? player1BonusTrophyPercentage : player1StyleTrophyPercentage)) * 100}%, lime ${(1 - (isBonus ? player1BonusTrophyPercentage : player1StyleTrophyPercentage)) * 100}% 100%)` }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(transparent 0% ${(1 - player1ReputationPercentage) * 100}%, #9600ff ${(1 - player1ReputationPercentage) * 100}% 100%)` }}>            
                            <img className="justify-center m-auto border border-black" src={`https://minotar.net/helm/${user1}/20.png`} alt="Player head"/>
                        </div>
                    </div>
                </div>
                <img src={`https://islandcdn.themysterys.com/icons/trophies/${isBonus ? "silver" : "purple"}.png`} className="w-5 ml-1" alt="Skill trophy icon"/>
                <p className="m-1">{isBonus ? player1BonusTrophies : player1StyleTrophies}</p>
                {!isBonus && <>
                    <img src={`https://islandcdn.themysterys.com/icons/currency/royal_reputation.png`} className="w-5 ml-1" alt="Skill trophy icon"/>
                    <p className="m-1">{player1Rep}</p>
                </>}
                <img src={`https://islandcdn.themysterys.com/icons/chroma_pack/prismatic.webp`} className="w-5 ml-1" alt="Skill trophy icon"/>
                <p className="m-1">{player1Chromas}</p>
            </div>
            <div className="flex flex-row items-center">
                <div className="bg-[#2f2f2f] rounded-full">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(transparent 0% ${(1 - (isBonus ? player2BonusTrophyPercentage : player2StyleTrophyPercentage)) * 100}%, lime ${(1 - (isBonus ? player2BonusTrophyPercentage : player2StyleTrophyPercentage)) * 100}% 100%)` }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(transparent 0% ${(1 - player2ReputationPercentage) * 100}%, #9600ff ${(1 - player2ReputationPercentage) * 100}% 100%)` }}>            
                            <img className="justify-center m-auto border border-black" src={`https://minotar.net/helm/${user2}/20.png`} alt="Player head"/>
                        </div>
                    </div>
                </div>
                <img src={`https://islandcdn.themysterys.com/icons/trophies/${isBonus ? "silver" : "purple"}.png`} className="w-5 ml-1" alt="Skill trophy icon"/>
                <p className="m-1">{isBonus ? player2BonusTrophies : player2StyleTrophies}</p>
                {!isBonus && <>
                    <img src={`https://islandcdn.themysterys.com/icons/currency/royal_reputation.png`} className="w-5 ml-1" alt="Skill trophy icon"/>
                    <p className="m-1">{player2Rep}</p>
                </>}
                <img src={`https://islandcdn.themysterys.com/icons/chroma_pack/prismatic.webp`} className="w-5 ml-1" alt="Skill trophy icon"/>
                <p className="m-1">{player2Chromas}</p>
            </div>
        </div>
    </StandardComparisonCard>
}

function StandardComparisonCard(
    { children, image, name, trophyColor, totalTrophies }: 
    { children?: ReactNode, image: string, name: string, trophyColor: string, totalTrophies: number }
) {
    return <div className="w-120 h-full bg-[#0c0c0c] rounded-2xl p-2">
        <div className="flex flex-row items-center gap-2 m-1">
            <img src={image} alt="Game image" className="w-12"/>
            <p className="font-bold text-3xl pr-3">{name}</p>
        </div>
        <div className="flex flex-row items-center m-1 mt-2">
            <img src={`https://islandcdn.themysterys.com/icons/trophies/${trophyColor}.png`} className="w-8" alt="Skill trophy icon"/>
            <p className="font-bold text-xl px-2">{totalTrophies}</p>
        </div>
        {children}
    </div>
}

function getCollections(data: PlayerComparisonData) {
    return [...new Set(data.collections.cosmetics.map(c => c.cosmetic.collection))]
}

function getCollectionTotalStyleTrophies(data: PlayerComparisonData, collection: string) {
    const cosmetics = data.collections.cosmetics.filter(item => item.cosmetic.collection == collection)
    return cosmetics.reduce((partialSum, currentValue) => {
        let trophyPotential = 0
        if(!currentValue.cosmetic.isBonusTrophies) {
            trophyPotential += currentValue.cosmetic.trophies
        }

        return partialSum + trophyPotential
    }, 0)
}

function getCollectionTotalBonusTrophies(data: PlayerComparisonData, collection: string) {
    const cosmetics = data.collections.cosmetics.filter(item => item.cosmetic.collection == collection)
    return cosmetics.reduce((partialSum, currentValue) => {
        let trophyPotential = 0
        if(currentValue.cosmetic.isBonusTrophies) {
            trophyPotential += currentValue.cosmetic.trophies
        }

        return partialSum + trophyPotential
    }, 0)
}

function getCollectionTotalChromaTrophies(data: PlayerComparisonData, collection: string) {
    const cosmetics = data.collections.cosmetics.filter(item => item.cosmetic.collection == collection)
    return cosmetics.reduce((partialSum, currentValue) => 
        partialSum + (currentValue.cosmetic.colorable && !currentValue.cosmetic.isBonusTrophies && currentValue.cosmetic.trophies != 0 ? 10 : 0)
    , 0)
}

function getCollectionTotalReputation(data: PlayerComparisonData, collection: string) {
    const cosmetics = data.collections.cosmetics.filter(item => item.cosmetic.collection == collection)
    return cosmetics.reduce((partialSum, currentValue) => 
        partialSum + (currentValue.cosmetic.royalReputation ? currentValue.cosmetic.royalReputation.reputationAmount * currentValue.cosmetic.royalReputation.donationLimit : 0)
    , 0)
}

function getPlayerStyleTrophies(data: PlayerComparisonData, collection: string) {
    const cosmetics = data.collections.cosmetics.filter(item => item.cosmetic.collection == collection)
    const trophies = cosmetics.reduce((partialSum, currentValue) =>
        partialSum + (currentValue.owned && !currentValue.cosmetic.isBonusTrophies ? currentValue.cosmetic.trophies : 0)
    , 0)
    const reputation = cosmetics.reduce((partialSum, currentValue) =>
        partialSum + (currentValue.cosmetic.royalReputation == null ? 0 : currentValue.donationsMade * currentValue.cosmetic.royalReputation.reputationAmount)
    , 0)
    const chromas = cosmetics.reduce((partialSum, currentValue) => 
        partialSum + (currentValue.cosmetic.colorable && !currentValue.cosmetic.isBonusTrophies && currentValue.chromaPacks.length == 4 ? 10 : 0)
    , 0)
    const bonus = cosmetics.reduce((partialSum, currentValue) => 
        partialSum + (currentValue.cosmetic.isBonusTrophies && currentValue.owned ? currentValue.cosmetic.trophies : 0)
    , 0)

    return [trophies, reputation, chromas, bonus]
}

function getPlayerTrophies(data: PlayerComparisonData, key: string) {
    const gameBadges = data.badges.filter(value => value.badge.goal.key?.startsWith(key))
    const totalTrophies = gameBadges.reduce((partialSum, currentValue) => {
        return partialSum + currentValue.badge.stages.reduce((partialSum2, currentValue2) => partialSum2 + currentValue2.trophies, 0)
    }, 0)

    const playerEarnedTrophies = gameBadges.reduce((partialSum, currentValue) => {
        return partialSum + currentValue.stageProgress.reduce((partialSum2, currentValue2) => {
            return partialSum2 + (currentValue2.progress.obtained >= currentValue2.progress.obtainable ? currentValue.badge.stages[currentValue2.stage - 1].trophies : 0)
        }, 0)
    }, 0)

    return [playerEarnedTrophies,totalTrophies]
}