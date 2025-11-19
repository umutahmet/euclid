import "./App.css";
import { Toolbar } from "./components/Toolbar";
import { CanvasOverview } from "./canvas/CanvasOverview";
import { useCanvasState } from "./canvas/hooks/useCanvasState";
import { Sidebar } from "./components/Sidebar";
import { generateArtifacts } from "./lib/generation";
import { useCallback } from "react";
import type { CanvasNode } from "./types/canvas";

function App() {
  const canvasState = useCanvasState();
  const { setNodes, setView } = canvasState;

  const handleCommit = useCallback((text: string) => {
    const entryId = Math.random().toString(36).substring(7);
    const entryNode: CanvasNode = {
      id: entryId,
      type: "journal",
      variant: "surface",
      x: -canvasState.view.x + 100,
      y: -canvasState.view.y + 100,
      title: "Journal Entry",
      summary: text.slice(0, 100),
      content: text,
      status: "Just now",
      surfaceWidthRem: 40,
    };

    const artifacts = generateArtifacts(entryNode);
    
    setNodes((prev) => [...prev, entryNode, ...artifacts]);
  }, [canvasState.view, setNodes]);

  return (
    <main className="flex h-screen w-screen flex-row overflow-hidden bg-white">
      <Sidebar onCommit={handleCommit} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Toolbar
          zoom={canvasState.view.zoom}
          setZoom={(zoom) =>
            setView((v) => ({ ...v, zoom }))
          }
        />
        <CanvasOverview canvasState={canvasState} />
      </div>
    </main>
  );
}

export default App;

