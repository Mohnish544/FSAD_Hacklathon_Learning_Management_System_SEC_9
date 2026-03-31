import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/auth";
import { courses } from "@/lib/data";

export default async function AssignmentsPage() {
  await requireRole("student");

  const assignments = courses.flatMap((course) =>
    course.assignments.map((assignment) => ({
      ...assignment,
      courseTitle: course.title,
    })),
  );

  return (
    <AppShell
      role="student"
      title="Assignments and Quizzes"
      subtitle="Track due dates, submit deliverables, and evaluate readiness before final assessments."
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Assignment</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">{assignment.courseTitle}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{assignment.title}</td>
                <td className="px-4 py-3 text-slate-700">{assignment.dueDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      assignment.submitted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {assignment.submitted ? "Submitted" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {assignment.score ? `${assignment.score}/${assignment.maxScore}` : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
