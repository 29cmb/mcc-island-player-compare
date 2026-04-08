"use client"
import Skin from "@/components/Skin"
import SkinOverride from "@/components/SkinOverride"
import { ComparisonData, PlayerComparisonData } from "@/lib/getData"
import Image from "next/image"
import { Dispatch, SetStateAction, useRef, useState } from "react"
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
    "fanojug": "/FanojuygPlush.gif"
}

export default function CompareViewClient({ user1, user2, data }: { user1: string, user2: string, data: ComparisonData }) {
    const playerSearchBoxState = useState<number | null>(null)

    return <>
        <div className="flex justify-center bg-[#202020] w-[60em] h-15 rounded-2xl my-3 mx-auto"> 
            <TopbarBox username={user1} state={playerSearchBoxState} index={1} otherUser={user2}/>
            <TopbarBox username={user2} state={playerSearchBoxState} index={2} otherUser={user1}/>
        </div>
        <div className="flex mx-auto">
            <ComparisonBox username={user1} data={data.player1}/>
            <ComparisonBox username={user2} data={data.player2}/>
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

function ComparisonBox({ username, data }: { username: string, data: PlayerComparisonData }) {
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
        <div className="bg-[#030303] rounded-2xl flex flex-col pb-2">
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