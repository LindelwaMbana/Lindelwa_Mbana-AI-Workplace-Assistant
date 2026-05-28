# AI Workplace — Productivity Assistant

> **Live App:** [https://rapid-work-pal.lovable.app](https://rapid-work-pal.lovable.app)  
> AI-generated content may require human review.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
7. [Feature Walkthroughs](#feature-walkthroughs)
8. [Prompt Engineering Approach](#prompt-engineering-approach)
9. [Design System](#design-system)
10. [Environment Variables](#environment-variables)
11. [Supabase Configuration](#supabase-configuration)
12. [Deployment](#deployment)
13. [Disclaimer](#disclaimer)

---

## Project Overview

**AI Workplace** is a modern SaaS productivity suite that brings together five AI-powered tools in a single, clean workspace. It helps professionals automate repetitive knowledge work — drafting emails, summarizing meetings, planning tasks, researching topics, and chatting with an AI assistant — all in one responsive interface.

Built with **TanStack Start**, **TypeScript**, **Vite**, and **Supabase**, and developed using the [Lovable](https://lovable.dev) AI-powered platform.

---

## Features

| Feature | Description | Route |
|---|---|---|
| **Smart Email Generator** | Draft polished emails by tone and audience | `/email` |
| **Meeting Notes Summarizer** | Extract key points, action items, and deadlines | `/notes` |
| **AI Task Planner** | Prioritize and schedule your day with AI | `/planner` |
| **Research Assistant** | Get AI briefings and insights on any topic | `/research` |
| **AI Chatbot** | A flexible assistant for any work task | `/chat` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (React, TypeScript) |
| Build Tool | Vite |
| Package Manager | Bun |
| Backend / Database | Supabase |
| Styling | Tailwind CSS + shadcn/ui (`components.json`) |
| Linting | ESLint |
| Formatting | Prettier |
| Platform | Lovable (AI-powered full-stack builder) |
| Template | `tanstack_start_ts_2026-05-25` |

---

## Project Structure

```
.
├── src/                   # Application source code
│   ├── routes/            # TanStack Start file-based routes
│   │   ├── index.tsx      # Dashboard (/)
│   │   ├── email.tsx      # Smart Email Generator (/email)
│   │   ├── notes.tsx      # Meeting Notes Summarizer (/notes)
│   │   ├── planner.tsx    # AI Task Planner (/planner)
│   │   ├── research.tsx   # Research Assistant (/research)
│   │   └── chat.tsx       # AI Chatbot (/chat)
│   ├── components/        # Reusable UI components
│   └── lib/               # Utilities and helpers
├── supabase/              # Supabase config, migrations, functions
├── .env                   # Environment variables (never commit)
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint rules
├── .prettierrc            # Prettier formatting rules
├── bunfig.toml            # Bun configuration
└── components.json        # shadcn/ui component config
```

---

## Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- **Bun** v1.0+ — [Install Bun](https://bun.sh)
- **Node.js** v18+ (used by some tooling)
- **Git**
- A **Supabase** account — [supabase.com](https://supabase.com)

---

## Step-by-Step Setup Guide

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### Step 2 — Install Dependencies

This project uses Bun as its package manager.

```bash
bun install
```

### Step 3 — Configure Environment Variables

Create a `.env` file in the root of the project (or edit the existing one). Add your Supabase credentials and any AI API keys:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Provider (add whichever you use, e.g. OpenAI / Anthropic)
VITE_OPENAI_API_KEY=your-openai-key
# or
VITE_ANTHROPIC_API_KEY=your-anthropic-key
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Step 4 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **Anon Key** from **Project Settings → API**.
3. Paste them into your `.env` file (see Step 3).
4. Apply any database migrations found in the `supabase/` folder:

```bash
# If you have the Supabase CLI installed:
supabase db push
```

Or run migrations manually from the Supabase SQL editor using the files in `supabase/`.

### Step 5 — Start the Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:3000` (or the port shown in your terminal).

### Step 6 — Explore the App

Open your browser and navigate to:

| Page | URL |
|---|---|
| Dashboard | `http://localhost:3000/` |
| Email Generator | `http://localhost:3000/email` |
| Meeting Notes | `http://localhost:3000/notes` |
| Task Planner | `http://localhost:3000/planner` |
| Research Assistant | `http://localhost:3000/research` |
| AI Chatbot | `http://localhost:3000/chat` |

### Step 7 — Build for Production

```bash
bun run build
```

Output will be placed in the `dist/` folder.

### Step 8 — Preview Production Build (Optional)

```bash
bun run preview
```

---

## Feature Walkthroughs

### Smart Email Generator (`/email`)

1. Select the **tone** (e.g. formal, friendly, assertive).
2. Choose your **target audience** (e.g. client, colleague, executive).
3. Enter a brief description of what you want to say.
4. Click **Generate** — the AI drafts a polished email based on your inputs.
5. Copy or edit the result as needed.

### Meeting Notes Summarizer (`/notes`)

1. Paste raw meeting notes or a transcript into the input field.
2. Click **Summarize**.
3. The AI returns structured output: **key points**, **action items**, and **deadlines**.
4. Review and export the summary.

### AI Task Planner (`/planner`)

1. Enter a list of tasks or describe your day.
2. Click **Plan My Day**.
3. The AI prioritizes and suggests a schedule based on urgency and importance.
4. Adjust and confirm your plan.

### Research Assistant (`/research`)

1. Enter a topic or question you want to research.
2. Click **Research**.
3. The AI returns a concise briefing with key insights and a summary.
4. Use the output as a starting point for deeper work.

### AI Chatbot (`/chat`)

1. Type any work-related question or task in the chat input.
2. Press **Send**.
3. The AI responds conversationally and can help with writing, planning, summarizing, and more.
4. The conversation history is maintained within the session.

---

## Prompt Engineering Approach

Each feature uses structured, purpose-built prompts:

- **Email Generator** — prompts specify tone, audience, and intent to ensure professional, audience-appropriate output.
- **Meeting Summarizer** — prompts instruct the model to extract only decisions, action items, and owners — no filler.
- **Task Planner** — prompts use prioritization frameworks (urgency vs. importance) and ask for time estimates.
- **Research Assistant** — prompts request structured briefings: background, key points, and a concise summary.
- **Chatbot** — uses a persistent system prompt defining the assistant as a professional workplace helper.

All prompts include instructions to produce clear, actionable, professionally formatted output.

---

## Design System

- **Layout:** Sidebar navigation + card-based content layout
- **Style:** Modern SaaS UI — clean, minimal, professional
- **Components:** Built with [shadcn/ui](https://ui.shadcn.com) on top of Tailwind CSS
- **Responsive:** Fully responsive across desktop, tablet, and mobile
- **Loading States:** All AI calls show loading indicators while waiting for responses
- **Disclaimer:** Displayed site-wide — *"AI-generated content may require human review"*

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key (if using OpenAI) | Conditional |
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key (if using Claude) | Conditional |

---

## Supabase Configuration

The `supabase/` directory contains:

- **Migrations** — database schema changes
- **Edge Functions** (if any) — serverless functions for AI calls or data processing
- **Config** — project-level Supabase settings

To reset and re-seed the database locally:

```bash
supabase db reset
```

---

## Deployment

This project is deployed on **Lovable** and is accessible at:

**[https://rapid-work-pal.lovable.app](https://rapid-work-pal.lovable.app)**

To deploy your own version:

1. Push your code to a GitHub repository.
2. Connect the repo to [Lovable](https://lovable.dev) or your preferred hosting platform (Vercel, Netlify, etc.).
3. Set all required environment variables in your hosting platform's dashboard.
4. Deploy.

For Vercel:

```bash
vercel deploy
```

For Netlify, connect your GitHub repo and set environment variables in the Netlify dashboard.

---

## Disclaimer

> ⚠️ **AI-generated content may require human review.**  
> Outputs from this application are generated by AI models and may contain errors, omissions, or inaccuracies. Always review AI-generated emails, summaries, plans, and research before using them in a professional context.

---

## License

This project was built using the [Lovable](https://lovable.dev) platform. Refer to your project's license terms for usage rights.
