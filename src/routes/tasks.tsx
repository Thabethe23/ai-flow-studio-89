import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Clock, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, PageHeader, SectionTitle } from "@/components/page";
import { useStore, type Task } from "@/lib/store";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "My Tasks — Aurora Work" },
      {
        name: "description",
        content:
          "Track every task from AI plans and meeting action items across today, this week, list and kanban views.",
      },
      { property: "og:title", content: "My Tasks — Aurora Work" },
      {
        property: "og:description",
        content: "Today, week, list and kanban views for your AI-assisted task board.",
      },
    ],
  }),
  component: TasksPage,
});

const COLUMNS: Array<{ id: Task["status"]; label: string }> = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "In progress" },
  { id: "done", label: "Done" },
];

const priorityClass: Record<Task["priority"], string> = {
  High: "bg-destructive/15 text-destructive",
  Medium: "bg-warning/20 text-warning-foreground",
  Low: "bg-success/15 text-success",
};

function TaskRow({ task }: { task: Task }) {
  const { updateTask, removeTask } = useStore();
  const done = task.status === "done";
  return (
    <div className="surface-card flex items-start gap-3 p-3.5">
      <Checkbox
        checked={done}
        onCheckedChange={(v) => updateTask(task.id, { status: v ? "done" : "todo" })}
        aria-label={`Mark ${task.title} complete`}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : ""}`}>
          {task.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className={`rounded-full px-2 py-0.5 font-semibold ${priorityClass[task.priority]}`}>
            {task.priority}
          </span>
          {task.deadline && <span>Due {task.deadline}</span>}
          {task.duration && <span>· {task.duration}</span>}
          {task.owner && <span>· {task.owner}</span>}
          {task.source && <span>· from {task.source}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!done && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const next = new Date(task.deadline ? `${task.deadline}T09:00` : Date.now());
              next.setDate(next.getDate() + 1);
              updateTask(task.id, { deadline: next.toISOString().slice(0, 10) });
              toast.success("Postponed by one day");
            }}
          >
            <Clock className="size-4" />
            <span className="sr-only sm:not-sr-only">Postpone</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete task"
          onClick={() => removeTask(task.id)}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

function TasksPage() {
  const { tasks, addTask, updateTask } = useStore();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [deadline, setDeadline] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  const todayTasks = tasks.filter((t) => t.deadline === today || (!t.deadline && t.status !== "done"));
  const weekTasks = tasks.filter((t) => t.deadline && t.deadline >= today && t.deadline <= weekEnd);

  const create = () => {
    if (!title.trim()) return;
    addTask({ title, priority, deadline: deadline || undefined, source: "Manual" });
    setTitle("");
    setDeadline("");
    toast.success("Task added");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        description="Everything Aurora suggested plus anything you added yourself. You always have the final say."
      />

      <section className="surface-card grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="new-task">New task</Label>
          <Input
            id="new-task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="What needs doing?"
          />
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
            <SelectTrigger className="w-full sm:w-32">
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
          <Label htmlFor="due">Due</Label>
          <Input id="due" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <Button onClick={create}>
          <Plus className="size-4" />
          Add
        </Button>
      </section>

      <Tabs defaultValue="today">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4 space-y-3">
          {todayTasks.length ? (
            todayTasks.map((t) => <TaskRow key={t.id} task={t} />)
          ) : (
            <EmptyState
              icon={<CheckSquare className="size-6" />}
              title="Nothing due today"
              description="Add a task above or generate a plan in the AI Task Planner."
            />
          )}
        </TabsContent>

        <TabsContent value="week" className="mt-4 space-y-3">
          {weekTasks.length ? (
            weekTasks.map((t) => <TaskRow key={t.id} task={t} />)
          ) : (
            <EmptyState title="No tasks in the next 7 days" description="Your week is clear." />
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-4 space-y-3">
          {tasks.length ? (
            tasks.map((t) => <TaskRow key={t.id} task={t} />)
          ) : (
            <EmptyState title="No tasks yet" description="Tasks you create or accept appear here." />
          )}
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {COLUMNS.map((col) => (
              <div
                key={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) updateTask(dragId, { status: col.id });
                  setDragId(null);
                }}
                className="rounded-xl border border-border bg-muted/40 p-3"
              >
                <SectionTitle icon={<CheckSquare className="size-4" />}>
                  {col.label} ({tasks.filter((t) => t.status === col.id).length})
                </SectionTitle>
                <div className="mt-3 space-y-2">
                  {tasks
                    .filter((t) => t.status === col.id)
                    .map((t) => (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={() => setDragId(t.id)}
                        className="surface-card cursor-grab p-3 active:cursor-grabbing"
                      >
                        <p className="text-sm font-medium">{t.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span
                            className={`rounded-full px-2 py-0.5 font-semibold ${priorityClass[t.priority]}`}
                          >
                            {t.priority}
                          </span>
                          {t.deadline && <span>Due {t.deadline}</span>}
                        </div>
                        <div className="mt-2 flex gap-1">
                          {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                            <Button
                              key={c.id}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[11px]"
                              onClick={() => updateTask(t.id, { status: c.id })}
                            >
                              → {c.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  {tasks.filter((t) => t.status === col.id).length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      Drag tasks here
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
