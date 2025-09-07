import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const role = req.cookies.get("userType")?.value
  const url = req.nextUrl.clone()

  // Not logged in → force login
  if (!role && !url.pathname.startsWith("/login")) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Doctor routes → only doctors
  if (url.pathname.startsWith("/doctor") && role !== "doctor") {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Receptionist routes → only receptionists
  if (url.pathname.startsWith("/dashboard") && role !== "receptionist") {
    url.pathname = "/doctor"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/doctor/:path*", "/dashboard/:path*", "/login"],
}
