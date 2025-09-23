import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.auth;

    // Public routes không cần authentication
    const publicRoutes = ["/", "/login", "/register"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Nếu chưa authenticated và không phải public route
    if (!isAuthenticated && !isPublicRoute) {
        console.log("🔒 Redirecting to login from:", pathname);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Nếu đã authenticated và đang ở trang login → redirect về home
    if (isAuthenticated && pathname === "/login") {
        console.log("✅ Already logged in, redirecting to home");
        return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("➡️ Allowing access to:", pathname);
    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - sw.js (service worker)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)",
    ],
};
