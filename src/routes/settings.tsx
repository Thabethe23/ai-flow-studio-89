import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme";
import { PageHeader, ResponsibleAiNotice, SectionTitle } from "@/components/page";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Aurora Work" },
      {
        name: "description",
        content:
          "Control appearance, default tone, working hours, reminders and your locally stored workspace data.",
      },
      { property: "og:title", content: "Settings — Aurora Work" },
      { property: "og:description", content: "Personalise Aurora Work and manage your data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { clearAll } = useStore();
  const [name, setName] = useState("Nonkululeko");
  const [hours, setHours] = useState("09:00 – 17:00");
  const [reminders, setReminders] = useState(true);

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Preferences apply across every tool in Aurora Work." />

      <section className="surface-card space-y-4 p-5">
        <SectionTitle>Profile & schedule</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Default working hours</Label>
          <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
        </div>
        <Button onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
      </section>

      <section className="surface-card space-y-4 p-5">
        <SectionTitle>Appearance & reminders</SectionTitle>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <Label htmlFor="dark">Dark mode</Label>
            <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
          </div>
          <Switch id="dark" checked={theme === "dark"} onCheckedChange={toggle} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <Label htmlFor="reminders">Task reminders</Label>
            <p className="text-xs text-muted-foreground">Show due-task badges in the header</p>
          </div>
          <Switch id="reminders" checked={reminders} onCheckedChange={setReminders} />
        </div>
      </section>

      <section className="surface-card space-y-4 p-5">
        <SectionTitle>Your data</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Drafts, summaries, plans and tasks are stored in this browser only.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Clear all workspace data</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all workspace data?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes every saved email draft, meeting summary, plan and task from
                this browser. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  clearAll();
                  toast.success("Workspace cleared");
                }}
              >
                Yes, clear everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <ResponsibleAiNotice />
    </div>
  );
}
