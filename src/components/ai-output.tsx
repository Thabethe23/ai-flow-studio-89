import { Check, Copy, Download, Pencil, RefreshCw, Save, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/markdown";

export function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ai-muted px-2.5 py-1 text-[11px] font-semibold text-ai">
      <Sparkles className="size-3" aria-hidden />
      AI Generated
    </span>
  );
}

export function AiLoading({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/40 p-10 text-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">This usually takes a few seconds.</p>
    </div>
  );
}

export function AiOutput({
  value,
  onChange,
  onRegenerate,
  onSave,
  filename,
  extraActions,
  children,
}: {
  value: string;
  onChange: (next: string) => void;
  onRegenerate?: () => void;
  onSave?: () => void;
  filename: string;
  extraActions?: ReactNode;
  children?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy — please select the text manually.");
    }
  };

  const exportFile = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-ai-muted/40 px-4 py-3">
        <AiBadge />
        <p className="text-[11px] text-muted-foreground">Editable before use — verify before sending</p>
      </div>

      <div className="max-h-[32rem] overflow-y-auto p-4">
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-80 font-mono text-xs leading-relaxed"
            aria-label="Edit AI generated content"
          />
        ) : (
          <Markdown content={value} />
        )}
      </div>

      {children ? <div className="border-t border-border p-4">{children}</div> : null}

      <div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 p-3">
        <Button variant="secondary" size="sm" onClick={copy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          Copy
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setEditing((e) => !e)}>
          <Pencil className="size-4" />
          {editing ? "Preview" : "Edit"}
        </Button>
        {onRegenerate ? (
          <Button variant="secondary" size="sm" onClick={onRegenerate}>
            <RefreshCw className="size-4" />
            Regenerate
          </Button>
        ) : null}
        {onSave ? (
          <Button variant="secondary" size="sm" onClick={onSave}>
            <Save className="size-4" />
            Save
          </Button>
        ) : null}
        <Button variant="secondary" size="sm" onClick={exportFile}>
          <Download className="size-4" />
          Export
        </Button>
        {extraActions}
      </div>
    </div>
  );
}
