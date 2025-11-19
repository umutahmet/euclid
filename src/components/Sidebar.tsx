import { useCallback, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCommit: (text: string) => void;
  className?: string;
}

export function Sidebar({ onCommit, className }: SidebarProps) {
  const [entry, setEntry] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        if (entry.trim()) {
          onCommit(entry);
          setEntry("");
        }
      }
    },
    [entry, onCommit]
  );

  const handleCommit = () => {
    if (entry.trim()) {
      onCommit(entry);
      setEntry("");
    }
  };

  return (
    <div className={cn("flex h-full w-80 flex-col border-r bg-white p-4", className)}>
      <div className="mb-6 space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Journal</h2>
        <p className="text-sm text-muted-foreground">
          Capture your thoughts. Press Shift+Enter to process.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Textarea
          ref={textareaRef}
          placeholder="What's on your mind?"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none border-slate-200 bg-slate-50/50 text-base leading-relaxed focus:bg-white"
        />
        
        <Button 
          onClick={handleCommit}
          disabled={!entry.trim()}
          className="w-full gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Process Entry
        </Button>
      </div>
    </div>
  );
}
