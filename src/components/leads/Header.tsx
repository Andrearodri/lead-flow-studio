import { Search, Plus, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="h-full px-6 flex items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold tracking-tight leading-none">
            Gestão de Leads — WhatsApp
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Triagem e qualificação de contatos em tempo real
          </p>
        </div>

        <div className="flex-1 flex justify-center max-w-xl mx-auto w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar contatos, telefones ou tags..."
              className="pl-9 h-10 bg-secondary/60 border-transparent focus-visible:bg-card focus-visible:border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-[18px] w-[18px]" />
          </Button>
          <Button className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>
    </header>
  );
}
