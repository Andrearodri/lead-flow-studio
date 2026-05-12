import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { LeadCard } from "./LeadCard";
import type { Lead, LeadStatus } from "./mock-data";
import { cn } from "@/lib/utils";

interface Props {
  id: LeadStatus;
  title: string;
  hint: string;
  accent: string;
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
}

export function KanbanColumn({ id, title, hint, accent, leads, onSelectLead }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-[300px] shrink-0">
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("h-2 w-2 rounded-full", accent)} />
          <h2 className="text-[13px] font-semibold tracking-tight truncate">{title}</h2>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {leads.length}
          </span>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground p-1 -m-1 rounded transition-colors"
          aria-label="Adicionar lead"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <p className="px-1 text-[11px] text-muted-foreground mb-3 -mt-2">{hint}</p>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-2xl p-2.5 space-y-2.5 transition-colors min-h-[200px]",
          "bg-secondary/40 border border-transparent",
          isOver && "bg-primary/5 border-primary/30 border-dashed",
        )}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <div className="text-center text-[11px] text-muted-foreground py-8">
            Solte um lead aqui
          </div>
        )}
      </div>
    </div>
  );
}
