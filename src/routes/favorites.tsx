import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { EmptyState, PageHeader } from "@/components/page";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Aurora Work" },
      {
        name: "description",
        content: "Your starred email drafts, meeting summaries and AI plans, kept close at hand.",
      },
      { property: "og:title", content: "Favorites — Aurora Work" },
      { property: "og:description", content: "Starred AI outputs you reuse most often." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { emails, meetings, plans } = useStore();
  const items = [
    ...emails.filter((e) => e.favorite).map((e) => ({ id: e.id, kind: "Email", title: e.subject, body: e.body })),
    ...meetings
      .filter((m) => m.favorite)
      .map((m) => ({ id: m.id, kind: "Meeting", title: m.title || "Untitled meeting", body: m.summary })),
    ...plans.filter((p) => p.favorite).map((p) => ({ id: p.id, kind: "Plan", title: p.title, body: p.plan })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Favorites" description="Starred outputs from across the platform." />
      {items.length ? (
        <div className="space-y-4">
          {items.map((i) => (
            <article key={`${i.kind}-${i.id}`} className="surface-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Star className="size-4 fill-warning text-warning" aria-hidden />
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">
                  {i.kind}
                </span>
                <h2 className="truncate text-sm font-semibold">{i.title}</h2>
              </div>
              <Markdown content={i.body} />
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Star className="size-6" />}
          title="No favorites yet"
          description="Star anything in History to pin it here."
        />
      )}
    </div>
  );
}
