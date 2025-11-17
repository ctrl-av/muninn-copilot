# Muninn — Embedded Memory Copilot

Muninn is a stateful engineering assistant built using Cloudflare Workers, Workers AI, and Durable Objects. It provides persistent project memory and specialized reasoning for embedded systems, firmware development, sensor fusion, real-time control, and related engineering workflows.

The goal is to demonstrate a complete AI-powered application using Cloudflare’s platform: an LLM-powered backend, long-term storage via Durable Objects, and a minimal frontend delivered at the edge.

---

## Features

### Persistent Memory

Each project ID corresponds to its own Durable Object instance.
Muninn stores:

* goals
* tasks
* notes
* architecture ideas
* conversation history

This enables long-term continuity across sessions.

### Workers AI (Llama 3.3)

The assistant uses Cloudflare’s Llama 3.3 70B model.
Responses are structured in three sections:

1. Brief analysis
2. Suggested architecture / approach
3. Concrete next tasks

### Minimal Frontend

A simple HTML/JavaScript interface is served directly from Cloudflare’s static asset binding.
Messages are sent to `/api/chat` and rendered in the page.

### Edge-Native Architecture

* Worker handles routing and AI inference
* Durable Object maintains isolated state
* Static assets served from `/public`
* Everything deployed globally on Cloudflare’s network

---

## Example Interaction

**User**
“I want to build an STM32 flight controller.”

**Muninn**

```
### Brief Analysis
Building an STM32 flight controller involves real-time processing, sensor integration, and control algorithms. STM32 devices are commonly used for this because of their peripheral set and performance.

### Suggested Architecture / Approach
- Select a specific STM32 part (e.g., STM32F303 series).
- Use an IMU for attitude estimation.
- Implement a complementary filter or Kalman filter for sensor fusion.
- Use PID or cascaded controllers for stabilization.
- Add telemetry for tuning and logging.

### Concrete Next Tasks
- Create an STM32CubeMX project with I2C/SPI and timer interrupts.
- Bring up the IMU and stream sensor data over UART.
- Implement basic attitude estimation.
- Prototype initial control loops and test on a bench setup.
- Iterate on gains using logged telemetry.
```

---

## Development

Install dependencies:

```
npm install
```

Run locally:

```
npm run dev
```

Open in browser:

```
http://localhost:8787/
```

### Endpoints

* `/` — Frontend UI
* `/api/chat` — AI + stateful memory
* `/api/health` — Health check

---

## Deployment

Deploy to Cloudflare:

```
npm run deploy
```

---

## Project Structure

```
public/
  index.html          # UI
src/
  index.ts            # Worker entry point
  MuninnSession.ts    # Durable Object for memory
wrangler.jsonc        # Cloudflare configuration
package.json
```

---

## Purpose

This project satisfies Cloudflare’s AI application assignment requirements:

* Uses Workers AI (Llama 3.3)
* Includes workflow/coordination via Durable Objects
* Provides user input via a simple chat UI
* Maintains persistent memory/state per project

It is also aligned with my background in embedded systems, firmware, and AI-assisted development tools.

