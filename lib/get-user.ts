import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) return null;
  return { id, email: session!.user!.email ?? "", name: session!.user!.name ?? null };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "Unauthorized");
  return user;
}

export function toErrorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  // Next.js dynamic-server bail (occurs during build static-prerender probe).
  // Not an error — Next.js handles it by rendering the route dynamically.
  const digest = (err as { digest?: string } | null)?.digest;
  if (digest === "DYNAMIC_SERVER_USAGE" || (digest && digest.startsWith("NEXT_"))) {
    throw err;
  }
  console.error("[api] unexpected error", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

type RouteHandler<P> = (req: Request, ctx: { params: P }) => Promise<Response>;

export function route<P = Record<string, string>>(
  handler: (req: Request, ctx: { params: P }) => Promise<Response>,
): RouteHandler<P> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}
