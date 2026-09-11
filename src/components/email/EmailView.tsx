import React, { useState } from "react";
import { Inbox, Send, FileText, Megaphone, Plus, Search, Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MOCK_MAILS = [
  { id: "1", subject: "Campanha de onboarding demo", sender: "marketing@example.com", date: "Hoje, 10:45", preview: "Olá! Seja bem-vindo à demonstração do Lead Flow Studio...", type: "campanhas" },
  { id: "2", subject: "Feedback sobre a demonstração", sender: "contato@example.com", date: "Ontem, 16:30", preview: "A experiência do Kanban ajudou a visualizar o funil?", type: "entrada" },
  { id: "3", subject: "Rascunho: follow-up demo", sender: "demo@lead-flow.example", date: "15 Mai", preview: "Olá, gostaria de agendar uma conversa sobre o projeto...", type: "rascunhos" },
  { id: "4", subject: "Aviso de exemplo", sender: "financeiro@example.com", date: "12 Mai", preview: "Este conteúdo é apenas uma mensagem fictícia da vitrine...", type: "enviados" },
];

export function EmailView() {
  const [activeFolder, setActiveFolder] = useState("entrada");
  const [selectedMail, setSelectedMail] = useState<any>(MOCK_MAILS[1]);
  const [searchQuery, setSearchQuery] = useState("");

  const folders = [
    { id: "entrada", label: "Caixa de Entrada", icon: Inbox, count: 12 },
    { id: "enviados", label: "Enviados", icon: Send },
    { id: "rascunhos", label: "Rascunhos", icon: FileText, count: 2 },
    { id: "campanhas", label: "Campanhas B2B", icon: Megaphone, count: 5 },
  ];

  const filteredMails = MOCK_MAILS.filter(
    (m) => m.type === activeFolder && 
    (m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
     m.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestão de E-mails e Campanhas</h1>
          <p className="text-xs text-gray-400 mt-0.5">Centralize a régua de comunicação com seus leads.</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold px-4 h-10">
          <Plus className="w-4 h-4 mr-1.5" />
          Nova Campanha
        </Button>
      </div>

      {/* Main Mail Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Folder Navigation */}
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-4 shrink-0 overflow-y-auto">
          <nav className="space-y-1">
            {folders.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={cn(
                    "flex items-center w-full px-4 py-3 rounded-xl text-xs font-semibold transition-colors",
                    isActive 
                      ? "bg-violet-50 text-violet-600" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span>{folder.label}</span>
                  {folder.count && (
                    <span className={cn(
                      "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md",
                      isActive ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-400"
                    )}>
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Center List / Right Detail Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Mails List Column */}
          <div className="w-[380px] border-r border-gray-100 flex flex-col shrink-0 bg-white overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar mensagens..."
                  className="pl-9 h-10 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-xs"
                />
              </div>
            </div>

            {/* Scrollable mail list */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filteredMails.length > 0 ? (
                filteredMails.map((mail) => (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedMail(mail)}
                    className={cn(
                      "w-full text-left p-5 transition-colors flex flex-col gap-1.5",
                      selectedMail?.id === mail.id ? "bg-violet-50/30 border-l-2 border-violet-500" : "hover:bg-gray-50/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-violet-600 truncate max-w-[180px]">{mail.sender}</span>
                      <span className="text-[10px] text-gray-400">{mail.date}</span>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 truncate">{mail.subject}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{mail.preview}</p>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-gray-400">
                  Nenhum e-mail nesta pasta.
                </div>
              )}
            </div>
          </div>

          {/* Mail Details View */}
          <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
            {selectedMail ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
                <div className="border-b border-gray-100 pb-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-violet-600 font-semibold px-3 py-1 bg-violet-50 rounded-lg">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedMail.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{selectedMail.date}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-gray-900 mb-2">{selectedMail.subject}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">De:</span>
                    <span className="text-xs font-semibold text-gray-700">{selectedMail.sender}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 leading-relaxed space-y-4">
                  <p>Prezado Cliente,</p>
                  <p>{selectedMail.preview}</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pulvinar accumsan elit, non dignissim eros posuere sed. Proin et pulvinar nisl. Duis cursus, leo in elementum interdum, dolor leo interdum ipsum, id finibus felis est a ex.</p>
                  <p>Atenciosamente,<br/><span className="font-bold text-gray-900">Equipe de Suporte e Automação</span></p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div className="max-w-xs">
                  <Eye className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900">Nenhuma mensagem selecionada</h3>
                  <p className="text-xs text-gray-400 mt-1">Selecione um e-mail na lista da esquerda para ver os detalhes completos.</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
