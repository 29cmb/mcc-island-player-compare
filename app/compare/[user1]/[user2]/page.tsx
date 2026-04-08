import FanojugSkin from "@/components/FanojugSkin"
import Skin from "@/components/Skin"
import getData, { PlayerComparisonData, ResponseCodes, SuccessfulComparisonDataResponse, UnsuccessfulComparisonDataResponse } from "@/lib/getData"
import Image from "next/image"

const CodeResponses = {
    [ResponseCodes.INVALID_PLAYERS]: "One or both of the players were not found or have not logged in recently!",
    [ResponseCodes.INVALID_SERVER_CREDENTIALS]: "Server is not set up correctly!",
    [ResponseCodes.PLAYER_LOOKUP_FAILED]: "Internal Error!"
}

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

export default async function ComparePage({ params }: { params: Promise<{ user1: string, user2: string }> }) {
    const { user1, user2 } = await params
    const dataResult = await getData(user1, user2)

    if(!dataResult.success) {
        return <p className="text-center m-10">{CodeResponses[(dataResult as UnsuccessfulComparisonDataResponse).code] || "An error occurred when trying to fetch user data"}</p>
    }

    const data = (dataResult as SuccessfulComparisonDataResponse).data
    console.log(data)

    return <div className="flex align-center m-auto">
        <ComparisonBox username={user1} data={data.player1}/>
        <ComparisonBox username={user2} data={data.player2}/>
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
        {username == "fanojug" ? <FanojugSkin/> : <Skin username={username} />}
        <div className="bg-[#030303] rounded-2xl flex flex-col pb-2">
            <div className="flex flex-row m-auto">
                <div className="flex flex-row items-center gap-1 shrink-0">
                    {icons.map((item, index) => 
                        // using regular images because nextjs ones don't have good pixel upscaling
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item}
                            key={index}
                            alt="Rank icon"
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
            <p className="text-gray-700 text-[10px]">/ {total}</p>
        </div>
    </div>
}