import { ShieldAlert, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function SensitiveNotice() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <p>
        Do not enter confidential, sensitive, or personal information unless you are authorized to
        do so and this platform is approved for that information.
      </p>
    </div>
  );
}

export function ResponsibleAiNotice({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`rounded-lg border border-border bg-muted/50 p-3 text-muted-foreground ${
        compact ? "text-[11px]" : "text-xs"
      }`}
    >
      <span className="font-semibold text-foreground">Responsible AI Notice:</span> AI-generated
      content may contain errors, omissions, or inaccurate information. Review and verify
      AI-generated emails, meeting summaries, tasks, schedules, and recommendations before relying
      on or sharing them. AI suggestions do not replace human judgment.
    </p>
  );
}

export function SectionTitle({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
      {icon ?? <Sparkles className="size-4" aria-hidden />}
      {children}
    </h2>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
      <div className="text-muted-foreground">{icon ?? <Sparkles className="size-6" />}</div>
      <p className="font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
