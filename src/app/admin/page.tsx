import { AppShell } from "@/components/app-shell";
import { AdminControlCenter } from "@/components/admin-control-center";
import { requireRole } from "@/lib/auth";
import { courses, enrollments } from "@/lib/data";
import { getPlatformMetrics, listUsers } from "@/lib/repositories";

export default async function AdminPage() {
  await requireRole("admin");
  const [metrics, dynamicUsers] = await Promise.all([getPlatformMetrics(), listUsers()]);

  return (
    <AppShell
      role="admin"
      title="Admin Analytics"
      subtitle="Operate your LMS with role-aware controls: analytics, course editing, quiz design, and enrollment management."
    >
      <AdminControlCenter
        metrics={metrics}
        courses={courses}
        users={dynamicUsers}
        enrollments={enrollments}
      />
    </AppShell>
  );
}
