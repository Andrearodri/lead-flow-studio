import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Send, Check } from "lucide-react";
import { COLUMNS, type Lead, type LeadStatus } from "./mock-data";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44Zm-8.48 18.2h-.01a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.82 9.82 0 0 1-1.51-5.18c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.89 6.97c0 5.43-4.42 9.83-9.8 9.83Z" />
    </svg>
  );
}

interface ChatMessage {
  id: string;
  from: "lead" | "company";
  text: string;
  time: string;
}

const MOCK_CHAT: ChatMessage[] = [
  { id: "m1", from: "lead", text: "Olá! Vi o anúncio de vocês e queria saber mais sobre o serviço.", time: "09:41" },
  { id: "m2", from: "company", text: "Oi! Que bom te ver por aqui 👋 Posso te ajudar agora mesmo. Sobre qual serviço gostaria de saber?", time: "09:42" },
  { id: "m3", from: "lead", text: "Quanto custa a consultoria inicial? Vocês atendem na região central?", time: "09:44" },
  { id: "m4", from: "company", text: "A consultoria inicial é gratuita e sim, atendemos toda a região central. Posso agendar uma conversa de 30 min com nosso especialista?", time: "09:45" },
];

interface Props {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (id: string, status: LeadStatus) => void;
}

export function LeadDetailSheet({ lead, open, onOpenChange, onMove }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setMessages(MOCK_CHAT);
  }, [open, lead?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!lead) return null;

  function send() {
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: `m${m.length + 1}`,
        from: "company",
        text: draft.trim(),
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[440px] p-0 flex flex-col gap-0"
      >
        <SheetHeader className="px-5 py-4 border-b space-y-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/80 to-info/80 text-primary-foreground grid place-items-center text-sm font-semibold shrink-0">
                {lead.iniciais}
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-base truncate">{lead.nome}</SheetTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <WhatsAppIcon className="h-3 w-3 text-whatsapp" />
                  <span className="text-xs text-muted-foreground tabular-nums truncate">
                    {lead.telefone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" />
                  Mover para...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {COLUMNS.map((col) => (
                  <DropdownMenuItem
                    key={col.id}
                    onClick={() => onMove(lead.id, col.id)}
                    className="text-xs"
                  >
                    <span className={cn("h-2 w-2 rounded-full mr-2", col.accent)} />
                    {col.title}
                    {lead.status === col.id && <Check className="h-3.5 w-3.5 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-[11px] text-muted-foreground">
              {COLUMNS.find((c) => c.id === lead.status)?.title}
            </span>
          </div>
        </SheetHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-secondary/30"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[78%]",
                msg.from === "company" ? "ml-auto items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "px-3.5 py-2 rounded-2xl text-sm leading-snug shadow-sm",
                  msg.from === "company"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm",
                )}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1 tabular-nums">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t p-3 bg-background">
          <div className="flex items-center gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Digite uma mensagem rápida..."
              className="h-10 rounded-full bg-secondary/50 border-transparent focus-visible:bg-background"
            />
            <Button
              size="icon"
              onClick={send}
              disabled={!draft.trim()}
              className="h-10 w-10 rounded-full shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
