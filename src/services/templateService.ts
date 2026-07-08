import { supabase } from '@/lib/supabase';
import { type QuickReply, type QuickReplyCategory, INITIAL_REPLIES } from '@/components/quick-replies/mock-data';

export const templateService = {
  isDemo(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem("crm_demo_mode") === "true";
  },

  getDemoTemplates(): QuickReply[] {
    const data = localStorage.getItem("demo_templates");
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        // Fallback
      }
    }
    const initial = INITIAL_REPLIES;
    localStorage.setItem("demo_templates", JSON.stringify(initial));
    return initial;
  },

  saveDemoTemplates(templates: QuickReply[]) {
    localStorage.setItem("demo_templates", JSON.stringify(templates));
  },

  /**
   * Busca todos os templates do usuário autenticado
   */
  async getTemplates(): Promise<QuickReply[]> {
    if (this.isDemo()) {
      return this.getDemoTemplates();
    }
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      titulo: item.titulo,
      texto: item.conteudo,
      categoria: item.categoria as QuickReplyCategory,
    }));
  },

  /**
   * Cria um novo template associado ao usuário logado
   */
  async createTemplate(template: Omit<QuickReply, 'id'>): Promise<QuickReply> {
    if (this.isDemo()) {
      const demoTemplates = this.getDemoTemplates();
      const newTemplate: QuickReply = {
        ...template,
        id: `demo_template_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      };
      this.saveDemoTemplates([newTemplate, ...demoTemplates]);
      return newTemplate;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('templates')
      .insert([{
        user_id: user.id,
        titulo: template.titulo,
        conteudo: template.texto,
        categoria: template.categoria
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      titulo: data.titulo,
      texto: data.conteudo,
      categoria: data.categoria as QuickReplyCategory,
    };
  },

  /**
   * Atualiza um template existente
   */
  async updateTemplate(id: string, template: Omit<QuickReply, 'id'>): Promise<void> {
    if (this.isDemo()) {
      const demoTemplates = this.getDemoTemplates();
      const updated = demoTemplates.map((t) => (t.id === id ? { ...t, ...template } : t));
      this.saveDemoTemplates(updated);
      return;
    }
    const { error } = await supabase
      .from('templates')
      .update({
        titulo: template.titulo,
        conteudo: template.texto,
        categoria: template.categoria
      })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Remove um template do banco
   */
  async deleteTemplate(id: string): Promise<void> {
    if (this.isDemo()) {
      const demoTemplates = this.getDemoTemplates();
      const updated = demoTemplates.filter((t) => t.id !== id);
      this.saveDemoTemplates(updated);
      return;
    }
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
