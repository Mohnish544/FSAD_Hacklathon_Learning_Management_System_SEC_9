import { NextResponse } from "next/server";
import { SESSION_ROLE_COOKIE } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/types";
import crypto from "crypto";

interface LoginBody {
  role: UserRole;
  email: string;
  password: string;
}

// Simple password verification
function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  return passwordHash === hash;
}

const demoCredentials: Record<UserRole, { email: string; password: string }> = {
  student: { email: "student@eduflow.dev", password: "student123" },
  admin: { email: "admin@eduflow.dev", password: "admin123" },
  instructor: { email: "instructor@eduflow.dev", password: "instructor123" },
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;

  if (!body?.role || !demoCredentials[body.role]) {
    return NextResponse.json({ message: "Invalid role." }, { status: 400 });
  }

  // First check demo credentials for quick hackathon access
  const demoAccount = demoCredentials[body.role];
  const isDemoLogin = body.email === demoAccount.email && body.password === demoAccount.password;

  if (!isDemoLogin) {
    // Check real Supabase database
    const supabase = getSupabaseClient();
    
    if (supabase) {
      const { data: user, error } = await supabase
        .from("users")
        .select()
        .eq("email", body.email)
        .eq("role", body.role)
        .single();

      if (!user || error) {
        return NextResponse.json(
          { message: "Invalid credentials for selected role." },
          { status: 401 }
        );
      }

      // Verify password
      if (!verifyPassword(body.password, user.password_hash)) {
        return NextResponse.json(
          { message: "Invalid credentials for selected role." },
          { status: 401 }
        );
      }

      // Update last login
      await supabase
        .from("users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", user.id);

      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        cohort: user.cohort,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: user.last_login_at,
      };

      const response = NextResponse.json({ ok: true, role: body.role, user: safeUser });

      response.cookies.set({
        name: SESSION_ROLE_COOKIE,
        value: body.role,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } else {
      // Fallback when Supabase is unavailable
      return NextResponse.json(
        { message: "Invalid credentials for selected role." },
        { status: 401 }
      );
    }
  }

  // Demo login successful
  const response = NextResponse.json({ ok: true, role: body.role });

  response.cookies.set({
    name: SESSION_ROLE_COOKIE,
    value: body.role,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
