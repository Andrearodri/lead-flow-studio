import React, { useState, useEffect } from "react";
import { QrCode, RefreshCw, XCircle, CheckCircle2, Smartphone, ShieldCheck, KeyRound, Link2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function IntegrationsView() {
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Formulário State
  const [gatewayUrl, setGatewayUrl] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [apiToken, setApiToken] = useState("");

  useEffect(() => {
    // Carregar credenciais salvas
    const savedInstance = localStorage.getItem("wa_instance_id");
    const savedToken = localStorage.getItem("wa_api_token");
    const savedUrl = localStorage.getItem("wa_gateway_url");

    if (savedInstance) setInstanceId(savedInstance);
    if (savedToken) setApiToken(savedToken);
    if (savedUrl) setGatewayUrl(savedUrl);

    // Se tiver as principais chaves da Green API, assume conectado
    if (savedInstance && savedToken) {
      setIsConnected(true);
    }
  }, []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("wa_instance_id", instanceId);
    localStorage.setItem("wa_api_token", apiToken);
    localStorage.setItem("wa_gateway_url", gatewayUrl);
    
    setIsConnected(true);
  };

  const handleGenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="h-full bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Conexão WhatsApp</h1>
        <p className="text-gray-500 text-sm">
          Gerencie a integração da API do WhatsApp para envios em background.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Connection Status & QR Code */}
        <div className="flex flex-col gap-6">
          {/* Status Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Status da Sessão</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Instância Principal</span>
              </div>
              {isConnected ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold border border-emerald-100 transition-all">
                  <CheckCircle2 className="w-4 h-4" />
                  Conectado
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-semibold border border-rose-100 transition-all">
                  <XCircle className="w-4 h-4" />
                  Desconectado
                </div>
              )}
            </div>
          </div>

          {/* QR Code Connect (Show only if disconnected) */}
          {!isConnected && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-52 h-52 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mb-6 relative shadow-inner">
                {isGenerating ? (
                   <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                ) : (
                   <QrCode className="w-28 h-28 text-gray-300/80" strokeWidth={1} />
                )}
              </div>
              
              <Button 
                onClick={handleGenerateQR}
                disabled={isGenerating}
                className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm rounded-xl px-6 w-full max-w-[240px] mb-8 font-medium"
              >
                {isGenerating ? "Gerando..." : "Gerar Novo QR Code"}
              </Button>

              <div className="w-full text-left bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-500" />
                  Como conectar:
                </h3>
                <ol className="text-sm text-gray-600 space-y-3 ml-1">
                  <li className="flex items-start gap-2"><span className="font-bold text-gray-900">1.</span> Abra o WhatsApp no seu celular</li>
                  <li className="flex items-start gap-2"><span className="font-bold text-gray-900">2.</span> Toque em <b>Aparelhos Conectados</b></li>
                  <li className="flex items-start gap-2"><span className="font-bold text-gray-900">3.</span> Aponte a câmera para esta tela</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Advanced API Gateway Configuration */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-gray-400" />
              API Gateway 
            </h2>
            <p className="text-[13px] text-gray-500 mb-6">
              Configure as credenciais da Evolution API, Z-API ou similar para conexão externa.
            </p>

            <form className="space-y-5" onSubmit={handleSaveCredentials}>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700 flex items-center gap-2">
                  WhatsApp Gateway URL
                </label>
                <Input 
                  placeholder="https://api.exemplo.com/v1" 
                  value={gatewayUrl}
                  onChange={(e) => setGatewayUrl(e.target.value)}
                  className="h-11 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-[13px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700 flex items-center gap-2">
                  Instance ID
                </label>
                <Input 
                  placeholder="my-instance-123" 
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="h-11 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-[13px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-700 flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5" />
                  API Token / Global API Key
                </label>
                <Input 
                  type="password"
                  placeholder="••••••••••••••••••••••••" 
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="h-11 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-[13px]"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm rounded-xl w-full h-11 font-medium">
                  Salvar Credenciais
                </Button>
              </div>
            </form>
          </div>

          {/* Note about Automation Engine */}
          <div className="bg-violet-50/80 border border-violet-100 rounded-2xl p-5 flex items-start gap-3">
            <div className="p-2 bg-violet-100/80 rounded-xl shrink-0 text-violet-600">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-violet-900 mb-1.5">Motor de Automações Ativado</h4>
              <p className="text-[13px] text-violet-700/80 leading-relaxed">
                Assim que a instância for conectada, as regras criadas na aba <b className="text-violet-800">Automações</b> passarão a disparar mensagens silenciosamente via API em segundo plano, sem abrir novas abas no seu navegador.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
