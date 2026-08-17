import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiBadge, AiLoading } from "@/components/ai-output";
import { Markdown } from "@/components/markdown";
import { PageHeader, ResponsibleAiNotice, SensitiveNotice } from "@/components/page";
import { askAssistant } from "@/lib/ai.functions";
import { useStore, workspaceContextString } from "@/lib/store";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Aurora Work" },
      {
        name: "description",
        content:
          "One assistant that moves work between your email drafts, meeting summaries, tasks and calendar.",
      },
      { property: "og:title", content: "AI Assistant — Aurora Work" },
      {
        property: "og:description",
        content: "Ask the assistant to connect meetings, tasks, schedules and follow-up emails.",
      },
    ],
  }),
  component: AssistantPage,
});

const PROMPTS = [
  "Turn my latest meeting summary into tasks with deadlines",
  "Draft a follow-up email for my open action items",
  "Rebalance this week's tasks around a 9–15 working day",
  "What should I focus on first today?",
];

type Msg = { role: "user" | "assistant"; content: string };

function AssistantPage() {
  const run = useServerFn(askAssistant);
  const store = useStore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question) return;
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    try {
      const context = workspaceContextString({
        tasks: store.tasks,
        emails: store.emails,
        meetings: store.meetings,
        plans: store.plans,
        activity: store.activity,
      });
      const history = messages
        .slice(-4)
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");
      const res = await run({
        data: { question, context: [context, history].filter(Boolean).join("\n\n") },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
      store.logActivity("assistant", question.slice(0, 60));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The assistant could not respond.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="Aurora sees the drafts, summaries and tasks you saved, and suggests how to move work between them. It never acts without you."
      />
      <SensitiveNotice />

      <div className="surface-card flex min-h-[26rem] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && !loading && (
            <div className="space-y-4 py-6 text-center">
              <span className="bg-brand-gradient mx-auto flex size-12 items-center justify-center rounded-2xl">
                <Sparkles className="size-6 text-primary-foreground" aria-hidden />
              </span>
              <p className="font-semibold">How can I help you move work forward?</p>
              <div className="mx-auto grid max-w-xl gap-2 sm:grid-cols-2">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-lg border border-border p-3 text-left text-sm transition-colors hover:bg-muted"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="max-w-[92%] space-y-2">
                <AiBadge />
                <div className="rounded-2xl rounded-bl-sm border border-border bg-muted/50 px-4 py-3">
                  <Markdown content={m.content} />
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(m.content);
                        toast.success("Copied");
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => send(messages[i - 1]?.content ?? "Please continue")}
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            ),
          )}

          {loading && <AiLoading label="Thinking through your workspace…" />}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask the assistant…"
              className="min-h-11 flex-1 resize-none"
              aria-label="Message the AI assistant"
            />
            <Button size="lg" onClick={() => send(input)} disabled={loading}>
              <Send className="size-4" />
              <span className="sr-only sm:not-sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
