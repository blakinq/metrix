import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: { name: parsed.data.name, email, passwordHash },
    });
    const workspace = await tx.workspace.create({
      data: {
        name: `${parsed.data.name}'s Workspace`,
        ownerId: createdUser.id,
      },
    });
    await tx.workspaceMember.create({
      data: { workspaceId: workspace.id, userId: createdUser.id, role: "owner" },
    });
    return createdUser;
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
