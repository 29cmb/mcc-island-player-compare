import Skin from "@/components/Skin"
import getData, { PlayerComparisonData, SuccessfulComparisonDataResponse } from "@/lib/getData"
import Image from "next/image"

export default async function ComparePage({ params }: { params: Promise<{ user1: string, user2: string }> }) {
    const { user1, user2 } = await params
    const dataResult = await getData(user1, user2)
    console.log(dataResult)

    if(!dataResult.success) {
        return <p>An error occurred when trying to fetch user data</p>
    }

    const data = (dataResult as SuccessfulComparisonDataResponse).data

    return <div className="flex align-center m-auto">
        <ComparisonBox username={user1} data={data.player1}/>
        <ComparisonBox username={user2} data={data.player2}/>
    </div>
}

function ComparisonBox({ username, data }: { username: string, data: PlayerComparisonData }) {
    return <div className="flex flex-col m-2">
        <Skin username={username} />
        <div className="bg-[#030303] rounded-2xl flex flex-col pb-2">
            <p className="text-center font-inter font-bold text-3xl m-2">{username}</p>
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