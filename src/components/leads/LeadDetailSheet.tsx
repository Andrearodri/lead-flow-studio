import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightLeft, Check, Loader2, MessageSquareQuote, Tag, DollarSign, Send, Save, StickyNote } from "lucide-react";
import { type Lead, type LeadStatus } from "./mock-data";
import { cn } from "@/lib/utils";
import { templateService } from "@/services/templateService";
import type { QuickReply } from "@/components/quick-replies/mock-data";
import { useTags } from "@/hooks/useTags";
import { useFunnelColumns } from "@/hooks/useFunnelColumns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { whatsappService } from "@/services/whatsappService";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44Zm-8.48 18.2h-.01a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.82 9.82 0 0 1-1.51-5.18c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.89 6.97c0 5.43-4.42 9.83-9.8 9.83Z" />
    </svg>
  );
}

interface Note {
  id: string;
  text: string;
  time: string;
}

const MOCK_NOTES: Note[] = [
  { id: "n1", text: "Lead cadastrou interesse através da Landing Page B2B.", time: "Hoje, 09:41" },
  { id: "n2", text: "Tentei contato telefônico, mas caiu na caixa postal. Enviei mensagem no WhatsApp.", time: "Hoje, 10:15" }
];

function parseTemplateVariables(text: string, lead: Lead): string {
  return text
    .replace(/\{nome\}/gi, lead.nome)
    .replace(/\{telefone\}/gi, lead.telefone)
    .replace(/\{servico\}/gi, lead.servico);
}

interface Props {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (id: string, status: LeadStatus) => void;
  onUpdateTags: (id: string, tagIds: string[]) => void;
  onUpdateValue?: (id: string, value: number) => void;
}

