import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("hello");
  return NextResponse.redirect(new URL("/welcome", request.url));
}

export const config = {
  matcher: "/",
};
