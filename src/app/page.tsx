import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";

export default async function Home() {
  const role = await getSessionRole();

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "student") {
    redirect("/student");
  }

  redirect("/login");
}
