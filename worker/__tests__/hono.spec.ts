import { describe, it, expect } from "vitest";
import worker from "../index";

describe("Worker API", () => {
  it("returns Cloudflare JSON for /api/*", async () => {
    const req = new Request("https://example.com/api/test");
    const res = await worker.fetch(req, {} as unknown as Env);
    const body = (await res.json()) as { name: string };
    expect(body.name).toBe("Cloudflare");
  });
});
