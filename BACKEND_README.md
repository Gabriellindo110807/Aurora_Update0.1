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
