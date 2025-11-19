import { useState, useMemo } from "react";
import type { CanvasNode } from "@/types/canvas";
import { sampleNodes } from "@/lib/data/canvas-mock";

const INITIAL_SCALE_FACTOR = 20;
const INITIAL_OFFSET_X = 0;
const INITIAL_OFFSET_Y = 0;

export function useCanvasState() {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);

  const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const nodeMap = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, CanvasNode>);
  }, [nodes]);

  return {
    nodes,
    setNodes,
    view,
    setView,
    selectedNode,
    setSelectedNode,
    drawerOpen,
    setDrawerOpen,
    nodeMap,
  };
}
