"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface Row {
  deviceType: string;
  sessions: number;
}

export function DevicesDonut({ data }: { data: Row[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="sessions"
            nameKey="deviceType"
            innerRadius={62}
            outerRadius={96}
            paddingAngle={2}
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
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
          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize: 12,
              color: "hsl(var(--muted-foreground))",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
