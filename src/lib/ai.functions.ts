import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGateway, RESPONSIBLE_AI_RULES } from "./ai.server";

const EmailInput = z.object({
  recipient: z.string().default(""),
  purpose: z.string().min(1),
  tone: z.string().default("Professional"),
  length: z.string().default("Medium"),
  keyPoints: z.string().default(""),
  subject: z.string().default(""),
  modifier: z.string().default(""),
  previous: z.string().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const revision = data.previous
      ? `\n\nPrevious draft to revise:\n${data.previous}\nRevision instruction: ${data.modifier || "improve clarity"}`
      : "";
    const text = await callGateway([
      { role: "system", content: RESPONSIBLE_AI_RULES },
      {
        role: "user",
        content: `Write an email.
Recipient / context: ${data.recipient || "not specified"}
Purpose: ${data.purpose}
Tone: ${data.tone}
Desired length: ${data.length}
Key points / instructions: ${data.keyPoints || "none provided"}
Subject line (optional): ${data.subject || "propose one"}
Return the email as plain text starting with "Subject: ...", then a blank line, then the body. No commentary.${revision}`,
      },
    ]);
    return { text };
  });

const MeetingInput = z.object({
  title: z.string().default(""),
  datetime: z.string().default(""),
  participants: z.string().default(""),
  notes: z.string().min(1),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callGateway([
      { role: "system", content: RESPONSIBLE_AI_RULES },
      {
        role: "user",
        content: `Summarize these meeting notes using markdown with these exact headings (omit nothing; write "Not stated in the notes." where information is missing):
## Executive Summary
## Key Discussion Points
## Important Decisions
## Action Items
## Assigned Responsibilities
## Deadlines
## Questions / Follow-ups
## Next Meeting Suggestions

Meeting title: ${data.title || "not specified"}
Date and time: ${data.datetime || "not specified"}
Participants: ${data.participants || "not specified"}

Notes / transcript:
${data.notes}`,
      },
    ]);
    return { text };
  });

const PlanInput = z.object({
  description: z.string().min(1),
  goal: z.string().default(""),
  priority: z.string().default("Medium"),
  deadline: z.string().default(""),
  duration: z.string().default(""),
  workingHours: z.string().default(""),
  recurring: z.string().default("None"),
  dependencies: z.string().default(""),
  instructions: z.string().default(""),
});

export const createPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callGateway([
      { role: "system", content: RESPONSIBLE_AI_RULES },
      {
        role: "user",
        content: `Turn this into an organised action plan in markdown with headings:
## Plan Overview
## Tasks
(for each task: title, description, priority, suggested deadline, estimated duration, subtasks, dependencies)
## Recommended Order
## Suggested Calendar Schedule
## Reminders

Task description: ${data.description}
Goal: ${data.goal || "not specified"}
Priority: ${data.priority}
Deadline: ${data.deadline || "not specified"}
Estimated duration: ${data.duration || "not specified"}
Preferred working hours: ${data.workingHours || "not specified"}
Recurring: ${data.recurring}
Dependencies: ${data.dependencies || "none"}
Additional instructions: ${data.instructions || "none"}

Then finish with a line "### Task List (JSON)" followed by a JSON array of objects {"title","priority","deadline","duration"} for the top-level tasks.`,
      },
    ]);
    return { text };
  });

const AssistantInput = z.object({
  question: z.string().min(1),
  context: z.string().default(""),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssistantInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callGateway([
      {
        role: "system",
        content: `${RESPONSIBLE_AI_RULES}
You help the user move information between the Email Generator, Meeting Summarizer, Task Planner and Calendar of this platform. Suggest concrete next steps; never claim to have performed an action yourself.`,
      },
      {
        role: "user",
        content: `Workspace context the user has saved:\n${data.context || "(empty workspace)"}\n\nUser: ${data.question}`,
      },
    ]);
    return { text };
  });

const ExtractInput = z.object({ summary: z.string().min(1) });

export const extractTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExtractInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callGateway([
      { role: "system", content: RESPONSIBLE_AI_RULES },
      {
        role: "user",
        content: `From the meeting summary below, extract the action items as a JSON array only (no prose, no code fences) of objects with keys "title", "owner", "priority" (High|Medium|Low), "deadline" (YYYY-MM-DD or empty). Only include items explicitly present.\n\n${data.summary}`,
      },
    ]);
    return { text };
  });