export function LeadDetailSheet({ lead, open, onOpenChange, onMove, onUpdateTags, onUpdateValue }: Props) {
  const [valStr, setValStr] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mensagem manual
  const [messageBody, setMessageBody] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Notas
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [newNote, setNewNote] = useState("");

  // Templates
  const [templates, setTemplates] = useState<QuickReply[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuickReply | null>(null);

  const availableTags = useTags();
  const leadTags = lead?.tags || [];
  const columns = useFunnelColumns();

  useEffect(() => {
    if (open) {
      setNotes(MOCK_NOTES); // Em prod, buscaria as notas do lead no DB
      setValStr(lead?.valorEstimado?.toString() || "");
      setMessageBody("");
      setSelectedTemplate(null);
    }
  }, [open, lead?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [notes]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function loadTemplates() {
      setIsLoadingTemplates(true);
      try {
        const data = await templateService.getTemplates();
        if (!cancelled) setTemplates(data);
      } catch (err) {
        console.error("Erro ao carregar templates:", err);
      } finally {
        if (!cancelled) setIsLoadingTemplates(false);
      }
    }
    loadTemplates();
    return () => { cancelled = true; };
  }, [open]);

  if (!lead) return null;

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) {
      setSelectedTemplate(null);
      setMessageBody("");
      return;
    }
    const found = templates.find((t) => t.id === id);
    if (found) {
      setSelectedTemplate(found);
      setMessageBody(parseTemplateVariables(found.texto, lead));
    }
  };

  const handleSendMessage = async () => {
    if (!messageBody.trim()) {
      toast.error("A mensagem não pode estar vazia.");
      return;
    }

    setIsSendingMessage(true);
    try {
      const res = await whatsappService.sendWhatsAppMessage({
        phone: lead.telefone,
        message: messageBody,
      });
      if (res && (res as any).demo) {
        toast.success("📱 Envio simulado com sucesso (Modo Demonstração)!");
      } else {
        toast.success("Mensagem enviada com sucesso!");
      }
      setMessageBody("");
      setSelectedTemplate(null);
    } catch (error: any) {
      toast.error("Falha no envio via Green API: " + error.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const toggleTag = (tagId: string) => {
    const current = lead.tags || [];
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    onUpdateTags(lead.id, next);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setValStr(val);
  };

  const handleSaveValue = () => {
    if (onUpdateValue && lead) {
      onUpdateValue(lead.id, Number(valStr));
      toast.success("Valor atualizado!");
    }
  };

  const formatCurrency = (val: string) => {
    if (!val) return "0,00";
    const num = Number(val) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      text: newNote,
      time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date())
    };
    setNotes((prev) => [...prev, note]);
    setNewNote("");
    toast.success("Anotação salva!");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 flex flex-col gap-0"
      >
        {/* Fix the Header to not scroll */}
        <div className="flex flex-col h-full overflow-hidden">
          
          <SheetHeader className="px-6 py-5 border-b shrink-0 space-y-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white grid place-items-center text-sm font-bold shrink-0 shadow-sm shadow-violet-500/20">
                  {lead.iniciais}
                </div>
                <div className="min-w-0">
                  <SheetTitle className="text-lg font-bold text-gray-900 truncate">{lead.nome}</SheetTitle>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs text-gray-500 font-medium tabular-nums truncate">
                      {lead.telefone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5 pb-1">
              {/* Valor Estimado Sync */}
              <div>
                <Label className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  Valor Estimado
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      value={formatCurrency(valStr)}
                      onChange={handleValueChange}
                      onBlur={handleSaveValue}
                      className="h-9 font-semibold text-[13px] tabular-nums pl-7 bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500 rounded-lg"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold pointer-events-none">
                      R$
                    </span>
                  </div>
                  <Button variant="outline" size="icon" onClick={handleSaveValue} className="h-9 w-9 shrink-0 text-gray-400 hover:text-emerald-600 border-gray-200">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Status / Move */}
              <div>
                <Label className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-blue-500" />
                  Status
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-9 justify-between text-xs font-semibold bg-gray-50/50 border-gray-200">
                      <span className="truncate">{columns.find((c) => c.id === lead.status)?.title || "Selecione"}</span>
                      <ArrowRightLeft className="h-3.5 w-3.5 ml-2 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {columns.map((col) => (
                      <DropdownMenuItem
                        key={col.id}
                        onClick={() => onMove(lead.id, col.id)}
                        className="text-xs font-medium"
                      >
                        <span className={cn("h-2 w-2 rounded-full mr-2", col.accent)} />
                        {col.title}
                        {lead.status === col.id && <Check className="h-3.5 w-3.5 ml-auto text-emerald-500" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Etiquetas / Tags Interativas */}
            <div className="pt-3">
              <label className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Tag className="h-3.5 w-3.5 text-amber-500" />
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isActive = leadTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all border",
                        isActive
                          ? `${tag.color} ${tag.textColor} border-transparent shadow-sm`
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      {tag.name}
                      {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                  );
                })}
                {availableTags.length === 0 && (
                  <span className="text-[11px] text-gray-400">
                    Nenhuma etiqueta cadastrada.
                  </span>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            
            {/* Seção de Automação / Mensagem Manual */}
            <div className="p-6 border-b border-gray-100 bg-white">
              <label className="flex items-center gap-1.5 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <MessageSquareQuote className="h-3.5 w-3.5 text-violet-500" />
                Disparo de Mensagem (simulado no modo demo)
              </label>

              {isLoadingTemplates ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                  <span className="text-xs text-gray-500 font-medium">Carregando templates...</span>
                </div>
              ) : (
                <select
                  value={selectedTemplate?.id ?? ""}
                  onChange={handleTemplateChange}
                  className="flex h-10 w-full items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-violet-500 mb-3 transition-shadow"
                >
                  <option value="">
                    {templates.length === 0
                      ? "Nenhum template cadastrado"
                      : "Selecionar template de mensagem..."}
                  </option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.categoria}] {t.titulo}
                    </option>
                  ))}
                </select>
              )}

              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Escreva a mensagem ou selecione um template acima..."
                className="min-h-[100px] text-xs leading-relaxed resize-none bg-white border-gray-200 focus-visible:ring-violet-500 rounded-xl mb-3 shadow-sm"
              />

              <Button
                onClick={handleSendMessage}
                disabled={isSendingMessage || !messageBody.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-11 rounded-xl shadow-md shadow-violet-500/20 transition-all disabled:opacity-50"
              >
                {isSendingMessage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando via Green API...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar mensagem
                  </>
                )}
              </Button>
            </div>

            {/* Seção de Anotações (Notes) */}
            <div className="p-6">
              <label className="flex items-center gap-1.5 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <StickyNote className="h-3.5 w-3.5 text-amber-500" />
                Histórico & Anotações
              </label>

              <div className="flex gap-2 mb-6">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Adicionar nova anotação..."
                  className="h-10 text-xs bg-white border-gray-200 focus-visible:ring-amber-500 rounded-xl shadow-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNote()}
                />
                <Button onClick={handleSaveNote} disabled={!newNote.trim()} className="h-10 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-sm">
                  Salvar
                </Button>
              </div>

              <div ref={scrollRef} className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note.id} className="relative pl-4 pb-2 border-l-2 border-gray-200 last:border-transparent">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300 ring-4 ring-slate-50" />
                      <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-tl-none shadow-sm">
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{note.text}</p>
                        <span className="block mt-2 text-[10px] font-bold text-gray-400">
                          {note.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-400 py-4">
                    Nenhuma anotação registrada para este lead.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
