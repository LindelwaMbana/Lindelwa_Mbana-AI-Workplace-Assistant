import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Send, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { runAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — AI Workplace" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const run = useServerFn(runAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await run({ data: { task: "chat", messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-9rem)]">
      <PageHeader
        icon={MessageSquare}
        title="AI Chatbot"
        description="A flexible workplace assistant. Ask anything — drafting, analysis, brainstorming."
      />

      <div className="flex-1 rounded-xl border border-border bg-card p-4 overflow-y-auto space-y-4 shadow-[var(--shadow-soft)]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground text-sm">
            <Sparkles className="h-8 w-8 mb-2 text-primary" />
            Start a conversation — try "Help me write a project update for stakeholders."
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-primary-foreground shrink-0"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3 text-sm flex gap-1">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
        <div className="flex gap-2 items-end">
          <Textarea
            rows={2}
            placeholder="Ask anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            maxLength={4000}
            className="resize-none border-0 focus-visible:ring-0 shadow-none"
          />
          <Button onClick={send} disabled={loading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}