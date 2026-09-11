import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LeadCard } from '../LeadCard';
import { type Lead } from '../mock-data';

const sampleLead: Lead = {
  id: 'lead-1',
  nome: 'Carlos Oliveira',
  telefone: '+55 11 91234-5678',
  servico: 'Consultoria',
  esperaMin: 15,
  status: 'novos',
  iniciais: 'CO',
  valorEstimado: 4500,
};

describe('LeadCard Component', () => {
  it('renders lead name, initials, phone number, and service badge', () => {
    render(<LeadCard lead={sampleLead} />);

    expect(screen.getByText('Carlos Oliveira')).toBeInTheDocument();
    expect(screen.getByText('CO')).toBeInTheDocument();
    expect(screen.getByText('+55 11 91234-5678')).toBeInTheDocument();
    expect(screen.getByText('Consultoria')).toBeInTheDocument();
  });

  it('triggers onSelect callback when card is clicked', () => {
    const onSelect = vi.fn();
    render(<LeadCard lead={sampleLead} onSelect={onSelect} />);

    const card = screen.getByText('Carlos Oliveira');
    fireEvent.click(card);

    expect(onSelect).toHaveBeenCalledWith(sampleLead);
  });

  it('displays idle alert badge when lead is waiting for > 48 hours', () => {
    const idleLead: Lead = {
      ...sampleLead,
      esperaMin: 50 * 60, // 50 hours
    };

    render(<LeadCard lead={idleLead} />);
    expect(screen.getByText(/Parado há 2 dias/i)).toBeInTheDocument();
  });

  it('triggers WhatsApp click handler', () => {
    const onSelect = vi.fn();
    render(<LeadCard lead={sampleLead} onSelect={onSelect} />);

    const waBtn = screen.getByLabelText('Iniciar WhatsApp');
    expect(waBtn).toBeInTheDocument();

    fireEvent.click(waBtn);
    expect(onSelect).toHaveBeenCalledWith(sampleLead);
  });
});
