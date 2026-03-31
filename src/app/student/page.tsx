import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CourseCard } from "@/components/course-card";
import { requireRole } from "@/lib/auth";
import { listCourses, listEnrollments } from "@/lib/repositories";

export default async function StudentDashboardPage() {
  await requireRole("student");

  const courses = await listCourses();
  const enrollments = await listEnrollments("u1");

  const inProgress = courses.filter((course) =>
    enrollments.some((entry) => entry.courseId === course.id),
  );

  const featuredCourses = courses.filter((course) => course.featured).slice(0, 3);

  const upcomingAssignments = inProgress
    .flatMap((course) =>
      course.assignments
        .filter((assignment) => !assignment.submitted)
        .map((assignment) => ({
          ...assignment,
          courseTitle: course.title,
        })),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const averageProgress = Math.round(
    enrollments.reduce((accumulator, entry) => accumulator + entry.progress, 0) /
      Math.max(1, enrollments.length),
  );

  const streak = Math.max(0, ...enrollments.map((entry) => entry.streakDays));
  const continueCourse = inProgress[0];
  const leaderboard = [
    { name: "Aarav Mehta", points: 1420, rank: 1 },
    { name: "Riya Shah", points: 1330, rank: 2 },
    { name: "Kunal Rao", points: 1285, rank: 3 },
    { name: "You", points: 1220, rank: 4 },
  ];

  return (
    <AppShell
      role="student"
      title="Student Dashboard"
      subtitle="Track your module progress, continue your last lesson, and complete assessments from one premium workspace."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Enrolled Courses</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{inProgress.length}</h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Assignments Due</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {inProgress.reduce(
              (accumulator, course) =>
                accumulator + course.assignments.filter((entry) => !entry.submitted).length,
              0,
            )}
          </h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average Progress</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{averageProgress}%</h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Learning Streak</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{streak} days</h2>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">Continue Learning</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {continueCourse ? continueCourse.title : "Start your first course"}
              </h3>
            </div>
            {continueCourse ? (
              <Link
                href={`/learn/${continueCourse.id}`}
                className="rounded-full bg-teal-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Resume
              </Link>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Jump back into your last active module and keep your streak alive.
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500"
              style={{ width: `${Math.min(averageProgress, 100)}%` }}
            />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h3>
          <div className="mt-4 space-y-3 text-sm">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded-xl border border-slate-100 p-3">
                <p className="font-semibold text-slate-900">{assignment.title}</p>
                <p className="mt-1 text-slate-600">{assignment.courseTitle}</p>
                <p className="mt-2 text-xs text-amber-700">Due: {assignment.dueDate}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Featured Learning Paths</h3>
        <p className="mt-1 text-sm text-slate-600">
          Explore recommended tracks based on demand, ratings, and completion momentum.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {featuredCourses.map((course) => (
            <div key={course.id} className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">{course.track}</p>
              <h4 className="mt-1 text-base font-bold text-slate-900">{course.title}</h4>
              <p className="mt-1 text-sm text-slate-600">{course.rating?.toFixed(1)} rating</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Announcements</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              New module published: API Security Essentials in Productive Backend Design.
            </p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Weekend sprint challenge is live. Complete 2 quizzes to unlock a bonus badge.
            </p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Mentor office hour scheduled for Monday, 7:30 PM.
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Leaderboard</h3>
          <div className="mt-3 space-y-2">
            {leaderboard.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-900 text-xs font-bold text-white">
                    {entry.rank}
                  </span>
                  <span className="font-semibold text-slate-900">{entry.name}</span>
                </div>
                <span className="font-semibold text-teal-700">{entry.points} pts</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        {inProgress.map((course) => {
          const enrollment = enrollments.find((entry) => entry.courseId === course.id);
          return <CourseCard key={course.id} course={course} progress={enrollment?.progress} />;
        })}
      </section>
    </AppShell>
  );
}
