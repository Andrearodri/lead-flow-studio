import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../Sidebar';

describe('Sidebar Component', () => {
  it('renders core navigation categories and menu items', () => {
    const onSelect = vi.fn();
    render(<Sidebar active="kanban" onSelect={onSelect} />);

    expect(screen.getByText('Menu Principal')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Mensagens')).toBeInTheDocument();
  });

  it('calls onSelect when a menu item is clicked', () => {
    const onSelect = vi.fn();
    render(<Sidebar active="kanban" onSelect={onSelect} />);

    const dashboardBtn = screen.getByText('Dashboard');
    fireEvent.click(dashboardBtn);

    expect(onSelect).toHaveBeenCalledWith('dashboard');
  });

  it('navigates to plans view when Upgrade Card is clicked', () => {
    const onSelect = vi.fn();
    render(<Sidebar active="kanban" onSelect={onSelect} />);

    const upgradeCard = screen.getByText('Faça o upgrade');
    fireEvent.click(upgradeCard);

    expect(onSelect).toHaveBeenCalledWith('plans');
  });

  it('renders logout button and triggers onLogout callback', () => {
    const onSelect = vi.fn();
    const onLogout = vi.fn();
    render(<Sidebar active="kanban" onSelect={onSelect} onLogout={onLogout} />);

    const logoutBtn = screen.getByTitle('Sair da Conta');
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
