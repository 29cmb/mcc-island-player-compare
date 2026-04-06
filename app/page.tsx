"use client"

import { BorderButton } from "@/components/BorderButton"
import Image from "next/image"
import { useRef, useState } from "react"
import { useRouter } from "next/router"
import { redirect } from "next/navigation"
export default function Home() {
  const player1Input = useRef<HTMLInputElement>(null)
  const player2Input = useRef<HTMLInputElement>(null)

  return <>
    <div className="flex flex-col min-h-screen justify-center items-center">
      <Image 
        src="https://cdn2.steamgriddb.com/logo_thumb/14edf56c2a2ce0f05d20e535759f4ee9.png" 
        width={350} 
        height={0} 
        loading="eager" 
        alt="MCC Island Logo"
        className="m-3"
      />
      <p className="text-2xl">Player Compare</p>
      <input className="bg-[#1f1f1f] p-2 rounded-2xl w-100 m-1 border-[#3b3b3b] border focus:outline-none focus:w-110 transition-all" ref={player1Input} placeholder="Player 1"/>
      <input className="bg-[#1f1f1f] p-2 rounded-2xl w-100 m-1 border-[#3b3b3b] border focus:outline-none focus:w-110 transition-all" ref={player2Input} placeholder="Player 2"/>
      <BorderButton text="Compare" onClick={() => redirect(`/compare/${encodeURIComponent(player1Input.current!.value)}/${encodeURIComponent(player2Input.current!.value)}`)}/>
    </div>
  </>
}
