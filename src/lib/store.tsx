import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Task = {
  id: string;
  title: string;
  notes?: string | undefined;
  priority: "High" | "Medium" | "Low";
  status: "todo" | "doing" | "done";
  deadline?: string | undefined;
  duration?: string | undefined;
  owner?: string | undefined;
  source?: string | undefined;
  createdAt: string;
};

export type SavedEmail = {
  id: string;
  subject: string;
  body: string;
  tone: string;
  createdAt: string;
  favorite?: boolean | undefined;
};

export type SavedMeeting = {
  id: string;
  title: string;
  datetime?: string | undefined;
  participants?: string | undefined;
  summary: string;
  createdAt: string;
  favorite?: boolean | undefined;
};

export type SavedPlan = {
  id: string;
  title: string;
  plan: string;
  createdAt: string;
  favorite?: boolean | undefined;
};

export type Activity = {
  id: string;
  kind: "email" | "meeting" | "plan" | "assistant" | "task";
  label: string;
  createdAt: string;
};

type State = {
  tasks: Task[];
  emails: SavedEmail[];
  meetings: SavedMeeting[];
  plans: SavedPlan[];
  activity: Activity[];
};

const EMPTY: State = { tasks: [], emails: [], meetings: [], plans: [], activity: [] };
const KEY = "aurora-workspace-v1";

type Ctx = State & {
  hydrated: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status"> & { status?: Task["status"] }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  saveEmail: (email: Omit<SavedEmail, "id" | "createdAt">) => void;
  saveMeeting: (meeting: Omit<SavedMeeting, "id" | "createdAt">) => void;
  savePlan: (plan: Omit<SavedPlan, "id" | "createdAt">) => void;
  toggleFavorite: (kind: "email" | "meeting" | "plan", id: string) => void;
  logActivity: (kind: Activity["kind"], label: string) => void;
  clearAll: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const logActivity = useCallback((kind: Activity["kind"], label: string) => {
    setState((s) => ({
      ...s,
      activity: [{ id: uid(), kind, label, createdAt: now() }, ...s.activity].slice(0, 40),
    }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      hydrated,
      logActivity,
      addTask: (task) =>
        setState((s) => ({
          ...s,
          tasks: [
            { ...task, status: task.status ?? "todo", id: uid(), createdAt: now() },
            ...s.tasks,
          ],
          activity: [
            { id: uid(), kind: "task" as const, label: `Task added: ${task.title}`, createdAt: now() },
            ...s.activity,
          ].slice(0, 40),
        })),
      updateTask: (id, patch) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      removeTask: (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
      saveEmail: (email) =>
        setState((s) => ({
          ...s,
          emails: [{ ...email, id: uid(), createdAt: now() }, ...s.emails],
        })),
      saveMeeting: (meeting) =>
        setState((s) => ({
          ...s,
          meetings: [{ ...meeting, id: uid(), createdAt: now() }, ...s.meetings],
        })),
      savePlan: (plan) =>
        setState((s) => ({ ...s, plans: [{ ...plan, id: uid(), createdAt: now() }, ...s.plans] })),
      toggleFavorite: (kind, id) =>
        setState((s) => {
          const flip = <T extends { id: string; favorite?: boolean | undefined }>(items: T[]) =>
            items.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i));
          if (kind === "email") return { ...s, emails: flip(s.emails) };
          if (kind === "meeting") return { ...s, meetings: flip(s.meetings) };
          return { ...s, plans: flip(s.plans) };
        }),
      clearAll: () => setState(EMPTY),
    }),
    [state, hydrated, logActivity],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function workspaceContextString(s: State) {
  const lines: string[] = [];
  if (s.tasks.length)
    lines.push(
      `Tasks:\n${s.tasks
        .slice(0, 15)
        .map((t) => `- ${t.title} (${t.priority}, ${t.status}${t.deadline ? `, due ${t.deadline}` : ""})`)
        .join("\n")}`,
    );
  if (s.meetings.length)
    lines.push(`Recent meetings: ${s.meetings.slice(0, 5).map((m) => m.title).join(", ")}`);
  if (s.emails.length)
    lines.push(`Recent email drafts: ${s.emails.slice(0, 5).map((e) => e.subject).join(", ")}`);
  if (s.plans.length)
    lines.push(`Recent plans: ${s.plans.slice(0, 5).map((p) => p.title).join(", ")}`);
  return lines.join("\n\n");
}
