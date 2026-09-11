/**
 * LeadStatus is now a dynamic string to support user-created funnel columns.
 * The funnelService is the source of truth for valid column IDs.
 */
export type LeadStatus = string;

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  servico: string;
  esperaMin: number;
  status: LeadStatus;
  iniciais: string;
  /** IDs das tags atribuídas a este lead */
  tags?: string[];
  /** Valor estimado do negócio em R$ */
  valorEstimado?: number;
}

/** @deprecated Use funnelService.getColumns() instead. Kept for initialization. */
export const COLUMNS: { id: LeadStatus; title: string; hint: string; accent: string }[] = [
  { id: "novos", title: "Novos Contatos", hint: "Leads que acabaram de chegar", accent: "bg-info" },
  { id: "qualificacao", title: "Em Qualificação", hint: "Conversa em andamento", accent: "bg-warning" },
  { id: "agendamento", title: "Agendamento / Visita", hint: "Reunião marcada", accent: "bg-primary" },
  { id: "proposta", title: "Proposta / Orçamento", hint: "Proposta enviada ao cliente", accent: "bg-violet-500" },
  { id: "fechado", title: "Fechado / Ganho", hint: "Venda concluída", accent: "bg-success" },
];

const ini = (n: string) =>
  n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

const make = (
  id: string,
  nome: string,
  telefone: string,
  servico: string,
  esperaMin: number,
  status: LeadStatus,
): Lead => ({ 
  id, 
  nome, 
  telefone, 
  servico, 
  esperaMin, 
  status, 
  iniciais: ini(nome),
  valorEstimado: Math.floor(Math.random() * 15000) + 1000
});

export const INITIAL_LEADS: Lead[] = [
  make("1", "Contato Demo 01", "+55 00 90000-0001", "Consultoria", 12, "novos"),
  make("2", "Contato Demo 02", "+55 00 90000-0002", "Orçamento", 27, "novos"),
  make("3", "Contato Demo 03", "+55 00 90000-0003", "Plano Premium", 4, "novos"),
  make("4", "Contato Demo 04", "+55 00 90000-0004", "Demonstração", 41, "novos"),

  make("5", "Contato Demo 05", "+55 00 90000-0005", "Consultoria", 65, "qualificacao"),
  make("6", "Contato Demo 06", "+55 00 90000-0006", "Orçamento", 33, "qualificacao"),
  make("7", "Contato Demo 07", "+55 00 90000-0007", "Suporte Técnico", 18, "qualificacao"),

  make("8", "Contato Demo 08", "+55 00 90000-0008", "Visita Técnica", 120, "agendamento"),
  make("9", "Contato Demo 09", "+55 00 90000-0009", "Reunião Comercial", 240, "agendamento"),

  make("10", "Contato Demo 10", "+55 00 90000-0010", "Plano Anual", 1440, "fechado"),
  make("11", "Contato Demo 11", "+55 00 90000-0011", "Consultoria", 2880, "fechado"),
];

export function formatEspera(min: number): string {
  if (min < 60) return `Aguardando há ${min} min`;
  if (min < 60 * 24) return `Aguardando há ${Math.floor(min / 60)}h`;
  const dias = Math.floor(min / (60 * 24));
  return `Aguardando há ${dias}d`;
}
