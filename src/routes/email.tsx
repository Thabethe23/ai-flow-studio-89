import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AiLoading, AiOutput } from "@/components/ai-output";
import { EmptyState, PageHeader, SensitiveNotice, SectionTitle } from "@/components/page";
import { generateEmail } from "@/lib/ai.functions";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aurora Work" },
      {
        name: "description",
        content:
          "Draft professional emails with AI: choose tone, length and key points, then edit the result before sending.",
      },
      { property: "og:title", content: "Smart Email Generator — Aurora Work" },
      {
        property: "og:description",
        content: "Generate tone-controlled email drafts you can edit, copy and export.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Formal", "Casual", "Persuasive", "Apologetic"];
const LENGTHS = ["Short", "Medium", "Long"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const { saveEmail, logActivity } = useStore();
  const [form, setForm] = useState({
    recipient: "",
    purpose: "",
    tone: "Professional",
    length: "Medium",
    keyPoints: "",
    subject: "",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const generate = async (modifier = "", usePrevious = false) => {
    if (!form.purpose.trim()) {
      toast.error("Add the email purpose first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await run({
        data: { ...form, modifier, previous: usePrevious ? output : "" },
      });
      setOutput(res.text);
      logActivity("email", `Email draft: ${form.purpose.slice(0, 48)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    const subject = output.match(/^Subject:\s*(.+)$/m)?.[1] ?? form.purpose.slice(0, 60);
    saveEmail({ subject, body: output, tone: form.tone });
    toast.success("Draft saved to History");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Email Generator"
        description="Give the AI your context and it drafts a clear, professional email. Nothing is ever sent automatically."
      />
      <SensitiveNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <SectionTitle icon={<Mail className="size-4" />}>Your input</SectionTitle>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient / context</Label>
            <Input
              id="recipient"
              value={form.recipient}
              onChange={(e) => set("recipient", e.target.value)}
              placeholder="e.g. Dr. Mokoena, my thesis supervisor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose *</Label>
            <Textarea
              id="purpose"
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
              placeholder="Request a two-day extension on the project report"
              className="min-h-20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={form.tone} onValueChange={(v) => set("tone", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Desired length</Label>
              <Select value={form.length} onValueChange={(v) => set("length", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points / instructions</Label>
            <Textarea
              id="points"
              value={form.keyPoints}
              onChange={(e) => set("keyPoints", e.target.value)}
              placeholder="Mention the data collection delay; offer to submit Friday 17:00"
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              placeholder="Leave blank to let the AI propose one"
            />
          </div>

          <Button className="w-full" size="lg" onClick={() => generate()} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </section>

        <section className="space-y-4">
          <SectionTitle>AI output</SectionTitle>
          {loading ? (
            <AiLoading label="Drafting your email…" />
          ) : error ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-sm">
              <p className="font-semibold">Generation failed</p>
              <p className="mt-1 text-muted-foreground">{error}</p>
              <Button className="mt-3" size="sm" variant="secondary" onClick={() => generate()}>
                Try again
              </Button>
            </div>
          ) : output ? (
            <AiOutput
              value={output}
              onChange={setOutput}
              onRegenerate={() => generate()}
              onSave={save}
              filename="email-draft.txt"
              extraActions={
                <>
                  <Button variant="ghost" size="sm" onClick={() => generate("make it shorter", true)}>
                    Make Shorter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => generate("make it more professional", true)}
                  >
                    More Professional
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => generate(`rewrite in a ${form.tone} tone`, true)}
                  >
                    Change Tone
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => generate("propose a stronger subject line", true)}
                  >
                    Generate Subject
                  </Button>
                </>
              }
            >
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Send className="size-3.5" aria-hidden />
                Review and copy into your email client — Aurora never sends email for you.
              </p>
            </AiOutput>
          ) : (
            <EmptyState
              icon={<Mail className="size-6" />}
              title="No draft yet"
              description="Fill in the purpose and any key points, then generate a draft you can edit freely."
            />
          )}
        </section>
      </div>
    </div>
  );
}
