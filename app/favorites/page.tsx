// app/favorites/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CharacterCard from "../../components/characterCard";
import { useAppStore } from "../../lib/store/useAppStore";

type ApiCharacter = {
  id: number;
  name: string;
  image: string;
  species?: string;
};

export default function FavoritesPage() {
  const token = useAppStore((s) => s.token);
  const favorites = useAppStore((s) => s.favorites);
  const initFavorites = useAppStore((s) => s.initFavorites);

  const [characters, setCharacters] = useState<ApiCharacter[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initFavorites();
  }, [initFavorites]);

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setCharacters([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const fetchAll = async () => {
      try {
        const ids = favorites.join(",");
        const res = await fetch(`https://rickandmortyapi.com/api/character/${ids}`);
        if (!res.ok) throw new Error("No se pudo cargar favoritos");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [data];
        if (!cancelled) setCharacters(arr);
      } catch {
        if (!cancelled) setCharacters([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  if (!token) {
    const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/favorites";
    return (
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card p-4 text-center">
              <h3>Inicia sesión para ver tus favoritos</h3>
              <p className="text-muted">
                Guarda personajes como favoritos y regresa luego para verlos desde cualquier dispositivo.
              </p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Link href={`/login?next=${encodeURIComponent(next)}`} className="btn btn-success">
                  Iniciar sesión
                </Link>
                <Link href="/characters" className="btn btn-outline-secondary">
                  Seguir explorando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <h2 className="mb-4">Tus favoritos</h2>
      {loading && <p>Cargando favoritos...</p>}
      {!loading && characters.length === 0 && (
        <div className="card p-4 text-center">
          <p className="mb-2">No tienes personajes favoritos todavía.</p>
          <Link href="/characters" className="btn btn-primary">Explorar personajes</Link>
        </div>
      )}

      <div className="row gy-4 mt-3">
        {characters.map((ch) => (
          <div key={ch.id} className="col-12 col-sm-6 col-md-4 d-flex">
            <CharacterCard character={ch} />
          </div>
        ))}
      </div>
    </main>
  );
}
