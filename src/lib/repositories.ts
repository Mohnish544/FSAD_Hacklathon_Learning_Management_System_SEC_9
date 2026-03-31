import { courses, enrollments, platformMetrics, users } from "@/lib/data";
import { getSessionRole } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";
import type { Course, Enrollment, PlatformMetrics, UserProfile } from "@/lib/types";

function isUserRole(value: unknown): value is UserProfile["role"] {
  return value === "student" || value === "instructor" || value === "admin";
}

export async function getCurrentUser(): Promise<UserProfile> {
  const roleFromSession = await getSessionRole();
  const sessionUser = roleFromSession
    ? users.find((entry) => entry.role === roleFromSession)
    : undefined;

  const client = getSupabaseClient();

  if (!client) {
    return sessionUser ?? users[0];
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return sessionUser ?? users[0];
  }

  const profile = users.find((entry) => entry.id === user.id);
  return profile ?? sessionUser ?? users[0];
}

export async function listCourses(): Promise<Course[]> {
  const client = getSupabaseClient();

  if (!client) {
    return courses;
  }

  const { data, error } = await client
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return courses;
  }

  return data as Course[];
}

export async function listEnrollments(userId: string): Promise<Enrollment[]> {
  const client = getSupabaseClient();

  if (!client) {
    return enrollments.filter((entry) => entry.userId === userId);
  }

  const { data, error } = await client
    .from("enrollments")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) {
    return enrollments.filter((entry) => entry.userId === userId);
  }

  return data.map((row) => ({
    userId: row.user_id as string,
    courseId: row.course_id as string,
    progress: row.progress as number,
    streakDays: row.streak_days as number,
  }));
}

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const client = getSupabaseClient();

  if (!client) {
    return platformMetrics;
  }

  const { data, error } = await client
    .from("platform_metrics")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    return platformMetrics;
  }

  return {
    activeLearners: data.active_learners as number,
    completionRate: data.completion_rate as number,
    averageQuizScore: data.average_quiz_score as number,
    assignmentSubmissionRate: data.assignment_submission_rate as number,
  };
}

export async function listUsers(): Promise<UserProfile[]> {
  const client = getSupabaseClient();

  if (!client) {
    return users;
  }

  const { data, error } = await client
    .from("users")
    .select("id, name, role, cohort")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return users;
  }

  const dbUsers: UserProfile[] = data
    .filter((row) => isUserRole(row.role))
    .map((row) => ({
      id: String(row.id),
      name: String(row.name),
      role: row.role,
      cohort: row.cohort ? String(row.cohort) : "FS-2026",
    }));

  const mergedById = new Map<string, UserProfile>();

  for (const user of users) {
    mergedById.set(user.id, user);
  }

  for (const user of dbUsers) {
    mergedById.set(user.id, user);
  }

  return Array.from(mergedById.values());
}
