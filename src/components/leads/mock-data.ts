export type LeadStatus = "novos" | "qualificacao" | "agendamento" | "fechado";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  servico: string;
  esperaMin: number;
  status: LeadStatus;
  iniciais: string;
}

export const COLUMNS: { id: LeadStatus; title: string; hint: string; accent: string }[] = [
  { id: "novos", title: "Novos Contatos", hint: "Leads que acabaram de chegar", accent: "bg-info" },
  { id: "qualificacao", title: "Em Qualificação", hint: "Conversa em andamento", accent: "bg-warning" },
  { id: "agendamento", title: "Agendamento / Visita", hint: "Reunião marcada", accent: "bg-primary" },
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
): Lead => ({ id, nome, telefone, servico, esperaMin, status, iniciais: ini(nome) });

export const INITIAL_LEADS: Lead[] = [
  make("1", "João Silva", "+55 11 99812-4523", "Consultoria", 12, "novos"),
  make("2", "Mariana Costa", "+55 21 99711-2210", "Orçamento", 27, "novos"),
  make("3", "Rafael Almeida", "+55 31 98822-5544", "Plano Premium", 4, "novos"),
  make("4", "Beatriz Nogueira", "+55 47 99654-1100", "Demonstração", 41, "novos"),

  make("5", "Carlos Henrique", "+55 11 99100-7788", "Consultoria", 65, "qualificacao"),
  make("6", "Letícia Ramos", "+55 19 98477-3321", "Orçamento", 33, "qualificacao"),
  make("7", "Pedro Martins", "+55 51 99966-2014", "Suporte Técnico", 18, "qualificacao"),

  make("8", "Ana Paula Souza", "+55 11 99834-7766", "Visita Técnica", 120, "agendamento"),
  make("9", "Felipe Rodrigues", "+55 41 99201-9988", "Reunião Comercial", 240, "agendamento"),

  make("10", "Juliana Pereira", "+55 11 98712-4521", "Plano Anual", 1440, "fechado"),
  make("11", "Ricardo Gomes", "+55 27 99654-8821", "Consultoria", 2880, "fechado"),
];

export function formatEspera(min: number): string {
  if (min < 60) return `Aguardando há ${min} min`;
  if (min < 60 * 24) return `Aguardando há ${Math.floor(min / 60)}h`;
  const dias = Math.floor(min / (60 * 24));
  return `Aguardando há ${dias}d`;
}
