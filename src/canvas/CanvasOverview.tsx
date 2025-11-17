import { useMemo } from "react";
import { LinkIcon, Workflow, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JournalingEditor } from "@/journal/JournalingEditor";

type CanvasNodeType = "journal" | "ai-draft" | "idea";

type CanvasNode = {
  id: string;
  title: string;
  summary: string;
  status: string;
  type: CanvasNodeType;
  x: number;
  y: number;
  highlight?: boolean;
  variant?: "surface" | "default";
  surfaceWidthRem?: number;
};

type CanvasLink = {
  id: string;
  from: CanvasNode["id"];
  to: CanvasNode["id"];
};

const nodePalette: Record<CanvasNodeType, string> = {
  journal: "from-sky-50/90 to-white border-sky-200 text-sky-900",
  "ai-draft": "from-violet-50/90 to-white border-violet-200 text-violet-900",
  idea: "from-amber-50/90 to-white border-amber-200 text-amber-900",
};

const sampleNodes: CanvasNode[] = [
  {
    id: "node-journal",
    title: "Journal surface",
    summary: "Canvas-native writing + drafting",
    status: "Live",
    type: "journal",
    x: 35,
    y: 58,
    highlight: true,
    variant: "surface",
    surfaceWidthRem: 58,
  },
  {
    id: "node-linkedin",
    title: "LinkedIn draft",
    summary: "Highlights focus sprints + leadership notes.",
    status: "AI draft · Needs review",
    type: "ai-draft",
    x: 74,
    y: 24,
  },
  {
    id: "node-thread",
    title: "Thread branch",
    summary: "Break entry into 5-s part mini-insights.",
    status: "Manual tweaks in progress",
    type: "idea",
    x: 78,
    y: 66,
  },
  {
    id: "node-voice",
    title: "Voice summary",
    summary: "Warm + direct tone kit synced last night.",
    status: "Voice profile ready",
    type: "ai-draft",
    x: 20,
    y: 25,
  },
];

const sampleLinks: CanvasLink[] = [
  { id: "link-journal-linkedin", from: "node-journal", to: "node-linkedin" },
  { id: "link-journal-thread", from: "node-journal", to: "node-thread" },
];

export function CanvasOverview() {
  const nodes = sampleNodes;
  const hasNodes = nodes.length > 0;

  const nodeMap = useMemo(() => {
    return nodes.reduce<Record<string, CanvasNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, [nodes]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#f5f8ff] via-white to-[#f3f1ff]">
      {/* Canvas controls floating top-right */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-lg border-slate-200/80 bg-white/90 px-3 shadow-sm backdrop-blur-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          New node
        </Button>
      </div>

      {/* Main canvas area */}
      <div className="relative h-full w-full overflow-hidden">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.15) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Gradient overlays */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-20 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />

        {/* Canvas content */}
        <div className="relative z-10 h-full w-full px-6 py-8 lg:px-10 lg:py-12">
          {hasNodes ? (
            <div className="relative h-full w-full">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {sampleLinks.map((link) => {
                  const from = nodeMap[link.from];
                  const to = nodeMap[link.to];
                  if (!from || !to) {
                    return null;
                  }

                  return (
                    <line
                      key={link.id}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="rgba(79,70,229,0.35)"
                      strokeWidth={0.6}
                      strokeLinecap="round"
                      strokeDasharray="6 6"
                    />
                  );
                })}
              </svg>

              {nodes.map((node) => {
                if (node.variant === "surface") {
                  return (
                    <div
                      key={node.id}
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        width: `min(${node.surfaceWidthRem ?? 48}rem, 92vw)`,
                      }}
                      className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_35px_70px_rgba(15,23,42,0.25)]"
                    >
                      <JournalingEditor
                        variant="canvas"
                        className="border-white/60"
                      />
                    </div>
                  );
                }

                return (
                  <article
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={cn(
                      "absolute w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-gradient-to-b p-5 text-left shadow-xl shadow-slate-500/30 ring-1 ring-white/50 backdrop-blur-sm transition-all",
                      nodePalette[node.type],
                      node.highlight &&
                        "ring-4 ring-primary/30 ring-offset-2 ring-offset-white"
                    )}
                  >
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-400/90">
                      <Workflow className="h-3.5 w-3.5" />
                      {node.type === "journal" && "Journal"}
                      {node.type === "ai-draft" && "AI draft"}
                      {node.type === "idea" && "Branch"}
                    </div>
                    <p className="mt-2 text-base font-semibold leading-tight text-slate-900">
                      {node.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {node.summary}
                    </p>
                    <p className="mt-4 text-xs font-medium text-slate-500">
                      {node.status}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <LinkIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-slate-900">
                  No nodes yet
                </p>
                <p className="text-base text-slate-600">
                  Add your first journal entry to seed the canvas and unlock AI
                  ideas.
                </p>
              </div>
              <Button className="rounded-full px-8 py-3 text-base">
                Start mapping
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex h-10 items-center justify-between border-t border-border bg-background px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className="rounded-md bg-slate-100/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-700"
          >
            Canvas
          </Badge>
          <span>Idea map</span>
        </div>
        <div>
          The overview refreshes whenever journaling entries are saved or new
          drafts are generated.
        </div>
        <div className="flex items-center gap-2">
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
