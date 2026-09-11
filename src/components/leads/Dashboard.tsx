import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import type { Lead } from './mock-data';
import { useFunnelColumns } from '@/hooks/useFunnelColumns';
import { useTags } from '@/hooks/useTags';
import { Users, Clock, Percent, DollarSign, TrendingUp, TrendingDown, Activity, ArrowRight, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const VIOLET_COLOR = '#8b5cf6'; // violet-500
const INDIGO_COLOR = '#6366f1'; // indigo-500
const VIOLET_LIGHT = '#c4b5fd'; // violet-300
const PALETTE = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatCompactBRL = (value: number) => {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(1).replace('.', ',')}K`;
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

const formatWaitTime = (mins: number) => {
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  return `${hours}h`;
};

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-lg text-sm z-50 min-w-[150px]">
        <p className="text-gray-500 mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-900 font-medium">
              {entry.name}: <span className="font-bold">{formatter ? formatter(entry.value) : entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

import { toast } from 'sonner';

interface DashboardProps {
  leads?: Lead[];
  onNavigateToKanban?: () => void;
}

export function Dashboard({ leads = [], onNavigateToKanban }: DashboardProps) {

  const columns = useFunnelColumns();
  const availableTags = useTags();
  const safeLeads = leads || [];
  
  // KPIs
  const totalLeads = safeLeads.length;
  const lastCol = columns.length > 0 ? columns[columns.length - 1] : null;
  
  const closedLeadsList = lastCol ? safeLeads.filter(l => l.status === lastCol.id) : [];
  const closedRevenue = closedLeadsList.reduce((acc, l) => acc + (l.valorEstimado || 0), 0);
  
  const conversionRate = totalLeads > 0 ? (closedLeadsList.length / totalLeads) * 100 : 0;
  
  const avgWaitTime = safeLeads.length > 0 
    ? Math.floor(safeLeads.reduce((acc, l) => acc + l.esperaMin, 0) / safeLeads.length)
    : 0;

  // Chart 1: Receita Estimada por Serviço (Main BarChart)
  const revenueByService = useMemo(() => {
    const map = new Map<string, number>();
    safeLeads.forEach(l => {
      const srv = l.servico || 'Outros';
      map.set(srv, (map.get(srv) || 0) + (l.valorEstimado || 0));
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [safeLeads]);

  // Chart 2: Leads por Etapa do Funil (Horizontal BarChart)
  const funnelData = useMemo(() => {
    return columns.map(col => ({
      name: col.title,
      value: safeLeads.filter(l => l.status === col.id).length
    })).reverse(); // Horizontal charts usually look better reversed or sorted
  }, [columns, safeLeads]);

  // Chart 3: Leads por Etiqueta/Serviço (Donut)
  const tagDistributionData = useMemo(() => {
    const map = new Map<string, number>();
    safeLeads.forEach(lead => {
      if (lead.tags && lead.tags.length > 0) {
        lead.tags.forEach(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          const tagName = tag ? tag.name : "Tag Removida";
          map.set(tagName, (map.get(tagName) || 0) + 1);
        });
      } else {
        const srv = lead.servico || 'Sem Etiqueta';
        map.set(srv, (map.get(srv) || 0) + 1);
      }
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [safeLeads, availableTags]);

  // Recent Activity Mock
  const recentActivity = useMemo(() => {
    return safeLeads
      .slice()
      .sort((a, b) => a.esperaMin - b.esperaMin)
      .slice(0, 4)
      .map(l => ({
        id: l.id,
        nome: l.nome,
        statusTitle: columns.find(c => c.id === l.status)?.title || 'Novo',
        timeAgo: formatDistanceToNow(new Date(Date.now() - l.esperaMin * 60000), { locale: ptBR, addSuffix: true }),
        iniciais: l.iniciais
      }));
  }, [safeLeads, columns]);

  // Retention Rate Mock (Stacked Vertical Bar)
  const retentionData = useMemo(() => [
    { name: 'Jun', active: 65, lost: 35 },
    { name: 'Jul', active: 72, lost: 38 },
    { name: 'Ago', active: 85, lost: 35 },
    { name: 'Set', active: 95, lost: 35 },
  ], []);

  const KpiCard = ({ title, value, icon: Icon, trend, isPositive }: any) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col flex-1 min-w-[200px] transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-violet-50 rounded-xl">
          <Icon className="w-4 h-4 text-violet-600" />
        </div>
      </div>
      <div className="text-3xl font-semibold text-gray-900 mb-2">{value}</div>
      {trend && (
        <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md w-fit
          ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      )}
    </div>
  );

  const CardWrapper = ({ title, action, children, noHeader }: any) => (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      {!noHeader && (title || action) && (
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {action && (
            <div className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors cursor-pointer">
              {action}
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Visão Geral</h1>
        <p className="text-gray-500 text-sm">
          Acompanhe suas métricas de vendas e performance da equipe.
        </p>
      </div>

      {/* KPIS */}
      <div className="flex flex-wrap gap-5 mb-8">
        <KpiCard title="Total Leads" value={totalLeads} icon={Users} trend="+12% vs last week" isPositive={true} />
        <KpiCard title="Tempo Médio" value={formatWaitTime(avgWaitTime)} icon={Clock} trend="-4% vs last week" isPositive={true} />
        <KpiCard title="Taxa de Conversão" value={`${conversionRate.toFixed(1)}%`} icon={Percent} trend="+2.4% vs last week" isPositive={true} />
        <KpiCard title="Receita Fechada" value={formatCompactBRL(closedRevenue)} icon={DollarSign} trend="+18% vs last month" isPositive={true} />
      </div>

      {/* ROW 2: MAIN CHART & CALENDAR WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* MAIN CHART */}
        <div className="lg:col-span-2 h-[420px]">
          <CardWrapper title="Receita por Serviço">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByService} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={formatCompactBRL} />
                <RechartsTooltip content={<CustomTooltip formatter={formatBRL} />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" name="Receita" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {revenueByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? VIOLET_COLOR : INDIGO_COLOR} fillOpacity={index === 0 ? 1 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardWrapper>
        </div>

        {/* CALENDAR & UPCOMING (Atividade Recente) */}
        <div className="lg:col-span-1 h-[420px]">
          <CardWrapper noHeader>
             {/* Header */}
             <div className="flex items-center justify-between mb-4 shrink-0">
               <span className="text-base font-semibold text-gray-900">Agenda</span>
               <button className="p-1 hover:bg-gray-50 rounded"><MoreHorizontal className="w-5 h-5 text-gray-400" /></button>
             </div>
             
             {/* Calendar Strip */}
             {(() => {
               const currentDate = new Date();
               const currentDay = currentDate.getDate();
               const monthNames = [
                 "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                 "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
               ];
               const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

               // Generate the 7 days of the current week starting from Sunday
               const startOfWeek = new Date(currentDate);
               startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

               const weekDays = Array.from({ length: 7 }).map((_, i) => {
                 const d = new Date(startOfWeek);
                 d.setDate(startOfWeek.getDate() + i);
                 return {
                   dayName: d.toLocaleDateString("pt-BR", { weekday: "short" }).substring(0, 2),
                   dayNum: d.getDate(),
                   isToday: d.getDate() === currentDay && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
                 };
               });

               return (
                 <>
                   <div className="flex items-center justify-between text-sm font-medium text-gray-900 mb-4 shrink-0">
                     <button className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
                     <span className="capitalize font-bold">{currentMonthYear}</span>
                     <button className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
                   </div>
                   <div className="grid grid-cols-7 gap-1 text-center mb-5 shrink-0">
                      {weekDays.map((wd, i) => (
                        <span key={i} className="text-xs text-gray-400 font-medium capitalize">{wd.dayName}</span>
                      ))}
                      
                      {weekDays.map((wd, i) => (
                        <div key={i} className="mt-2 text-center flex items-center justify-center">
                          {wd.isToday ? (
                            <span className="text-xs bg-violet-600 text-white font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md shadow-violet-500/30">
                              {wd.dayNum}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-700 font-medium w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
                              {wd.dayNum}
                            </span>
                          )}
                        </div>
                      ))}
                   </div>
                 </>
               );
             })()}

             {/* Upcoming Items */}
             <div className="border-t border-gray-100 pt-4 mb-3 shrink-0 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Atividade Recente</span>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3 min-h-0">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, i) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-semibold flex items-center justify-center shrink-0 text-xs">
                          {activity.iniciais}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {activity.nome}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                            {activity.statusTitle} • {activity.timeAgo}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-300 shrink-0 ml-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">Nenhuma atividade.</div>
                )}
             </div>
          </CardWrapper>
        </div>

      </div>

      {/* ROW 3: LEADS MANAGEMENT & RETENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEADS MANAGEMENT (Span 2) */}
        <div className="lg:col-span-2 h-[380px]">
          <CardWrapper
            title="Gestão de Leads"
            action={
              <button
                onClick={() => onNavigateToKanban ? onNavigateToKanban() : toast.info("Navegando para Clientes/Leads...")}
                className="flex items-center gap-1 hover:text-violet-700 transition-colors cursor-pointer font-medium"
              >
                Ver Detalhes <ArrowRight className="w-3 h-3"/>
              </button>
            }
          >
            <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
              
              {/* Horizontal Bar Chart (Funil) */}
              <div className="flex-1 h-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }} width={100} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]} barSize={24}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={VIOLET_COLOR} fillOpacity={0.9 - (index * 0.15)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Donut Chart (Distribuição) */}
              <div className="flex-1 h-full min-h-[150px] border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="80%"
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {tagDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute positioning for a minimal legend overlay if needed, but Recharts Legend is okay. Custom simple legend: */}
                  <div className="absolute bottom-0 w-full flex flex-wrap justify-center gap-3">
                     {tagDistributionData.slice(0,3).map((entry, index) => (
                       <div key={index} className="flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PALETTE[index % PALETTE.length] }} />
                         <span className="text-[10px] text-gray-500 font-medium">{entry.name}</span>
                       </div>
                     ))}
                  </div>
              </div>

            </div>
          </CardWrapper>
        </div>

        {/* RETENTION RATE (Span 1) */}
        <div className="lg:col-span-1 h-[380px]">
          <CardWrapper title="Taxa de Retenção" action={<MoreHorizontal className="w-4 h-4 text-gray-400" />}>
             <div className="mb-6 shrink-0">
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">95%</h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mb-1">+12% vs last month</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Comparativo de conversão por mês</p>
             </div>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={retentionData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                    {/* Darker bar for active on bottom */}
                    <Bar dataKey="active" name="Conversão" fill={VIOLET_COLOR} radius={[0, 0, 0, 0]} stackId="a" barSize={32} />
                    {/* Lighter bar for lost on top */}
                    <Bar dataKey="lost" name="Perdas" fill={VIOLET_LIGHT} radius={[4, 4, 0, 0]} stackId="a" barSize={32} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <div className="flex items-center justify-center gap-4 mt-4 shrink-0">
               <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-violet-500"></span><span className="text-xs font-medium text-gray-500">Conversão</span></div>
               <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-violet-300"></span><span className="text-xs font-medium text-gray-500">Perdas</span></div>
             </div>
          </CardWrapper>
        </div>

      </div>

    </div>
  );
}
