"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Row {
  source: string;
  sessions: number;
}

export function SourcesBar({ data }: { data: Row[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="0"
            vertical={false}
            opacity={0.5}
          />
          <XAxis
            dataKey="source"
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
            cursor={{ fill: "hsl(var(--surface))", opacity: 0.4 }}
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
          <Bar
            dataKey="sessions"
            fill="hsl(var(--chart-1))"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
