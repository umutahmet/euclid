# Project Euclid

Turns everyday journaling into structured, publishable content.

---

## 1. Core Objectives

- Capture daily journal entries.
- Generate multi-platform content (posts, threads, captions, scripts).
- Maintain and refine a personal voice model.
- Allow branching, remixing, and reorganising of ideas visually.
- Run everything on Cloudflare: Workers, AI bindings, AutoRAG, D1/KV storage.
- Infinite canvas for navigation, drag-drop, and connecting nodes.

---

## 2. Main Modules

### _1. Journaling Module_

- Simple editor (rich text + markdown).
- Automatic timestamping, tagging, and semantic indexing via AutoRAG.
- Ability to link entries to existing branches on the canvas.

### _2. Voice Learning Module_

- Collects samples: journals, past posts, optional uploads.
- Periodically refines a voice/tone embedding using Cloudflare Models.
- Surfaces a _voice summary_ the user can tweak (“less formal”, “more thoughtful”, etc.).

### _3. AI Generation Engine_

- Input: journal text, voice profile, target platform.
- Output: drafts for:
  – LinkedIn
  – Instagram captions
  – Twitter threads
  – Medium articles
  – YouTube/TikTok scripts (short form)
- Includes a “refine again” loop:

  1. User edits the output.
  2. AI learns the changes.
  3. New outputs get closer to the user’s tone.

### _4. Infinite Canvas_

- Core navigation mode.
- Nodes: journal entries, AI drafts, refined content, ideas, themes.
- Drag to move, tap to open, draw connections, branch off anywhere.
- Ability to “fork” a cluster into a new draft chain.
- Mini-map for panning if the canvas gets large.

### _5. Knowledge Store (AutoRAG)_

- Every entry is chunked + stored with metadata.
- Used for:
  – voice modelling
  – content suggestions
  – thematic clustering
  – “what should I write today?” prompts
- System learns over time what topics matter most.

---

## 3. User Flow

### _1. Daily Flow_

1. User writes a journal entry.
2. System indexes it + updates voice model.
3. Canvas displays it as a new node.
4. User selects “Generate for Platforms”.
5. Output nodes appear around the original.
6. User edits → system refines tone → updates future outputs.

### _2. Weekly Flow_

_AutoRAG surfaces a summary of themes:_

- Top ideas emerging
- Topics gaining momentum
- Untapped concepts
- Suggested content clusters
  User can tap any theme → generate long-form drafts.

---

## 4. Data & Storage (Cloudflare)

- **D1** → journals, user profiles, voice settings.
- **KV** → cached embeddings, quick-access drafts.
- **R2** → audio samples (optional for voice learning), backups.
- **Vectors / AutoRAG** → semantic search + theme detection.

---

## Worker API — Hono

- We use Hono to structure Cloudflare Worker routes; it provides a small, fast router and middleware primitives. The Worker exposes a minimal API at `/api/*` that returns JSON (keeps parity with the previous bare handler).
- `worker/index.ts` uses a Hono `app` and exports `fetch` — this keeps TypeScript compatibility with the Wrangler-generated `ExportedHandler<Env>` types.
- Example route: `app.get('/api/example', c => c.json({ name: 'Cloudflare' }))`.
- Adding new routes or middleware is as simple as `app.use(...)` and `app.get/post/put/delete(...)`.

See `worker/index.ts` for the current minimal example.

---

## 5. Key Features to Prioritise First (MVP)

1. Journaling editor
2. Basic generation for one platform (e.g., LinkedIn)
3. Canvas with simple nodes + drag
4. Voice model (basic version)
5. AutoRAG indexing
6. Re-generation loop with user edits

Keep the first version tight — just enough to prove the magic.

---

## 6. Later Extensions

- Multi-user collaboration.
- “Storyline mode” for long-form work.
- Audio journaling (speech-to-text).
- Publishing directly to platforms.
- Personal analytics (“your weekly mind map”).
