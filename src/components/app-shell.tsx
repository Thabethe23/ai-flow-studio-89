import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  Clock,
  FileText,
  HelpCircle,
  LayoutDashboard,
  ListTodo,
  Mail,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  Star,
  Sun,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme";
import { useStore } from "@/lib/store";
import { ResponsibleAiNotice } from "@/components/page";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes", icon: FileText },
  { to: "/planner", label: "AI Task Planner", icon: ListTodo },
  { to: "/calendar", label: "Calendar / Schedule", icon: CalendarDays },
  { to: "/tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/history", label: "History", icon: Clock },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help & Support", icon: HelpCircle },
] as const;

const MOBILE_NAV = [NAV[0], NAV[1], NAV[2], NAV[5], NAV[6]];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1" aria-label="Main navigation">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-4">
      <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-xl">
        <Sparkles className="size-5 text-primary-foreground" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-bold text-sidebar-accent-foreground">
          Aurora Work
        </span>
        <span className="block text-[11px] text-sidebar-foreground/70">AI productivity suite</span>
      </span>
    </div>
  );
}

function GlobalSearch() {
  const [q, setQ] = useState("");
  const results = useMemo(
    () => (q.trim() ? NAV.filter((n) => n.label.toLowerCase().includes(q.toLowerCase())) : []),
    [q],
  );

  return (
    <div className="relative hidden w-full max-w-sm sm:block">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search workspace, tools, pages…"
        className="pl-9"
        aria-label="Search"
      />
      {results.length > 0 && (
        <div className="surface-card absolute top-full z-30 mt-2 w-full overflow-hidden p-1">
          {results.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setQ("")}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <Icon className="size-4 text-muted-foreground" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const { tasks } = useStore();
  const [open, setOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dueSoon = tasks.filter((t) => t.status !== "done").length;

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar px-3 pb-4 lg:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto">
          <NavList />
        </div>
        <Link
          to="/assistant"
          className="mt-3 flex items-center gap-2 rounded-xl bg-sidebar-accent/70 p-3 text-sm text-sidebar-accent-foreground transition-colors hover:bg-sidebar-accent"
        >
          <Sparkles className="size-4" aria-hidden />
          <span>
            <span className="block font-semibold">Ask the AI Assistant</span>
            <span className="block text-[11px] text-sidebar-foreground/70">
              Move work across tools
            </span>
          </span>
        </Link>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar px-3 text-sidebar-foreground">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand />
                <NavList onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <GlobalSearch />

            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Link
                to="/tasks"
                className="relative inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
                aria-label={`Notifications: ${dueSoon} open tasks`}
              >
                <Bell className="size-5" />
                {dueSoon > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
                )}
              </Link>
              <span className="bg-brand-gradient ml-1 flex size-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground">
                N
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pt-6 pb-32 sm:px-6 lg:pb-12">{children}</main>

        {showNotice && (
          <div className="fixed right-3 bottom-20 z-30 max-w-sm lg:bottom-4">
            <div className="surface-card relative p-1 shadow-float">
              <button
                onClick={() => setShowNotice(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss notice"
              >
                <X className="size-3.5" />
              </button>
              <ResponsibleAiNotice compact />
            </div>
          </div>
        )}

        <nav
          className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 backdrop-blur lg:hidden"
          aria-label="Primary"
        >
          {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] ${
                pathname === to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" aria-hidden />
              <span className="max-w-full truncate px-1">{label.split(" ")[0]}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
