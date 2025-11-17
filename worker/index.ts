import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// Keep the simple API behavior the same but use Hono routing. This
// scales to additional routes and middleware easily.
app.get("/api/*", (c) => c.json({ name: "Cloudflare" }));

// Default 404 for everything else
app.get("*", () => new Response(null, { status: 404 }));

export default {
  fetch: (request: Request, env: Env) => app.fetch(request, env),
} satisfies ExportedHandler<Env>;
