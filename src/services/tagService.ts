/**
 * tagService — Estado central reativo para Tags.
 *
 * Funciona como um micro-store com pub/sub para que componentes
 * possam se inscrever em mudanças e re-renderizar automaticamente.
 */

export interface Tag {
  id: string;
  name: string;
  /** Tailwind bg class, e.g. "bg-red-500" */
  color: string;
  /** Tailwind text class, e.g. "text-white" */
  textColor: string;
}

export const TAG_COLORS = [
  { name: "Vermelho", value: "bg-red-500", text: "text-white" },
  { name: "Azul", value: "bg-blue-500", text: "text-white" },
  { name: "Verde", value: "bg-emerald-500", text: "text-white" },
  { name: "Amarelo", value: "bg-amber-400", text: "text-amber-900" },
  { name: "Roxo", value: "bg-violet-500", text: "text-white" },
  { name: "Rosa", value: "bg-pink-500", text: "text-white" },
  { name: "Cinza", value: "bg-slate-500", text: "text-white" },
] as const;

/* ── Mock data ── */
const INITIAL_TAGS: Tag[] = [
  { id: "t1", name: "VIP", color: "bg-violet-500", textColor: "text-white" },
  { id: "t2", name: "Urgente", color: "bg-red-500", textColor: "text-white" },
  { id: "t3", name: "Indicação", color: "bg-emerald-500", textColor: "text-white" },
  { id: "t4", name: "Retornar", color: "bg-amber-400", textColor: "text-amber-900" },
  { id: "t5", name: "Pós-Venda", color: "bg-blue-500", textColor: "text-white" },
];

type Listener = () => void;

let tags: Tag[] = [...INITIAL_TAGS];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const tagService = {
  /** Get current snapshot */
  getTags(): Tag[] {
    return tags;
  },

  /** Subscribe to changes — returns an unsubscribe function */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Add a new tag */
  addTag(name: string, color: string, textColor: string): Tag {
    const newTag: Tag = {
      id: `t${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      color,
      textColor,
    };
    tags = [...tags, newTag];
    notify();
    return newTag;
  },

  /** Remove a tag by id */
  deleteTag(id: string) {
    tags = tags.filter((t) => t.id !== id);
    notify();
  },

  /** Find a tag by id */
  getById(id: string): Tag | undefined {
    return tags.find((t) => t.id === id);
  },
};
