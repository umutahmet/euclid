/**
 * Sample Canvas Data
 *
 * Mock data for development and testing of the canvas system.
 */

import type { CanvasNode, CanvasLink } from "@/types/canvas";

export const sampleNodes: CanvasNode[] = [
  {
    id: "node-journal",
    title: "Journal surface",
    summary: "Canvas-native writing + drafting",
    status: "Live",
    type: "journal",
    x: 35,
    y: 58,
    highlight: true,
    variant: "surface",
    surfaceWidthRem: 58,
  },
  {
    id: "node-linkedin",
    title: "LinkedIn draft",
    summary: "Highlights focus sprints + leadership notes.",
    status: "AI draft · Needs review",
    type: "ai-draft",
    x: 74,
    y: 24,
  },
  {
    id: "node-thread",
    title: "Thread branch",
    summary: "Break entry into 5-s part mini-insights.",
    status: "Manual tweaks in progress",
    type: "idea",
    x: 78,
    y: 66,
  },
  {
    id: "node-voice",
    title: "Voice summary",
    summary: "Warm + direct tone kit synced last night.",
    status: "Voice profile ready",
    type: "ai-draft",
    x: 20,
    y: 25,
  },
];

export const sampleLinks: CanvasLink[] = [
  { id: "link-journal-linkedin", from: "node-journal", to: "node-linkedin" },
  { id: "link-journal-thread", from: "node-journal", to: "node-thread" },
];
