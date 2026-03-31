import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] w-full items-center px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Choose your portal to get started</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Student Portal */}
          <Link
            href="/login/student"
            className="group relative overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-white to-teal-50 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 dark:border-teal-800 dark:from-slate-800 dark:to-slate-900"
          >
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-teal-200/20 blur-3xl transition group-hover:blur-2xl" />
            <div className="relative">
              <div className="inline-flex rounded-full bg-teal-100 p-3 dark:bg-teal-900">
                <svg className="h-6 w-6 text-teal-700 dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.307 2 15.25s4.5 9 10 9m0-13c5.5 0 10 4.054 10 9 0 4.943-4.5 9-10 9m0-13v13m0-13C6.5 6.253 2 10.307 2 15.25s4.5 9 10 9m0-13c5.5 0 10 4.054 10 9 0 4.943-4.5 9-10 9" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Student Learning</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Access your courses, complete lessons, track progress, and achieve your learning goals.
              </p>
              <div className="mt-6 flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-400">
                <span>Continue</span>
                <svg className="h-5 w-5 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Admin Portal */}
          <Link
            href="/login/admin"
            className="group relative overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-white to-cyan-50 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 dark:border-cyan-800 dark:from-slate-800 dark:to-slate-900"
          >
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-200/20 blur-3xl transition group-hover:blur-2xl" />
            <div className="relative">
              <div className="inline-flex rounded-full bg-cyan-100 p-3 dark:bg-cyan-900">
                <svg className="h-6 w-6 text-cyan-700 dark:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Manage courses, analytics, content organization, and learning outcomes.
              </p>
              <div className="mt-6 flex items-center gap-2 font-semibold text-cyan-700 dark:text-cyan-400">
                <span>Continue</span>
                <svg className="h-5 w-5 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* CTA for new users */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-8 text-center dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">New student?</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Create your account to start learning today</p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-teal-500 hover:to-cyan-500"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
