import React, { useState } from "react";
import { Megaphone, Plus, Search, Calendar, Play, Pause, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const INITIAL_CAMPAIGNS = [
  {
    id: "1",
    name: "Resgate de Leads Antigos (Q1)",
    status: "active", // active | paused
    target: "leads_frios",
    sent: 450,
    total: 500,
    created: "10/05/2026",
  },
  {
    id: "2",
    name: "Campanha Especial Black Friday B2B",
    status: "paused",
    target: "propostas_perdidas",
    sent: 120,
    total: 350,
    created: "02/05/2026",
  },
  {
    id: "3",
    name: "Oferta Setup Exclusivo WhatsApp CRM",
    status: "active",
    target: "qualificacao",
    sent: 89,
    total: 100,
    created: "14/05/2026",
  },
];

export function CampaignsView() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c))
    );
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestão de Campanhas Ativas</h1>
          <p className="text-gray-500 text-sm">
            Dispare réguas de mensagens em lote e acompanhe o progresso de prospecção.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors rounded-xl font-medium px-4">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Tabela/Grid de Campanhas */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar campanha por nome ou público..."
              className="pl-10 h-10 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-[13px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Campanha</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Público-Alvo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Progresso de Disparos</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Criação</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => {
                  const pct = Math.round((camp.sent / camp.total) * 100);
                  return (
                    <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                            <Megaphone className="w-4 h-4" />
                          </div>
                          <span className="text-[13px] font-bold text-gray-900">{camp.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {camp.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Em Andamento
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            Pausada
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {camp.target}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-full max-w-[200px]">
                          <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-1">
                            <span>{pct}% concluído</span>
                            <span>{camp.sent}/{camp.total}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50 shadow-inner">
                            <div
                              className="bg-violet-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500">
                        {camp.created}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                        <button
                          onClick={() => handleToggleStatus(camp.id)}
                          className={cn(
                            "p-2 rounded-lg font-bold transition-all border shadow-sm inline-flex items-center gap-1.5",
                            camp.status === "active"
                              ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50"
                          )}
                        >
                          {camp.status === "active" ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              Iniciar
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    Nenhuma campanha de prospecção ativa encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
