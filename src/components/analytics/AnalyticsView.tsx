import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, Award, Clock, DollarSign, Users, ChevronRight } from "lucide-react";

const REVENUE_DATA = [
  { name: "Jan", receita: 12000 },
  { name: "Fev", receita: 15000 },
  { name: "Mar", receita: 18000 },
  { name: "Abr", receita: 24000 },
  { name: "Mai", receita: 31000 },
];

const LEADS_CHANNEL_DATA = [
  { name: "WhatsApp", leads: 350, color: "#8b5cf6" },
  { name: "Instagram", leads: 180, color: "#a78bfa" },
  { name: "Site", leads: 120, color: "#c084fc" },
];

export function AnalyticsView() {
  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Análise de Performance e BI</h1>
        <p className="text-gray-500 text-sm">
          Acompanhe métricas vitais e dados estratégicos em tempo real.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* KPI 1 */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">Custo por Lead (CPL)</p>
            <h3 className="text-2xl font-bold text-gray-900">R$ 14,20</h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center mt-0.5">
              - 12% em relação ao mês anterior
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">Lifetime Value (LTV)</p>
            <h3 className="text-2xl font-bold text-gray-900">R$ 4.800,00</h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center mt-0.5">
              + 8.5% de retenção média
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">Tempo Médio de Fechamento</p>
            <h3 className="text-2xl font-bold text-gray-900">6.2 dias</h3>
            <span className="text-[10px] text-indigo-500 font-bold flex items-center mt-0.5">
              Ideal para ciclos B2B complexos
            </span>
          </div>
        </div>

      </div>

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico 1: Evolução da Receita */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Evolução de Receita Mensal</h3>
            <p className="text-xs text-gray-400 mt-0.5">Faturamento comercial acumulado de novos contratos (R$)</p>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="receita" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReceita)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Canais de Leads */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Leads Gerados por Canal</h3>
            <p className="text-xs text-gray-400 mt-0.5">Quantidade de oportunidades qualificadas por canal de marketing</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LEADS_CHANNEL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="leads" radius={[8, 8, 0, 0]} maxBarSize={45}>
                  {LEADS_CHANNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
