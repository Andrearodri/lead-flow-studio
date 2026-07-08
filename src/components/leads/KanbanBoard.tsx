import { useState } from "react";
import { toast } from "sonner";
import { leadService } from "@/services/leadService";
import { whatsappService } from "@/services/whatsappService";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { type Lead, type LeadStatus } from "./mock-data";
import { useFunnelColumns } from "@/hooks/useFunnelColumns";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCard } from "./LeadCard";
import { LeadDetailSheet } from "./LeadDetailSheet";

interface KanbanBoardProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  searchQuery?: string;
  onUpdateValue?: (id: string, value: number) => void;
}

export function KanbanBoard({ leads, setLeads, searchQuery = "", onUpdateValue }: KanbanBoardProps) {
  const columns = useFunnelColumns();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeLead = leads.find((l) => l.id === activeId) ?? null;
  const selectedLead = leads.find((l) => l.id === selectedId) ?? null;

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  async function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const overId = e.over?.id as LeadStatus | undefined;
    const activeLeadId = String(e.active.id);
    const movedLead = leads.find((l) => l.id === activeLeadId) ?? null;

    if (!overId || !movedLead) return;

    // Atualização otimista (UI)
    setLeads((prev) =>
      prev.map((l) => (l.id === activeLeadId ? { ...l, status: overId } : l)),
    );

    const targetCol = columns.find((c) => c.id === overId);
    const colTitle = targetCol?.title ?? overId;
    
    // --- LÓGICA DE AUTOMAÇÃO BACKGROUND ---
    const isProposta = colTitle.toLowerCase().includes("proposta") || colTitle.toLowerCase().includes("orçamento") || columns.findIndex(c => c.id === overId) === 2;

    // Dispara a automação apenas se mudou de coluna
    if (isProposta && movedLead.status !== overId) {
      const firstName = movedLead.nome.split(" ")[0];
      const autoMessage = `Olá, ${firstName}! Vi que seu atendimento avançou e estamos com sua proposta pronta. Um de nossos especialistas já vai falar com você!`;
      
      // Execução em background
      (async () => {
        try {
          const res = await whatsappService.sendWhatsAppMessage({
            phone: movedLead.telefone,
            message: autoMessage
          });
          if (res && (res as any).demo) {
            toast.success(`⚡ Simulação: Mensagem de proposta enviada para ${firstName}`);
          } else {
            toast.success(`⚡ Automação disparada: Proposta enviada para ${firstName}`);
          }
        } catch (error) {
          console.error("Erro na automação background:", error);
          toast.error("⚠️ Falha na automação: Verifique as credenciais da API.");
        }
      })();
    } else if (movedLead.status !== overId) {
      // Toast padrão manual para outras colunas
      const formattedMessage = `Olá ${movedLead.nome}, seu atendimento avançou para: ${colTitle}`;
      const cleanedNumber = movedLead.telefone.replace(/\D/g, "");
      const finalNumber = (!cleanedNumber.startsWith("55") && cleanedNumber.length >= 10) ? `55${cleanedNumber}` : cleanedNumber;
      const url = `https://api.whatsapp.com/send?phone=${finalNumber}&text=${encodeURIComponent(formattedMessage)}`;

      toast(`Lead movido para ${colTitle}`, {
        action: {
          label: "Avisar no WhatsApp",
          onClick: () => {
            window.open(url, "_blank", "noopener,noreferrer");
          },
        },
        dismissible: true,
        duration: 5000,
      });
    }

    // Persistir no back-end de forma isolada (não impede a execução do resto do código)
    try {
      await leadService.updateLeadStatus(activeLeadId, overId);
    } catch (err: any) {
      console.error("Falha ao atualizar status no banco:", err);
    }
  }

  function handleSelect(lead: Lead) {
    setSelectedId(lead.id);
    setSheetOpen(true);
  }

  async function handleMove(id: string, status: LeadStatus) {
    // Atualização otimista
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    
    // Persistir no back-end
    try {
      await leadService.updateLeadStatus(id, status);
    } catch (err: any) {
      console.error("Falha ao mover status via menu:", err);
    }
  }

  function handleUpdateTags(id: string, tagIds: string[]) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, tags: tagIds } : l)),
    );
  }

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.nome.toLowerCase().includes(query) ||
      lead.servico.toLowerCase().includes(query)
    );
  });

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="kanban-scroll flex gap-5 overflow-x-auto px-6 pb-8 pt-6 h-full">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            hint={col.hint}
            accent={col.accent}
            leads={filteredLeads.filter((l) => l.status === col.id)}
            onSelectLead={handleSelect}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeLead ? (
          <div className="w-[284px]">
            <LeadCard lead={activeLead} overlay />
          </div>
        ) : null}
      </DragOverlay>
      <LeadDetailSheet
        lead={selectedLead}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onMove={handleMove}
        onUpdateTags={handleUpdateTags}
        onUpdateValue={onUpdateValue}
      />
    </DndContext>
  );
}
