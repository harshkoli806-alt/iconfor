import { buildPrompt, sanitizeSvg } from "../../../lib/generator";

export const runtime = "nodejs";

// Works with any OpenAI-compatible provider. Set two env vars:
//   GEN_BASE_URL   e.g. https://api.deepseek.com/v1
//   GEN_API_KEY    your key
//   GEN_MODEL      e.g. deepseek-chat   (optional, defaults below)
const BASE = process.env.GEN_BASE_URL || "https://api.deepseek.com/v1";
const KEY = process.env.GEN_API_KEY;
const MODEL = process.env.GEN_MODEL || "deepseek-chat";

// Crude per-IP throttle. Resets when the serverless instance recycles,
// which is fine as a first line of defence against casual abuse.
const hits = new Map();
const WINDOW = 60_000;
const LIMIT = 6;

function throttled(ip) {
  const now = Date.now();
  const log = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  if (log.length >= LIMIT) return true;
  log.push(now);
  hits.set(ip, log);
  return false;
}

export async function POST(req) {
  if (!KEY) {
    return Response.json(
      { error: "Generation isn't configured yet. Add GEN_API_KEY to your environment." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (throttled(ip)) {
    return Response.json({ error: "Slow down a moment — try again in a minute." }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const description = String(body.description || "").trim().slice(0, 200);
  if (description.length < 3) {
    return Response.json({ error: "Describe the icon you want first." }, { status: 400 });
  }

  const prompt = buildPrompt({
    description,
    style: String(body.style || "flat"),
    palette: String(body.palette || "ink"),
  });

  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1400,
        temperature: 0.6,
        messages: [
          { role: "system", content: "You output raw SVG markup only. Never use markdown fences or prose." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "The generator is busy. Try again in a moment." }, { status: 502 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const svg = sanitizeSvg(text);

    if (!svg) {
      return Response.json(
        { error: "That one came back unusable. Try simpler wording or a different style." },
        { status: 422 }
      );
    }

    return Response.json({ svg });
  } catch {
    return Response.json({ error: "Couldn't reach the generator. Try again." }, { status: 502 });
  }
}
