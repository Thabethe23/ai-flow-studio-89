const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callGateway(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new Error("AI is not configured for this app (missing API key).");
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    let message = `AI request failed (${res.status}).`;
    try {
      const body = (await res.json()) as { error?: { message?: string }; message?: string };
      message = body?.error?.message || body?.message || message;
    } catch {
      /* keep default message */
    }
    if (res.status === 429) message = "Too many requests right now. Please retry in a moment.";
    if (res.status === 402)
      message = message || "AI credits are exhausted. Please add credits to continue.";
    throw new Error(message);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

export const RESPONSIBLE_AI_RULES = `You are an assistant inside a professional productivity platform.
Rules:
- Use ONLY the information the user supplied. Never invent facts, names, numbers or dates.
- If information is missing, state the uncertainty briefly or use a clearly marked placeholder like [confirm date].
- Never claim an email was sent or a calendar was changed.
- Write clear, grammatically correct, professional prose.`;
