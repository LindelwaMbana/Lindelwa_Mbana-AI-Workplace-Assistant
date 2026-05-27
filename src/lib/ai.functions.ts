import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type Task =
  | "email"
  | "summary"
  | "planner"
  | "research"
  | "chat";

const SYSTEMS: Record<Task, string> = {
  email:
    "You are a senior business communication expert. Draft a clear, professional email using the requested tone and audience. Output ONLY the email with a subject line on the first line as 'Subject: ...', a blank line, then the body. Keep it concise, well-structured, and ready to send. Avoid filler.",
  summary:
    "You are an expert meeting analyst. From the raw meeting notes/transcript, produce a structured summary in Markdown with EXACTLY these sections:\n## Summary\n(2-3 sentence overview)\n## Key Points\n- bullet points\n## Decisions\n- bullets (or 'None')\n## Action Items\n- [Owner] Action — Deadline (or 'TBD')\n## Risks & Open Questions\n- bullets (or 'None')\nBe specific. Do not invent details that are not in the input.",
  planner:
    "You are an AI productivity coach. Given the user's tasks and constraints, produce a prioritized daily/weekly plan in Markdown. Use the Eisenhower matrix mentally but output:\n## Priorities (Today)\n1. Task — why it matters — estimated minutes\n## Schedule\n- HH:MM–HH:MM — Task (focus/admin/break)\n## Deferred / Delegate\n- bullets\nBe realistic about time. Group similar work. Include short breaks.",
  research:
    "You are a meticulous research assistant. Produce a Markdown briefing:\n## TL;DR\n(3 bullets)\n## Key Insights\n- numbered insights with brief reasoning\n## Notable Considerations\n- bullets\n## Suggested Next Steps\n- bullets\nBe neutral, factual, and call out uncertainty when relevant. Do not fabricate sources or statistics.",
  chat:
    "You are a helpful, concise AI workplace assistant. Help the user with professional tasks: writing, summarizing, planning, analysis. Use Markdown. Be friendly but efficient.",
};

type Msg = { role: "system" | "user" | "assistant"; content: string };

export const runAI = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      task: z.enum(["email", "summary", "planner", "research", "chat"]),
      prompt: z.string().min(1).max(20000).optional(),
      messages: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().min(1).max(20000),
          }),
        )
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const system = SYSTEMS[data.task as Task];
    const messages: Msg[] = [{ role: "system", content: system }];
    if (data.messages && data.messages.length) {
      messages.push(...data.messages);
    } else if (data.prompt) {
      messages.push({ role: "user", content: data.prompt });
    } else {
      throw new Error("Provide prompt or messages");
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429)
        throw new Error("Rate limit reached. Please try again in a moment.");
      if (resp.status === 402)
        throw new Error("AI credits exhausted. Add credits in Workspace Settings.");
      const txt = await resp.text();
      console.error("AI gateway error", resp.status, txt);
      throw new Error("AI request failed");
    }

    const json = await resp.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    return { content };
  });