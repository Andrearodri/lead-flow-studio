import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/leads/Sidebar";
import { Header } from "@/components/leads/Header";
import { KanbanBoard } from "@/components/leads/KanbanBoard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
}
