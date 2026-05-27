import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { runAI } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AIOutput } from "@/components/AIOutput";
import { Disclaimer } from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — AI Workplace" }] }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Persuasive", "Apologetic", "Concise", "Enthusiastic"];
const AUDIENCES = ["Client", "Manager", "Teammate", "Executive", "Vendor", "Job recruiter"];

function EmailPage() {
  const run = useServerFn(runAI);
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Client");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!context.trim()) {
      toast.error("Add some context about what the email should say.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Tone: ${tone}\nAudience: ${audience}\nSubject hint: ${subject || "(infer one)"}\n\nContext / key points:\n${context}`;
      const res = await run({ data: { task: "email", prompt } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Generate ready-to-send emails tuned to your tone and audience."
      />

      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-[var(--shadow-soft)]">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Subject hint (optional)</Label>
          <Input
            placeholder="e.g. Project kickoff next week"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
          />
        </div>
        <div className="space-y-1.5">
          <Label>What should the email say?</Label>
          <Textarea
            rows={6}
            placeholder="Key points, context, what action you want the reader to take…"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            maxLength={4000}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Disclaimer />
          <Button onClick={generate} disabled={loading}>
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </div>
      </div>

      <AIOutput content={output} loading={loading} />
    </div>
  );
}