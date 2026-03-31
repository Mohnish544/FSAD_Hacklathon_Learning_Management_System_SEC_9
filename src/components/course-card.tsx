import Link from "next/link";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  progress?: number;
}

export function CourseCard({ course, progress }: CourseCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-teal-950/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.thumbnail})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-900">
            {course.level}
          </span>
          {course.featured ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{course.track}</span>
          <span>
            {course.rating ? `${course.rating.toFixed(1)} rating` : "New"}
            {course.learners ? ` • ${course.learners}+ learners` : ""}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-700">{course.description}</p>

        <div className="flex flex-wrap gap-2">
          {(course.skills ?? []).slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">By {course.instructor}</span>
          <span className="font-semibold text-slate-700">
            {course.durationHours ? `${course.durationHours}h` : `${course.lessons.length} lessons`}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          {typeof progress === "number" ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {progress}% complete
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Self-paced
            </span>
          )}
          <Link
            href={`/learn/${course.id}`}
            className="inline-flex items-center rounded-full bg-teal-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Open Course
          </Link>
        </div>
      </div>
    </article>
  );
}
