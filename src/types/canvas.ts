/**
 * Canvas Node Types
 *
 * Core type definitions for the canvas system including nodes and links.
 */

export type CanvasNodeType = "journal" | "ai-draft" | "idea";

export type CanvasNode = {
  id: string;
  title: string;
  summary: string;
  status: string;
  type: CanvasNodeType;
  x: number;
  y: number;
  highlight?: boolean;
  variant?: "surface" | "default";
  surfaceWidthRem?: number;
  content?: string;
};

export type CanvasLink = {
  id: string;
  from: CanvasNode["id"];
  to: CanvasNode["id"];
};
