/**
 * Canvas Constants
 *
 * Visual styling and configuration constants for canvas nodes.
 */

import type { CanvasNodeType } from "@/types/canvas";

export const nodePalette: Record<CanvasNodeType, string> = {
  journal: "from-sky-50/90 to-white border-sky-200 text-sky-900",
  "ai-draft": "from-violet-50/90 to-white border-violet-200 text-violet-900",
  idea: "from-amber-50/90 to-white border-amber-200 text-amber-900",
};

export const nodeTypeLabels: Record<CanvasNodeType, string> = {
  journal: "Journal Entry",
  "ai-draft": "AI Draft",
  idea: "Branch Idea",
};

export const nodeTypeColors: Record<CanvasNodeType, string> = {
  journal: "bg-sky-100 text-sky-900 border-sky-200",
  "ai-draft": "bg-violet-100 text-violet-900 border-violet-200",
  idea: "bg-amber-100 text-amber-900 border-amber-200",
};
