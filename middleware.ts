import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_ROLE_COOKIE = "eduflow_role";

function getRole(request: NextRequest): string | null {
  return request.cookies.get(SESSION_ROLE_COOKIE)?.value ?? null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const role = getRole(request);

  if (pathname === "/") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (role === "student") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/login")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (role === "student") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    return NextResponse.next();
  }

  const studentPath =
    pathname.startsWith("/student") ||
    pathname.startsWith("/catalog") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/assignments");

  if (studentPath && role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
