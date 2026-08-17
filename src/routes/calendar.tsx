import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, SectionTitle } from "@/components/page";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar & Schedule — Aurora Work" },
      {
        name: "description",
        content:
          "See scheduled tasks and meeting follow-ups on a month calendar with a mobile-friendly agenda view.",
      },
      { property: "og:title", content: "Calendar & Schedule — Aurora Work" },
      {
        property: "og:description",
        content: "Month and agenda views for AI-scheduled tasks and deadlines.",
      },
    ],
  }),
  component: CalendarPage,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CalendarPage() {
  const { tasks } = useStore();
  const [cursor, setCursor] = useState(() => new Date());

  const { cells, label } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: Array<{ date: string; day: number } | null> = Array.from(
      { length: offset },
      () => null,
    );
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push({
        day: d,
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
    return {
      cells: list,
      label: cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    };
  }, [cursor]);

  const today = new Date().toISOString().slice(0, 10);
  const scheduled = tasks.filter((t) => t.deadline);
  const agenda = [...scheduled].sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1));

  const shift = (n: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar / Schedule"
        description="Scheduled tasks and deadlines. AI suggestions are placed here only after you accept them."
        actions={
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="icon" aria-label="Previous month" onClick={() => shift(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-2 text-sm font-semibold">{label}</span>
            <Button variant="secondary" size="icon" aria-label="Next month" onClick={() => shift(1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      <section className="surface-card hidden overflow-hidden p-3 sm:block">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground uppercase">
          {DAYS.map((d) => (
            <span key={d} className="py-1.5">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) =>
            cell ? (
              <div
                key={cell.date}
                className={`min-h-24 rounded-lg border p-1.5 text-left ${
                  cell.date === today ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <span className="text-xs font-semibold">{cell.day}</span>
                <div className="mt-1 space-y-1">
                  {scheduled
                    .filter((t) => t.deadline === cell.date)
                    .slice(0, 3)
                    .map((t) => (
                      <p
                        key={t.id}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] ${
                          t.status === "done"
                            ? "bg-muted text-muted-foreground line-through"
                            : "bg-accent text-accent-foreground"
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </p>
                    ))}
                </div>
              </div>
            ) : (
              <div key={`empty-${i}`} className="min-h-24 rounded-lg bg-muted/30" />
            ),
          )}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle icon={<CalendarDays className="size-4" />}>Agenda</SectionTitle>
        {agenda.length ? (
          agenda.map((t) => (
            <div key={t.id} className="surface-card flex items-center justify-between gap-3 p-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.title}</p>
                <p className="text-xs text-muted-foreground">
                  {t.deadline} {t.duration ? `· ${t.duration}` : ""} · {t.priority}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[11px] capitalize">
                {t.status}
              </span>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<CalendarDays className="size-6" />}
            title="Nothing scheduled"
            description="Give tasks a due date, or accept a schedule from the AI Task Planner."
          />
        )}
      </section>
    </div>
  );
}
