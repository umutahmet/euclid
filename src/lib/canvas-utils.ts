/**
 * Canvas Utilities
 *
 * Helper functions for working with canvas nodes and links.
 */

import type { CanvasNode, CanvasLink } from "@/types/canvas";

/**
 * Creates a map of node IDs to node objects for O(1) lookups
 */
export function createNodeMap(nodes: CanvasNode[]): Record<string, CanvasNode> {
  return nodes.reduce<Record<string, CanvasNode>>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});
}

/**
 * Get all nodes that link TO the specified node (sources/parents)
 */
export function getIncomingConnections(
  nodeId: string,
  links: CanvasLink[]
): CanvasLink[] {
  return links.filter((link) => link.to === nodeId);
}

/**
 * Get all nodes that the specified node links TO (derived/children)
 */
export function getOutgoingConnections(
  nodeId: string,
  links: CanvasLink[]
): CanvasLink[] {
  return links.filter((link) => link.from === nodeId);
}

/**
 * Get all source nodes (nodes that link to the specified node)
 */
export function getSourceNodes(
  nodeId: string,
  nodes: CanvasNode[],
  links: CanvasLink[]
): CanvasNode[] {
  const incomingConnections = getIncomingConnections(nodeId, links);
  return nodes.filter((node) =>
    incomingConnections.some((link) => link.from === node.id)
  );
}

/**
 * Get all derived nodes (nodes that the specified node links to)
 */
export function getDerivedNodes(
  nodeId: string,
  nodes: CanvasNode[],
  links: CanvasLink[]
): CanvasNode[] {
  const outgoingConnections = getOutgoingConnections(nodeId, links);
  return nodes.filter((node) =>
    outgoingConnections.some((link) => link.to === node.id)
  );
}
