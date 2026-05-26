"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Point {
  date: string;
  pageviews: number;
  visitors: number;
}

export function PageviewsChart({ data }: { data: Point[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="vFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="0"
            vertical={false}
            opacity={0.5}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={42}
          />
          <Tooltip
            cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
              padding: "8px 12px",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4 }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="pageviews"
            stroke="hsl(var(--chart-1))"
            strokeWidth={1.75}
            fill="url(#pvFill)"
          />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="hsl(var(--chart-2))"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            fill="url(#vFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
