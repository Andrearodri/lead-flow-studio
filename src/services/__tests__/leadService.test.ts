import { describe, it, expect, beforeEach } from 'vitest';
import { leadService } from '../leadService';
import { type Lead } from '@/components/leads/mock-data';

describe('leadService', () => {
  beforeEach(() => {
    localStorage.clear();
    // Enable demo mode by default for isolated testing
    localStorage.setItem("crm_demo_mode", "true");
  });

  it('fetches initial demo leads list', async () => {
    const leads = await leadService.getLeads();
    expect(Array.isArray(leads)).toBe(true);
    expect(leads.length).toBeGreaterThan(0);
  });

  it('creates a new lead and persists it in demo mode', async () => {
    const newLeadData: Lead = {
      id: 'test-123',
      nome: 'Teste de Lead',
      telefone: '+5511988887777',
      servico: 'Consultoria',
      esperaMin: 5,
      status: 'novos',
      iniciais: 'TL',
    };

    const createdLead = await leadService.createLead(newLeadData);
    expect(createdLead.nome).toBe('Teste de Lead');

    const allLeads = await leadService.getLeads();
    expect(allLeads.some((l) => l.id === createdLead.id)).toBe(true);
  });

  it('updates estimated lead value in demo mode', async () => {
    const leads = await leadService.getLeads();
    const firstLead = leads[0];

    await leadService.updateLeadValue(firstLead.id, 9500);
    const updatedLeads = await leadService.getLeads();
    const updatedLead = updatedLeads.find((l) => l.id === firstLead.id);

    expect(updatedLead?.valorEstimado).toBe(9500);
  });

  it('updates lead status during drag and drop', async () => {
    const leads = await leadService.getLeads();
    const firstLead = leads[0];

    await leadService.updateLeadStatus(firstLead.id, 'qualificando');
    const updatedLeads = await leadService.getLeads();
    const updatedLead = updatedLeads.find((l) => l.id === firstLead.id);

    expect(updatedLead?.status).toBe('qualificando');
  });
});
