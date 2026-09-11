import { useState } from "react";
import { Search, Plus, Bell, Menu, LayoutDashboard, Package, ShoppingBag, Users, MessageSquare, Mail, Waypoints, PieChart, Blocks, HelpCircle, MessageCircle, Settings, Rocket, LogOut, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { type Lead } from "./mock-data";
import { type NavView } from "./Sidebar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onAddLead?: (lead: Lead) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  activeView?: NavView;
  onSelectView?: (view: NavView) => void;
  onLogout?: () => void;
}

export function Header({
  onAddLead,
  searchQuery = "",
  onSearchChange,
  activeView = "kanban",
  onSelectView,
  onLogout,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("Consultoria");
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Novo lead cadastrado", desc: "Contato Demo 01 entrou via WhatsApp", time: "Há 5 min", read: false },
    { id: "2", title: "Status alterado", desc: "Contato Demo 02 avançou para 'Em Proposta'", time: "Há 25 min", read: false },
    { id: "3", title: "Lembrete de automação", desc: "Simulação iniciada com 12 contatos", time: "Há 1h", read: true },
  ]);

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
    toast.success(`Lead "${nome}" cadastrado com sucesso!`);
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

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("Todas as notificações foram lidas.");
  };

  const isDemo = typeof window !== "undefined" && localStorage.getItem("crm_demo_mode") === "true";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: NavView; label: string; icon: any; category: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Menu Principal" },
    { id: "products", label: "Produtos", icon: Package, category: "Menu Principal" },
    { id: "orders", label: "Pedidos", icon: ShoppingBag, category: "Menu Principal" },
    { id: "kanban", label: "Clientes / Leads", icon: Users, category: "Menu Principal" },
    { id: "quick-replies", label: "Mensagens", icon: MessageSquare, category: "Menu Principal" },
    { id: "email", label: "E-mail", icon: Mail, category: "Ferramentas" },
    { id: "automations", label: "Automações", icon: Waypoints, category: "Ferramentas" },
    { id: "analytics", label: "Análises", icon: PieChart, category: "Ferramentas" },
    { id: "integrations", label: "Integrações", icon: Blocks, category: "Ferramentas" },
    { id: "campaigns", label: "Campanhas", icon: Rocket, category: "Área de Trabalho" },
    { id: "plans", label: "Planos", icon: Package, category: "Área de Trabalho" },
    { id: "help", label: "Central de Ajuda", icon: HelpCircle, category: "Suporte & Configs" },
    { id: "feedback", label: "Feedback", icon: MessageCircle, category: "Suporte & Configs" },
    { id: "settings", label: "Configurações", icon: Settings, category: "Suporte & Configs" },
  ];

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3 justify-between w-full">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu de navegação">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 flex flex-col h-full">
              <SheetHeader className="p-5 border-b border-gray-100 text-left">
                <SheetTitle className="text-base font-bold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-extrabold text-xs">
                    V
                  </div>
                  Lead Flow Studio
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {["Menu Principal", "Ferramentas", "Área de Trabalho", "Suporte & Configs"].map((cat) => (
                  <div key={cat}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
                      {cat}
                    </p>
                    <div className="space-y-0.5">
                      {navItems
                        .filter((item) => item.category === cat)
                        .map((item) => {
                          const Icon = item.icon;
                          const isActive = activeView === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                onSelectView?.(item.id);
                                setMobileNavOpen(false);
                              }}
                              className={cn(
                                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                                isActive
                                  ? "bg-orange-50 text-orange-600 font-semibold"
                                  : "text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              <Icon className={cn("w-4 h-4", isActive ? "text-orange-500" : "text-gray-400")} />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
              {onLogout && (
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-2 text-xs font-medium text-rose-600 hover:bg-rose-50 w-full p-2.5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da Conta
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <h1 className="text-[14px] sm:text-[15px] font-semibold tracking-tight leading-none truncate">
              Lead Flow Studio — CRM Demo
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">
              Triagem e qualificação de contatos em tempo real
            </p>
          </div>
          {isDemo && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-150 uppercase tracking-wider shrink-0 select-none">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
              Demo
            </span>
          )}
        </div>

        <div className="flex-1 flex justify-center max-w-xs sm:max-w-md mx-2 sm:mx-4 w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Pesquisar contatos, telefones ou tags..."
              className="pl-9 h-9 sm:h-10 text-xs sm:text-sm bg-secondary/60 border-transparent focus-visible:bg-card focus-visible:border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Notificações">
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 shadow-lg" align="end">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-gray-900">Notificações</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Lidas
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                      );
                    }}
                    className={cn(
                      "p-3 text-xs cursor-pointer hover:bg-gray-50 transition-colors",
                      !n.read && "bg-orange-50/40 font-medium"
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-gray-900">{n.title}</p>
                      <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-gray-500 mt-0.5 text-[11px]">{n.desc}</p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-1.5 shadow-sm h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Lead</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSave}>
                <DialogHeader>
                  <DialogTitle>Novo Lead</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="nome" className="text-sm font-medium leading-none">
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
                    <label htmlFor="telefone" className="text-sm font-medium leading-none">
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
                    <label htmlFor="servico" className="text-sm font-medium leading-none">
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
