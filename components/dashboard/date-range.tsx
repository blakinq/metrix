"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export function DateRangePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("range") ?? "7d";

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("range", value);
    next.delete("from");
    next.delete("to");
    router.replace(`${pathname}?${next.toString()}`);
  }

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger className="w-44">
        <span className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        {PRESETS.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
