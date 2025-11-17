import {
  ArrowRight,
  Calendar,
  Edit3,
  ExternalLink,
  Link2,
  Sparkles,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CanvasNode, CanvasLink } from "@/types/canvas";
import { nodeTypeLabels, nodeTypeColors } from "@/lib/constants/canvas";
import {
  getIncomingConnections,
  getOutgoingConnections,
} from "@/lib/canvas-utils";

interface NodeDetailDrawerProps {
  node: CanvasNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectedNodes?: CanvasNode[];
  links?: CanvasLink[];
}

export function NodeDetailDrawer({
  node,
  open,
  onOpenChange,
  connectedNodes = [],
  links = [],
}: NodeDetailDrawerProps) {
  if (!node) return null;

  const incomingConnections = getIncomingConnections(node.id, links);
  const outgoingConnections = getOutgoingConnections(node.id, links);

  const sourceNodes = connectedNodes.filter((n) =>
    incomingConnections.some((link) => link.from === n.id)
  );
  const derivedNodes = connectedNodes.filter((n) =>
    outgoingConnections.some((link) => link.to === n.id)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-[540px]"
      >
        <SheetHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Badge
                className={cn(
                  "rounded-md px-2.5 py-0.5 text-xs font-medium",
                  nodeTypeColors[node.type]
                )}
              >
                {nodeTypeLabels[node.type]}
              </Badge>
              <SheetTitle className="text-2xl font-semibold leading-tight">
                {node.title}
              </SheetTitle>
              <SheetDescription className="text-base">
                {node.summary}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Status
            </div>
            <p className="text-sm text-foreground">{node.status}</p>
          </div>

          {/* Content Preview (for AI drafts and ideas) */}
          {node.type !== "journal" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {node.type === "ai-draft" ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      AI-Generated Content
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-3.5 w-3.5" />
                      Draft Content
                    </>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2">
                  <ExternalLink className="h-3 w-3" />
                  Edit
                </Button>
              </div>
              <Textarea
                readOnly
                value={`This is a preview of the ${
                  node.type === "ai-draft" ? "AI-generated" : "draft"
                } content for "${
                  node.title
                }".\n\nThe full content would be displayed here, showing the complete text that was generated or written for this node.\n\n${
                  node.summary
                }`}
                className="min-h-[200px] resize-none bg-muted/50 font-mono text-sm"
              />
            </div>
          )}

          {/* Source Connections */}
          {sourceNodes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                Source ({sourceNodes.length})
              </div>
              <div className="space-y-2">
                {sourceNodes.map((sourceNode) => (
                  <div
                    key={sourceNode.id}
                    className="flex items-start gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase tracking-wider"
                        >
                          {nodeTypeLabels[sourceNode.type]}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-tight">
                        {sourceNode.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sourceNode.summary}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Derived Outputs */}
          {derivedNodes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Derived Outputs ({derivedNodes.length})
              </div>
              <div className="space-y-2">
                {derivedNodes.map((derivedNode) => (
                  <div
                    key={derivedNode.id}
                    className="flex items-start gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                  >
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase tracking-wider"
                        >
                          {nodeTypeLabels[derivedNode.type]}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-tight">
                        {derivedNode.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {derivedNode.summary}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {derivedNode.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 border-t pt-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Actions
            </div>
            <div className="flex flex-wrap gap-2">
              {node.type === "journal" && (
                <>
                  <Button variant="default" size="sm" className="gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate AI Draft
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Edit3 className="h-3.5 w-3.5" />
                    Create Branch
                  </Button>
                </>
              )}
              {node.type === "ai-draft" && (
                <>
                  <Button variant="default" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Publish
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </>
              )}
              {node.type === "idea" && (
                <>
                  <Button variant="default" size="sm" className="gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate Draft
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Edit3 className="h-3.5 w-3.5" />
                    Refine Idea
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
