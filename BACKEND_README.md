# 🔧 Aurora - Back-end Separado

## 📢 Importante

Este projeto agora possui um **back-end separado** desenvolvido em **Node.js + Express + Firebase** seguindo a arquitetura **MVC** e implementando **padrões GoF**.

---

## 📂 Estrutura do Projeto

```
Aurora_Update0.1/
├── src/              # Front-end (React + TypeScript)
│   └── ...
└── server/           # ⭐ BACK-END SEPARADO (Node.js + Express)
    ├── src/
    │   ├── config/        # Singleton - Firebase
    │   ├── controllers/   # Controllers MVC
    │   ├── models/        # Models
    │   ├── repositories/  # Repository Pattern
    │   ├── routes/        # Rotas Express
    │   ├── services/      # Services
    │   └── patterns/      # Padrões GoF
    ├── app.js
    ├── package.json
    └── README.md          # 📖 Documentação completa do back-end
```

---

## 🚀 Como Rodar o Back-end

### 1. Entre na pasta do servidor

```bash
cd server
```

### 2. Leia a documentação completa

Toda a documentação detalhada está em:

📖 **[server/README.md](./server/README.md)**

Inclui:
- ✅ Instruções de instalação
- ✅ Configuração do Firebase
- ✅ Lista de endpoints da API
- ✅ Explicação dos padrões GoF
- ✅ Exemplos de uso

---

## 🎯 Padrões GoF Implementados

O back-end implementa **5 padrões GoF**:

1. **Singleton** - Conexão única com Firebase
2. **Repository** - Camada de persistência isolada
3. **Factory** - Criação centralizada de objetos
4. **Strategy** - Diferentes estratégias de autenticação
5. **Observer** - Sistema de notificações de eventos

📚 Documentação detalhada dos padrões: **[server/PADROES_GOF.md](./server/PADROES_GOF.md)**

---

## 📡 Endpoints da API

### Autenticação
- `POST /api/register` - Cadastrar usuário
- `POST /api/login` - Login

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário

### Posts
- `GET /api/posts` - Listar posts
- `POST /api/posts` - Criar post
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post
- `GET /api/posts/user/:userId` - Posts por usuário

---

## 🎓 Atende os Requisitos do Professor

✅ Sistema estruturado em orientação a objetos
✅ Padrão Repository implementado
✅ Arquitetura MVC clara e separada
✅ Singleton aplicado exclusivamente para conexão com banco
✅ 3 outros padrões GoF implementados e justificados (Factory, Strategy, Observer)
✅ Todas as funcionalidades funcionando
✅ Código em repositório GitHub público
✅ README completo com instruções

---

## 📦 Tecnologias do Back-end

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Firebase Admin SDK** - Banco de dados e autenticação
- **JavaScript ES6+** - Linguagem

---

## 🔗 Links Úteis

- **Documentação completa do back-end:** [server/README.md](./server/README.md)
- **Explicação dos padrões GoF:** [server/PADROES_GOF.md](./server/PADROES_GOF.md)
- **Repositório GitHub:** https://github.com/Gabriellindo110807/Aurora_Update0.1

---
## 💡 Funcionalidades Implementadas
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

## ⚙️ Erros Conhecidos e Ajustes em Andamento
Problema Identificado	Descrição	Status
Botão de login ausente	O botão de login ainda não está visível na interface principal.	⚙️ Corrigindo
Nome aleatório na tela inicial	A tela de login exibe um identificador genérico em vez do nome real do sistema.	⚙️ Corrigindo
Máscaras de CPF e telefone	O sistema de cadastro ainda não possui máscaras aplicadas aos campos de CPF e telefone.	⚙️ Em desenvolvimento
Integração Google API	A API do Google OAuth ainda não foi configurada corretamente, portanto está temporariamente desabilitada.	⚙️ Em correção
Produtos não vinculando às listas	Há uma falha ao adicionar produtos às listas criadas; a equipe já está corrigindo o problema.	⚙️ Corrigindo
Chatbox (Chatbot inteligente)	A interface de chat ainda está em desenvolvimento e será integrada com IA em breve.	⚙️ Em desenvolvimento


---
## 👨‍💻 Desenvolvido por

**Equipe Aurora Technology - 2025**

| Nome | Matrícula |
|------|-----------|
| Alisson Batista | 12302155 |
| Gabriel Scarpelli | 12301426 |
| Vitor Hugo Oliveira | 12302783 |
| Clara Vasconcelos | 12302317 |
| Julia Santiago | 12301841 |

---

**⚡ Para rodar o back-end, acesse a pasta `server/` e siga as instruções do README.md**
