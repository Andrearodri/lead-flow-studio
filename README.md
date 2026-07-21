# Lead Flow Studio

> Aplicação de gestão de leads com dashboard, quadro Kanban interativo, organização por etapas do funil de vendas, painel de detalhes e templates de mensagens.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-96%25-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## O Problema

Equipes comerciais frequentemente perdem leads porque não têm visibilidade clara sobre o pipeline de vendas. Saber em qual etapa cada lead está, o que já foi feito e o que precisa acontecer é essencial para converter mais.

## A Solução

O Lead Flow Studio oferece um painel visual tipo Kanban para organizar leads por etapa do funil, com painel de detalhes completo por lead e templates de mensagens prontos para agilizar o atendimento.

---

## Funcionalidades Implementadas

- **Kanban interativo** com drag-and-drop entre colunas (dnd-kit)
- **Painel de detalhes** do lead (nome, contato, etapa, observações)
- **Templates de mensagens** para acelerar respostas frequentes
- **Dashboard** com indicadores visuais do funil
- **Dados locais mockados** para demonstração sem dependência externa
- **Interface responsiva** com Tailwind CSS e Radix UI
- **Formulários validados** com React Hook Form e Zod

> **Nota sobre demonstração:** O projeto utiliza exclusivamente dados locais fictícios. Não há integração com serviços externos, envio de mensagens reais ou acesso a dados de produção nesta versão.

---

## Stack Tecnológica

| Categoria | Tecnologias |
|---|---|
| **Frontend** | React 18, TypeScript |
| **Roteamento** | TanStack Router, TanStack Start |
| **Estado / Dados** | TanStack Query, mock-data local |
| **Drag-and-drop** | dnd-kit |
| **UI / Estilo** | Radix UI, shadcn/ui, Tailwind CSS |
| **Formulários** | React Hook Form, Zod |
| **Gráficos** | Recharts |
| **Build / Deploy** | Vite, Cloudflare Workers |

---

## Arquitetura

```
src/
├── components/
│   ├── leads/          # Kanban, LeadCard, LeadDetailSheet, Header, Sidebar
│   ├── quick-replies/  # Templates de mensagens
│   └── ui/             # Componentes Radix UI / shadcn
├── routes/             # Páginas e rotas (TanStack Router)
├── hooks/              # Custom hooks
├── lib/                # Utilitários
└── types/              # Tipos TypeScript globais
```

---

## Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Andrearodri/lead-flow-studio.git
cd lead-flow-studio

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

### Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor local |
| `npm run build` | Gera o build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata o código com Prettier |

---

## Decisões Técnicas

- **TanStack Router** para roteamento tipado e type-safe
- **dnd-kit** como solução de drag-and-drop acessível e flexível
- **Zod + React Hook Form** para validação de formulários em runtime
- **Mock data local** para isolar a demonstração de qualquer serviço externo
- **Cloudflare Workers** como target de deploy pela performance na edge

---

## Limitações Atuais

- Não há persistência de dados (sem banco de dados nesta versão)
- Não há autenticação de usuários
- Os dados são redefinidos a cada recarga da página
- Deploy público ainda não publicado

---

## Roadmap

- [ ] Deploy público (Cloudflare Workers)
- [ ] Persistência com localStorage ou banco de dados
- [ ] Autenticação de usuários
- [ ] Filtros e busca de leads
- [ ] Exportação de dados
- [ ] Notificações e lembretes

---

## Atribuição

Este projeto teve sua estrutura inicial criada com apoio do **Lovable** (ferramenta de desenvolvimento com IA generativa). A personalização da interface, evolução dos fluxos, configuração do projeto, documentação e validação técnica foram realizadas por André Rodrigues.

---

## Licença

MIT — veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

## Contato

**André Rodrigues**
- LinkedIn: [linkedin.com/in/andreaparecidorodrigues-dev](https://www.linkedin.com/in/andreaparecidorodrigues-dev/)
- Portfólio: [andrestudiodev.duckdns.org](https://andrestudiodev.duckdns.org/)
- GitHub: [github.com/Andrearodri](https://github.com/Andrearodri)
