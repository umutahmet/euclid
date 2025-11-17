# Frontend TODO List

This document tracks planned frontend work with checkboxes for progress updates. Check an item when the task is shipped or move it to a follow-up if the scope changes.

## 1. MVP Frontend

- [x] Build the journaling editor shell (markdown + rich text toolbar, autosave indicators) via `JournalingEditor`.
- [ ] Hook basic generation controls (platform selector, submit flow) into the journal panel.
- [ ] Render the canvas overview (grid background, empty state, basic node placement).
- [ ] Implement node detail drawer with connections to journal drafts and AI outputs.
- [ ] Surface simple voice summary + tweak controls; wire edits to the preview state.

## 2. Canvas & Interaction Mechanics

- [ ] Add drag-and-drop + pan handlers for canvas navigation (mouse + touch).
- [ ] Layer mini-map + jump controls when the node graph exceeds viewport bounds.
- [ ] Introduce branching controls that let users fork a node into a new idea stream.
- [ ] Animate node transitions when content updates or canvas zoom changes.

## 3. Data & Integrations

- [ ] Build adaptive tone learning system that analyzes user writing patterns and usage to automatically match their voice.
- [ ] Implement Worker API client with fetch handlers for journaling, voice, and AI endpoints; include error boundaries and retry logic.
- [ ] Integrate Cloudflare D1 persistence for nodes and generations with optimistic UI updates and conflict resolution.
- [ ] Surface AutoRAG summaries and suggested prompts alongside the canvas.
- [ ] Add feature flag UI to opt in/out of voice retraining and AutoRAG indexing.

## 4. Polishing & Quality

- [ ] Define Tailwind theme tokens for spacing, colors, and typography shared across modules.
- [ ] Audit accessibility (focus states, labels) of newly built controls.
- [ ] Write focused Vitest suites for the journaling editor and canvas helpers.
- [ ] Document manual QA steps (browsers, workflows) in docs/PROJECT.md when features land.

## 5. Future Ideas / Stretch

- [ ] Integrate content publishing workflow (LinkedIn, threads, etc.) with status indicators.
- [ ] Explore collaborative canvas sessions and shared nodes with presence indicators.
- [ ] Add analytics dashboard (“weekly mind map”) to surface emerging themes.
