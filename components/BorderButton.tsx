"use client"
export function BorderButton(props: { text: string, onClick: () => void }) {
    return <button className="border-3 border-[#11d45f] p-2 rounded-2xl w-30 m-1 hover:scale-110 active:scale-90 transition-all" onClick={() => props.onClick()}>{props.text}</button>
}