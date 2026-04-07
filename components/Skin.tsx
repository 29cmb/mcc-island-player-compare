'use client'

import { ReactSkinview3d } from 'react-skinview3d';

export default function Skin(props: { username: string, height?: number, width?: number }) {
    return <ReactSkinview3d
        skinUrl={`https://minotar.net/skin/${props.username}`}
        height={props.height || 400}
        width={props.width || 300}
    />
}