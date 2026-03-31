import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CourseLearningStudio } from "@/components/course-learning-studio";
import { requireRole } from "@/lib/auth";
import { getCourseById } from "@/lib/data";

interface LearnPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
  await requireRole("student");
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return (
    <AppShell
      role="student"
      title={course.title}
      subtitle="Module-wise learning flow with videos, readings, multi-quiz checkpoints, progress auto-save, and resume support."
    >
      <CourseLearningStudio course={course} />
    </AppShell>
  );
}
