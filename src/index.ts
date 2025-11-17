/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { MuninnSession } from "./MuninnSession";

export interface Env {
  AI: Ai;
  MUNINN_PROJECTS: DurableObjectNamespace;
  ASSETS: Fetcher; //created automatically from "assets" in wrangler.jsonc
}


export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api")) {
      // This will serve public/index.html at "/"
      return env.ASSETS.fetch(request);
    }

    // Chat endpoint
    if (url.pathname === "/api/chat" && request.method === "POST") {
      const body = await request.json<any>();
      const projectId = body.projectId || "default";
      const message: string = body.message || "";

      // Get DO stub for this project
      const id = env.MUNINN_PROJECTS.idFromName(projectId);
      const stub = env.MUNINN_PROJECTS.get(id);

      // Load memory
      const stateResp = await stub.fetch("https://muninn.internal/state");
      const memory = await stateResp.json<any>();

      // Build LLM messages
      const messages = [
        {
          role: "system",
          content: `
            You are Muninn, Odin's companion raven gifted with memory.
            You help recall, refine, and design embedded systems and AI/AR architectures.
            You know about STM32, sensor fusion, RF telemetry, AR glasses, and game engines.
            Always respond in three sections:
            1) Brief analysis
            2) Suggested architecture / approach
            3) Concrete next tasks (bullet points)
          `,
        },
        {
          role: "system",
          content: `Current project memory: ${JSON.stringify({
            projectName: memory.projectName,
            goals: memory.goals,
            tasks: memory.tasks,
            notes: memory.notes,
          })}`,
        },
        { role: "user", content: message },
      ];

      // Call Llama 3.3 on Workers AI
      const aiResult: any = await env.AI.run(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        { messages }
      );

      const reply: string =
        aiResult.response || aiResult.output || JSON.stringify(aiResult);

      // Append to history
      const updatedMemory = {
        projectName: memory.projectName || "Muninn Project",
        goals: memory.goals || [],
        tasks: memory.tasks || [],
        notes: memory.notes || [],
        history: [
          ...(memory.history || []),
          { role: "user", content: message, ts: Date.now() },
          { role: "assistant", content: reply, ts: Date.now() },
        ],
      };

      await stub.fetch("https://muninn.internal/update", {
        method: "POST",
        body: JSON.stringify(updatedMemory),
      });

      return Response.json({ reply, memory: updatedMemory });
    }

    if (url.pathname === "/api/health") {
      return new Response("ok");
    }

    return new Response("Not found", { status: 404 });
  },
};

export { MuninnSession };

