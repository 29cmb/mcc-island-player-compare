"use client"
import { BorderButton } from "@/components/BorderButton";
import { redirect } from "next/navigation";

export default function RateLimitPage() {
    return <div className="flex flex-col m-auto justify-center items-center">
        <p className="text-3xl">You&apos;re making requests too quickly! Try again a little later!</p>
        <BorderButton text="Go home" onClick={() => {
            redirect("/", "push")
        }} />
    </div>
}