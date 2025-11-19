import { Badge } from "@/components/ui/badge";

interface CanvasStatusBarProps {
  nodeCount: number;
  onResetView: () => void;
}

export function CanvasStatusBar({ nodeCount, onResetView }: CanvasStatusBarProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-500 shadow-sm backdrop-blur-sm pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <Badge
          variant="secondary"
          className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-200"
        >
          MAP
        </Badge>
        <span>{nodeCount} nodes</span>
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onResetView}
          className="hover:text-slate-900 transition-colors"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
