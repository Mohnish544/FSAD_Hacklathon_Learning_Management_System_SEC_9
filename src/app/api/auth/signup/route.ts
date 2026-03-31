import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "@/lib/supabase";
import { SESSION_ROLE_COOKIE } from "@/lib/auth";
import crypto from "crypto";

// Simple password hashing (in production use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String((error as { code?: string }).code) : "";
  const message = "message" in error ? String((error as { message?: string }).message) : "";

  return code === "PGRST205" || message.includes("Could not find the table");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      cohort?: string;
    };

    const { name, email, password, cohort } = body;

    // Validation
    if (!name || !email || !password || !cohort) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (email.length < 5 || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ message: "Database unavailable" }, { status: 500 });
    }

    // Check if email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError && !isMissingTableError(existingUserError)) {
      console.error("Email lookup error:", existingUserError);
      return NextResponse.json({ message: "Database error while validating email" }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Generate user ID
    const userId = `student_${crypto.randomUUID()}`;
    const passwordHash = hashPassword(password);

    // Create user in database
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        name,
        password_hash: passwordHash,
        role: "student",
        cohort,
        is_active: true,
      })
      .select()
      .single();

    if (createError) {
      if (!isMissingTableError(createError)) {
        console.error("User creation error:", createError);
        return NextResponse.json({ message: "Failed to create user account" }, { status: 500 });
      }

      // Graceful fallback mode when schema is not yet applied in Supabase.
      const store = await cookies();
      store.set(SESSION_ROLE_COOKIE, "student", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json(
        {
          message: "Account created in local mode. Apply Supabase schema for persistent storage.",
          user: {
            id: userId,
            name,
            email,
            role: "student",
            cohort,
          },
          storageMode: "local-fallback",
        },
        { status: 201 }
      );
    }

    // Log registration for admin real-time updates
    await supabase.from("user_registrations").insert({
      user_id: userId,
      email,
      name,
      role: "student",
      cohort,
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    });

    // Set session cookie
    const store = await cookies();
    store.set(SESSION_ROLE_COOKIE, "student", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        message: "Student account created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          cohort: newUser.cohort,
        },
        storageMode: "supabase",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
