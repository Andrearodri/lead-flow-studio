export interface SendMessageParams {
  phone: string;
  message: string;
  instanceId?: string;
  apiToken?: string;
}

export const whatsappService = {
  isDemo(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem("crm_demo_mode") === "true";
  },

  /**
   * Envia uma mensagem via WhatsApp usando o gateway Green API.
   */
  async sendWhatsAppMessage({ phone, message, instanceId, apiToken }: SendMessageParams) {
    if (this.isDemo()) {
      // Simular latência de rede de 800ms
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(`[SIMULADO] WhatsApp enviado para ${phone}: ${message}`);
      return { sent: true, demo: true };
    }

    try {
      // Obter credenciais (ou das props, ou do LocalStorage)
      const creds = this.getCredentials();
      const finalInstanceId = instanceId || creds.instanceId;
      const finalApiToken = apiToken || creds.apiToken;

      if (!finalInstanceId || !finalApiToken) {
        throw new Error("Credenciais do WhatsApp (Instance ID e API Token) não configuradas. Verifique a aba Integrações.");
      }

      // 1. Limpar telefone (remover tudo que não é número)
      let cleanPhone = phone.replace(/\D/g, "");

      // 2. Garantir o DDI 55 (Brasil) caso não tenha e o número pareça ser local
      if (cleanPhone.length === 10 || cleanPhone.length === 11) {
        cleanPhone = `55${cleanPhone}`;
      }

      // 3. Formatar o chatId padrão da Green API
      const chatId = `${cleanPhone}@c.us`;

      console.log('Disparando API para:', chatId);

      // 4. Montar a URL da Green API
      const url = `https://api.green-api.com/waInstance${finalInstanceId}/sendMessage/${finalApiToken}`;

      // 5. Executar a requisição HTTP POST
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Erro na API (${response.status}): ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("Mensagem WhatsApp enviada com sucesso!", result);
      return result;
    } catch (error) {
      console.error("Falha ao disparar WhatsApp via Green API:", error);
      throw error;
    }
  },

  /**
   * Pega as credenciais ativas armazenadas no LocalStorage
   */
  getCredentials() {
    const instanceId = localStorage.getItem("wa_instance_id") || "";
    const apiToken = localStorage.getItem("wa_api_token") || "";
    const gatewayUrl = localStorage.getItem("wa_gateway_url") || "";

    return { instanceId, apiToken, gatewayUrl };
  }
};
