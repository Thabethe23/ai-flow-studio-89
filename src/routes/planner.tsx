import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ListTodo, Sparkles } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AiLoading, AiOutput } from "@/components/ai-output";
import { EmptyState, PageHeader, SectionTitle, SensitiveNotice } from "@/components/page";
import { createPlan } from "@/lib/ai.functions";
import { useStore, type Task } from "@/lib/store";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler — Aurora Work" },
      {
        name: "description",
        content:
          "Turn goals into an ordered action plan with subtasks, durations, suggested deadlines and a schedule you control.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler — Aurora Work" },
      {
        property: "og:description",
        content: "Plan, sequence and schedule work with AI suggestions you can override.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(createPlan);
  const { addTask, savePlan, logActivity } = useStore();
  const [form, setForm] = useState({
    description: "",
    goal: "",
    priority: "Medium",
    deadline: "",
    duration: "",
    workingHours: "",
    dependencies: "",
    instructions: "",
  });
  const [recurring, setRecurring] = useState(false);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const plan = async () => {
    if (!form.description.trim()) {
      toast.error("Describe the task or goal first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await run({
        data: { ...form, recurring: recurring ? "Weekly" : "None" },
      });
      setOutput(res.text);
      logActivity("plan", `Plan created: ${form.description.slice(0, 48)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const addToBoard = () => {
    const jsonStart = output.lastIndexOf("[");
    const jsonEnd = output.lastIndexOf("]");
    let added = 0;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      try {
        const items = JSON.parse(output.slice(jsonStart, jsonEnd + 1)) as Array<{
          title: string;
          priority?: Task["priority"];
          deadline?: string;
          duration?: string;
        }>;
        items.forEach((i) => {
          addTask({
            title: i.title,
            priority: i.priority ?? (form.priority as Task["priority"]),
            deadline: i.deadline || form.deadline || undefined,
            duration: i.duration || form.duration || undefined,
            source: "AI Plan",
          });
          added += 1;
        });
      } catch {
        added = 0;
      }
    }
    if (!added) {
      addTask({
        title: form.description.slice(0, 80),
        priority: form.priority as Task["priority"],
        deadline: form.deadline || undefined,
        duration: form.duration || undefined,
        source: "AI Plan",
      });
      added = 1;
    }
    toast.success(`${added} task${added > 1 ? "s" : ""} added to My Tasks`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Task Planner & Scheduler"
        description="Describe a goal and Aurora proposes tasks, subtasks, order and a schedule. You confirm everything before it reaches your board."
      />
      <SensitiveNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <SectionTitle icon={<ListTodo className="size-4" />}>Planning input</SectionTitle>

          <div className="space-y-2">
            <Label htmlFor="description">Task description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Prepare and deliver the client onboarding workshop"
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal / outcome</Label>
            <Input
              id="goal"
              value={form.goal}
              onChange={(e) => set("goal", e.target.value)}
              placeholder="Client team can use the platform unaided"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["High", "Medium", "Low"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Estimated duration</Label>
              <Input
                id="duration"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="6 hours"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Preferred working hours</Label>
              <Input
                id="hours"
                value={form.workingHours}
                onChange={(e) => set("workingHours", e.target.value)}
                placeholder="09:00 – 15:00"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="recurring">Recurring task</Label>
              <p className="text-xs text-muted-foreground">Repeat this plan weekly</p>
            </div>
            <Switch id="recurring" checked={recurring} onCheckedChange={setRecurring} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deps">Dependencies</Label>
            <Input
              id="deps"
              value={form.dependencies}
              onChange={(e) => set("dependencies", e.target.value)}
              placeholder="Needs the signed scope document first"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra">Additional instructions</Label>
            <Textarea
              id="extra"
              value={form.instructions}
              onChange={(e) => set("instructions", e.target.value)}
              className="min-h-20"
              placeholder="Keep sessions under 90 minutes; avoid Fridays"
            />
          </div>

          <Button className="w-full" size="lg" onClick={plan} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Planning…" : "Create AI Plan"}
          </Button>
        </section>

        <section className="space-y-4">
          <SectionTitle>AI plan</SectionTitle>
          {loading ? (
            <AiLoading label="Building your action plan…" />
          ) : error ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-sm">
              <p className="font-semibold">Planning failed</p>
              <p className="mt-1 text-muted-foreground">{error}</p>
              <Button className="mt-3" size="sm" variant="secondary" onClick={plan}>
                Try again
              </Button>
            </div>
          ) : output ? (
            <AiOutput
              value={output}
              onChange={setOutput}
              onRegenerate={plan}
              onSave={() => {
                savePlan({ title: form.description.slice(0, 70), plan: output });
                toast.success("Plan saved to History");
              }}
              filename="ai-plan.md"
              extraActions={
                <Button size="sm" onClick={addToBoard}>
                  <ListTodo className="size-4" />
                  Add tasks to My Tasks
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<ListTodo className="size-6" />}
              title="No plan yet"
              description="Describe the work and Aurora will break it into ordered, scheduled tasks."
            />
          )}
        </section>
      </div>
    </div>
  );
}
