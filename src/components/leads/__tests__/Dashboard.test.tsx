import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../Dashboard';
import { type Lead } from '../mock-data';

const sampleLeads: Lead[] = [
  { id: '1', nome: 'Ana Lima', telefone: '+5511999990001', servico: 'Consultoria', esperaMin: 10, status: 'novos', iniciais: 'AL', valorEstimado: 3000 },
  { id: '2', nome: 'Bruno Costa', telefone: '+5511999990002', servico: 'Orçamento', esperaMin: 30, status: 'fechado', iniciais: 'BC', valorEstimado: 7500 },
];

describe('Dashboard Component', () => {
  it('renders overall metrics KPIs correctly', () => {
    render(<Dashboard leads={sampleLeads} />);

    expect(screen.getByText('Visão Geral')).toBeInTheDocument();
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Receita Fechada')).toBeInTheDocument();
    expect(screen.getByText('R$ 7,5K')).toBeInTheDocument();
  });

  it('triggers onNavigateToKanban callback when Ver Detalhes is clicked', () => {
    const onNavigateToKanban = vi.fn();
    render(<Dashboard leads={sampleLeads} onNavigateToKanban={onNavigateToKanban} />);

    const detailsBtn = screen.getByText('Ver Detalhes');
    fireEvent.click(detailsBtn);

    expect(onNavigateToKanban).toHaveBeenCalledTimes(1);
  });

  it('renders recent activity section', () => {
    render(<Dashboard leads={sampleLeads} />);

    expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
    expect(screen.getByText('Ana Lima')).toBeInTheDocument();
    expect(screen.getByText('Bruno Costa')).toBeInTheDocument();
  });
});
