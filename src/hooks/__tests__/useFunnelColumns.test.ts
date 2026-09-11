import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFunnelColumns } from '../useFunnelColumns';
import { funnelService } from '@/services/funnelService';

describe('useFunnelColumns hook', () => {
  it('returns default funnel columns', () => {
    const { result } = renderHook(() => useFunnelColumns());

    expect(result.current.length).toBeGreaterThan(0);
    const ids = result.current.map((col) => col.id);
    expect(ids).toContain('novos');
    expect(ids).toContain('qualificacao');
    expect(ids).toContain('fechado');
  });

  it('updates reactively when a new column is added via funnelService', () => {
    const { result } = renderHook(() => useFunnelColumns());
    const initialLength = result.current.length;

    act(() => {
      funnelService.addColumn('Lead Quente', 'Etapa prioritária');
    });

    expect(result.current.length).toBe(initialLength + 1);
    expect(result.current.some((col) => col.title === 'Lead Quente')).toBe(true);
  });
});
