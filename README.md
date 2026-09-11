# Lead Flow Studio

Interactive CRM showcase built with React and TypeScript.

O Lead Flow Studio é uma vitrine interativa de portfólio para explorar um fluxo comercial: leads em Kanban, detalhes de contato, templates de mensagens, métricas e uma simulação de comunicação. O projeto apresenta uma interface funcional sem exigir conta ou credenciais para o modo demonstração.

## Demonstração

Na tela de entrada, escolha **Visualizar demonstração (Modo Visitante)**. O modo demo permite:

- navegar pelo CRM e pelo Kanban;
- mover leads por drag-and-drop, inclusive em telas touch;
- abrir detalhes, editar campos locais e usar busca;
- visualizar dashboard e gráficos derivados dos dados de demonstração;
- criar e usar templates de respostas rápidas;
- simular o envio de mensagens sem chamar um serviço externo.

Os dados do modo demo são fictícios e ficam no navegador do visitante. Nenhuma mensagem real é enviada.

## O que é demonstração e o que é integração opcional

O fluxo principal da vitrine é local e independente de Supabase. O projeto também contém um modo real opcional:

- **Supabase:** autenticação e persistência de leads/templates quando as variáveis públicas são configuradas. O schema, as políticas de acesso e o projeto hospedado não fazem parte deste repositório.
- **Green API/WhatsApp:** integração experimental existente no código para um ambiente real configurado pelo operador. Ela não é usada no modo demo e não deve receber credenciais em arquivos públicos ou no frontend publicado.

As telas de produtos, pedidos, e-mail, campanhas, automações, planos e feedback são conceitos de interface com dados estáticos ou estado local. Elas não representam módulos de backend prontos para produção.

## Stack

- React 19
- TypeScript 5.9
- TanStack Start e TanStack Router
- Vite 7
- Tailwind CSS 4
- Radix UI e Lucide React
- @dnd-kit para drag-and-drop
- Recharts para gráficos
- Supabase JavaScript SDK como integração opcional

## Arquitetura resumida

~~~text
src/
├── components/auth/          # login, cadastro e modo visitante
├── components/leads/         # Kanban, dashboard, cards e detalhes
├── components/quick-replies/ # templates de mensagens
├── components/settings/      # etapas e etiquetas locais
├── components/ui/            # componentes de interface reutilizáveis
├── hooks/                    # estado local e hooks de domínio
├── lib/                      # clientes e utilitários
├── routes/                   # rota principal e shell da aplicação
└── services/                 # acesso opcional ao Supabase e mensagens
~~~

Não há uma API própria neste repositório. O arquivo src/server.ts é o wrapper de execução do TanStack Start; o modo demo funciona no cliente, e o modo real depende do Supabase externo.

## Como executar

Requisitos: Node.js compatível com o projeto e npm.

~~~bash
npm ci
npm run dev
~~~

Abra a URL exibida pelo Vite e selecione o modo visitante.

Validações disponíveis:

~~~bash
npm run typecheck
npm test
npm run build
~~~

## Variáveis de ambiente opcionais

Crie .env.local somente para testar o modo real com um projeto Supabase autorizado:

~~~env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
~~~

Esses valores não devem ser commitados. Sem essas variáveis, o modo visitante continua disponível.

## Limitações conhecidas

- o modo demo usa localStorage para leads e templates; tags, etapas, notas e parte das preferências permanecem em estado local da sessão;
- o modo real depende de schema e políticas configurados fora deste repositório;
- não há backend próprio, fila ou envio de WhatsApp em produção;
- as telas auxiliares são protótipos visuais e não devem ser descritas como funcionalidades completas;
- o projeto não inclui um deploy público ou screenshots versionados neste momento;
- não há arquivo de licença definido atualmente.

## Origem e atribuição

O projeto foi iniciado a partir de uma configuração/template de TanStack Start associada ao Lovable. A UI, os fluxos de demonstração, os serviços, os testes e a documentação deste repositório foram desenvolvidos e adaptados por André Rodrigues. A atribuição das dependências permanece conforme suas respectivas licenças.

## Autor

**André Rodrigues**

- GitHub: [@Andrearodri](https://github.com/Andrearodri)
- LinkedIn: [André Rodrigues](https://linkedin.com/in/andrearodri)
