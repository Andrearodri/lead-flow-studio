import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Mail,
  Waypoints,
  PieChart,
  Blocks,
  HelpCircle,
  MessageCircle,
  Settings,
  Search,
  Rocket,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type NavView = "dashboard" | "kanban" | "quick-replies" | "settings" | "automations" | "integrations" | "products" | "orders" | "email" | "analytics" | "help" | "feedback" | "campaigns" | "plans";

interface SidebarProps {
  active: NavView;
  onSelect: (view: NavView) => void;
  onLogout?: () => void;
}

export function Sidebar({ active, onSelect, onLogout }: SidebarProps) {
  const [userEmail, setUserEmail] = useState<string>("Sessão Ativa");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);
  const renderItem = (
    id: NavView | null,
    icon: any,
    label: string,
    badge?: number,
    isActiveOverride?: boolean
  ) => {
    const isActive = isActiveOverride !== undefined ? isActiveOverride : (id ? active === id : false);
    return (
      <button
        key={label}
        onClick={() => id && onSelect(id)}
        className="relative flex items-center w-full px-6 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50"
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-orange-500 rounded-r-full" />
        )}
        <div className="w-5 flex justify-center mr-3">
          {icon && (
            <icon.type
              {...icon.props}
              className={cn(
                "w-4 h-4",
                isActive ? "text-orange-500" : "text-gray-400"
              )}
            />
          )}
        </div>
        <span className={cn(isActive ? "text-gray-900 font-semibold" : "text-gray-500")}>
          {label}
        </span>
        {badge !== undefined && (
          <span className="ml-auto bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center justify-center min-w-[20px]">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const renderWorkspaceItem = (id: NavView, label: string, dotColor: string, badge?: number) => {
    const isActive = active === id;
    return (
      <button
        key={label}
        onClick={() => onSelect(id)}
        className={cn(
          "relative flex items-center w-full px-6 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50",
          isActive ? "text-gray-900 font-semibold" : "text-gray-500"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-orange-500 rounded-r-full" />
        )}
        <div className="w-5 flex justify-center mr-3">
          <span className={cn("w-2 h-2 rounded-sm", dotColor)} />
        </div>
        <span>{label}</span>
        {badge !== undefined && (
          <span className="ml-auto bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center justify-center min-w-[20px]">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-6 text-[10px] font-bold text-gray-400 mt-6 mb-2 uppercase tracking-wider">
      {title}
    </div>
  );

  return (
    <aside className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-gray-100 bg-white h-full overflow-hidden">
      {/* Search Bar */}
      <div className="px-5 py-5 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-12 py-2 bg-gray-50/80 border border-gray-100 rounded-lg text-[13px] text-gray-900 focus:ring-1 focus:ring-gray-200 outline-none transition-shadow placeholder:text-gray-400"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <span className="text-[10px] font-medium text-gray-400 border border-gray-200 bg-white rounded px-1.5 py-0.5 shadow-sm">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <SectionHeader title="Menu Principal" />
        <nav className="flex flex-col">
          {renderItem("dashboard", <LayoutDashboard />, "Dashboard")}
          {renderItem("products", <Package />, "Produtos")}
          {renderItem("orders", <ShoppingBag />, "Pedidos")}
          {/* Customer maps to our Kanban de Leads */}
          {renderItem("kanban", <Users />, "Clientes")}
          {/* Message maps to our Quick Replies */}
          {renderItem("quick-replies", <MessageSquare />, "Mensagens", 33)}
        </nav>

        <SectionHeader title="Ferramentas" />
        <nav className="flex flex-col">
          {renderItem("email", <Mail />, "E-mail")}
          {renderItem("automations", <Waypoints />, "Automações")}
          {renderItem("analytics", <PieChart />, "Análises")}
          {renderItem("integrations", <Blocks />, "Integrações")}
        </nav>

        <SectionHeader title="Área de Trabalho" />
        <nav className="flex flex-col">
          {renderWorkspaceItem("campaigns", "Campanhas", "bg-indigo-500", 5)}
          {renderWorkspaceItem("plans", "Planos de Produto", "bg-pink-500", 4)}
        </nav>

        {/* Bottom Menu Items */}
        <div className="mt-8 mb-4">
          <nav className="flex flex-col">
            {renderItem("help", <HelpCircle />, "Central de Ajuda")}
            {renderItem("feedback", <MessageCircle />, "Feedback")}
            {renderItem("settings", <Settings />, "Configurações")}
          </nav>
        </div>

        {/* Upgrade Card */}
        <div className="px-5 mb-5 shrink-0 mt-auto pt-4">
          <div className="p-3.5 rounded-xl border border-gray-100 shadow-sm bg-white hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                <Rocket className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">Faça o upgrade</p>
                <p className="text-[11px] text-gray-500 truncate">Libere todas as funções</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Profile / Logout Card */}
        <div className="px-5 mb-6 shrink-0 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                {userEmail.substring(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-gray-900 truncate" title={userEmail}>
                  {userEmail.split("@")[0]}
                </p>
                <p className="text-[10px] text-gray-400 truncate">Usuário Ativo</p>
              </div>
            </div>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600 transition-colors shrink-0"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
