export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/sites/:path*", "/admin/:path*", "/notifications/:path*"],
};
