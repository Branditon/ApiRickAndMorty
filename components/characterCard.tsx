// components/characterCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "../lib/store/useAppStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type ApiCharacter = {
  id: number;
  name: string;
  image: string;
  species?: string;
  status?: string;
};

export default function CharacterCard({ character }: { character: ApiCharacter }) {
  const router = useRouter();
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = useAppStore((s) => s.isFavorite(character.id));
  const token = useAppStore((s) => s.token);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const displayedFav = mounted ? isFav : false;

  const onFavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : `/characters`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    toggleFavorite(character.id);
  };

  return (
    <Link href={`/characters/${character.id}`} className="block">
      <div className="rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 bg-white">
        <div className="relative w-full bg-slate-200">
          <Image
            src={character.image}
            alt={character.name}
            width={500}
            height={500}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          <button
            type="button"
            onClick={onFavClick}
            aria-pressed={displayedFav}
            aria-label={displayedFav ? "Quitar favorito" : "Agregar a favoritos"}
            title={displayedFav ? "Quitar favorito" : "Agregar a favoritos"}
            className="fav-btn absolute top-3 right-3 z-30"
          >
            {displayedFav ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .587l3.668 7.431L23.6 9.748l-5.8 5.657L19.336 24 12 20.013 4.664 24l1.536-8.595L.4 9.748l7.932-1.73L12 .587z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.454a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L12 15.347l-3.99 2.664c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.024 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.285-3.957z" />
              </svg>
            )}
          </button>
        </div>

        <div className="p-3 bg-white">
          <h3 className="text-center text-lg font-semibold text-slate-900">{character.name}</h3>
          <p className="text-center text-sm text-slate-500 mt-1">{character.species ?? ""}</p>
        </div>
      </div>
    </Link>
  );
}
