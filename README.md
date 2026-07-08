# Lead Flow Studio

> Sistema de gestão de leads com interface Kanban interativa, construído com React, TypeScript e TanStack Router.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-96%25-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Sobre o Projeto

Lead Flow Studio é um sistema de gestão de leads com interface Kanban interativa. O projeto resolve um problema real de equipes comerciais: a falta de visibilidade sobre o pipeline de vendas e o status de cada lead ao longo do funil.

A aplicação permite visualizar, mover e gerenciar leads entre etapas do funil de forma intuitiva, com painel de detalhes, respostas rápidas e organização por status.

---

## Funcionalidades

- **Kanban interativo** com drag and drop entre colunas
- **Painel de detalhes do lead** (LeadDetailSheet) com informações completas
- **Respostas rápidas** para agilizar atendimento
- **Filtros e organização** por status do lead
- **Interface responsiva** com Tailwind CSS
- **Navegação tipada** com TanStack Router

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Interface de usuário |
| TypeScript | Tipagem estática |
| TanStack Router | Roteamento tipado |
| Tailwind CSS | Estilização |
| dnd-kit | Drag and drop |
| shadcn/ui | Componentes de UI |
| Vite | Build tool |

---

## Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/Andrearodri/lead-flow-studio.git

# Entre na pasta
cd lead-flow-studio

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── leads/          # Componentes do Kanban e painel de leads
│   └── ui/             # Componentes de UI reutilizáveis
├── routes/             # Rotas da aplicação (TanStack Router)
├── data/               # Mock data para desenvolvimento
└── types/              # Tipos TypeScript
```

---

## Aprendizados

- Implementação de drag and drop com dnd-kit em um contexto real de CRM
- Roteamento tipado com TanStack Router
- Arquitetura de componentes em projetos React com TypeScript
- Gestão de estado local com hooks customizados

---

## Próximos Passos

- [ ] Dashboard com métricas (total de leads, conversão por etapa)
- [ ] Integração com backend real
- [ ] Autenticação de usuários
- [ ] Notificações e lembretes
- [ ] Deploy público

---

## Contato

**André Rodrigues**  
Desenvolvedor Full Stack Júnior  
[GitHub](https://github.com/Andrearodri) · [LinkedIn](https://linkedin.com/in/andrearodri)
