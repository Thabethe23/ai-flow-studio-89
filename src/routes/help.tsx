import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, FileText, Mail, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader, ResponsibleAiNotice, SectionTitle } from "@/components/page";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Aurora Work" },
      {
        name: "description",
        content:
          "Learn how the email generator, meeting summarizer, task planner and AI assistant work together in Aurora Work.",
      },
      { property: "og:title", content: "Help & Support — Aurora Work" },
      { property: "og:description", content: "Guides and answers for using Aurora Work responsibly." },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  {
    q: "How does the workflow connect the three tools?",
    a: "Summarize a meeting, convert its action items into tasks, schedule those tasks on the calendar, then draft a follow-up email — each step hands its output to the next.",
  },
  {
    q: "Can Aurora send emails or change my calendar by itself?",
    a: "No. Every AI output is a draft you review, edit and confirm. Nothing is sent and nothing is scheduled without your action.",
  },
  {
    q: "Where is my data stored?",
    a: "Saved drafts, summaries, plans and tasks are kept in this browser. Clear them any time from Settings.",
  },
  {
    q: "What should I not paste into Aurora?",
    a: "Avoid confidential, sensitive or personal information unless you are authorized and this platform is approved for it.",
  },
];

const GUIDES = [
  { to: "/email", label: "Write a better email prompt", icon: Mail },
  { to: "/meetings", label: "Get sharper meeting summaries", icon: FileText },
  { to: "/calendar", label: "Schedule work realistically", icon: CalendarDays },
  { to: "/assistant", label: "Use the unified assistant", icon: Sparkles },
] as const;

function HelpPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Help & Support"
        description="Short guides, frequently asked questions and our responsible AI commitments."
      />

      <section className="grid gap-3 sm:grid-cols-2">
        {GUIDES.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="surface-card flex items-center gap-3 p-4 hover:bg-muted/50">
            <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-lg">
              <Icon className="size-4 text-primary-foreground" aria-hidden />
            </span>
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </section>

      <section className="surface-card p-5">
        <SectionTitle>Frequently asked questions</SectionTitle>
        <Accordion type="single" collapsible className="mt-2">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <ResponsibleAiNotice />
    </div>
  );
}
