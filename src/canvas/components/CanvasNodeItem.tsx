import { Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalingEditor } from "@/journal/JournalingEditor";
import type { CanvasNode } from "@/types/canvas";

interface CanvasNodeItemProps {
  node: CanvasNode;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onClick: (e: React.MouseEvent, node: CanvasNode) => void;
}

export function CanvasNodeItem({ node, isSelected, onMouseDown, onClick }: CanvasNodeItemProps) {
  if (node.variant === "surface") {
    return (
      <div
        style={{
          transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`,
          width: `min(${node.surfaceWidthRem ?? 48}rem, 92vw)`,
        }}
        className="absolute cursor-default"
        onMouseDown={(e) => onMouseDown(e, node.id)}
      >
        <div className="rounded-xl border border-slate-200 bg-white">
          <JournalingEditor variant="canvas" className="border-none" initialContent={node.content} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`,
      }}
      className="absolute"
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      <article
        className={cn(
          "w-[16rem] cursor-pointer rounded-xl border bg-white p-4 text-left transition-colors",
          node.highlight ? "border-indigo-200 bg-indigo-50/30" : "border-slate-200 hover:border-slate-300",
          isSelected && "ring-2 ring-indigo-500/20 border-indigo-400"
        )}
        onClick={(e) => onClick(e, node)}
      >
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
          <Workflow className="h-3 w-3" />
          {node.type === "journal" && "Journal"}
          {node.type === "ai-draft" && "AI Draft"}
          {node.type === "idea" && "Branch"}
        </div>
        <p className="mt-2 text-sm font-medium leading-snug text-slate-900">
          {node.title}
        </p>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {node.summary}
        </p>
        {node.status && (
          <div className="mt-3 flex items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                node.status.includes("Live") ? "bg-emerald-400" : "bg-amber-400"
              )}
            />
            <span className="text-[10px] text-slate-400">{node.status}</span>
          </div>
        )}
      </article>
    </div>
  );
}
