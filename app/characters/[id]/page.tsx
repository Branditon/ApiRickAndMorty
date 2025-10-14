// app/characters/[id]/page.tsx
import Link from "next/link";

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
};

async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener el personaje");
  return res.json();
}

export default async function CharacterPage({
  params,
}: {
  params?: { id?: string } | Promise<{ id?: string } | undefined>;
}) {
  const p = (await Promise.resolve(params)) as { id?: string } | undefined;
  const id = p?.id ?? "";

  if (!id) {
    return <div className="alert alert-danger">ID de personaje inválido</div>;
  }

  try {
    const character = await getCharacter(id);

    return (
      <main>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card shadow">
              <div style={{ height: 400, overflow: "hidden" }}>
                <img
                  src={character.image}
                  alt={character.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="card-body">
                <h2 className="card-title text-success">{character.name}</h2>
                <ul className="list-unstyled text-muted">
                  <li><strong>Status:</strong> {character.status}</li>
                  <li><strong>Especie:</strong> {character.species}</li>
                  <li><strong>Género:</strong> {character.gender}</li>
                  <li><strong>Origen:</strong> {character.origin?.name}</li>
                  <li><strong>Ubicación:</strong> {character.location?.name}</li>
                </ul>

                <Link href="/characters?page=1" className="btn btn-success mt-3">
                  ◀ Volver al listado
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (err: any) {
    return <div className="alert alert-danger">Error: {String(err?.message ?? "desconocido")}</div>;
  }
}
