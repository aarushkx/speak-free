import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/login", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (
        token &&
        (url.pathname.startsWith("/login") ||
            url.pathname.startsWith("/register") ||
            url.pathname.startsWith("/verify") ||
            url.pathname === "/")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}
