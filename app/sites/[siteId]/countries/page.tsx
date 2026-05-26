import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import { getSiteForUser } from "@/lib/ownership";
import { countryBreakdown } from "@/lib/analytics";
import { parseRange } from "@/lib/session";
import { DateRangePicker } from "@/components/dashboard/date-range";
import { ShareRow } from "@/components/dashboard/share-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countryName, formatNumber } from "@/lib/utils";
import { CountryFlag } from "@/components/dashboard/country-flag";

export default async function CountriesPage({
  params,
  searchParams,
}: {
  params: { siteId: string };
  searchParams: Record<string, string | undefined>;
}) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const site = await getSiteForUser(params.siteId, user.id);
  if (!site) notFound();

  const range = parseRange(
    new URLSearchParams(searchParams as Record<string, string>),
  );
  const countries = await countryBreakdown({ siteId: site.id, ...range });
  const total = countries.reduce((s, c) => s + c.sessions, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Countries
        </p>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Countries</CardTitle>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {formatNumber(total)} sessions · {countries.length} countries
          </span>
        </CardHeader>
        <CardContent>
          {countries.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No country data yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {countries.map((c) => (
                <li key={c.country}>
                  <ShareRow
                    label={
                      <span className="flex items-center gap-2.5">
                        <CountryFlag
                          code={c.country}
                          name={countryName(c.country)}
                          size="md"
                        />
                        <span className="truncate text-foreground/90">
                          {countryName(c.country)}
                        </span>
                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-muted-foreground/70">
                          {c.country}
                        </span>
                      </span>
                    }
                    value={formatNumber(c.sessions)}
                    share={c.sessions / total}
                    variant="chart-4"
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
