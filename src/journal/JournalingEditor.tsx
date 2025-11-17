import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Dot, Loader2, Sparkles } from "lucide-react";

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

type GenerationStatus = "idle" | "pending" | "success" | "error";

type PlatformOption = {
  id: "linkedin" | "twitter" | "instagram";
  label: string;
  summary: string;
  tone: string;
};

const platformOptions: PlatformOption[] = [
  {
    id: "linkedin",
    label: "LinkedIn spotlight",
    summary: "Polished recap for long-form, thoughtful feeds.",
    tone: "Professional warmth",
  },
  {
    id: "twitter",
    label: "X thread",
    summary: "Rapid-fire takeaways for scroll-stopping snippets.",
    tone: "Punchy + direct",
  },
  {
    id: "instagram",
    label: "Instagram caption",
    summary: "Digestible story beats to pair with visuals.",
    tone: "Conversational + bright",
  },
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

type JournalingEditorProps = {
  variant?: "default" | "canvas";
  className?: string;
};

export function JournalingEditor({ variant = "default", className }: JournalingEditorProps) {
  const isCanvasVariant = variant === "canvas";
  const [entry, setEntry] = useState("");
  const [status, setStatus] = useState<JournalingStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const saveHandle = useRef<number | null>(null);
  const generationHandle = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [targetPlatformId, setTargetPlatformId] = useState<PlatformOption["id"]>(platformOptions[0].id);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>("idle");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lastQueuedAt, setLastQueuedAt] = useState<Date | null>(null);
  const [lastQueuedPlatformId, setLastQueuedPlatformId] = useState<PlatformOption["id"] | null>(null);

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
      if (generationHandle.current) {
        window.clearTimeout(generationHandle.current);
      }
    };
  }, []);

  const selectedPlatform = useMemo(
    () => platformOptions.find((option) => option.id === targetPlatformId) ?? platformOptions[0],
    [targetPlatformId],
  );

  const lastQueuedPlatform = useMemo(
    () => (lastQueuedPlatformId ? platformOptions.find((option) => option.id === lastQueuedPlatformId) ?? null : null),
    [lastQueuedPlatformId],
  );

  useEffect(() => {
    if (generationStatus !== "success") {
      return;
    }

    const timeout = window.setTimeout(() => setGenerationStatus("idle"), 3200);

    return () => window.clearTimeout(timeout);
  }, [generationStatus]);

  useEffect(() => {
    if (entry.trim() && generationStatus === "error") {
      setGenerationStatus("idle");
      setGenerationError(null);
    }
  }, [entry, generationStatus]);

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

  const handleGenerationSubmit = useCallback(() => {
    if (generationStatus === "pending") {
      return;
    }

    if (!entry.trim()) {
      setGenerationStatus("error");
      setGenerationError("Add a few lines to your journal before generating a draft.");
      return;
    }

    setGenerationStatus("pending");
    setGenerationError(null);

    if (generationHandle.current) {
      window.clearTimeout(generationHandle.current);
    }

    generationHandle.current = window.setTimeout(() => {
      setGenerationStatus("success");
      setLastQueuedAt(new Date());
      setLastQueuedPlatformId(selectedPlatform.id);
      generationHandle.current = null;
    }, 1200);
  }, [entry, generationStatus, selectedPlatform.id]);

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

  const generationStatusLabel = useMemo(() => {
    if (generationStatus === "pending") {
      return "Sending to AI…";
    }

    if (generationStatus === "error") {
      return "Entry required";
    }

    if (generationStatus === "success" && lastQueuedAt && lastQueuedPlatform) {
      return `Queued ${formatRelativeTime(lastQueuedAt)}`;
    }

    return "Ready to draft";
  }, [generationStatus, lastQueuedAt, lastQueuedPlatform]);

  const generationHint = useMemo(() => {
    if (generationStatus === "error" && generationError) {
      return generationError;
    }

    if (generationStatus === "pending") {
      return `Blending your entry for ${selectedPlatform.label}…`;
    }

    if (lastQueuedAt && lastQueuedPlatform) {
      return `Queued ${lastQueuedPlatform.label} ${formatRelativeTime(lastQueuedAt)}.`;
    }

    if (entry.trim()) {
      return `Will use ${wordCount} words from today when you queue a ${selectedPlatform.label} draft.`;
    }

    return "Start writing above to enable AI drafts.";
  }, [entry, generationError, generationStatus, lastQueuedAt, lastQueuedPlatform, selectedPlatform.label, wordCount]);

  const handleTextareaKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleGenerationSubmit();
      }
    },
    [handleGenerationSubmit],
  );

  const canSubmitGeneration = entry.trim().length > 0 && generationStatus !== "pending";

  return (
    <Card
      className={cn(
        "flex w-full flex-col border-border/80 bg-white/90 shadow-xl shadow-slate-200/70",
        isCanvasVariant
          ? "h-full max-w-none rounded-[2.5rem] border-slate-200/60 bg-gradient-to-b from-white/95 via-slate-50/95 to-white"
          : "max-w-3xl rounded-3xl",
        className,
      )}
    >
      <CardHeader
        className={cn(
          "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
          isCanvasVariant ? "px-6 pb-4 pt-6 lg:px-8" : undefined,
        )}
      >
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

      <CardContent
        className={cn("space-y-4", isCanvasVariant ? "px-6 pb-6 pt-0 lg:px-8" : undefined)}
      >
        <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white p-4 shadow-inner shadow-white/60 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Sparkles className="h-4 w-4 text-primary" />
                AI generation
              </div>
              <p className="text-base font-semibold text-slate-900">Select a platform and queue a draft.</p>
              <p className="text-sm text-slate-600">We pair your entry + voice profile before sending it to the worker.</p>
            </div>

            <Badge
              variant="outline"
              className="rounded-full border-dashed border-slate-300 bg-white/80 px-4 py-2 text-[13px] font-medium text-slate-600"
            >
              {generationStatusLabel}
            </Badge>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {platformOptions.map((option) => {
              const isActive = option.id === selectedPlatform.id;
              return (
                <Button
                  key={option.id}
                  type="button"
                  variant="outline"
                  aria-pressed={isActive}
                  onClick={() => setTargetPlatformId(option.id)}
                  className={cn(
                    "h-auto w-full flex-col items-start gap-1.5 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left shadow-sm transition-all",
                    isActive
                      ? "border-primary/60 bg-primary/5 text-slate-900 shadow-primary/20"
                      : "text-slate-600 hover:border-primary/40 hover:text-slate-900",
                  )}
                >
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.summary}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {option.tone}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              className="w-full rounded-2xl px-6 py-3 text-base font-semibold sm:w-auto"
              onClick={handleGenerationSubmit}
              disabled={!canSubmitGeneration}
            >
              {generationStatus === "pending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending draft…
                </>
              ) : (
                <>Generate for {selectedPlatform.label}</>
              )}
            </Button>

            <p
              className={cn(
                "text-sm",
                generationStatus === "error" ? "text-rose-500" : "text-slate-600",
              )}
            >
              {generationHint}
            </p>
          </div>
        </section>

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
          onKeyDown={handleTextareaKeyDown}
          spellCheck
          aria-label="Daily journal entry"
          className="min-h-[20rem] resize-y bg-white text-base leading-relaxed"
        />
      </CardContent>

      <CardFooter
        className={cn(
          "flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
          isCanvasVariant ? "px-6 pb-6 pt-0 lg:px-8" : undefined,
        )}
      >
        <span className="font-medium text-slate-700">{wordCount} words</span>
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Press <kbd className="rounded-md border bg-white px-1 py-0.5 text-[11px] font-semibold">⌘⏎</kbd>{" "}
          to queue AI generation
        </span>
      </CardFooter>
    </Card>
  );
}
