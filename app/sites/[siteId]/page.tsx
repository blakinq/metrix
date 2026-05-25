import { redirect } from "next/navigation";

export default function SiteIndex({ params }: { params: { siteId: string } }) {
  redirect(`/sites/${params.siteId}/overview`);
}
