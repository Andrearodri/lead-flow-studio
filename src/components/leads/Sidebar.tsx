import { LayoutDashboard, KanbanSquare, MessageSquareText, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavView = "dashboard" | "kanban" | "quick-replies" | "settings";

const items: { id: NavView; icon: typeof LayoutDashboard; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "kanban", icon: KanbanSquare, label: "Kanban de Leads" },
  { id: "quick-replies", icon: MessageSquareText, label: "Mensagens Rápidas" },
  { id: "settings", icon: Settings, label: "Configurações" },
];

interface SidebarProps {
  active: NavView;
  onSelect: (view: NavView) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-card/50 backdrop-blur-sm">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">LeadFlow</p>
          <p className="text-[11px] text-muted-foreground">CRM WhatsApp</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                "hover:bg-accent text-muted-foreground hover:text-foreground",
                isActive &&
                  "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-medium",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 1.75} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-info text-primary-foreground grid place-items-center text-xs font-semibold">
            MA
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">Marina Alves</p>
            <p className="text-[11px] text-muted-foreground">Conta Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
