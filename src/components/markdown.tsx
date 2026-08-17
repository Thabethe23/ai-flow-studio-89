import { Fragment, type ReactNode } from "react";

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Minimal markdown renderer for AI output (headings, lists, paragraphs, bold). */
export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/```/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {list.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (/^#{1,3}\s/.test(line)) {
      flush();
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s*/, "");
      blocks.push(
        level >= 3 ? <h3 key={idx}>{inline(text)}</h3> : <h2 key={idx}>{inline(text)}</h2>,
      );
      return;
    }
    if (/^\s*([-*•]|\d+\.)\s+/.test(line)) {
      list.push(line.replace(/^\s*([-*•]|\d+\.)\s+/, ""));
      return;
    }
    if (!line.trim()) {
      flush();
      return;
    }
    flush();
    blocks.push(<p key={idx}>{inline(line)}</p>);
  });
  flush();

  return <div className="prose-ai text-sm text-foreground">{blocks}</div>;
}
