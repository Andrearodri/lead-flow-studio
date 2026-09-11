import React, { useState } from "react";
import { Plus, Zap, Clock, MessageCircle, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const INITIAL_RULES = [
  {
    id: "1",
    title: "Alerta de SLA 48h",
    description: "Notifica o gestor se o lead ficar mais de 48h sem contato na etapa de Negociação.",
    icon: Clock,
    active: true,
  },
  {
    id: "2",
    title: "Boas-vindas Automática",
    description: "Envia template de WhatsApp quando um novo lead entra no Kanban.",
    icon: MessageCircle,
    active: false,
  },
  {
    id: "3",
    title: "Tag VIP (Alto Valor)",
    description: "Adiciona tag 'VIP' automaticamente se o Valor Estimado for maior que R$ 10.000.",
    icon: Tag,
    active: true,
  },
  {
    id: "4",
    title: "Lead Esfriou",
    description: "Move o lead para a coluna 'Perdido' após 15 dias sem interação.",
    icon: Zap,
    active: false,
  },
];

export function AutomationsView() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Automações Inteligentes</h1>
          <p className="text-gray-500 text-sm">
            Crie regras de gatilho e ação para otimizar o seu fluxo de trabalho.
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors rounded-xl font-medium px-4">
              <Plus className="w-4 h-4 mr-2" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[460px] rounded-2xl border-gray-100 shadow-xl">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-lg font-bold text-gray-900">Criar Nova Automação</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Defina o gatilho (Quando) e a ação (Então) para a nova regra.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700">Quando acontecer...</label>
                <Select>
                  <SelectTrigger className="w-full h-11 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-violet-500">
                    <SelectValue placeholder="Selecione um gatilho" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                    <SelectItem value="lead_moved">Lead movido para etapa X</SelectItem>
                    <SelectItem value="time_passed">Lead sem contato há X dias</SelectItem>
                    <SelectItem value="tag_added">Nova tag adicionada</SelectItem>
                    <SelectItem value="value_updated">Valor estimado atualizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center text-gray-300">
                <div className="bg-gray-50 p-2 rounded-full border border-gray-100">
                   <ArrowRight className="w-4 h-4 rotate-90 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700">Então faça...</label>
                <Select>
                  <SelectTrigger className="w-full h-11 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-violet-500">
                    <SelectValue placeholder="Selecione uma ação" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                    <SelectItem value="send_wp">Enviar template de WhatsApp</SelectItem>
                    <SelectItem value="notify_manager">Notificar Gestor</SelectItem>
                    <SelectItem value="move_lead">Mover Lead para etapa Y</SelectItem>
                    <SelectItem value="add_tag">Adicionar Tag Específica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4 gap-3">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="button" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-sm" onClick={() => setIsModalOpen(false)}>Salvar Automação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de Regras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div
              key={rule.id}
              className={cn(
                "bg-white rounded-2xl p-6 transition-all duration-300 relative overflow-hidden",
                rule.active ? "border border-violet-100 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.1)]" : "border border-gray-100 opacity-70 shadow-sm"
              )}
            >
              {rule.active && (
                <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
              )}
              <div className="flex items-start justify-between mb-5">
                <div className={cn(
                  "p-3 rounded-xl shrink-0 transition-colors duration-300",
                  rule.active ? "bg-violet-50 text-violet-600" : "bg-gray-50 text-gray-400"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <Switch
                  checked={rule.active}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
              <h3 className={cn(
                "text-base font-bold mb-2 transition-colors duration-300",
                rule.active ? "text-gray-900" : "text-gray-500"
              )}>
                {rule.title}
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {rule.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
