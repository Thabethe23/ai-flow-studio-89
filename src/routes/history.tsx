import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, FileText, ListTodo, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, PageHeader } from "@/components/page";
import { Markdown } from "@/components/markdown";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Aurora Work" },
      {
        name: "description",
        content: "Every saved email draft, meeting summary and AI plan in one searchable archive.",
      },
      { property: "og:title", content: "History — Aurora Work" },
      {
        property: "og:description",
        content: "Search saved AI drafts, summaries and plans from your workspace.",
      },
    ],
  }),
  component: HistoryPage,
});

function Item({
  title,
  subtitle,
  body,
  favorite,
  onFavorite,
}: {
  title: string;
  subtitle: string;
  body: string;
  favorite?: boolean | undefined;
  onFavorite: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <button className="min-w-0 text-left" onClick={() => setOpen((o) => !o)}>
          <p className="truncate font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </button>
        <Button variant="ghost" size="icon" onClick={onFavorite} aria-label="Toggle favorite">
          <Star className={`size-4 ${favorite ? "fill-warning text-warning" : ""}`} />
        </Button>
      </div>
      {open && (
        <div className="mt-3 border-t border-border pt-3">
          <Markdown content={body} />
        </div>
      )}
    </div>
  );
}

function HistoryPage() {
  const { emails, meetings, plans, activity, toggleFavorite } = useStore();
  const [q, setQ] = useState("");
  const match = (s: string) => s.toLowerCase().includes(q.toLowerCase());

  return (
    <div className="space-y-6">
      <PageHeader title="History" description="Everything you saved, searchable and re-editable." />

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search history…"
        aria-label="Search history"
        className="max-w-md"
      />

      <Tabs defaultValue="emails">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="mt-4 space-y-3">
          {emails.filter((e) => match(e.subject + e.body)).length ? (
            emails
              .filter((e) => match(e.subject + e.body))
              .map((e) => (
                <Item
                  key={e.id}
                  title={e.subject}
                  subtitle={`${e.tone} · ${new Date(e.createdAt).toLocaleString()}`}
                  body={e.body}
                  favorite={e.favorite}
                  onFavorite={() => toggleFavorite("email", e.id)}
                />
              ))
          ) : (
            <EmptyState icon={<Mail className="size-6" />} title="No saved emails" description="Save a draft from the Smart Email Generator." />
          )}
        </TabsContent>

        <TabsContent value="meetings" className="mt-4 space-y-3">
          {meetings.filter((m) => match(m.title + m.summary)).length ? (
            meetings
              .filter((m) => match(m.title + m.summary))
              .map((m) => (
                <Item
                  key={m.id}
                  title={m.title || "Untitled meeting"}
                  subtitle={`${m.datetime || "no date"} · ${new Date(m.createdAt).toLocaleString()}`}
                  body={m.summary}
                  favorite={m.favorite}
                  onFavorite={() => toggleFavorite("meeting", m.id)}
                />
              ))
          ) : (
            <EmptyState icon={<FileText className="size-6" />} title="No saved summaries" description="Save a summary from the Meeting Notes Summarizer." />
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4 space-y-3">
          {plans.filter((p) => match(p.title + p.plan)).length ? (
            plans
              .filter((p) => match(p.title + p.plan))
              .map((p) => (
                <Item
                  key={p.id}
                  title={p.title}
                  subtitle={new Date(p.createdAt).toLocaleString()}
                  body={p.plan}
                  favorite={p.favorite}
                  onFavorite={() => toggleFavorite("plan", p.id)}
                />
              ))
          ) : (
            <EmptyState icon={<ListTodo className="size-6" />} title="No saved plans" description="Save a plan from the AI Task Planner." />
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-4 space-y-2">
          {activity.length ? (
            activity.map((a) => (
              <div key={a.id} className="surface-card flex items-center gap-3 p-3 text-sm">
                <Clock className="size-4 text-muted-foreground" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{a.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <EmptyState title="No activity yet" description="Your AI activity will show up here." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
