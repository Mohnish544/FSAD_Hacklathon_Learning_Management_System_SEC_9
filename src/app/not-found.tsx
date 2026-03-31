import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-800">
        Missing Resource
      </p>
      <h1 className="text-4xl font-bold text-slate-900">Page Not Found</h1>
      <p className="max-w-md text-slate-700">
        The route you requested is not available. Continue from the dashboard.
      </p>
      <Link
        href="/"
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Back to Dashboard
      </Link>
    </main>
  );
}
