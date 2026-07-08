import { supabase } from '@/lib/supabase';
import { type Lead, type LeadStatus, INITIAL_LEADS } from '@/components/leads/mock-data';

export const leadService = {
  isDemo(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem("crm_demo_mode") === "true";
  },

  getDemoLeads(): Lead[] {
    const data = localStorage.getItem("demo_leads");
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        // Fallback
      }
    }
    const initial = INITIAL_LEADS;
    localStorage.setItem("demo_leads", JSON.stringify(initial));
    return initial;
  },

  saveDemoLeads(leads: Lead[]) {
    localStorage.setItem("demo_leads", JSON.stringify(leads));
  },

  /**
   * Busca todos os leads do usuário autenticado
   */
  async getLeads(): Promise<Lead[]> {
    if (this.isDemo()) {
      return this.getDemoLeads();
    }
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapeamento do banco (snake_case) para a interface do Front-end (camelCase/custom)
      return data.map(item => ({
        id: item.id,
        nome: item.nome,
        telefone: item.telefone,
        servico: item.servico,
        esperaMin: item.espera_min,
        status: item.status as LeadStatus,
        iniciais: item.iniciais,
        tags: item.tags || [],
        valorEstimado: item.valor_estimado || 0
      }));
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      throw error;
    }
  },

  /**
   * Cria um novo lead associado ao usuário logado
   */
  async createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
    if (this.isDemo()) {
      const demoLeads = this.getDemoLeads();
      const newLead: Lead = {
        ...lead,
        id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        iniciais: lead.iniciais || lead.nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")
      };
      this.saveDemoLeads([newLead, ...demoLeads]);
      return newLead;
    }
    try {
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('leads')
        .insert([{
          user_id: user.id,
          nome: lead.nome,
          telefone: lead.telefone,
          servico: lead.servico,
          espera_min: lead.esperaMin,
          status: lead.status,
          iniciais: lead.iniciais,
          valor_estimado: lead.valorEstimado || 0
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        nome: data.nome,
        telefone: data.telefone,
        servico: data.servico,
        esperaMin: data.espera_min,
        status: data.status as LeadStatus,
        iniciais: data.iniciais,
        valorEstimado: data.valor_estimado || 0
      };
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  },

  /**
   * Atualiza o status (Drag and Drop) de um lead existente
   */
  async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    if (this.isDemo()) {
      const demoLeads = this.getDemoLeads();
      const updated = demoLeads.map((l) => (l.id === id ? { ...l, status } : l));
      this.saveDemoLeads(updated);
      return;
    }
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Erro ao atualizar status do lead ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza o valor estimado de um lead
   */
  async updateLeadValue(id: string, valorEstimado: number): Promise<void> {
    if (this.isDemo()) {
      const demoLeads = this.getDemoLeads();
      const updated = demoLeads.map((l) => (l.id === id ? { ...l, valorEstimado } : l));
      this.saveDemoLeads(updated);
      return;
    }
    try {
      const { error } = await supabase
        .from('leads')
        .update({ valor_estimado: valorEstimado })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Erro ao atualizar valor do lead ${id}:`, error);
      throw error;
    }
  }
};
