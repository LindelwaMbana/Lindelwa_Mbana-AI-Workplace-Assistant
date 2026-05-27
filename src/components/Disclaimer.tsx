import { Info } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/60 border border-border rounded-lg px-3 py-2">
      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <span>AI-generated content may require human review.</span>
    </div>
  );
}