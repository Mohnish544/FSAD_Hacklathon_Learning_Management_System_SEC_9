import { notFound } from "next/navigation";
import Link from "next/link";
import { AuthLoginForm } from "@/components/auth-login-form";

interface RoleLoginPageProps {
  params: Promise<{ role: string }>;
}

export default async function RoleLoginPage({ params }: RoleLoginPageProps) {
  const { role } = await params;

  if (role !== "student" && role !== "admin") {
    notFound();
  }

  const isAdmin = role === "admin";
  const gradientFrom = isAdmin ? "from-cyan-600" : "from-teal-600";
  const gradientTo = isAdmin ? "to-blue-600" : "to-cyan-600";

  return (
    <main className="flex min-h-[calc(100vh-80px)] w-full items-center px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left side - Hero */}
          <div className="flex flex-col justify-center">
            <Link
              href="/login"
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>

            <div className="mt-8">
              <span
                className={`inline-flex rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-opacity-10 px-4 py-1 text-sm font-semibold ${isAdmin ? "text-cyan-700 dark:text-cyan-300" : "text-teal-700 dark:text-teal-300"}`}
              >
                {isAdmin ? "Admin Portal" : "Student Portal"}
              </span>
              <h1 className="mt-6 text-5xl font-bold text-slate-900 dark:text-white">
                {isAdmin ? "Manage Your LMS" : "Continue Learning"}
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                {isAdmin
                  ? "Access analytics, content management, and learner operations with confidence."
                  : "Resume your courses, complete lessons, and track your progress."}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {(isAdmin
                ? [
                    { label: "Courses", value: "50+" },
                    { label: "Students", value: "2K+" },
                    { label: "Analytics", value: "Real-time" },
                    { label: "Support", value: "24/7" },
                  ]
                : [
                    { label: "Courses", value: "15+" },
                    { label: "Progress", value: "Tracked" },
                    { label: "Community", value: "Active" },
                    { label: "Certificates", value: "Earned" },
                  ]
              ).map((stat, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <AuthLoginForm role={role} />
          </div>
        </div>
      </div>
    </main>
  );
}
