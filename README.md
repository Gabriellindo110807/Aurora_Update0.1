Aurora Technology – Sistema de Listas Inteligentes e Carrinho Automatizado
🧠 Descrição do Projeto

O Aurora Technology é um sistema web completo desenvolvido como projeto final da disciplina de Programação Orientada a Objetos, aplicando arquitetura MVC e múltiplos padrões de projeto GoF.
O objetivo é oferecer uma experiência automatizada de compra e gerenciamento de listas, permitindo criar listas inteligentes, adicionar produtos, simular pesagem e escaneamento de itens, além de manter integração direta com o banco de dados e o carrinho digital do usuário.

O sistema combina inteligência artificial, interface responsiva e persistência de dados para simular um totem de autoatendimento inteligente, com visual moderno em tons dourado e azul, seguindo a identidade visual Aurora Technology.

👥 Integrantes
Nome	Matrícula
Alisson Batista	12302155
Gabriel Scarpelli	12301426
Vitor Hugo Oliveira	12302783
Clara Vasconcelos	12302317
Julia Santiago	12301841
🧩 Arquitetura e Padrões de Projeto

O projeto segue rigorosamente o padrão MVC (Model–View–Controller), garantindo separação clara de responsabilidades entre interface, controle e persistência de dados.

src/

├── components/     # Componentes de interface (View)

├── controllers/    # Lógica de controle e regras de negócio

├── models/         # Classes e entidades do domínio (OO)

├── repositories/   # Camada de persistência (Repository Pattern)

├── lib/            # Configurações e Singleton de conexão

├── hooks/          # Observadores reativos e lógica auxiliar

├── i18n/           # Internacionalização (idiomas)

└── pages/          # Páginas principais da aplicação

⚙️ Padrões GoF Implementados
Padrão	Aplicação	Justificativa
Singleton	Conexão única com Supabase	Evita múltiplas instâncias e economiza recursos
Repository	Persistência de dados	Desacopla entidades da infraestrutura
Observer	Atualização de interface	Reflete mudanças em tempo real no carrinho e listas
Strategy	Cálculo e formatação de preços	Permite diferentes estratégias de exibição e arredondamento
Factory Method	Criação de objetos (Produto, Lista, Usuário)	Facilita manutenção e consistência das entidades

💡 Funcionalidades Implementadas
Nº	Funcionalidade	Status

1	Cadastro e login de usuários (com Google OAuth)	✔️

2	Interface responsiva do carrinho inteligente	✔️

3	Escaneamento de produtos (simulação via código)	✔️

4	Pesagem automática de itens	✔️

5	Cálculo em tempo real do valor total da compra	✔️

6	Integração entre carrinho e servidor	✔️

7	Registro de produtos no banco de dados	✔️

8	Consulta e atualização de estoque	✔️

9	Emissão de comprovante digital de compra	✔️

10	Histórico completo de compras do usuário	✔️

11	Gerenciamento de sessão do usuário	✔️

12	Armazenamento de dados persistente (SQLite/Drizzle/Supabase)	✔️

13	Rotas RESTful (GET, POST, PUT, DELETE)	✔️

14	Validação de dados no backend	✔️

15	Controle de erros centralizado	✔️

16	Interface intuitiva para checkout	✔️

17	Configuração via .env	✔️

18	Estilização dinâmica com Tailwind	✔️

19	Modularização com arquitetura limpa	✔️

20	Design responsivo e acessível	✔️

21	Máscaras e validações de CPF e telefone	⚙️ Em desenvolvimento

22	Chatbot inteligente (chatbox de suporte)	⚙️ Em desenvolvimento

23	Interface multilíngue (i18n)	✔️

24	Tema claro/escuro persistente	✔️

⚙️ Erros Conhecidos e Ajustes em Andamento
Problema Identificado	Descrição	Status
Botão de login ausente	O botão de login ainda não está visível na interface principal.	⚙️ Corrigindo
Nome aleatório na tela inicial	A tela de login exibe um identificador genérico em vez do nome real do sistema.	⚙️ Corrigindo
Máscaras de CPF e telefone	O sistema de cadastro ainda não possui máscaras aplicadas aos campos de CPF e telefone.	⚙️ Em desenvolvimento
Integração Google API	A API do Google OAuth ainda não foi configurada corretamente, portanto está temporariamente desabilitada.	⚙️ Em correção
Produtos não vinculando às listas	Há uma falha ao adicionar produtos às listas criadas; a equipe já está corrigindo o problema.	⚙️ Corrigindo
Chatbox (Chatbot inteligente)	A interface de chat ainda está em desenvolvimento e será integrada com IA em breve.	⚙️ Em desenvolvimento

🧰 Tecnologias Utilizadas
Categoria	Tecnologia

Linguagem	TypeScript

Framework Front-end	React + Vite

Banco de Dados	Supabase (PostgreSQL)

Persistência Local	SQLite / Drizzle ORM

Estilização	Tailwind CSS

Autenticação	Supabase Auth + Google OAuth

Padrões GoF	Singleton, Repository, Observer, Strategy, Factory Method

Integração de IA	Chatbot (OpenAI / HuggingFace API)

Internacionalização	i18next

Controle de versão	Git + GitHub

Deploy	Supabase / Vercel

⚙️ Como Executar o Projeto

O site foi está no ar pela fácil integração com Banco de Dados e fácil monitoramento do mesmo: http://aurorasmartcar.lovable.app

🔧 1. Pré-requisitos

Certifique-se de ter instalado:

Node.js 18+

npm ou yarn

Conta configurada no Supabase

📦 2. Instalação
# Clonar o repositório
git clone https://github.com/Gabriellindo110807/Aurora_Update0.1

# Entrar na pasta do projeto
cd Aurora_Update0.1

# Instalar dependências
npm install

🔐 3. Configurar variáveis de ambiente

Crie um arquivo .env na raiz com as seguintes variáveis:

VITE_SUPABASE_URL=https://<SEU_PROJETO>.supabase.co
VITE_SUPABASE_ANON_KEY=<SUA_CHAVE_ANON>
VITE_GOOGLE_CLIENT_ID=<SEU_CLIENT_ID>
VITE_GOOGLE_CLIENT_SECRET=<SEU_CLIENT_SECRET>

▶️ 4. Executar o projeto
npm run dev


O projeto será iniciado em:
👉 http://localhost:5173

📂 Estrutura de Diretórios
Aurora_Update0.1/

├── public/                  # Assets, ícones e logotipos

├── src/

│   ├── components/           # Componentes reutilizáveis (View)

│   ├── controllers/          # Lógica de controle e regras de negócio

│   ├── models/               # Entidades OO (Produto, Lista, Usuário)

│   ├── repositories/         # Repository Pattern e persistência

│   ├── lib/                  # Singleton de conexão com Supabase

│   ├── hooks/                # Observadores e lógicas auxiliares

│   ├── i18n/                 # Traduções multilíngues

│   └── pages/                # Páginas principais do app

├── .env.example              # Exemplo de variáveis de ambiente

├── package.json

├── vite.config.ts

└── README.md

🧾 Licença

Este projeto é licenciado sob a Licença MIT.
© 2025 Aurora Technology

🚀 Sobre o Projeto

O Aurora Technology representa o equilíbrio entre orientação a objetos, arquitetura limpa e design moderno.
Com base em padrões de projeto GoF, integração em tempo real e IA aplicada, o Aurora se consolida como uma solução escalável, modular e inteligente — projetada para o futuro dos sistemas de autoatendimento.
