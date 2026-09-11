import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Auth } from '../Auth';

describe('Auth Component', () => {
  it('renders login form with title and email input', () => {
    render(<Auth />);

    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digitar senha...')).toBeInTheDocument();
  });

  it('allows switching between login and registration views', () => {
    render(<Auth />);

    const switchBtn = screen.getByText(/Criar conta grátis/i);
    fireEvent.click(switchBtn);

    expect(screen.getByText('Crie sua conta no CRM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar-se agora/i })).toBeInTheDocument();
  });

  it('triggers onDemoLogin callback when demo button is clicked', () => {
    const onDemoLogin = vi.fn();
    render(<Auth onDemoLogin={onDemoLogin} />);

    const demoBtn = screen.getByRole('button', { name: /Visualizar demonstração/i });
    fireEvent.click(demoBtn);

    expect(onDemoLogin).toHaveBeenCalledTimes(1);
  });
});
