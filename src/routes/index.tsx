import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace" },
      { name: "description", content: "Your AI productivity dashboard." },
    ],
  }),
  component: Index,
});

const features = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft polished emails by tone and audience.", icon: Mail },
  { to: "/notes", title: "Meeting Notes Summarizer", desc: "Extract decisions, actions, and deadlines.", icon: FileText },
  { to: "/planner", title: "AI Task Planner", desc: "Prioritize and schedule your day.", icon: ListChecks },
  { to: "/research", title: "Research Assistant", desc: "Get briefings and insights on any topic.", icon: Search },
  { to: "/chat", title: "AI Chatbot", desc: "A flexible assistant for any work task.", icon: MessageSquare },
] as const;

function Index() {
  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-primary-foreground shadow-[var(--shadow-glow)]"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
          <Sparkles className="h-3.5 w-3.5" /> AI Workplace Productivity Assistant
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
          Automate the busywork. Focus on what matters.
        </h1>
        <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
          Draft emails, summarize meetings, plan your day, and research topics — all powered by AI, in one workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Start with Email <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Open AI Chat
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition"
              >
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-accent text-accent-foreground mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
                <div className="mt-4 text-xs text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-muted-foreground text-center">
        AI-generated content may require human review.
      </p>
    </div>
  );
}
