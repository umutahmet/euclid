

interface CanvasGridProps {
  view: { x: number; y: number; zoom: number };
}

export function CanvasGrid({ view }: CanvasGridProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
        backgroundSize: `${20 * view.zoom}px ${20 * view.zoom}px`,
        backgroundPosition: `${view.x}px ${view.y}px`,
      }}
    />
  );
}
