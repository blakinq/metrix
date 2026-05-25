import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@metrix.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@metrix.app",
      passwordHash,
      emailVerifiedAt: new Date(),
      isSuperAdmin: true,
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: "ws_demo" },
    update: {},
    create: {
      id: "ws_demo",
      name: "Demo Workspace",
      ownerId: user.id,
      members: {
        create: { userId: user.id, role: "owner" },
      },
    },
  });

  await prisma.site.upsert({
    where: { trackingId: "mx_demo123" },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: "Demo Site",
      domain: "example.com",
      trackingId: "mx_demo123",
      status: "active",
    },
  });

  console.log("Seeded demo user: demo@metrix.app / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
