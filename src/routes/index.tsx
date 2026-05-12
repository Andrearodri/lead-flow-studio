import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar, type NavView } from "@/components/leads/Sidebar";
import { Header } from "@/components/leads/Header";
import { KanbanBoard } from "@/components/leads/KanbanBoard";
import { QuickRepliesView } from "@/components/quick-replies/QuickRepliesView";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [view, setView] = useState<NavView>("kanban");

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <Sidebar active={view} onSelect={setView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          {view === "kanban" && <KanbanBoard />}
          {view === "quick-replies" && <QuickRepliesView />}
          {view === "dashboard" && <Placeholder title="Dashboard" />}
          {view === "settings" && <Placeholder title="Configurações" />}
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
