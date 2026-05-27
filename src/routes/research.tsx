import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { runAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput } from "@/components/AIOutput";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — AI Workplace" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runAI);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const research = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic or question.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { task: "research", prompt: topic } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Research failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Get a structured briefing on any topic — TL;DR, insights, and next steps."
      />
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-[var(--shadow-soft)]">
        <div className="space-y-1.5">
          <Label>Topic or question</Label>
          <Textarea
            rows={6}
            placeholder="e.g. Compare the main approaches to retrieval-augmented generation for enterprise search."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={2000}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Disclaimer />
          <Button onClick={research} disabled={loading}>
            {loading ? "Researching…" : "Generate Briefing"}
          </Button>
        </div>
      </div>
      <AIOutput content={output} loading={loading} />
    </div>
  );
}