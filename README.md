# Aura AI

Prompt:

Create a modern, professional, responsive AI Productivity Platform that combines three powerful tools into one unified application:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner & Scheduler

The application should have a clean, premium, professional UI suitable for students, professionals, businesses, and organizations. The design should be intuitive, accessible, mobile-friendly, and optimized for desktop, tablet, and smartphone screens.

1. Dashboard Layout

Create a central dashboard with:

A professional top navigation/header.

Welcome message such as “Good morning! What would you like to accomplish today?”

Quick-action cards for:

Generate Email

Summarize Meeting

Create Tasks

Schedule Tasks

Overview statistics:

Emails Generated

Meetings Summarized

Tasks Pending

Tasks Completed

Upcoming tasks and meetings.

Recent AI activity.

Productivity overview.

Notifications and reminders.

A prominent AI assistant/action button.

Use cards, clean spacing, subtle shadows, rounded corners, clear typography, and a modern professional visual hierarchy.

2. Sidebar Navigation

Create a collapsible responsive sidebar containing:

Dashboard

Smart Email Generator

Meeting Notes

AI Task Planner

Calendar / Schedule

My Tasks

AI Assistant

History

Favorites

Settings

Help & Support

On mobile devices, convert the sidebar into a hamburger menu or bottom navigation.

3. Smart Email Generator

Create an email-generation workspace with two clearly separated sections:

Input Section

Recipient/context field

Email purpose

Tone selector:

Professional

Friendly

Formal

Casual

Persuasive

Apologetic

Desired length

Key points/instructions

Optional subject field

“Generate Email” button

AI Output Section
Display the AI-generated email in a professional editable text area.

Include actions:

Copy

Edit

Regenerate

Make Shorter

Make More Professional

Change Tone

Generate Subject

Save

Export

The AI should generate clear, grammatically correct, professional responses based only on the information supplied by the user.

4. Meeting Notes Summarizer

Create a meeting-notes input area where users can paste or upload meeting transcripts/notes.

Provide:

Meeting title

Date and time

Participants

Meeting notes/transcript input

“Summarize Meeting” button

The AI output should organize information into:

Executive Summary

Key Discussion Points

Important Decisions

Action Items

Assigned Responsibilities

Deadlines

Questions / Follow-ups

Next Meeting Suggestions

Allow users to copy, edit, download, save, and regenerate the summary.

Clearly distinguish AI-generated content from information directly supplied by the user.

5. AI Task Planner & Scheduler

Create an intelligent task-planning workspace.

Input Section
Allow users to enter:

Task description

Goal

Priority

Deadline

Estimated duration

Preferred working hours

Recurring task option

Dependencies

Additional instructions

Add a “Create AI Plan” button.

AI Output Section

The AI should transform the user's goals into an organized action plan containing:

Task title

Description

Priority

Suggested deadline

Estimated duration

Subtasks

Dependencies

Recommended order

Calendar schedule

Reminders

Provide views for:

Today

This Week

Calendar

List

Kanban

Allow users to drag and drop tasks, edit schedules, mark tasks complete, postpone tasks, and manually override AI recommendations.

6. Unified AI Assistant

Integrate all three tools so they work together.

For example:

Meeting Notes → Tasks → Calendar → Email

After summarizing a meeting, the AI should be able to identify action items, convert them into tasks, suggest deadlines, place them on the user's schedule, and optionally generate follow-up emails.

Create a unified “AI Assistant” that can understand the user's current workflow and help move information between the Email Generator, Meeting Summarizer, Task Planner, and Calendar.

7. AI Generated Responses

Every AI-generated response should:

Be clearly labeled “AI Generated”.

Be editable before use.

Include Copy, Edit, Regenerate, and Save actions.

Avoid presenting assumptions as facts.

Clearly identify uncertainty when information is incomplete.

Never automatically send emails or permanently modify schedules without user confirmation.

8. Professional UI Design

Use a premium SaaS-style interface with:

Clean typography

Modern cards

Consistent spacing

Professional icons

Clear buttons

Accessible contrast

Subtle animations

Loading indicators while AI is processing

Empty states

Error states

Success notifications

Confirmation dialogs

Search functionality

Dark mode and light mode

Keep the interface uncluttered and make the primary actions immediately visible.

9. Responsive Design

The entire application must be fully responsive.

Desktop:

Persistent sidebar

Multi-column dashboard

Large input/output workspace

Tablet:

Collapsible sidebar

Adaptive card layouts

Optimized spacing

Mobile:

Hamburger navigation

Single-column layouts

Touch-friendly buttons

Stacked input/output sections

Mobile-friendly calendar and task views

Sticky primary action buttons where appropriate

10. Responsible AI Disclaimer

Include a visible but non-intrusive disclaimer throughout the application:

“Responsible AI Notice: AI-generated content may contain errors, omissions, or inaccurate information. Review and verify AI-generated emails, meeting summaries, tasks, schedules, and recommendations before relying on or sharing them. AI suggestions do not replace human judgment.”

For sensitive information, display an additional reminder:

“Do not enter confidential, sensitive, or personal information unless you are authorized to do so and the platform is approved for that information.”

11. Overall User Experience

The complete application should feel like a single integrated productivity system rather than three separate tools.

Create smooth navigation between:

Dashboard → Email → Meeting Notes → Tasks → Calendar → AI Assistant

Use consistent components, styling, terminology, and interaction patterns across the entire platform.

The final product should look like a polished, production-ready AI SaaS application with a professional dashboard, intuitive navigation, responsive design, editable AI outputs, strong user controls, and responsible AI messaging.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ai-flow-studio-89.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/01509de5-75c5-49d0-afaa-096242b31ea2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
