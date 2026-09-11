import { describe, it, expect, beforeEach, vi } from 'vitest';
import { whatsappService } from '../whatsappService';

describe('whatsappService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('detects demo mode status', () => {
    expect(whatsappService.isDemo()).toBe(false);
    localStorage.setItem("crm_demo_mode", "true");
    expect(whatsappService.isDemo()).toBe(true);
  });

  it('simulates message sending in demo mode', async () => {
    localStorage.setItem("crm_demo_mode", "true");
    const res = await whatsappService.sendWhatsAppMessage({
      phone: '+55 11 99999-8888',
      message: 'Olá, gostaria de agendar uma consultoria.',
    });

    expect(res.sent).toBe(true);
    expect(res.demo).toBe(true);
  });

  it('retrieves credentials from localStorage', () => {
    localStorage.setItem("wa_instance_id", "12345");
    localStorage.setItem("wa_api_token", "token-abc-789");

    const creds = whatsappService.getCredentials();
    expect(creds.instanceId).toBe("12345");
    expect(creds.apiToken).toBe("token-abc-789");
  });

  it('throws error when credentials are missing in live mode', async () => {
    await expect(
      whatsappService.sendWhatsAppMessage({
        phone: '11999998888',
        message: 'Teste sem credenciais',
      })
    ).rejects.toThrow(/Credenciais do WhatsApp/i);
  });
});
