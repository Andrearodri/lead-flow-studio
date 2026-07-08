import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar, type NavView } from "@/components/leads/Sidebar";
import { Header } from "@/components/leads/Header";
import { KanbanBoard } from "@/components/leads/KanbanBoard";
import { QuickRepliesView } from "@/components/quick-replies/QuickRepliesView";
import { SettingsView } from "@/components/settings/SettingsView";
import { type Lead } from "@/components/leads/mock-data";
import { supabase } from "@/lib/supabase";
import { leadService } from "@/services/leadService";
import { Auth } from "@/components/auth/Auth";
import { Dashboard } from "@/components/leads/Dashboard";
import { AutomationsView } from "@/components/automations/AutomationsView";
import { IntegrationsView } from "@/components/integrations/IntegrationsView";
import { ProductsView } from "@/components/products/ProductsView";
import { OrdersView } from "@/components/orders/OrdersView";
import { EmailView } from "@/components/email/EmailView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { FeedbackView } from "@/components/feedback/FeedbackView";
import { HelpView } from "@/components/help/HelpView";
import { CampaignsView } from "@/components/campaigns/CampaignsView";
import { PlansView } from "@/components/plans/PlansView";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<NavView>("kanban");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isDemo = typeof window !== "undefined" && localStorage.getItem("crm_demo_mode") === "true";
    if (isDemo) {
      setSession({ user: { email: "visitante@demo-flow.com", id: "demo-user-id" } });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.removeItem("crm_demo_mode");
      }
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.removeItem("crm_demo_mode");
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    
    let isMounted = true;
    
    async function fetchLeads() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await leadService.getLeads();
        if (isMounted) setLeads(data);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLeads();
    
    return () => { isMounted = false; };
  }, [session]);

  const handleAddLead = async (newLeadParams: Lead) => {
    try {
      // Cria no back-end primeiro
      const savedLead = await leadService.createLead(newLeadParams);
      // Atualiza a interface
      setLeads((prev) => [savedLead, ...prev]);
    } catch (err: any) {
      console.error("Falha ao salvar o lead:", err.message);
      alert("Erro ao salvar o lead: " + err.message);
    }
  };

  const handleUpdateLeadValue = async (id: string, value: number) => {
    try {
      await leadService.updateLeadValue(id, value);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, valorEstimado: value } : l)));
    } catch (err: any) {
      console.error("Erro ao atualizar valor:", err);
    }
  };

  if (!session) {
    return (
      <Auth 
        onDemoLogin={() => {
          localStorage.setItem("crm_demo_mode", "true");
          setSession({ user: { email: "visitante@demo-flow.com", id: "demo-user-id" } });
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <Sidebar 
        active={view} 
        onSelect={setView} 
        onLogout={() => {
          localStorage.removeItem("crm_demo_mode");
          localStorage.removeItem("demo_leads");
          localStorage.removeItem("demo_templates");
          supabase.auth.signOut();
          setSession(null);
        }} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onAddLead={handleAddLead} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm text-center">
            Erro ao carregar dados: {error}
          </div>
        )}

        <main className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {view === "kanban" && (
                <KanbanBoard 
                  leads={leads} 
                  setLeads={setLeads} 
                  searchQuery={searchQuery} 
                  onUpdateValue={handleUpdateLeadValue}
                />
              )}
              {view === "quick-replies" && <QuickRepliesView />}
              {view === "dashboard" && <Dashboard leads={leads} />}
              {view === "settings" && <SettingsView leads={leads} />}
              {view === "automations" && <AutomationsView />}
              {view === "integrations" && <IntegrationsView />}
              {view === "products" && <ProductsView />}
              {view === "orders" && <OrdersView />}
              {view === "email" && <EmailView />}
              {view === "analytics" && <AnalyticsView />}
              {view === "feedback" && <FeedbackView />}
              {view === "help" && <HelpView />}
              {view === "campaigns" && <CampaignsView />}
              {view === "plans" && <PlansView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="h-full grid place-items-center text-center px-6">
      <div className="max-w-sm">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Esta seção ainda está em construção. Em breve, novas funcionalidades aqui.
        </p>
      </div>
    </div>
  );
}
