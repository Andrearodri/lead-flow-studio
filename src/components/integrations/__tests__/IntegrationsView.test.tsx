import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { IntegrationsView } from '../IntegrationsView';

describe('IntegrationsView Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Conexão WhatsApp title and connection status card', () => {
    render(<IntegrationsView />);

    expect(screen.getByText('Conexão WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Status da Sessão')).toBeInTheDocument();
    expect(screen.getByText('Desconectado')).toBeInTheDocument();
  });

  it('allows saving WhatsApp API gateway credentials to localStorage', () => {
    render(<IntegrationsView />);

    const instanceInput = screen.getByPlaceholderText('my-instance-123');
    const tokenInput = screen.getByPlaceholderText('••••••••••••••••••••••••');
    const saveBtn = screen.getByRole('button', { name: /Salvar Credenciais/i });

    fireEvent.change(instanceInput, { target: { value: 'instancia-123' } });
    fireEvent.change(tokenInput, { target: { value: 'token-abc' } });
    fireEvent.click(saveBtn);

    expect(localStorage.getItem('wa_instance_id')).toBe('instancia-123');
    expect(localStorage.getItem('wa_api_token')).toBe('token-abc');
    expect(screen.getByText('Conectado')).toBeInTheDocument();
  });

  it('shows connected status immediately if credentials exist in localStorage', () => {
    localStorage.setItem('wa_instance_id', 'inst-99');
    localStorage.setItem('wa_api_token', 'tok-99');

    render(<IntegrationsView />);
    expect(screen.getByText('Conectado')).toBeInTheDocument();
  });
});
