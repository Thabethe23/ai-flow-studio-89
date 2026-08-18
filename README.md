# Aurora Work

A modern, professional AI productivity platform that combines three powerful tools into one unified workspace:

- **Smart Email Generator** — tone-controlled professional emails in seconds
- **Meeting Notes Summarizer** — transcripts into structured summaries with action items
- **AI Task Planner & Scheduler** — goals turned into ordered tasks, deadlines, and calendar views

Built with **TanStack Start**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

![Aurora Work](https://ai-flow-studio-89.lovable.app/opengraph-image)

## Live Demo

- **Published app:** [https://ai-flow-studio-89.lovable.app](https://ai-flow-studio-89.lovable.app)
- **Preview build:** [https://id-preview--01509de5-75c5-49d0-afaa-096242b31ea2.lovable.app](https://id-preview--01509de5-75c5-49d0-afaa-096242b31ea2.lovable.app)

## Features

### Unified Dashboard
A central hub with productivity stats, upcoming tasks, quick actions, and recent AI activity.

### Smart Email Generator
Draft emails with control over tone, purpose, length, and audience. Edit the AI output inline and save drafts to your workspace.

### Meeting Notes Summarizer
Paste raw meeting notes and get a structured summary with key decisions, action items, and owners. Convert action items directly into tasks.

### AI Task Planner
Describe a goal and receive a step-by-step plan with priorities, subtasks, and suggested deadlines. Send any plan straight to your task board.

### Calendar & Task Board
View tasks in a monthly calendar, list, kanban, or weekly schedule. Track status from *todo* → *doing* → *done*.

### AI Assistant
A unified chat assistant that understands your workspace context (tasks, emails, meetings, plans) and helps you move information between tools.

### Additional Pages
- **History** — timeline of all AI-generated content
- **Favorites** — starred emails, meetings, and plans
- **Settings** — theme toggle, data clearing, and workspace preferences
- **Help & Support** — FAQ and usage guidance

## Design & UX

- Clean, premium SaaS aesthetic with deep navy surfaces and teal + amber accents
- Fully responsive layout with a persistent desktop sidebar, mobile sheet navigation, and a bottom navigation bar on smartphones
- Light and dark mode support
- Semantic OKLCH color tokens and custom design utilities
- Accessible components built on Radix primitives

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start v1 |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| State | React Context + localStorage |
| AI | Lovable AI Gateway (Google Gemini 3.6 Flash) |

## Project Structure

```
src/
├── components/         # Shared UI components (shell, AI output, markdown, page, theme)
├── lib/                # AI gateway, workspace store, utilities
├── routes/             # TanStack Start file-based routes
│   ├── index.tsx       # Dashboard
│   ├── email.tsx       # Smart Email Generator
│   ├── meetings.tsx    # Meeting Notes Summarizer
│   ├── planner.tsx     # AI Task Planner
│   ├── calendar.tsx    # Calendar & Schedule
│   ├── tasks.tsx       # My Tasks
│   ├── assistant.tsx   # Unified AI Assistant
│   ├── history.tsx     # History
│   ├── favorites.tsx   # Favorites
│   ├── settings.tsx    # Settings
│   └── help.tsx        # Help & Support
├── styles.css          # Global theme tokens and design utilities
└── __root.tsx          # Root layout
```

## Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- `npm` or `bun`

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:8080](http://localhost:8080).

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## AI Configuration

AI features are powered by the Lovable AI Gateway. The server-side handler reads the project API key at runtime:

```bash
LOVABLE_API_KEY=<your-lovable-api-key>
```

No client-side API key is exposed.

## Responsible AI Notice

Aurora Work uses AI to assist with drafting, summarizing, and planning. AI-generated content should be reviewed before use in professional or legal contexts. The app clearly labels AI output, allows inline editing, and displays a **Responsible AI Notice** on every page.

## Deployment

This project is configured for deployment through Lovable. Connect the project to GitHub for automatic two-way sync, or deploy the production build to any platform that supports Vite + Node-compatible edge runtimes.

## Publishing to GitHub

To publish this project to a GitHub repository:

1. Open the project in the [Lovable editor](https://lovable.dev).
2. Click the **Plus (+) menu** in the chat input (bottom-left corner).
3. Choose **GitHub → Connect project**.
4. Authorize the Lovable GitHub App when prompted.
5. Select the GitHub account or organization where you want the repository.
6. Click **Create Repository** to push the project code to GitHub.

Once connected, every change made in Lovable will automatically push to GitHub, and changes pushed to GitHub will sync back into Lovable.

## License

This project is generated by Lovable and is provided as a starting point for your own application. Modify and use it according to your own license and requirements.

---

Built with ❤️ using [Lovable](https://lovable.dev).
