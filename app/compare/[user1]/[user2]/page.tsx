import getData, { ResponseCodes, SuccessfulComparisonDataResponse, UnsuccessfulComparisonDataResponse } from "@/lib/getData"
import CompareViewClient from "./CompareViewClient"

export const CodeResponses = {
    [ResponseCodes.INVALID_PLAYERS]: "One or both of the players were not found or have not logged in recently!",
    [ResponseCodes.INVALID_SERVER_CREDENTIALS]: "Server is not set up correctly!",
    [ResponseCodes.PLAYER_LOOKUP_FAILED]: "Internal Error!"
}

export default async function ComparePage({ params }: { params: Promise<{ user1: string, user2: string }> }) {
    const { user1, user2 } = await params
    const dataResult = await getData(user1, user2)

    if(!dataResult.success) {
        return <p className="text-center m-10">{CodeResponses[(dataResult as UnsuccessfulComparisonDataResponse).code] || "An error occurred when trying to fetch user data"}</p>
    }

    const data = (dataResult as SuccessfulComparisonDataResponse).data
    console.log(data)

    return <CompareViewClient data={data} user1={user1} user2={user2}/>
}