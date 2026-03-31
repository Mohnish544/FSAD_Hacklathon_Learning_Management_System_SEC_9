"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types";

const roleContent: Record<"student" | "admin", { label: string; hint: string; email: string; password: string }> = {
  student: {
    label: "Student Portal",
    hint: "Resume your courses, complete lessons, and track progress.",
    email: "student@eduflow.dev",
    password: "student123",
  },
  admin: {
    label: "Admin Dashboard",
    hint: "Manage content, analytics, and learner operations.",
    email: "admin@eduflow.dev",
    password: "admin123",
  },
};

interface AuthLoginFormProps {
  role: "student" | "admin";
}

export function AuthLoginForm({ role }: AuthLoginFormProps) {
  const router = useRouter();
  const defaults = useMemo(() => roleContent[role], [role]);

  const [email, setEmail] = useState(defaults.email);
  const [password, setPassword] = useState(defaults.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: role as UserRole, email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      setError(data.message ?? "Login failed. Please check credentials.");
      return;
    }

    router.push(role === "admin" ? "/admin" : "/student");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{defaults.label}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{defaults.hint}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 dark:from-teal-500 dark:to-cyan-500 dark:hover:from-teal-400 dark:hover:to-cyan-400"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-xs text-slate-500 dark:text-slate-500">
        💡 Demo credentials are pre-filled for quick access.
      </p>
    </div>
  );
}
