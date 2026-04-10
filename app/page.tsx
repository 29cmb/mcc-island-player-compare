"use client"

import { BorderButton } from "@/components/BorderButton"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useRef } from "react"

const friends = [
  "Nibbl_z", 
  "fanojug", 
  "DevCmb", 
  "Enderladss", 
  "L_st", 
  "MCgamergoat", 
  "WhoSheMellow", 
  "azure_axolotl", 
  "indiglore", 
  "mossless", 
  "qGoodbye", 
  "sillybestie", 
  "BananaBoy1001", 
  "Celestiya", 
  "DANYX__", 
  "Dreaxy_", 
  "ElRoniMC", 
  "MatMart",
  "Ettze",
  "F1rePhoenix_",
  "JSMusic",
  "LordGameKnight8",
  "MeluGarg_",
  "MickeydeVos",
  "Oriukas",
  "Pears_9",
  "Pineapple_Pigeon",
  "RangerDC",
  "SunaMySuba",
  "SuperS58",
  "TheMasked_Panda",
  "Topo809",
  "Vitxu04",
  "YNSMango",
  "_zeekay",
  "cyvl",
  "elliesher",
  "lennonunited",
  "louvrene",
  "lucyrosette",
  "otrs",
  "roxepy",
  "sbrattzee"
]

export default function Home() {
  const player1Input = useRef<HTMLInputElement>(null)
  const player2Input = useRef<HTMLInputElement>(null)

  return <>
    <div className="flex flex-col min-h-screen justify-center items-center">
      <Image 
        src="https://cdn2.steamgriddb.com/logo_thumb/14edf56c2a2ce0f05d20e535759f4ee9.png" 
        width={350} 
        height={250}
        loading="eager" 
        alt="MCC Island Logo"
        className="m-3"
      />
      <p className="text-2xl">Player Compare</p>
      <input className="bg-[#1f1f1f] p-2 rounded-2xl w-100 m-1 border-[#3b3b3b] border focus:outline-none focus:w-110 transition-all" ref={player1Input} id="player1" placeholder="Player 1"/>
      <input className="bg-[#1f1f1f] p-2 rounded-2xl w-100 m-1 border-[#3b3b3b] border focus:outline-none focus:w-110 transition-all" ref={player2Input} id="player2" placeholder="Player 2"/>
      <BorderButton text="Compare" onClick={() => redirect(`/compare/${encodeURIComponent(player1Input.current!.value)}/${encodeURIComponent(player2Input.current!.value)}`, "push")}/>
        <p>Don&apos;t know who to compare? <button className="text-[#00a2ff] underline cursor-pointer" onClick={() => {
          redirect(`/compare/${friends[Math.round(Math.random() * friends.length - 1)]}/${friends[Math.round(Math.random() * friends.length - 1)]}`, "push")
        }}>Compare 2 of my friends!</button></p>
    </div>
  </>
}
