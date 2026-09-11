/**
 * funnelService — Estado central reativo para as etapas do funil (colunas do Kanban).
 *
 * Mesma arquitetura pub/sub do tagService. Componentes se inscrevem
 * via useFunnelColumns() e re-renderizam ao adicionar/editar/excluir etapas.
 */

export interface FunnelColumn {
  id: string;
  title: string;
  hint: string;
  accent: string;
  order: number;
}

/* ── Palette for new columns ── */
const ACCENT_PALETTE = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-teal-500",
];

/* ── Default columns (matching original COLUMNS) ── */
const DEFAULT_COLUMNS: FunnelColumn[] = [
  { id: "novos", title: "Novos Contatos", hint: "Leads que acabaram de chegar", accent: "bg-info", order: 0 },
  { id: "qualificacao", title: "Em Qualificação", hint: "Conversa em andamento", accent: "bg-warning", order: 1 },
  { id: "agendamento", title: "Agendamento / Visita", hint: "Reunião marcada", accent: "bg-primary", order: 2 },
  { id: "proposta", title: "Proposta / Orçamento", hint: "Proposta enviada ao cliente", accent: "bg-violet-500", order: 3 },
  { id: "fechado", title: "Fechado / Ganho", hint: "Venda concluída", accent: "bg-success", order: 4 },
];

type Listener = () => void;

let columns: FunnelColumn[] = [...DEFAULT_COLUMNS].sort((a, b) => a.order - b.order);
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const funnelService = {
  /** Get current columns (already sorted) */
  getColumns(): FunnelColumn[] {
    return columns;
  },

  /** Subscribe to changes — returns an unsubscribe function */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Add a new column at the end */
  addColumn(title: string, hint = ""): FunnelColumn {
    const maxOrder = columns.length > 0 ? Math.max(...columns.map((c) => c.order)) : -1;
    const accentIndex = columns.length % ACCENT_PALETTE.length;
    const newCol: FunnelColumn = {
      id: `col_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title,
      hint: hint || "Nova etapa do funil",
      accent: ACCENT_PALETTE[accentIndex],
      order: maxOrder + 1,
    };
    columns = [...columns, newCol].sort((a, b) => a.order - b.order);
    notify();
    return newCol;
  },

  /** Update a column's title and/or hint */
  updateColumn(id: string, updates: Partial<Pick<FunnelColumn, "title" | "hint">>) {
    columns = columns
      .map((col) => (col.id === id ? { ...col, ...updates } : col))
      .sort((a, b) => a.order - b.order);
    notify();
  },

  /** Delete a column by id */
  deleteColumn(id: string) {
    const filtered = columns.filter((c) => c.id !== id);
    // Re-normalize order
    columns = filtered
      .sort((a, b) => a.order - b.order)
      .map((c, i) => ({ ...c, order: i }));
    notify();
  },

  /** Find a column by id */
  getById(id: string): FunnelColumn | undefined {
    return columns.find((c) => c.id === id);
  },

  /** Check if any column has a given id */
  hasColumn(id: string): boolean {
    return columns.some((c) => c.id === id);
  },
};
