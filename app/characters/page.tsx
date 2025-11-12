// app/characters/page.tsx
import Link from "next/link";
import CharacterCard from "../../components/characterCard";
import { cookies } from "next/headers";

type ApiCharacter = {
  id: number;
  name: string;
  image: string;
  species?: string;
};

const API = "https://rickandmortyapi.com/api/character";

function getPageFromSearchObj(searchObj?: Record<string, string | string[] | undefined>) {
  try {
    const p = searchObj?.page;
    if (!p) return 1;
    if (Array.isArray(p)) return Number(p[0]) || 1;
    const n = Number(p);
    return isNaN(n) || n < 1 ? 1 : n;
  } catch {
    return 1;
  }
}

export default async function CharactersPage({
  // **IMPORTANTE**: no declarar searchParams como Promise<...> en el tipo
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // Aseguramos que searchParams esté resuelto antes de usar sus propiedades
  const sp = await Promise.resolve(searchParams ?? {});
  const page = getPageFromSearchObj(sp);

  // Leemos cookie en server-side (await cookies())
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;

  if (!token) {
    // construimos next a partir de `sp` (NO usar searchParams directamente)
    const next = page && page > 1 ? `/characters?page=${page}` : "/characters";
    return (
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card p-4 text-center">
              <h3>Inicia sesión para ver la lista de personajes</h3>
              <p className="text-muted">
                Debes iniciar sesión para acceder a esta sección. Si quieres, puedes seguir explorando sin guardar favoritos.
              </p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Link href={`/login?next=${encodeURIComponent(next)}`} className="btn btn-success">
                  Iniciar sesión
                </Link>
                <Link href="/characters-guest" className="btn btn-outline-secondary">
                  Seguir (vista invitado)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const apiPage = Math.ceil((page * 10) / 20) || 1;
  const res = await fetch(`${API}?page=${apiPage}`, { cache: "no-store" });
  if (!res.ok) {
    return <div className="alert alert-danger">Error al cargar personajes: {res.status}</div>;
  }
  const data = await res.json();
  const total = Number(data?.info?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const offset = ((page - 1) * 10) % 20;
  const results: ApiCharacter[] = Array.isArray(data.results) ? data.results.slice(offset, offset + 10) : [];

  return (
    <main>
      <div className="row gy-4">
        {results.map((ch) => (
          <div key={ch.id} className="col-12 col-sm-6 col-md-4 d-flex">
            <CharacterCard character={ch} />
          </div>
        ))}
      </div>

      <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
            <Link className="page-link" href={`/characters?page=${Math.max(1, page - 1)}`}>
              Anterior
            </Link>
          </li>

          <li className="page-item disabled">
            <span className="page-link">
              Página {page} / {totalPages}
            </span>
          </li>

          <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
            <Link className="page-link" href={`/characters?page=${Math.min(totalPages, page + 1)}`}>
              Siguiente
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
