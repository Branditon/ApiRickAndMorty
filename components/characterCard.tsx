// components/characterCard
import Link from "next/link";

export type ApiCharacter = {
    id: number;
    name: string;
    image: string;
    species?: string;
    status?: string;
};

export default function CharacterCard({ character }: { character: ApiCharacter }) {
    return (
        <Link href={`/characters/${character.id}`} className="block">
            <div className="rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="relative w-full bg-slate-200">
                    <div style={{ paddingTop: "100%" }} />
                    <img
                        src={character.image}
                        alt={character.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                <div className="p-3 bg-white">
                    <h3 className="text-center text-lg font-semibold text-slate-900">{character.name}</h3>
                    <p className="text-center text-sm text-slate-500 mt-1">{character.species ?? ""}</p>
                </div>
            </div>
        </Link>
    );
}
