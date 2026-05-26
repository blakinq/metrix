import { cache } from "react";
import { prisma } from "@/lib/db";

export interface UserSite {
  id: string;
  name: string;
  domain: string;
}

/**
 * Fetch the sites the user can access. Wrapped in React `cache()` so multiple
 * layouts / components calling it in the same request share one DB roundtrip.
 */
export const getUserSites = cache(async (userId: string): Promise<UserSite[]> => {
  return prisma.site.findMany({
    where: {
      status: { not: "deleted" },
      workspace: { members: { some: { userId } } },
    },
    select: { id: true, name: true, domain: true },
    orderBy: { createdAt: "desc" },
  });
});
