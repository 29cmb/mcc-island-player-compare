export default function SkinOverride({ image }: { image: string }) {
    {/* eslint-disable-next-line @next/next/no-img-element */}
    return <img src={image} className="w-75 h-100" alt="Skin"></img>
}