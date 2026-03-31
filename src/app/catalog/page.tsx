import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/auth";
import { CatalogBrowser } from "@/components/catalog-browser";
import { listCourses } from "@/lib/repositories";

export default async function CatalogPage() {
  await requireRole("student");
  const courses = await listCourses();

  return (
    <AppShell
      role="student"
      title="Course Catalog"
      subtitle="Explore curated tracks, compare levels, and find the right course quickly with live filters."
    >
      <CatalogBrowser courses={courses} />
    </AppShell>
  );
}
