// app/characters/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
}

async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) throw new Error("Error al obtener el personaje");
  const data = await res.json();
  return data as Character;
}

export default async function CharacterPage({
  params,
}: {
  params?: { id?: string } | Promise<{ id?: string } | undefined> | undefined;
}) {
  const resolved = (await Promise.resolve(params ?? {})) as { id?: string | undefined };
  const id = resolved.id;

  if (!id) {
    return notFound();
  }

  let character: Character | null = null;
  try {
    character = await getCharacter(id);
  } catch (err) {
    return notFound();
  }

  return (
    <main className="flex flex-col items-center p-10 text-white">
      <div className="max-w-md bg-gray-800 rounded-2xl shadow-xl p-6">
        <div style={{ position: "relative", width: "100%", height: 360, overflow: "hidden", borderRadius: 12 }}>
          <Image
            src={character.image}
            alt={character.name}
            width={600}
            height={360}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>

        <h1 className="text-3xl font-bold text-green-400 text-center my-4">{character.name}</h1>

        <div className="text-gray-300 space-y-2">
          <p>
            <span className="font-semibold text-green-300">Estado:</span> {character.status}
          </p>
          <p>
            <span className="font-semibold text-green-300">Especie:</span> {character.species}
          </p>
          <p>
            <span className="font-semibold text-green-300">Género:</span> {character.gender}
          </p>
          <p>
            <span className="font-semibold text-green-300">Origen:</span> {character.origin.name}
          </p>
          <p>
            <span className="font-semibold text-green-300">Ubicación actual:</span> {character.location.name}
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/characters" className="bg-green-500 text-black px-6 py-2 rounded-lg hover:bg-green-400 transition">
            Volver
          </Link>
        </div>
      </div>
    </main>
  );
}
