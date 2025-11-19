import {
  Home,
  Hand,
  MousePointer2,
  Square,
  Circle,
  Type,
  Image,
  MessageSquare,
  Search,
  Users,
  Share2,
  Play,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  className?: string;
  zoom: number;
  setZoom: (zoom: number) => void;
  onNewNode?: () => void;
}

export function Toolbar({ className, zoom, setZoom, onNewNode }: ToolbarProps) {
  return (
    <header
      className={cn(
        "flex h-12 w-full items-center justify-between border-b border-border bg-background px-2",
        className
      )}
    >
      {/* Left section - Logo and file name */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Home className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1 px-2">
          <span className="text-sm font-medium">Euclid</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* Center section - Tools */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Move (V)"
        >
          <MousePointer2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Hand (H)"
        >
          <Hand className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Rectangle (R)"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Ellipse (O)"
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Text (T)"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Image (I)"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Comment (C)"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm mr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border-r border-slate-100 hover:bg-slate-50"
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))}
          >
            <Minus className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <span className="w-12 text-center text-xs font-medium text-slate-600">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border-l border-slate-100 hover:bg-slate-50"
            onClick={() => setZoom(Math.min(zoom + 0.1, 5))}
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 shadow-sm hover:bg-slate-50 mr-2"
          onClick={onNewNode}
        >
          <Plus className="h-3.5 w-3.5" />
          New node
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Users className="h-4 w-4" />
        </Button>
        <Button variant="default" size="sm" className="h-8 gap-1.5 px-3">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
        <Button variant="default" size="sm" className="h-8 gap-1.5 px-3">
          <Play className="h-3.5 w-3.5" />
          Present
        </Button>
      </div>
    </header>
  );
}
