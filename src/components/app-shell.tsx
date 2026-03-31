"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { RoleSwitcher } from "@/components/role-switcher";

const studentLinks = [
  { href: "/student", label: "Dashboard" },
  { href: "/catalog", label: "Catalog" },
  { href: "/assignments", label: "Assessments" },
  { href: "/learn/c1", label: "Continue Learning" },
];

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/admin?tab=courses", label: "Course Manager" },
  { href: "/admin?tab=users", label: "User Control" },
];

interface AppShellProps {
  title: string;
  subtitle: string;
  role?: "student" | "admin";
  children: ReactNode;
}

export function AppShell({ title, subtitle, role = "student", children }: AppShellProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1280px] gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <aside className="hidden w-72 shrink-0 flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-lg lg:flex">
        <div className="rounded-2xl bg-gradient-to-br from-teal-950 via-cyan-900 to-emerald-700 p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">EduFlow LMS</p>
          <h2 className="mt-2 text-2xl font-bold">{role === "admin" ? "Admin Suite" : "Student Hub"}</h2>
          <p className="mt-2 text-sm text-teal-100">
            {role === "admin"
              ? "Control analytics, modules, quizzes, and users from one panel."
              : "Learn through module-wise lessons, readings, and smart checkpoints."}
          </p>
        </div>

        <nav className="mt-4 grid gap-2">
          {links.map((item) => {
            const active = pathname.startsWith(item.href.split("?")[0]);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-teal-900 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Live Alerts</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>New module released in Full Stack Foundations.</li>
            <li>Quiz completion rose by 12% this week.</li>
            <li>Leaderboard refreshes every 24 hours.</li>
          </ul>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-5">
        <header className="relative overflow-hidden rounded-3xl border border-teal-900/10 bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-6">
          <div className="absolute -right-24 -top-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-cyan-200/20 blur-3xl" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(transparent_24px,rgba(255,255,255,0.07)_25px),linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.07)_25px)] [background-size:25px_25px]" />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100/90">
                {role === "admin" ? "Administration" : "Student Workspace"}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-teal-100 sm:text-base">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-teal-100">Hackathon Build</p>
                <p className="mt-1 text-sm font-semibold text-white">Premium Demo</p>
              </div>
              <RoleSwitcher />
            </div>
          </div>
        </header>

        {role === "student" ? (
          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-teal-50 px-4 py-3 text-sm text-slate-700">
            New this week: module checkpoints now include instant feedback and saved progress resume.
          </div>
        ) : (
          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-teal-50 px-4 py-3 text-sm text-slate-700">
            Admin notice: completion rates dipped in modules longer than 35 minutes. Review pacing recommendations.
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
