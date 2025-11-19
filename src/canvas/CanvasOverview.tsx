import { useEffect, useRef } from "react";
import { LinkIcon } from "lucide-react";

import { NodeDetailDrawer } from "./NodeDetailDrawer";
import { sampleLinks } from "@/lib/data/canvas-mock";

import { useCanvasState } from "./hooks/useCanvasState";
import { useCanvasInteractions } from "./hooks/useCanvasInteractions";
import { CanvasGrid } from "./components/CanvasGrid";
import { CanvasStatusBar } from "./components/CanvasStatusBar";
import { CanvasNodeItem } from "./components/CanvasNodeItem";
import { CanvasLinks } from "./components/CanvasLinks";

interface CanvasOverviewProps {
  canvasState: ReturnType<typeof useCanvasState>;
}

export function CanvasOverview({ canvasState }: CanvasOverviewProps) {
  const {
    nodes,
    setNodes,
    view,
    setView,
    selectedNode,
    setSelectedNode,
    drawerOpen,
    setDrawerOpen,
    nodeMap,
  } = canvasState;

  // Interactions
  const {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNodeClick,
  } = useCanvasInteractions({
    view,
    setView,
    nodes,
    setNodes,
    setSelectedNode,
    setDrawerOpen,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const hasNodes = nodes.length > 0;

  // Center view on mount
  useEffect(() => {
    if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setView({ x: width / 2 - 1000, y: height / 2 - 1000, zoom: 1 });
    }
  }, [setView]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-50/50">
      {/* Main canvas area */}
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <CanvasGrid view={view} />

        {/* Canvas content container with transform */}
        <div
            className="absolute left-0 top-0 origin-top-left will-change-transform"
            style={{
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            }}
        >
          {hasNodes ? (
            <>
              <CanvasLinks links={sampleLinks} nodeMap={nodeMap} />

              {nodes.map((node) => (
                <CanvasNodeItem
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onMouseDown={handleMouseDown}
                  onClick={handleNodeClick}
                />
              ))}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center pt-40">
              <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                <LinkIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-900">
                  Canvas is empty
                </p>
                <p className="text-sm text-slate-500">
                  Start by creating a new node
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CanvasStatusBar
        nodeCount={nodes.length}
        onResetView={() => setView({ x: 0, y: 0, zoom: 1 })}
      />

      <NodeDetailDrawer
        node={selectedNode}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        connectedNodes={nodes}
        links={sampleLinks}
      />
    </div>
  );
}

