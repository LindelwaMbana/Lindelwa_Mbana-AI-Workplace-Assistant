import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { runAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput } from "@/components/AIOutput";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — AI Workplace" }] }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(runAI);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (notes.trim().length < 30) {
      toast.error("Paste at least a few sentences of meeting notes.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { task: "summary", prompt: notes } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Turn raw notes or transcripts into structured summaries with decisions, actions, and deadlines."
      />
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-[var(--shadow-soft)]">
        <div className="space-y-1.5">
          <Label>Meeting notes or transcript</Label>
          <Textarea
            rows={12}
            placeholder="Paste your meeting notes, bullets, or full transcript here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={18000}
          />
          <div className="text-xs text-muted-foreground">{notes.length} / 18000</div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Disclaimer />
          <Button onClick={summarize} disabled={loading}>
            {loading ? "Summarizing…" : "Summarize"}
          </Button>
        </div>
      </div>
      <AIOutput content={output} loading={loading} />
    </div>
  );
}