import "./App.css";
import { Toolbar } from "./components/Toolbar";
import { CanvasOverview } from "./canvas/CanvasOverview";
import { useCanvasState } from "./canvas/hooks/useCanvasState";

function App() {
  const canvasState = useCanvasState();

  return (
    <main className="app-shell">
      <Toolbar
        zoom={canvasState.view.zoom}
        setZoom={(zoom) =>
          canvasState.setView((v) => ({ ...v, zoom }))
        }
      />
      <CanvasOverview canvasState={canvasState} />
    </main>
  );
}

export default App;
