export type QuickReplyCategory = "Boas-vindas" | "Comercial" | "Suporte" | "Follow-up" | "Encerramento";

export interface QuickReply {
  id: string;
  categoria: QuickReplyCategory;
  titulo: string;
  texto: string;
}

export const categoryTone: Record<QuickReplyCategory, string> = {
  "Boas-vindas": "bg-info/15 text-info border-info/20",
  Comercial: "bg-primary/15 text-primary border-primary/20",
  Suporte: "bg-warning/15 text-warning border-warning/20",
  "Follow-up": "bg-accent text-foreground border-border",
  Encerramento: "bg-success/15 text-success border-success/20",
};

export const INITIAL_REPLIES: QuickReply[] = [
  {
    id: "qr-1",
    categoria: "Boas-vindas",
    titulo: "Saudação Inicial",
    texto: "Olá! Tudo bem? Que bom te ver por aqui. Como posso te ajudar hoje?",
  },
  {
    id: "qr-2",
    categoria: "Comercial",
    titulo: "Envio de Orçamento",
    texto:
      "Segue o nosso catálogo com os valores atualizados. Qualquer dúvida, estou à disposição!",
  },
  {
    id: "qr-3",
    categoria: "Suporte",
    titulo: "Aviso de Ausência",
    texto:
      "No momento estamos fora do nosso horário de atendimento. Retornaremos sua mensagem amanhã às 08h.",
  },
  {
    id: "qr-4",
    categoria: "Follow-up",
    titulo: "Retomar Conversa",
    texto:
      "Oi! Passando para saber se você teve a oportunidade de avaliar a proposta que enviei. Posso te ajudar com algo?",
  },
  {
    id: "qr-5",
    categoria: "Comercial",
    titulo: "Confirmação de Agendamento",
    texto:
      "Tudo certo! Sua visita está confirmada. Te envio um lembrete uma hora antes do horário combinado.",
  },
  {
    id: "qr-6",
    categoria: "Encerramento",
    titulo: "Agradecimento Final",
    texto:
      "Foi um prazer te atender! Qualquer nova necessidade, é só chamar por aqui. Tenha um ótimo dia. 🙌",
  },
];
