import React, { useState } from "react";
import { Search, HelpCircle, ChevronDown, ChevronUp, LifeBuoy, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Como funciona o gatilho automático de WhatsApp?",
    answer: "Toda vez que você move um card de Lead para a coluna 'Proposta / Orçamento', o sistema dispara em background uma requisição para o gateway da Green API contendo a mensagem dinâmica com o nome do cliente. Certifique-se de manter as credenciais ativas na aba Integrações.",
  },
  {
    question: "Onde ficam armazenados os tokens da Green API?",
    answer: "Todos os tokens (Instance ID, API Token e Gateway URL) são salvos de forma criptografada diretamente no localStorage do seu navegador. Isso garante privacidade absoluta sem armazenamento de chaves sensíveis em nossos servidores de banco.",
  },
  {
    question: "Como o isolamento de dados RLS me protege contra invasões?",
    answer: "Utilizamos o Row Level Security nativo do PostgreSQL (via Supabase). Isso significa que as consultas ao banco são vinculadas de forma inquebrável ao seu auth.uid(). Mesmo que alguém saiba o ID de um lead de outro usuário, a API do Supabase bloqueará qualquer tentativa de visualização ou edição.",
  },
  {
    question: "Posso adicionar novos campos e colunas no meu funil?",
    answer: "Sim! Na aba Configurações, no painel 'Etapas do Funil', você tem total flexibilidade para criar, reordenar ou remover as etapas do seu pipeline. A visualização do Kanban se adaptará dinamicamente.",
  },
  {
    question: "Qual o limite de disparos diários pelo WhatsApp?",
    answer: "O limite de mensagens depende exclusivamente da classificação e do aquecimento do seu número de WhatsApp junto à Meta e à infraestrutura da Green API. Recomendamos seguir as boas práticas para evitar bloqueios.",
  },
];

export function HelpView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      
      {/* Top Banner Search */}
      <div className="text-center max-w-xl mx-auto mt-6 mb-12">
        <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-100 text-violet-600 shadow-sm">
          <LifeBuoy className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Como podemos ajudar?</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Busque tutoriais completos, documentações ou tire dúvidas rápidas sobre o CRM.
        </p>
        
        {/* Big Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busque tutoriais ou artigos de suporte..."
            className="pl-12 h-12 bg-white border-gray-200 rounded-2xl focus-visible:ring-violet-500 text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Main Container FAQ + Humanized Support */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        {/* Left Side: FAQ Accordions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Perguntas Frequentes</h3>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-xs text-gray-800 hover:text-violet-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-violet-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-gray-400 bg-white border border-gray-100 rounded-2xl">
                Nenhuma dúvida FAQ correspondente encontrada.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Human Support Card */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-fit lg:sticky lg:top-8">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Suporte Humanizado</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Não encontrou o que precisava? Nossa equipe técnica está de plantão para te ajudar com conexões API ou qualquer bug.
            </p>
          </div>

          <Button className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md font-semibold transition-all flex items-center justify-center gap-2 group">
            Abrir Chamado
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

      </div>

    </div>
  );
}
