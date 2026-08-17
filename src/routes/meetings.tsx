import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, ListTodo, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiLoading, AiOutput } from "@/components/ai-output";
import { EmptyState, PageHeader, SectionTitle, SensitiveNotice } from "@/components/page";
import { extractTasks, summarizeMeeting } from "@/lib/ai.functions";
import { useStore, type Task } from "@/lib/store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aurora Work" },
      {
        name: "description",
        content:
          "Turn meeting transcripts into an executive summary, decisions, action items and deadlines you can convert into tasks.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Aurora Work" },
      {
        property: "og:description",
        content: "Structured AI meeting summaries with action items you can send to your task board.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const runExtract = useServerFn(extractTasks);
  const { saveMeeting, addTask, logActivity } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", datetime: "", participants: "", notes: "" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onUpload = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    set("notes", text.slice(0, 40000));
    toast.success(`Loaded ${file.name}`);
  };

  const summarize = async () => {
    if (!form.notes.trim()) {
      toast.error("Paste or upload meeting notes first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await run({ data: form });
      setOutput(res.text);
      logActivity("meeting", `Meeting summarized: ${form.title || "Untitled meeting"}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const convertToTasks = async () => {
    setConverting(true);
    try {
      const res = await runExtract({ data: { summary: output } });
      const json = res.text.slice(res.text.indexOf("["), res.text.lastIndexOf("]") + 1);
      const items = JSON.parse(json) as Array<{
        title: string;
        owner?: string;
        priority?: Task["priority"];
        deadline?: string;
      }>;
      if (!items.length) {
        toast.info("No explicit action items were found in this summary.");
        return;
      }
      items.forEach((item) =>
        addTask({
          title: item.title,
          owner: item.owner,
          priority: item.priority ?? "Medium",
          deadline: item.deadline || undefined,
          source: form.title || "Meeting",
        }),
      );
      toast.success(`${items.length} task${items.length > 1 ? "s" : ""} added to My Tasks`);
      navigate({ to: "/tasks" });
    } catch {
      toast.error("Could not read action items — review the summary and try again.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste or upload notes and get a structured summary. AI sections are labelled separately from the details you supplied."
      />
      <SensitiveNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <SectionTitle icon={<FileText className="size-4" />}>Meeting details</SectionTitle>

          <div className="space-y-2">
            <Label htmlFor="title">Meeting title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Q3 product planning"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="datetime">Date and time</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={form.datetime}
                onChange={(e) => set("datetime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                value={form.participants}
                onChange={(e) => set("participants", e.target.value)}
                placeholder="Nonku, Sipho, Ana"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Notes / transcript *</Label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary">
                <Upload className="size-3.5" aria-hidden />
                Upload .txt / .md
                <input
                  type="file"
                  accept=".txt,.md,text/plain"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
              </label>
            </div>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Paste the raw meeting notes or transcript here…"
              className="min-h-64"
            />
          </div>

          <Button className="w-full" size="lg" onClick={summarize} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Summarizing…" : "Summarize Meeting"}
          </Button>
        </section>

        <section className="space-y-4">
          <SectionTitle>AI summary</SectionTitle>
          {loading ? (
            <AiLoading label="Reading your notes…" />
          ) : error ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-sm">
              <p className="font-semibold">Summary failed</p>
              <p className="mt-1 text-muted-foreground">{error}</p>
              <Button className="mt-3" size="sm" variant="secondary" onClick={summarize}>
                Try again
              </Button>
            </div>
          ) : output ? (
            <AiOutput
              value={output}
              onChange={setOutput}
              onRegenerate={summarize}
              onSave={() => {
                saveMeeting({ ...form, summary: output });
                toast.success("Summary saved to History");
              }}
              filename="meeting-summary.md"
              extraActions={
                <Button size="sm" onClick={convertToTasks} disabled={converting}>
                  <ListTodo className="size-4" />
                  {converting ? "Extracting…" : "Convert action items to tasks"}
                </Button>
              }
            >
              <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">You supplied:</span>{" "}
                {form.title || "no title"} · {form.datetime || "no date"} ·{" "}
                {form.participants || "no participants"}
              </div>
            </AiOutput>
          ) : (
            <EmptyState
              icon={<FileText className="size-6" />}
              title="No summary yet"
              description="Add your meeting notes and Aurora will organise them into decisions, action items and deadlines."
            />
          )}
        </section>
      </div>
    </div>
  );
}
