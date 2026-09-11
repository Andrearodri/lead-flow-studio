import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { QuickRepliesView } from '../QuickRepliesView';

describe('QuickRepliesView Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("crm_demo_mode", "true");
  });

  it('renders quick replies header title and new template button', async () => {
    render(<QuickRepliesView />);

    expect(screen.getByText('Mensagens Rápidas e Templates')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Novo Template/i })).toBeInTheDocument();
    });
  });

  it('opens new template dialog when clicking Novo Template button', async () => {
    render(<QuickRepliesView />);

    const newBtn = await screen.findByRole('button', { name: /Novo Template/i });
    fireEvent.click(newBtn);

    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: Saudação Inicial/i)).toBeInTheDocument();
  });
});
