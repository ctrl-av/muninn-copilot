import type { Env } from "./index";

export class MuninnSession {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "GET" && path.endsWith("/state")) {
      const memory = (await this.state.storage.get("memory")) || {
        projectName: "Unnamed Project",
        goals: [],
        tasks: [],
        notes: [],
        history: [],
      };
      return Response.json(memory);
    }

    if (request.method === "POST" && path.endsWith("/update")) {
      const patch = await request.json();
      await this.state.storage.put("memory", patch);
      return new Response("ok");
    }

    return new Response("Not found", { status: 404 });
  }
}
