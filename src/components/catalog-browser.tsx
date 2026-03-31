"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import type { Course } from "@/lib/types";

interface CatalogBrowserProps {
  courses: Course[];
}

export function CatalogBrowser({ courses }: CatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [track, setTrack] = useState("All");

  const tracks = useMemo(() => {
    const uniqueTracks = new Set(courses.map((course) => course.track));
    return ["All", ...Array.from(uniqueTracks).sort((a, b) => a.localeCompare(b))];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesQuery =
        query.trim().length === 0 ||
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        (course.skills ?? []).some((skill) =>
          skill.toLowerCase().includes(query.toLowerCase()),
        );

      const matchesLevel = level === "All" || course.level === level;
      const matchesTrack = track === "All" || course.track === track;

      return matchesQuery && matchesLevel && matchesTrack;
    });
  }, [courses, level, query, track]);

  const totalLearners = filteredCourses.reduce(
    (accumulator, course) => accumulator + (course.learners ?? 0),
    0,
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, topic, or skill"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-teal-500"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Level</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-teal-500"
            >
              <option>All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Track</span>
            <select
              value={track}
              onChange={(event) => setTrack(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-teal-500"
            >
              {tracks.map((trackOption) => (
                <option key={trackOption}>{trackOption}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Matched Courses</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{filteredCourses.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Learners Reached</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalLearners.toLocaleString()}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Featured Tracks</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {new Set(filteredCourses.map((course) => course.track)).size}
          </p>
        </article>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>

      {filteredCourses.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
          No courses matched your filters. Try clearing search or selecting another track.
        </section>
      ) : null}
    </div>
  );
}
