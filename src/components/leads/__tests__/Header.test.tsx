import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../Header';

describe('Header Component', () => {
  it('renders title, search input, and action buttons', () => {
    render(<Header searchQuery="" onSearchChange={vi.fn()} />);

    expect(screen.getByText(/Lead Flow Studio — CRM Demo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Pesquisar contatos/i)).toBeInTheDocument();
  });

  it('triggers search input change callback', () => {
    const onSearchChange = vi.fn();
    render(<Header searchQuery="" onSearchChange={onSearchChange} />);

    const searchInput = screen.getByPlaceholderText(/Pesquisar contatos/i);
    fireEvent.change(searchInput, { target: { value: 'Maria' } });

    expect(onSearchChange).toHaveBeenCalledWith('Maria');
  });

  it('opens Novo Lead modal when Novo Lead button is clicked', () => {
    render(<Header />);

    const newLeadBtn = screen.getByRole('button', { name: /Novo Lead/i });
    fireEvent.click(newLeadBtn);

    expect(screen.getByText('Nome do Contato')).toBeInTheDocument();
    expect(screen.getByText('Número do WhatsApp')).toBeInTheDocument();
  });

  it('renders mobile menu trigger button', () => {
    render(<Header />);
    const menuBtn = screen.getByLabelText('Abrir menu de navegação');
    expect(menuBtn).toBeInTheDocument();
  });
});
