import React, { useState } from "react";
import { Plus, FileText, Search, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const INITIAL_ORDERS = [
  {
    id: "#ORD-2026-001",
    client: "Empresa Demo A",
    service: "Setup de Automação WhatsApp",
    value: 1500.00,
    date: "12/05/2026",
    status: "active", // active | pending | cancelled
  },
  {
    id: "#ORD-2026-002",
    client: "Empresa Exemplo B",
    service: "Consultoria Comercial B2B",
    value: 9000.00,
    date: "14/05/2026",
    status: "pending",
  },
  {
    id: "#ORD-2026-003",
    client: "Empresa Demo C",
    service: "Licenciamento CRM & Integração",
    value: 499.00,
    date: "15/05/2026",
    status: "active",
  },
  {
    id: "#ORD-2026-004",
    client: "Empresa Exemplo D",
    service: "Treinamento de Equipe",
    value: 2500.00,
    date: "10/05/2026",
    status: "cancelled",
  },
];

export function OrdersView() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((o) => {
    return (
      o.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestão de Pedidos e Contratos</h1>
          <p className="text-gray-500 text-sm">
            Acompanhe o fechamento de propostas e status dos contratos ativos.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors rounded-xl font-medium px-4">
          <Plus className="w-4 h-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Search Bar in Table Header */}
        <div className="p-5 border-b border-gray-50 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, pedido ou serviço..."
              className="pl-10 h-10 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-[13px]"
            />
          </div>
        </div>

        {/* Modern Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID do Pedido</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Serviço Contratado</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fechamento</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-gray-900">
                      {order.id}
                    </td>
                    
                    {/* Client */}
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-semibold text-gray-800">
                      {order.client}
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                        <span className="text-[13px] text-gray-600 truncate max-w-[200px]">{order.service}</span>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-gray-950">
                      R$ {order.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500">
                      {order.date}
                    </td>

                    {/* Status Badges */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status === "active" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Ativo
                        </span>
                      )}
                      {order.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          Aguardando Assinatura
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                          Cancelado
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                    Nenhum pedido ou contrato correspondente encontrado.
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
