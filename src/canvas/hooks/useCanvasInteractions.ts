import { useState, useRef, useCallback } from "react";
import type { CanvasNode } from "@/types/canvas";

interface ViewState {
  x: number;
  y: number;
  zoom: number;
}

interface UseCanvasInteractionsProps {
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
  nodes: CanvasNode[];
  setNodes: React.Dispatch<React.SetStateAction<CanvasNode[]>>;
  setSelectedNode: (node: CanvasNode | null) => void;
  setDrawerOpen: (open: boolean) => void;
}

export function useCanvasInteractions({
  view,
  setView,
  setNodes,
  setSelectedNode,
  setDrawerOpen,
}: UseCanvasInteractionsProps) {
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newZoom = Math.min(Math.max(view.zoom + delta, 0.1), 5);

      setView((v) => ({ ...v, zoom: newZoom }));
    } else {
      setView((v) => ({
        ...v,
        x: v.x - e.deltaX,
        y: v.y - e.deltaY,
      }));
    }
  }, [view.zoom, setView]);

  const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;

    if (nodeId) {
      e.stopPropagation();
      setDraggedNodeId(nodeId);
    } else {
      setIsDraggingCanvas(true);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingCanvas && !draggedNodeId) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (!isDraggingRef.current) {
      const dist = Math.hypot(
        e.clientX - dragStartPos.current.x,
        e.clientY - dragStartPos.current.y
      );
      if (dist > 5) isDraggingRef.current = true;
    }

    if (isDraggingCanvas) {
      setView((v) => ({ ...v, x: v.x + deltaX, y: v.y + deltaY }));
    } else if (draggedNodeId) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggedNodeId
            ? { ...n, x: n.x + deltaX / view.zoom, y: n.y + deltaY / view.zoom }
            : n
        )
      );
    }
  }, [isDraggingCanvas, draggedNodeId, view.zoom, setView, setNodes]);

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggedNodeId(null);
  };

  const handleNodeClick = (e: React.MouseEvent, node: CanvasNode) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;

    setSelectedNode(node);
    setDrawerOpen(true);
  };

  return {
    isDraggingCanvas,
    draggedNodeId,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleNodeClick,
    isDraggingRef,
  };
}
