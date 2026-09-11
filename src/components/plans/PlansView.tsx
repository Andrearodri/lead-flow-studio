import React from "react";
import { Plus, Check, Edit3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "1",
    name: "Setup Básico WhatsApp",
    price: "R$ 1.500,00",
    billing: "Taxa Única",
    popular: false,
    features: [
      "Integração com 1 Instância de API",
      "Template de Mensagem de Boas-vindas",
      "Kanban de Organização Simples",
      "Suporte via Central de Ajuda",
    ],
  },
  {
    id: "2",
    name: "Consultoria Premium & Automações",
    price: "R$ 3.000,00",
    billing: "Cobrança Mensal",
    popular: true,
    features: [
      "Tudo do plano Setup Básico",
      "Até 3 Instâncias ativas em paralelo",
      "Gatilhos IFTTT integrados ao Kanban",
      "Suporte via e-mail e chat prioritário",
      "Isolamento Multi-Tenant com RLS de alta segurança",
    ],
  },
  {
    id: "3",
    name: "CRM SaaS White-label Enterprise",
    price: "R$ 499,00",
    billing: "Mensalidade Recorrente",
    popular: false,
    features: [
      "Instâncias ilimitadas do WhatsApp",
      "Dashboard analítico completo com BI",
      "Integração nativa de e-mail corporativo",
      "Acesso à API restrita para desenvolvedores",
      "SLA de suporte de até 4 horas úteis",
    ],
  },
];

export function PlansView() {
  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Planos e Pacotes de Serviços</h1>
          <p className="text-gray-500 text-sm">
            Estruture suas tabelas de preço para propostas B2B rápidas e eficientes.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors rounded-xl font-medium px-4">
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between relative transition-all duration-200 hover:shadow-md
              ${plan.popular ? "border-violet-500 ring-2 ring-violet-500/10 scale-105 md:-translate-y-2" : "border-gray-100"}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-[10px] font-extrabold px-3 py-1 rounded-full bg-violet-600 text-white shadow-sm uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Mais Vendido
              </span>
            )}

            <div>
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-base font-extrabold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-black text-gray-950">{plan.price}</span>
                  <span className="text-xs text-gray-400 font-semibold">/{plan.billing}</span>
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-4.5 h-4.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span className="text-xs text-gray-600 leading-relaxed font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Footer */}
            <Button
              variant={plan.popular ? "default" : "outline"}
              className={`w-full h-11 rounded-2xl font-bold text-xs gap-1.5 transition-all
                ${plan.popular ? "bg-violet-600 hover:bg-violet-700 text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Plano
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
