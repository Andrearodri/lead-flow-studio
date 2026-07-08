import { useState, useEffect } from "react";
import { Pencil, Trash2, MessageSquareQuote, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { categoryTone, type QuickReply, type QuickReplyCategory } from "./mock-data";
import { templateService } from "@/services/templateService";

const CATEGORIES: QuickReplyCategory[] = ["Boas-vindas", "Comercial", "Suporte", "Follow-up", "Encerramento"];

export function QuickRepliesView() {
  const [templates, setTemplates] = useState<QuickReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<QuickReplyCategory>("Boas-vindas");

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar os templates.");
    } finally {
      setIsLoading(false);
    }
  }

  function openModal(template?: QuickReply) {
    if (template) {
      setEditingId(template.id);
      setTitulo(template.titulo);
      setTexto(template.texto);
      setCategoria(template.categoria);
    } else {
      setEditingId(null);
      setTitulo("");
      setTexto("");
      setCategoria("Boas-vindas");
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setTitulo("");
    setTexto("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !texto.trim()) return;

    setIsSaving(true);
    try {
      if (editingId) {
        await templateService.updateTemplate(editingId, { titulo, texto, categoria });
        setTemplates((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, titulo, texto, categoria } : t))
        );
      } else {
        const newTemplate = await templateService.createTemplate({ titulo, texto, categoria });
        setTemplates((prev) => [newTemplate, ...prev]);
      }
      closeModal();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert("Falha ao salvar o template. " + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir esta mensagem rápida?")) return;

    // Optimistic Delete
    const previousTemplates = [...templates];
    setTemplates((prev) => prev.filter((t) => t.id !== id));

    try {
      await templateService.deleteTemplate(id);
    } catch (err: any) {
      console.error("Erro ao excluir:", err);
      alert("Falha ao excluir o template.");
      setTemplates(previousTemplates); // Rollback
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Mensagens Rápidas e Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as respostas prontas para sua equipe utilizar no atendimento.
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-1.5 shadow-sm shrink-0">
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {error && (
        <div className="px-6 mb-4">
          <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
            {error}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        </div>
      ) : (
        <div className="px-6 pb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.length === 0 && !error && (
            <div className="col-span-full py-10 text-center text-muted-foreground text-sm border border-dashed rounded-xl">
              Nenhum template cadastrado. Clique em "Novo Template" para criar o primeiro.
            </div>
          )}
          {templates.map((r) => (
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

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap">
                {r.texto}
              </p>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-end gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openModal(r)}
                  className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(r.id)}
                  className="h-8 gap-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Template" : "Novo Template"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Título</label>
                <Input 
                  value={titulo} 
                  onChange={(e) => setTitulo(e.target.value)} 
                  placeholder="Ex: Saudação Inicial" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Categoria</label>
                <select 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value as QuickReplyCategory)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Mensagem</label>
                <Textarea 
                  value={texto} 
                  onChange={(e) => setTexto(e.target.value)} 
                  placeholder="Digite a mensagem que será enviada..." 
                  required
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editingId ? "Salvar Alterações" : "Criar Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
