// components/LoginClient.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "../lib/store/useAppStore";

export default function LoginClient() {
    const router = useRouter();
    const params = useSearchParams();
    const next = params?.get("next") ?? "/characters";
    const setToken = useAppStore((s) => s.setToken);

    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const fakeToken = user ? `user-${user}` : `user-anon-${Math.floor(Math.random() * 10000)}`;
        setToken(fakeToken);

        router.push(next);
    };

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6">
                <div className="card p-4">
                    <h3>Iniciar sesión (demo)</h3>
                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre de usuario</label>
                            <input value={user} onChange={(e) => setUser(e.target.value)} className="form-control" />
                        </div>
                        <button className="btn btn-success" disabled={loading}>
                            {loading ? "Entrando..." : "Iniciar sesión"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
