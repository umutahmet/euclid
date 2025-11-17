import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Dot, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type JournalingStatus = "saved" | "saving" | "idle";

type WrapFormattingOption = {
  id: string;
  label: string;
  type: "wrap";
  token: string;
  placeholder: string;
};

type PrefixFormattingOption = {
  id: string;
  label: string;
  type: "prefix";
  prefix: string;
  placeholder: string;
};

type FormattingOption = WrapFormattingOption | PrefixFormattingOption;

const formattingOptions: FormattingOption[] = [
  { id: "bold", label: "Bold", type: "wrap", token: "**", placeholder: "bold thought" },
  { id: "italic", label: "Italic", type: "wrap", token: "_", placeholder: "emphasized idea" },
  { id: "code", label: "Code", type: "wrap", token: "`", placeholder: "snippet" },
  { id: "quote", label: "Quote", type: "prefix", prefix: "> ", placeholder: "Insight worth quoting" },
  { id: "bullet", label: "List", type: "prefix", prefix: "- ", placeholder: "List item" },
];

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const formatRelativeTime = (timestamp: Date) => {
  const now = Date.now();
  const diffMs = timestamp.getTime() - now;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (Math.abs(diffMs) < minute) {
    return relativeTime.format(Math.round(diffMs / 1000), "second");
  }

  if (Math.abs(diffMs) < hour) {
    return relativeTime.format(Math.round(diffMs / minute), "minute");
  }

  if (Math.abs(diffMs) < day) {
    return relativeTime.format(Math.round(diffMs / hour), "hour");
  }

  return relativeTime.format(Math.round(diffMs / day), "day");
};

const countWords = (value: string) => {
  if (!value.trim()) {
    return 0;
  }

  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
};

export function JournalingEditor() {
  const [entry, setEntry] = useState("");
  const [status, setStatus] = useState<JournalingStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveHandle = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queueSave = useCallback(() => {
    if (saveHandle.current) {
      window.clearTimeout(saveHandle.current);
    }

    setStatus("saving");

    saveHandle.current = window.setTimeout(() => {
      setStatus("saved");
      setLastSavedAt(new Date());
      saveHandle.current = null;
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (saveHandle.current) {
        window.clearTimeout(saveHandle.current);
      }
    };
  }, []);

  const applyFormatting = (option: FormattingOption) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.focus();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selected = value.slice(start, end);
    const placeholder = selected || option.placeholder;
    let addition = "";
    let selectionStart = start;
    let selectionEnd = end;

    if (option.type === "wrap") {
      addition = `${option.token}${placeholder}${option.token}`;
      selectionStart = start + option.token.length;
      selectionEnd = selectionStart + placeholder.length;
    } else {
      const prependNewline = start > 0 && value[start - 1] !== "\n";
      const newline = prependNewline ? "\n" : "";
      addition = `${newline}${option.prefix}${placeholder}`;
      selectionStart = start + newline.length + option.prefix.length;
      selectionEnd = selectionStart + placeholder.length;
    }

    const nextValue = `${value.slice(0, start)}${addition}${value.slice(end)}`;

    setEntry(nextValue);
    queueSave();

    requestAnimationFrame(() => {
      if (!textareaRef.current) {
        return;
      }

      const node = textareaRef.current;
      node.selectionStart = selectionStart;
      node.selectionEnd = selectionEnd;
    });
  };

  const insertTimestamp = () => {
    setEntry((previous) => {
      const stamp = new Date().toLocaleString();
      const prefix = previous.trim().length ? "\n\n" : "";
      return `${previous}${prefix}> ${stamp}\n`;
    });
    queueSave();
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry(event.target.value);
    queueSave();
  };

  const wordCount = useMemo(() => countWords(entry), [entry]);

  const statusLabel = useMemo(() => {
    if (status === "saving") {
      return "Saving draft…";
    }

    if (lastSavedAt) {
      return `Saved ${formatRelativeTime(lastSavedAt)}`;
    }

    return "Ready to write";
  }, [lastSavedAt, status]);

  const statusIcon = useMemo(() => {
    if (status === "saving") {
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />;
    }

    if (status === "saved" && lastSavedAt) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }

    return <Dot className="h-5 w-5 text-muted-foreground" />;
  }, [lastSavedAt, status]);

  return (
    <Card className="w-full max-w-3xl border-border/80 bg-white/90 shadow-xl shadow-slate-200/70">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="uppercase tracking-wide text-xs text-slate-700">
            Journal
          </Badge>
          <div>
            <CardTitle>Daily entry</CardTitle>
            <CardDescription>
              Capture what happened today and flag ideas worth expanding for future drafts.
            </CardDescription>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-2 rounded-full border-muted bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground",
          )}
        >
          {statusIcon}
          {statusLabel}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-dashed border-muted bg-muted p-3">
          {formattingOptions.map((option) => (
            <Button
              key={option.id}
              type="button"
              size="sm"
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-sm text-slate-700 shadow-sm hover:bg-slate-50"
              onClick={() => applyFormatting(option)}
            >
              {option.label}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="rounded-xl bg-transparent text-sm font-medium text-primary hover:bg-primary/10"
            onClick={insertTimestamp}
          >
            Insert timestamp
          </Button>
        </div>

        <Textarea
          ref={textareaRef}
          placeholder="Start journaling…"
          value={entry}
          onChange={handleChange}
          spellCheck
          aria-label="Daily journal entry"
          className="min-h-[20rem] resize-y bg-white text-base leading-relaxed"
        />
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium text-slate-700">{wordCount} words</span>
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Press <kbd className="rounded-md border bg-white px-1 py-0.5 text-[11px] font-semibold">⌘⏎</kbd>{" "}
          to queue AI generation
        </span>
      </CardFooter>
    </Card>
  );
}
