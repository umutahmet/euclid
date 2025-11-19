import type { CanvasNode } from "@/types/canvas";

export const generateArtifacts = (sourceNode: CanvasNode): CanvasNode[] => {
  const baseId = Math.random().toString(36).substring(7);
  const offset = 300;

  return [
    {
      id: `linkedin-${baseId}`,
      type: "ai-draft",
      x: sourceNode.x + offset,
      y: sourceNode.y - 150,
      title: "LinkedIn Post",
      summary: `Here's a professional take on "${sourceNode.content?.substring(0, 20) ?? ""}..."`,
      status: "Draft",
    },
    {
      id: `twitter-${baseId}`,
      type: "ai-draft",
      x: sourceNode.x + offset,
      y: sourceNode.y + 50,
      title: "X Thread",
      summary: `1/ ${sourceNode.content?.substring(0, 30) ?? ""}...\n\n2/ Key insight here.`,
      status: "Draft",
    },
    {
      id: `instagram-${baseId}`,
      type: "ai-draft",
      x: sourceNode.x + offset,
      y: sourceNode.y + 250,
      title: "Instagram Caption",
      summary: `${sourceNode.content?.substring(0, 40) ?? ""}...\n\nLink in bio! ✨`,
      status: "Draft",
    },
  ];
};
