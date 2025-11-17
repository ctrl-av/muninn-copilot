███╗   ███╗██╗   ██╗███╗   ██╗██╗███╗   ██╗███╗   ██╗
████╗ ████║██║   ██║████╗  ██║██║████╗  ██║████╗  ██║
██╔████╔██║██║   ██║██╔██╗ ██║██║██╔██╗ ██║██╔██╗ ██║
██║╚██╔╝██║██║   ██║██║╚██╗██║██║██║╚██╗██║██║╚██╗██║
██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║██║ ╚████║██║ ╚████║
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝
               M U N I N N
        Embedded Memory Copilot

Muninn — Embedded Memory Copilot

A Cloudflare Workers AI application with persistent memory using Durable Objects

Muninn is a stateful engineering copilot built on Cloudflare Workers AI, Durable Objects, and static assets served at the edge. The name comes from Muninn, one of Odin’s ravens associated with “memory.” The application acts as a long-term project assistant that remembers embedded systems, firmware, AR/AI pipelines, and hardware–software design work across sessions.

This project was built as part of the Cloudflare AI application assignment and demonstrates the following:

 - LLM inference using Workers AI

 - Durable Objects for persistent memory

 - Worker + DO coordination patterns

 - A simple, functional chat UI

 - A full edge-native architecture

Features
Persistent Memory with Durable Objects

Each project ID is backed by its own MuninnSession Durable Object.
Muninn stores:

 - Long-term notes

 - Goals

 - Tasks

 - Architectural decisions

 - Conversation history

This allows the assistant to remember individual engineering projects over time instead of treating every request as stateless.

Workers AI (Llama 3.3) for Reasoning

Muninn uses Workers AI with the following model:

@cf/meta/llama-3.3-70b-instruct-fp8-fast


The system prompt specializes the model toward embedded software, STM32 development, sensor fusion, real-time control systems, AR glasses pipelines, and game-engine style systems programming.

Frontend Served from Cloudflare

A minimal HTML/JS interface is served from /public using Cloudflare’s static asset binding.
The UI communicates directly with the Worker through /api/chat.

Architecture Overview
Static Frontend (Cloudflare Assets)
      │
      ▼
Cloudflare Worker (index.ts)
  - routes requests
  - handles AI calls
  - forwards memory ops to DO
      │
      ├───────────────────────────────┐
      │                               │
      ▼                               ▼
Durable Object (MuninnSession)      Workers AI
- persistent per-project state       - Llama 3.3 inference

Example Interaction

User Input
Project ID: flight-controller
Message: “I want to build an STM32 flight controller.”

Muninn Response

### Brief Analysis
Building an STM32 flight controller requires understanding embedded systems, control loops, and real-time sensor processing. STM32 devices are well-suited for this because of their peripheral set and performance. Important early decisions include selecting the MCU, choosing sensors, and deciding on the control architecture.

### Suggested Architecture / Approach
- Microcontroller: Select an STM32 part with sufficient performance (e.g., STM32F303 series).
- Sensors: Use an IMU (accelerometer + gyroscope), and optionally a magnetometer and barometer.
- Sensor Fusion: Implement a Kalman filter or complementary filter for attitude estimation.
- Control Algorithm: Use PID loops or a cascaded controller for stabilization.
- Telemetry: Add an RF or serial telemetry link for data logging and tuning.

### Concrete Next Tasks
- Select the exact STM32 variant based on available peripherals.
- Bring up an STM32CubeMX project with I2C/SPI and a periodic timer interrupt.
- Interface with the IMU and verify raw sensor outputs via UART.
- Implement a simple complementary filter to estimate roll/pitch angles.
- Build an initial PID loop targeting stable orientation on a test rig.
- Add data logging to evaluate filter accuracy and controller response.

Local Development

Install dependencies:

npm install


Start the development server:

npm run dev


This starts the Worker at:

http://localhost:8787/


The chat UI is served at /.
The AI endpoint is at /api/chat.

Deployment

Deploy to Cloudflare:

npm run deploy


Cloudflare will generate a Workers.dev URL for the live application.

Project Structure
muninn-copilot/
├── public/
│   └── index.html
├── src/
│   ├── index.ts
│   └── MuninnSession.ts
├── wrangler.jsonc
└── package.json

Core Technologies

Cloudflare Workers

Cloudflare Workers AI (Llama 3.3)

Durable Objects

Static asset binding

TypeScript

Purpose

The goal of this project was to build an AI-powered application that uses Cloudflare's full stack: Workers, Workers AI, Durable Objects, and real user interaction. Muninn is designed around workflows I use in embedded systems development—STM32 firmware, sensor interfacing, control systems, and AI/AR processing—which makes it both a technical demonstration and a tool directly relevant to the type of engineering work I do.
