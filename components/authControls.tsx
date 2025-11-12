// components/authControls.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "../lib/store/useAppStore";
import { useEffect } from "react";

export default function AuthControls() {
  const token = useAppStore((s) => s.token);
  const logout = useAppStore((s) => s.logout);
  const favorites = useAppStore((s) => s.favorites ?? []);
  const router = useRouter();
  const initFavorites = useAppStore((s) => s.initFavorites);

  useEffect(() => {
    initFavorites();
  }, [initFavorites]);

  const onLogout = () => {
    logout();
    router.push("/characters");
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <Link href="/favorites" className="btn btn-sm btn-outline-success d-flex align-items-center">
        <span className="me-2">Favoritos</span>
        <span className="badge bg-success">{favorites.length}</span>
      </Link>

      {token ? (
        <button type="button" className="btn btn-sm btn-light" onClick={onLogout}>
          Cerrar sesión
        </button>
      ) : (
        <Link href="/login" className="btn btn-sm btn-outline-light">
          Iniciar sesión
        </Link>
      )}
    </div>
  );
}
