import React from "react";
import { MessageSquare, Star, Smile, Meh, Frown } from "lucide-react";
import { cn } from "@/lib/utils";

const FEEDBACKS = [
  {
    id: "1",
    client: "Juliana Pereira",
    company: "Pereira Imóveis",
    score: 10,
    comment: "A automação de WhatsApp salvou nosso tempo! A velocidade de triagem de leads triplicou desde o primeiro dia de setup.",
    date: "Hoje",
  },
  {
    id: "2",
    client: "Ricardo Gomes",
    company: "Gomes Advocacia",
    score: 9,
    comment: "A segurança e o isolamento de dados são impressionantes. Excelente ferramenta para gerenciar a privacidade das propostas comerciais.",
    date: "Ontem",
  },
  {
    id: "3",
    client: "Carlos Henrique",
    company: "TechStore B2B",
    score: 8,
    comment: "Muito prático o painel Kanban! Gostaríamos apenas de ver mais opções prontas de e-mail marketing integradas no futuro.",
    date: "3 dias atrás",
  },
  {
    id: "4",
    client: "Mariana Costa",
    company: "Estética Premium",
    score: 5,
    comment: "O onboarding demorou um pouco mais do que o esperado por conta de configurações de domínio, mas o software é extremamente estável.",
    date: "1 semana atrás",
  },
];

export function FeedbackView() {
  // NPS Score metrics
  const total = FEEDBACKS.length;
  const promoters = FEEDBACKS.filter((f) => f.score >= 9).length;
  const detractors = FEEDBACKS.filter((f) => f.score <= 6).length;
  const npsScore = Math.round(((promoters - detractors) / total) * 100);

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Voz do Cliente (NPS)</h1>
          <p className="text-gray-500 text-sm">
            Monitore o nível de satisfação (Net Promoter Score) e feedbacks diretos dos clientes.
          </p>
        </div>

        {/* NPS Highlight Board */}
        <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-black">
            NPS
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Índice Geral</p>
            <h4 className="text-lg font-black text-gray-900">
              {npsScore > 0 ? `+${npsScore}` : npsScore}
            </h4>
          </div>
        </div>
      </div>

      {/* Grid of Feedbacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEEDBACKS.map((feedback) => {
          const isPromoter = feedback.score >= 9;
          const isPassive = feedback.score >= 7 && feedback.score <= 8;
          const isDetractor = feedback.score <= 6;

          return (
            <div
              key={feedback.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Top Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isPromoter && <Smile className="w-5 h-5 text-emerald-500" />}
                    {isPassive && <Meh className="w-5 h-5 text-amber-500" />}
                    {isDetractor && <Frown className="w-5 h-5 text-rose-500" />}
                    
                    <span className="text-xs text-gray-400 font-medium">Avaliado em {feedback.date}</span>
                  </div>

                  {/* Rating Badge */}
                  <span
                    className={cn(
                      "text-xs font-extrabold px-3 py-1 rounded-xl shadow-inner",
                      isPromoter && "bg-emerald-50 text-emerald-600 border border-emerald-100",
                      isPassive && "bg-amber-50 text-amber-600 border border-amber-100",
                      isDetractor && "bg-rose-50 text-rose-600 border border-rose-100"
                    )}
                  >
                    Nota {feedback.score}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-[13px] text-gray-600 italic font-medium leading-relaxed mb-6">
                  "{feedback.comment}"
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="border-t border-gray-50 pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs">
                  {feedback.client.substring(0, 1)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-none">{feedback.client}</h4>
                  <span className="text-[10px] text-gray-400 font-medium">{feedback.company}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
