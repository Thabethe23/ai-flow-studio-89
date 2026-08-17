import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  Clock,
  FileText,
  ListTodo,
  Mail,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState, PageHeader, ResponsibleAiNotice, SectionTitle } from "@/components/page";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurora Work AI Productivity Platform" },
      {
        name: "description",
        content:
          "One dashboard for AI email drafting, meeting summaries and task planning — with stats, upcoming work and recent AI activity.",
      },
      { property: "og:title", content: "Dashboard — Aurora Work AI Productivity Platform" },
      {
        property: "og:description",
        content: "Draft emails, summarize meetings and plan tasks with AI from a single workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  {
    to: "/email",
    label: "Generate Email",
    description: "Tone-controlled drafts in seconds",
    icon: Mail,
  },
  {
    to: "/meetings",
    label: "Summarize Meeting",
    description: "Decisions and action items",
    icon: FileText,
  },
  { to: "/planner", label: "Create Tasks", description: "Turn goals into steps", icon: ListTodo },
  {
    to: "/calendar",
    label: "Schedule Tasks",
    description: "Place work on your calendar",
    icon: CalendarDays,
  },
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Mail;
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        <Icon className="size-4 text-primary" aria-hidden />
      </div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function Dashboard() {
  const { tasks, emails, meetings, activity } = useStore();
  const pending = tasks.filter((t) => t.status !== "done");
  const completed = tasks.filter((t) => t.status === "done");
  const total = tasks.length || 1;
  const rate = Math.round((completed.length / total) * 100);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = [...tasks]
    .filter((t) => t.status !== "done" && t.deadline)
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1))
    .slice(0, 5);
  const overdue = pending.filter((t) => t.deadline && t.deadline < today);

  return (
    <div className="space-y-8">
      <section className="surface-card relative overflow-hidden p-6 sm:p-8">
        <div className="bg-brand-gradient absolute -top-24 -right-16 size-64 rounded-full opacity-15" />
        <div className="relative">
          <p className="text-sm font-medium text-primary">{greeting()}, Nonkululeko</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            What would you like to <span className="text-gradient-brand">accomplish</span> today?
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Draft an email, summarize a meeting or plan your work — Aurora keeps everything connected.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link to="/assistant">
                <Sparkles className="size-4" />
                Ask the AI Assistant
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/email">
                Generate an email
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_ACTIONS.map(({ to, label, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group flex items-start gap-3 p-4 transition-shadow hover:shadow-float"
          >
            <span className="bg-brand-gradient flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Icon className="size-5 text-primary-foreground" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">{label}</span>
              <span className="block text-xs text-muted-foreground">{description}</span>
            </span>
            <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Emails generated" value={emails.length} icon={Mail} />
        <StatCard label="Meetings summarized" value={meetings.length} icon={FileText} />
        <StatCard label="Tasks pending" value={pending.length} icon={CheckSquare} />
        <StatCard label="Tasks completed" value={completed.length} icon={CheckCircle2} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-2">
          <SectionTitle icon={<CalendarDays className="size-4" />}>
            Upcoming tasks & meetings
          </SectionTitle>
          {upcoming.length ? (
            upcoming.map((t) => (
              <div key={t.id} className="surface-card flex items-center gap-3 p-3.5">
                <span className="bg-accent flex size-9 shrink-0 items-center justify-center rounded-lg text-accent-foreground">
                  <CheckSquare className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {t.deadline} · {t.priority}
                    {t.source ? ` · from ${t.source}` : ""}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/tasks">Open</Link>
                </Button>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<CalendarDays className="size-6" />}
              title="Nothing scheduled yet"
              description="Plan work in the AI Task Planner or convert meeting action items into tasks."
            />
          )}

          <SectionTitle icon={<TrendingUp className="size-4" />}>Productivity overview</SectionTitle>
          <div className="surface-card space-y-4 p-5">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Completion rate</span>
                <span className="text-muted-foreground">{rate}%</span>
              </div>
              <Progress value={rate} className="mt-2" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "High priority", value: pending.filter((t) => t.priority === "High").length },
                { label: "In progress", value: tasks.filter((t) => t.status === "doing").length },
                { label: "AI actions", value: activity.length },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-muted/60 p-3">
                  <p className="font-display text-xl font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle icon={<Bell className="size-4" />}>Notifications & reminders</SectionTitle>
          <div className="surface-card space-y-3 p-4 text-sm">
            {overdue.length > 0 && (
              <p className="rounded-lg bg-destructive/10 p-3 text-destructive">
                {overdue.length} task{overdue.length > 1 ? "s" : ""} past the suggested deadline.
              </p>
            )}
            <p className="rounded-lg bg-muted/60 p-3 text-muted-foreground">
              {pending.length
                ? `You have ${pending.length} open task${pending.length > 1 ? "s" : ""}. Review them in My Tasks.`
                : "No open tasks — a good moment to plan the week."}
            </p>
          </div>

          <SectionTitle icon={<Clock className="size-4" />}>Recent AI activity</SectionTitle>
          <div className="surface-card divide-y divide-border">
            {activity.length ? (
              activity.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-ai" aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate text-sm">{a.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                Nothing yet — your AI activity appears here.
              </p>
            )}
          </div>
        </section>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
