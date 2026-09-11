import React, { useState } from "react";
import { Package, Plus, Cpu, MessageSquare, Briefcase, Users, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INITIAL_PRODUCTS = [
  {
    id: "1",
    name: "Setup de Automação WhatsApp",
    description: "Construção de fluxos, templates de resposta rápida e conexões API com gateways.",
    price: 1500,
    type: "single", // single | recurring
    icon: MessageSquare,
    active: true,
  },
  {
    id: "2",
    name: "Consultoria Comercial B2B",
    description: "Estruturação de processos comerciais, roteiro de vendas e treinamento de pré-vendas.",
    price: 3000,
    type: "recurring",
    icon: Briefcase,
    active: true,
  },
  {
    id: "3",
    name: "Licenciamento CRM & Integração",
    description: "Acesso total à plataforma SaaS de leads com suporte prioritário e sincronia Supabase.",
    price: 499,
    type: "recurring",
    icon: Cpu,
    active: true,
  },
  {
    id: "4",
    name: "Treinamento & Onboarding de Vendedores",
    description: "Capacitação completa da equipe comercial para utilização correta das ferramentas.",
    price: 2500,
    type: "single",
    icon: Users,
    active: false,
  },
];

export function ProductsView() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    setOpenDropdownId(null);
  };

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Catálogo de Produtos e Serviços</h1>
          <p className="text-gray-500 text-sm">
            Gerencie o portfólio de soluções B2B oferecidas pela sua empresa.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors rounded-xl font-medium px-4">
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <div
              key={product.id}
              className={cn(
                "bg-white border rounded-2xl p-6 shadow-sm relative transition-all duration-200",
                product.active ? "border-gray-100" : "border-gray-100 opacity-60"
              )}
            >
              {/* Card Options Dropdown */}
              <div className="absolute top-5 right-5">
                <button
                  onClick={() => toggleDropdown(product.id)}
                  className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {openDropdownId === product.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10 animate-in fade-in slide-in-from-top-1">
                    <button className="flex items-center w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium gap-2">
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(product.id)}
                      className="flex items-center w-full px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium gap-2 border-t border-gray-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {product.active ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                )}
              </div>

              {/* Icon */}
              <div className={cn(
                "p-3 rounded-xl inline-flex mb-5 shadow-sm",
                product.active ? "bg-violet-50 text-violet-600" : "bg-gray-50 text-gray-400"
              )}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Name and Billing Badge */}
              <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">
                {product.name}
              </h3>
              
              <div className="mb-4">
                {product.type === "recurring" ? (
                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                    Recorrente (Mensal)
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                    Pagamento Único
                  </span>
                )}
              </div>

              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed line-clamp-2">
                {product.description}
              </p>

              {/* Price Tag */}
              <div className="border-t border-gray-50 pt-4 flex items-baseline justify-between">
                <span className="text-xs text-gray-400 font-medium">Valor comercial:</span>
                <span className="text-lg font-extrabold text-gray-900">
                  R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  {product.type === "recurring" && <span className="text-xs font-medium text-gray-400">/mês</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
