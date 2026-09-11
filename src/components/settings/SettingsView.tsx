import { useState } from "react";
import {
  User,
  Tag,
  GitBranch,
  Plus,
  Trash2,
  Pencil,
  Save,
  Building2,
  Phone,
  Mail,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tagService, TAG_COLORS } from "@/services/tagService";
import { funnelService } from "@/services/funnelService";
import { useTags } from "@/hooks/useTags";
import { useFunnelColumns } from "@/hooks/useFunnelColumns";
import type { Lead } from "@/components/leads/mock-data";

interface SettingsViewProps {
  leads?: Lead[];
}

export function SettingsView({ leads = [] }: SettingsViewProps) {
  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize o seu CRM — perfil, etiquetas e funil de vendas.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            Meu Perfil
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-1.5">
            <Tag className="h-4 w-4" />
            Etiquetas
          </TabsTrigger>
          <TabsTrigger value="funnel" className="gap-1.5">
            <GitBranch className="h-4 w-4" />
            Funil de Vendas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="tags">
          <TagsTab />
        </TabsContent>

        <TabsContent value="funnel">
          <FunnelTab leads={leads} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Profile Tab                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
function ProfileTab() {
  const [companyName, setCompanyName] = useState("Empresa Demo");
  const [responsibleName, setResponsibleName] = useState("Usuário Demo");
  const [email, setEmail] = useState("demo@lead-flow.example");
  const [phone, setPhone] = useState("+55 00 90000-0099");

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-4 max-w-2xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Informações da Empresa
          </h3>
          <p className="text-xs text-muted-foreground">
            Dados exibidos no perfil e nas comunicações com leads.
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Nome da Empresa</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-9"
              placeholder="Nome da empresa"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="responsible-name">Nome do Responsável</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="responsible-name"
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
              className="pl-9"
              placeholder="Nome completo"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              placeholder="email@empresa.com"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone (WhatsApp)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-9"
              placeholder="+55 11 99999-9999"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Tags Tab  —  Conectada ao tagService central                             */
/* ────────────────────────────────────────────────────────────────────────── */
function TagsTab() {
  const tags = useTags();
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(TAG_COLORS[0].value);

  const handleAdd = () => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    const color = TAG_COLORS.find((c) => c.value === selectedColor) ?? TAG_COLORS[0];
    tagService.addTag(trimmed, color.value, color.text);
    setNewTagName("");
  };

  const handleDelete = (id: string) => {
    tagService.deleteTag(id);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-4 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-500 grid place-items-center">
          <Tag className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Gerenciar Etiquetas
          </h3>
          <p className="text-xs text-muted-foreground">
            Crie tags para categorizar seus leads de forma rápida.
          </p>
        </div>
      </div>

      {/* Add form */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Nome da etiqueta..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-full sm:w-40">
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${selectedColor}`}
              />
              <SelectValue placeholder="Cor" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {TAG_COLORS.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${color.value}`}
                  />
                  {color.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAdd} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {/* Tags grid */}
      {tags.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhuma etiqueta criada ainda.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center gap-1.5 rounded-lg border border-border bg-background px-1 py-0.5 transition-all hover:shadow-sm"
            >
              <Badge
                className={`${tag.color} ${tag.textColor} border-transparent pointer-events-none`}
              >
                {tag.name}
              </Badge>
              <button
                onClick={() => handleDelete(tag.id)}
                className="h-6 w-6 rounded-md grid place-items-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-60 group-hover:opacity-100"
                title="Excluir etiqueta"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Funnel Tab  —  Conectada ao funnelService central                        */
/* ────────────────────────────────────────────────────────────────────────── */
function FunnelTab({ leads }: { leads: Lead[] }) {
  const columns = useFunnelColumns();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  /* Accent color mapping for the left indicator */
  const accentFallback: Record<string, string> = {
    "bg-info": "bg-blue-500",
    "bg-warning": "bg-amber-500",
    "bg-primary": "bg-indigo-500",
    "bg-success": "bg-emerald-500",
  };

  const handleAddStep = () => {
    funnelService.addColumn("Nova Etapa");
  };

  const handleDelete = (id: string) => {
    // Check if any leads are in this column
    const leadsInColumn = leads.filter((l) => l.status === id);
    if (leadsInColumn.length > 0) {
      alert(
        `Não é possível excluir esta etapa.\n\nExistem ${leadsInColumn.length} lead(s) nesta coluna. Mova-os para outra etapa antes de excluir.`,
      );
      return;
    }
    if (confirm("Tem certeza que deseja excluir esta etapa do funil?")) {
      funnelService.deleteColumn(id);
    }
  };

  const startEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const confirmEdit = () => {
    if (editingId && editTitle.trim()) {
      funnelService.updateColumn(editingId, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-4 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-500 grid place-items-center">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Etapas do Funil
            </h3>
            <p className="text-xs text-muted-foreground">
              Configure as colunas do seu Kanban de vendas.
            </p>
          </div>
        </div>
        <Button onClick={handleAddStep} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nova Etapa
        </Button>
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        {columns.map((step, index) => {
          const barColor = accentFallback[step.accent] ?? step.accent;
          const leadsInCol = leads.filter((l) => l.status === step.id).length;
          const isEditing = editingId === step.id;

          return (
            <div
              key={step.id}
              className="group flex items-center gap-4 rounded-lg border border-border bg-background p-4 transition-all hover:shadow-sm"
            >
              {/* Accent bar */}
              <div
                className={`h-10 w-1.5 rounded-full ${barColor} shrink-0`}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 shrink-0"
                      onClick={confirmEdit}
                      title="Confirmar"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                      onClick={cancelEdit}
                      title="Cancelar"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-medium text-foreground truncate">
                        {step.title}
                      </p>
                      {leadsInCol > 0 && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium tabular-nums">
                          {leadsInCol} {leadsInCol === 1 ? "lead" : "leads"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 pl-7 truncate">
                      {step.hint}
                    </p>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => startEdit(step.id, step.title)}
                    title="Editar etapa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => handleDelete(step.id)}
                    title="Excluir etapa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {columns.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500/60" />
          <p className="text-sm text-muted-foreground">
            Nenhuma etapa no funil. Clique em "+ Nova Etapa" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
