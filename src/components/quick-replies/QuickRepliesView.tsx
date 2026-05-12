import { Pencil, Trash2, MessageSquareQuote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INITIAL_REPLIES, categoryTone } from "./mock-data";

export function QuickRepliesView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Mensagens Rápidas e Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as respostas prontas para sua equipe utilizar no atendimento.
          </p>
        </div>
        <Button className="gap-1.5 shadow-sm shrink-0">
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <div className="px-6 pb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {INITIAL_REPLIES.map((r) => (
          <article
            key={r.id}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-border/80"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                  categoryTone[r.categoria],
                )}
              >
                {r.categoria}
              </span>
              <MessageSquareQuote className="h-4 w-4 text-muted-foreground/60" />
            </div>

            <h3 className="text-[15px] font-semibold tracking-tight leading-tight">{r.titulo}</h3>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {r.texto}
            </p>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
