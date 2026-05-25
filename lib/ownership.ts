/**
 * Centralizes IDOR protection — every private endpoint must call this. See §22.
 */
import { prisma } from "@/lib/db";
import { HttpError } from "@/lib/get-user";

export async function getSiteForUser(siteId: string, userId: string) {
  return prisma.site.findFirst({
    where: {
      id: siteId,
      status: { not: "deleted" },
      workspace: {
        members: { some: { userId } },
      },
    },
    include: { workspace: true },
  });
}

export async function assertSiteAccess(siteId: string, userId: string) {
  const site = await getSiteForUser(siteId, userId);
  if (!site) throw new HttpError(404, "Not found");
  return site;
}
