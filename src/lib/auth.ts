import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/types";

export const SESSION_ROLE_COOKIE = "eduflow_role";

const allowedRoles: UserRole[] = ["student", "instructor", "admin"];

export async function getSessionRole(): Promise<UserRole | null> {
  const store = await cookies();
  const role = store.get(SESSION_ROLE_COOKIE)?.value;

  if (!role) {
    return null;
  }

  return allowedRoles.includes(role as UserRole) ? (role as UserRole) : null;
}

export async function requireRole(role: UserRole): Promise<void> {
  const currentRole = await getSessionRole();

  if (currentRole !== role) {
    redirect("/login");
  }
}
