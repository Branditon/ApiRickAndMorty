// app/characters/page.tsx
import Link from "next/link";

type ApiCharacter = {
    id: number;
    name: string;
    image: string;
    species?: string;
};

const API = "https://rickandmortyapi.com/api/character";

function getPageFromSearchObj(searchObj?: { [key: string]: string | string[] | undefined }) {
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
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined } | undefined>;
}) {
    const sp = await Promise.resolve(searchParams ?? {});
    const page = getPageFromSearchObj(sp);
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

    const portalUrl =
        "https://www.pngkey.com/png/detail/112-1129189_alcateia-rick-and-morty-portal-home-rug-rick.png";

    return (
        <main>
            <div className="row gy-4">
                {results.map((ch) => (
                    <div key={ch.id} className="col-12 col-sm-6 col-md-4 d-flex">
                        <article className="card w-100 shadow-sm">
                            <Link href={`/characters/${ch.id}`} className="text-decoration-none">
                                <div
                                    className="portal-overlay"
                                    style={{ backgroundImage: `url('${portalUrl}')` }}
                                    aria-hidden
                                />
                                <div style={{ height: 240, overflow: "hidden", position: "relative" }}>
                                    <img
                                        src={ch.image}
                                        alt={ch.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            position: "relative",
                                            zIndex: 0,
                                        }}
                                    />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title mb-1 text-dark">{ch.name}</h5>
                                    <p className="card-text text-muted mb-0">{ch.species ?? ""}</p>
                                </div>
                            </Link>
                        </article>
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
