import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks } from "lucide-react";
import { toast } from "sonner";
import { runAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput } from "@/components/AIOutput";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — AI Workplace" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(runAI);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [start, setStart] = useState("09:00");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = async () => {
    if (!tasks.trim()) {
      toast.error("List at least one task.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Available time: ${hours} hours starting at ${start}.\n\nTasks (one per line, optional notes):\n${tasks}`;
      const res = await run({ data: { task: "planner", prompt } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Get a prioritized, time-boxed schedule for your day."
      />
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-[var(--shadow-soft)]">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Start time</Label>
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Working hours</Label>
            <Input
              type="number"
              min={1}
              max={16}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Your tasks</Label>
          <Textarea
            rows={8}
            placeholder={"e.g.\nFinish Q3 report (urgent, ~2h)\nReview PRs\nCall vendor about renewal\nDeep work on roadmap"}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            maxLength={4000}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Disclaimer />
          <Button onClick={plan} disabled={loading}>
            {loading ? "Planning…" : "Build My Day"}
          </Button>
        </div>
      </div>
      <AIOutput content={output} loading={loading} />
    </div>
  );
}