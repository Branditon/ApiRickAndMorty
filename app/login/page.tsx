// app/login/page.tsx
import React, { Suspense } from "react";
import LoginClient from "../../components/loginClient";

export default function LoginPage() {
  return (
    <main className="container my-5">
      <Suspense fallback={<div className="text-center py-5">Cargando formulario...</div>}>
        <LoginClient />
      </Suspense>
    </main>
  );
}
