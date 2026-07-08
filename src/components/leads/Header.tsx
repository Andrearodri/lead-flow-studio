import { useState } from "react";
import { Search, Plus, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { type Lead } from "./mock-data";

interface HeaderProps {
  onAddLead?: (lead: Lead) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ onAddLead, searchQuery = "", onSearchChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("Consultoria");

  function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!nome.trim() || !telefone.trim()) return;

    const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
    
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      telefone,
      servico,
      esperaMin: 0,
      status: "novos",
      iniciais: iniciais || "?",
    };

    onAddLead?.(newLead);
    setOpen(false);
    setNome("");
    setTelefone("");
    setServico("Consultoria");
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (!newOpen) {
      setNome("");
      setTelefone("");
      setServico("Consultoria");
    }
  }

  const isDemo = typeof window !== "undefined" && localStorage.getItem("crm_demo_mode") === "true";

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="h-full px-6 flex items-center gap-4 justify-between w-full">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight leading-none">
              Vetor Opus — Inteligência em Vendas
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Triagem e qualificação de contatos em tempo real
            </p>
          </div>
          {isDemo && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-150 uppercase tracking-wider shrink-0 select-none">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
              Demonstração
            </span>
          )}
        </div>

        <div className="flex-1 flex justify-center max-w-xl mx-auto w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Pesquisar contatos, telefones ou tags..."
              className="pl-9 h-10 bg-secondary/60 border-transparent focus-visible:bg-card focus-visible:border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-[18px] w-[18px]" />
          </Button>
          
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSave}>
                <DialogHeader>
                  <DialogTitle>Novo Lead</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="nome" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Nome do Contato
                    </label>
                    <Input 
                      id="nome" 
                      name="nome"
                      value={nome} 
                      onChange={e => setNome(e.target.value)} 
                      placeholder="Ex: João da Silva" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="telefone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Número do WhatsApp
                    </label>
                    <Input 
                      id="telefone" 
                      name="telefone"
                      value={telefone} 
                      onChange={e => setTelefone(e.target.value)} 
                      placeholder="Ex: +55 11 99999-9999" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="servico" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Serviço de Interesse
                    </label>
                    <select 
                      id="servico"
                      name="servico"
                      value={servico} 
                      onChange={e => setServico(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Consultoria">Consultoria</option>
                      <option value="Orçamento">Orçamento</option>
                      <option value="Suporte Técnico">Suporte Técnico</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
                  <Button type="submit">Salvar Lead</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
