import type { CanvasNode, CanvasLink } from "@/types/canvas";

interface CanvasLinksProps {
  links: CanvasLink[];
  nodeMap: Record<string, CanvasNode>;
}

export function CanvasLinks({ links, nodeMap }: CanvasLinksProps) {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      style={{ width: 1, height: 1 }}
    >
      {links.map((link) => {
        const from = nodeMap[link.from];
        const to = nodeMap[link.to];
        if (!from || !to) return null;

        return (
          <line
            key={link.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#cbd5e1"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
