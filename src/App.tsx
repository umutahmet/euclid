import "./App.css";
import { Toolbar } from "./components/Toolbar";
import { CanvasOverview } from "./canvas/CanvasOverview";

function App() {
  return (
    <main className="app-shell">
      <Toolbar />
      <CanvasOverview />
    </main>
  );
}

export default App;
