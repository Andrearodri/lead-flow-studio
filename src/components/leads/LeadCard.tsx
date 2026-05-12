import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MoreHorizontal } from "lucide-react";
import { formatEspera, type Lead } from "./mock-data";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44Zm-8.48 18.2h-.01a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.82 9.82 0 0 1-1.51-5.18c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.89 6.97c0 5.43-4.42 9.83-9.8 9.83Zm5.4-7.37c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

const serviceTone: Record<string, string> = {
  Consultoria: "bg-info/10 text-info border-info/20",
  Orçamento: "bg-warning/15 text-warning-foreground border-warning/30",
  "Plano Premium": "bg-primary/10 text-primary border-primary/20",
  "Plano Anual": "bg-primary/10 text-primary border-primary/20",
  Demonstração: "bg-accent text-accent-foreground border-border",
  "Suporte Técnico": "bg-secondary text-secondary-foreground border-border",
  "Visita Técnica": "bg-info/10 text-info border-info/20",
  "Reunião Comercial": "bg-primary/10 text-primary border-primary/20",
};

export function LeadCard({
  lead,
  overlay = false,
  onSelect,
}: {
  lead: Lead;
  overlay?: boolean;
  onSelect?: (lead: Lead) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;
  const tone = serviceTone[lead.servico] ?? "bg-secondary text-secondary-foreground border-border";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !overlay && onSelect?.(lead)}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-3.5 cursor-grab active:cursor-grabbing animate-lead-in",
        "shadow-[0_1px_0_0_rgba(0,0,0,0.02)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] hover:border-primary/30",
        isDragging && !overlay && "opacity-40",
        overlay && "shadow-[0_20px_40px_-15px_rgba(15,23,42,0.35)] rotate-1",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/80 to-info/80 text-primary-foreground grid place-items-center text-[11px] font-semibold shrink-0">
            {lead.iniciais}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-tight truncate">{lead.nome}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <WhatsAppIcon className="h-3 w-3 text-whatsapp" />
              <span className="text-[11px] text-muted-foreground tabular-nums truncate">
                {lead.telefone}
              </span>
            </div>
          </div>
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-1 -m-1 rounded"
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Mais opções"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center text-[10.5px] font-medium px-2 py-0.5 rounded-full border",
            tone,
          )}
        >
          {lead.servico}
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatEspera(lead.esperaMin)}
        </span>
      </div>
    </div>
  );
}
