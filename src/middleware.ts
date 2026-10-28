import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./utilities/supabase/middleware";

const PROTECTED_ROUTES = ["/cart", "/checkout", "/orders"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const { supabaseResponse, user } = await updateSession(req);

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/shop", req.url));
  }

  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
