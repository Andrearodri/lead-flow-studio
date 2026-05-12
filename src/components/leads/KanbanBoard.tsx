import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { COLUMNS, INITIAL_LEADS, type Lead, type LeadStatus } from "./mock-data";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCard } from "./LeadCard";

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const overId = e.over?.id as LeadStatus | undefined;
    if (!overId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === String(e.active.id) ? { ...l, status: overId } : l)),
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="kanban-scroll flex gap-5 overflow-x-auto px-6 pb-8 pt-6 h-full">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            hint={col.hint}
            accent={col.accent}
            leads={leads.filter((l) => l.status === col.id)}
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
    </DndContext>
  );
}
