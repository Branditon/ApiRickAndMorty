// app/logout/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "../../lib/store/useAppStore";

export default function LogoutPage() {
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    logout();
    router.replace("/characters");
  }, [logout, router]);

  return null;
}
