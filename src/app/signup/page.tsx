import Link from "next/link";
import { AuthSignupForm } from "@/components/auth-signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] w-full items-center px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left side - Hero */}
          <div className="flex flex-col justify-center">
            <div>
              <span className="inline-flex rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                Start Learning
              </span>
              <h1 className="mt-6 text-5xl font-bold text-slate-900 dark:text-white">
                Begin Your Learning Journey
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Join thousands of learners. Create your account today and unlock access to quality education.
              </p>
            </div>

            <ul className="mt-10 space-y-4">
              {[
                { icon: "✓", text: "Instant access to all courses" },
                { icon: "✓", text: "Learn at your own pace" },
                { icon: "✓", text: "Track your progress" },
                { icon: "✓", text: "Join our community" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <AuthSignupForm />
          </div>
        </div>
      </div>
    </main>
  );
}
