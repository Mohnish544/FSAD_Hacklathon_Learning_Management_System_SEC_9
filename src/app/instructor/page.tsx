import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/auth";
import { courses } from "@/lib/data";

export default async function InstructorPage() {
  await requireRole("admin");

  const totalLessons = courses.reduce(
    (accumulator, course) => accumulator + course.modules.flatMap((module) => module.lessons).length,
    0,
  );
  const totalModules = courses.reduce((accumulator, course) => accumulator + course.modules.length, 0);

  return (
    <AppShell
      role="admin"
      title="Instructor Studio"
      subtitle="Create engaging modules, ship assessments, and monitor learner outcomes in one place."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Published Courses</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{courses.length}</h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Lessons</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{totalLessons}</h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Modules</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{totalModules}</h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending Reviews</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">14</h2>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Create New Course</h3>
          <p className="mt-1 text-sm text-slate-600">
            This MVP includes a static authoring panel. Connect this form to Supabase inserts for production use.
          </p>
          <form className="mt-4 grid gap-3">
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Course title"
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Track"
            />
            <textarea
              className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Course summary"
            />
            <button
              type="button"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save Draft
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Publishing Checklist</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>1. Add at least 3 lessons with clear outcomes.</li>
            <li>2. Attach one graded assignment.</li>
            <li>3. Configure quiz with 5+ questions.</li>
            <li>4. Set role policy for instructor ownership.</li>
            <li>5. Publish and monitor first-week completion rate.</li>
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
