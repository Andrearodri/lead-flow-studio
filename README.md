# Lead Flow Studio

> Sistema avançado de gestão de leads com interface Kanban interativa, dashboard analítico de BI e simulador de automações de WhatsApp em segundo plano.

![Status do Projeto](https://img.shields.io/badge/Status-Pronto%20para%20Portf%C3%B3lio-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-v4-violet?style=for-the-badge&logo=tailwindcss)
![TanStack](https://img.shields.io/badge/TanStack-Start-ff5a1a?style=for-the-badge)

---

## 💻 Demonstração

O projeto conta com um **Modo Demonstração (Ambiente de Visitante)** 100% seguro para avaliadores e recrutadores. Você pode navegar pela interface completa, simular envios de mensagens de WhatsApp e fazer edições no pipeline sem a necessidade de criar uma conta ou fornecer dados pessoais.

* **URL do Projeto Publicado:** *[Inserir link do deploy aqui após publicação]*
* **Como acessar:** Na tela de login, clique no botão **"Visualizar demonstração (Modo Visitante)"**.

---

## 📷 Screenshots

### 1. Tela de Entrada (com Modo Demo)
![Tela de Autenticação](./docs/images/screenshot_login.png)

### 2. Quadro Kanban (Drag and Drop)
![Kanban Principal](./docs/images/screenshot_kanban.png)

### 3. Painel Lateral de Detalhes do Lead
![Painel do Lead](./docs/images/screenshot_lead_detail.png)

### 4. Templates de Mensagens Rápidas
![Templates](./docs/images/screenshot_templates.png)

### 5. Dashboard Comercial (BI)
![Dashboard](./docs/images/screenshot_dashboard.png)

### 6. Configurações e Etiquetas
![Configurações](./docs/images/screenshot_settings.png)

---

## 🎯 Problema que o Projeto Resolve

No dia a dia comercial de pequenas e médias empresas que vendem pelo WhatsApp, a triagem manual de leads costuma ser desorganizada e lenta. Há perda frequente de contatos devido à falta de visibilidade do funil e atraso no envio de propostas comerciais.

O **Lead Flow Studio** resolve esse gargalo ao:
1. Centralizar a triagem visual no formato Kanban, separando os contatos em colunas de progresso.
2. Permitir o disparo rápido de modelos de mensagens prontas diretamente para o WhatsApp do cliente.
3. Automatizar o envio de propostas em segundo plano assim que o status do lead avança no funil.
4. Exibir métricas de conversão e faturamento projetado em tempo real em um painel analítico.

---

## 🚀 Funcionalidades

* **Quadro Kanban Interativo:** Organização visual das etapas de vendas (Novos Contatos, Qualificação, Agendamento, Proposta, Fechado) com ordenação dinâmica e suporte total a Drag & Drop.
* **Painel Lateral do Lead (LeadDetailSheet):** Visualização completa do histórico do cliente, controle de valor estimado do negócio, tags interativas, anotações de progresso e atalho rápido de comunicação.
* **Disparo Automatizado (Vetor Opus):** Integração para envio de mensagens via WhatsApp Green API. O sistema monitora as movimentações no Kanban e dispara propostas em background quando um lead atinge a etapa de fechamento.
* **Templates de Mensagens (Quick Replies):** CRUD completo (Criar, Ler, Atualizar e Excluir) de templates de respostas rápidas armazenados no banco de dados.
* **Dashboard e BI:** Indicadores de desempenho de conversão (total de leads, tempo médio de espera, taxa de conversão e faturamento fechado) com gráficos de receita por serviço, leads por canal e histórico de perdas.
* **Configuração Dinâmica:** Gerenciamento reativo de etiquetas (Tags) e colunas do funil no painel de configurações.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts (Gráficos), `@dnd-kit/core` (Drag and Drop).
* **Framework:** **TanStack Start** (SSR/Server-Side Rendering de última geração).
* **Back-end & Persistência (Modo Real):** **Supabase** (PostgreSQL, Realtime Database, Auth Service).
* **Gateway de Mensagens (Modo Real):** **Green API** (Integração com WhatsApp).
* **Hospedagem & Deploy:** **Cloudflare Pages / Workers** (Wranger CLI).

---

## 📐 Arquitetura do Projeto

O projeto adota uma arquitetura limpa dividida em componentes de UI, hooks reativos e serviços isolados:

```
src/
├── components/
│   ├── auth/           # Login, Cadastro e Modo Demonstração
│   ├── leads/          # Kanban, Dashboard, Cards e Painel Lateral
│   ├── quick-replies/  # Gestão de Templates de Mensagens
│   ├── settings/       # Painel de Etiquetas e Etapas do Funil
│   ├── ui/             # Componentes base (botões, inputs, dialogs)
│   └── analytics/      # BI e métricas auxiliares
├── hooks/              # Hooks customizados para pub/sub de estado reativo
├── lib/                # Configuração de clientes (Supabase)
├── routes/             # Rotas tipadas no TanStack Router
├── services/           # Abstração de chamadas à APIs externas e DB
└── start.ts            # Ponto de inicialização do TanStack Start
```

---

## 🔒 Modo Demonstração e Segurança

Para proteger dados reais de clientes e evitar custos com faturamento de APIs externas durante avaliações públicas:
1. **Dados em LocalStorage:** No Modo Demonstração, todos os leads, templates e modificações são mantidos localmente na memória e no `localStorage` do navegador do visitante. Nenhuma informação é persistida no banco de dados central Supabase.
2. **Mensagens Simuladas:** Qualquer disparo automático ou manual de WhatsApp no Modo Demo intercepta a chamada de rede, aguarda um delay de rede de `800ms` e exibe um feedback visual na tela (Toast) com a mensagem: *"📱 Envio simulado com sucesso (Modo Demonstração)!"*.
3. **Credenciais Ocultas:** Nenhum token de API ou senha é exposto nos arquivos públicos do repositório.

---

## ⚙️ Como Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/Andrearodri/lead-flow-studio.git
cd lead-flow-studio
```

### 2. Instalar as dependências
```bash
npm install
# ou se preferir bun:
bun install
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse **`http://localhost:8080/`** no navegador. Para utilizar o Modo Real com o Supabase e salvar dados no banco, configure o arquivo `.env.local` conforme as variáveis abaixo.

---

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto para rodar no Modo Real integrado:

```env
# Chaves públicas do Supabase (Client-Side)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

---

## 💡 Aprendizados

* **TanStack Start & SSR:** Compreensão de carregamento de páginas híbridas com hydration e compilação focada em Serverless (Cloudflare Workers).
* **Gestão de Estado em Arquitetura Serverless:** Desenvolvimento de micro-stores reativas com padrões Pub/Sub para propagar estados sem depender de grandes estruturas globais como Redux.
* **Tolerância a Falhas e Modos Híbridos:** Construção de interceptadores inteligentes em nível de serviço para alternar dinamicamente entre persistência Cloud (Supabase) e Offline (LocalStorage).

---

## 🔮 Próximos Passos

- [ ] Integração com IA (Google Gemini API) para sugerir respostas rápidas e analisar o sentimento das anotações do lead.
- [ ] Gráfico de evolução de vendas integrado com o banco de dados Supabase em tempo real.
- [ ] Exportação de relatórios em PDF/Excel a partir da tela de Analytics.

---

## 👤 Autor

**André Rodrigues**
* **GitHub:** [@Andrearodri](https://github.com/Andrearodri)
* **LinkedIn:** [André Rodrigues](https://linkedin.com/in/andrearodri)
