// app/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import AuthControls from "../components/authControls";
import React from "react";

export const metadata = {
  title: "Rick & Morty Portal",
  description: "Explora el multiverso de personajes de Rick & Morty",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="app-body">
        <div className="portal-bg" aria-hidden />
        <div className="bg-vignette" aria-hidden />

        <header className="py-4 border-bottom border-secondary" style={{ zIndex: 3, position: "relative" }}>
          <div className="container d-flex justify-content-between align-items-center">
            <div style={{ flex: 1, textAlign: "center" }}>
              <h1 className="h3 mb-1 text-success">Serie Rick &amp; Morty</h1>
              <p className="mb-0 text-white">Explora personajes de todo el multiverso</p>
            </div>

            <div style={{ flex: 0 }}>
              <AuthControls />
            </div>
          </div>
        </header>

        <main className="container my-5" style={{ zIndex: 3, position: "relative" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
