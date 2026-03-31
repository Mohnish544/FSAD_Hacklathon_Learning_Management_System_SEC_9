import { NextResponse } from "next/server";
import { SESSION_ROLE_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_ROLE_COOKIE,
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}
