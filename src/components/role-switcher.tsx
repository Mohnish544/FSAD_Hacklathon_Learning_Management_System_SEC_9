"use client";

import { useRouter } from "next/navigation";

export function RoleSwitcher() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 transition hover:border-teal-400 hover:text-teal-700"
    >
      Switch Role
    </button>
  );
}
