# 🌟 Aurora - Sistema de Gerenciamento com Padrões GoF

## 📋 Informações do Projeto

**Nome do Projeto:** Aurora Update 0.1

**Repositório:** https://github.com/Gabriellindo110807/Aurora_Update0.1

### 👥 Integrantes

| Nome | Matrícula |
|------|-----------|
| Gabriel Lindo | 110807 |
| [Nome do Integrante 2] | [Matrícula] |
| [Nome do Integrante 3] | [Matrícula] |

---

## 📝 Descrição

Sistema web desenvolvido com arquitetura **MVC** (Model-View-Controller) utilizando **Node.js**, **Express** e **Firebase**, aplicando **padrões de projeto GoF** (Gang of Four) para demonstrar boas práticas de desenvolvimento orientado a objetos.

O projeto implementa um sistema completo de gerenciamento de usuários e posts, com autenticação, persistência de dados e notificações em tempo real.

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação
- ✅ Cadastro de usuários (register)
- ✅ Login de usuários (login)
- ✅ Autenticação via Firebase Auth
- ✅ Validação de credenciais

### 👤 Gerenciamento de Usuários
- ✅ Criar novo usuário
- ✅ Listar todos os usuários
- ✅ Buscar usuário por ID
- ✅ Buscar usuário por email

### 📝 Gerenciamento de Posts
- ✅ Criar novo post
- ✅ Listar todos os posts
- ✅ Buscar post por ID
- ✅ Atualizar post existente
- ✅ Deletar post
- ✅ Listar posts por usuário

### 🔔 Sistema de Notificações
- ✅ Logs automáticos de ações
- ✅ Estatísticas de uso em tempo real
- ✅ Notificações de eventos do sistema

---

## 🏗️ Arquitetura do Sistema

### Estrutura de Pastas

```
server/
├── src/
│   ├── config/
│   │   └── firebase.js           # Singleton - Conexão Firebase
│   ├── controllers/
│   │   ├── UserController.js     # Controller de usuários
│   │   └── PostController.js     # Controller de posts
│   ├── models/
│   │   ├── User.js               # Model de usuário
│   │   └── Post.js               # Model de post
│   ├── repositories/
│   │   ├── UserRepository.js     # Repository de usuários
│   │   └── PostRepository.js     # Repository de posts
│   ├── routes/
│   │   ├── userRoutes.js         # Rotas de usuários
│   │   └── postRoutes.js         # Rotas de posts
│   ├── services/
│   │   └── AuthService.js        # Serviço de autenticação
│   └── patterns/
│       ├── FactoryPattern.js     # Factory Method
│       ├── StrategyPattern.js    # Strategy
│       └── ObserverPattern.js    # Observer
├── app.js                        # Aplicação principal
├── package.json                  # Dependências
├── .env.example                  # Exemplo de variáveis de ambiente
└── README.md                     # Este arquivo
```

### Camadas do MVC

#### 📊 Model (Modelo)
- **User.js**: Representa a entidade usuário
- **Post.js**: Representa a entidade post
- Encapsulam dados e validações

#### 🎮 Controller (Controlador)
- **UserController.js**: Processa requisições de usuários
- **PostController.js**: Processa requisições de posts
- Conecta as rotas com a lógica de negócio

#### 👁️ View (Visão)
- Front-end separado (React + TypeScript)
- Comunicação via API REST

---

## 🎯 Padrões de Projeto GoF Implementados

### 1. 🔒 Singleton Pattern
**Arquivo:** `src/config/firebase.js`

**Objetivo:** Garantir uma única instância da conexão com o Firebase durante toda a execução da aplicação.

**Justificativa:**
- Evita múltiplas conexões desnecessárias ao banco de dados
- Economiza recursos (memória e conexões)
- Garante consistência no acesso aos dados
- Centraliza a configuração do Firebase

**Como funciona:**
```javascript
class FirebaseSingleton {
  constructor() {
    if (FirebaseSingleton.instance) {
      return FirebaseSingleton.instance;
    }
    // Inicializa Firebase apenas uma vez
    this.app = admin.initializeApp({...});
    FirebaseSingleton.instance = this;
  }
}
```

---

### 2. 🗄️ Repository Pattern
**Arquivos:** `src/repositories/UserRepository.js`, `src/repositories/PostRepository.js`

**Objetivo:** Isolar a lógica de acesso aos dados da lógica de negócio.

**Justificativa:**
- Separa responsabilidades (princípio SOLID)
- Facilita testes unitários (pode-se mockar repositories)
- Centraliza queries ao banco de dados
- Facilita migração para outro banco no futuro
- Controllers não precisam conhecer detalhes do Firebase

**Como funciona:**
```javascript
class UserRepository {
  async create(user) {
    return await this.collection.add(user.toObject());
  }
  async findById(id) {
    return await this.collection.doc(id).get();
  }
}
```

---

### 3. 🏭 Factory Method Pattern
**Arquivo:** `src/patterns/FactoryPattern.js`

**Objetivo:** Centralizar a criação de objetos complexos (User, Post).

**Justificativa:**
- Encapsula a lógica de criação de objetos
- Facilita manutenção (mudanças em um só lugar)
- Permite criar diferentes tipos de objetos dinamicamente
- Controllers não precisam conhecer detalhes de construção

**Como funciona:**
```javascript
class ModelFactory {
  static createUser(data) {
    return new User(data.id, data.email, data.name, data.createdAt);
  }

  static createPost(data) {
    return new Post(data.id, data.title, data.content, ...);
  }
}
```

---

### 4. 🎭 Strategy Pattern
**Arquivo:** `src/patterns/StrategyPattern.js`

**Objetivo:** Permitir diferentes estratégias de autenticação intercambiáveis.

**Justificativa:**
- Facilita adicionar novos métodos de autenticação (Google, Facebook, etc.)
- Cada estratégia é independente e testável
- Cliente pode trocar estratégia em tempo de execução
- Segue princípio Open/Closed (aberto para extensão, fechado para modificação)

**Como funciona:**
```javascript
// Estratégias diferentes
class EmailPasswordStrategy {
  async authenticate(credentials) { /* lógica email/senha */ }
}

class AnonymousStrategy {
  async authenticate(credentials) { /* lógica anônima */ }
}

// Context que usa a estratégia
class AuthContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async authenticate(credentials) {
    return await this.strategy.authenticate(credentials);
  }
}
```

---

### 5. 👁️ Observer Pattern
**Arquivo:** `src/patterns/ObserverPattern.js`

**Objetivo:** Notificar múltiplos componentes quando eventos importantes ocorrem (criação, atualização, deleção de posts).

**Justificativa:**
- Desacopla objetos que precisam se comunicar
- Permite adicionar/remover observadores dinamicamente
- Facilita logging, auditoria e notificações em tempo real
- Um evento pode disparar múltiplas ações automaticamente

**Como funciona:**
```javascript
// Subject que notifica observadores
class PostSubject {
  notify(data) {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

// Observadores concretos
class LogObserver {
  update(data) {
    console.log('[LOG]', data);
  }
}

class StatsObserver {
  update(data) {
    // Atualiza estatísticas
  }
}

// Uso no controller
postSubject.postCreated(savedPost); // Notifica todos os observadores
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 14.0 ou superior
- NPM ou Yarn
- Conta no Firebase (https://console.firebase.google.com)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/Gabriellindo110807/Aurora_Update0.1.git
cd Aurora_Update0.1/server
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto ou use um existente
3. Vá em **Project Settings** > **Service Accounts**
4. Clique em **Generate New Private Key**
5. Salve o arquivo como `serviceAccountKey.json` na pasta `server/`

### Passo 4: Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
PORT=3000
NODE_ENV=development
```

### Passo 5: Iniciar o Servidor

```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

---

## 📡 Endpoints da API

### Autenticação

#### Registrar Usuário
```http
POST /api/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

### Usuários

#### Listar Todos os Usuários
```http
GET /api/users
```

#### Buscar Usuário por ID
```http
GET /api/users/:id
```

### Posts

#### Listar Todos os Posts
```http
GET /api/posts
```

#### Buscar Post por ID
```http
GET /api/posts/:id
```

#### Criar Novo Post
```http
POST /api/posts
Content-Type: application/json

{
  "title": "Título do Post",
  "content": "Conteúdo do post...",
  "userId": "id-do-usuario"
}
```

#### Atualizar Post
```http
PUT /api/posts/:id
Content-Type: application/json

{
  "title": "Novo título",
  "content": "Novo conteúdo"
}
```

#### Deletar Post
```http
DELETE /api/posts/:id
```

#### Buscar Posts por Usuário
```http
GET /api/posts/user/:userId
```

---

## 🧪 Testando a API

### Usando cURL

```bash
# Health check
curl http://localhost:3000/

# Registrar usuário
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha123","name":"Usuario Teste"}'

# Listar posts
curl http://localhost:3000/api/posts
```

### Usando Postman/Insomnia

1. Importe a collection disponível no repositório
2. Configure a base URL: `http://localhost:3000`
3. Execute as requisições

---

## 📦 Dependências Principais

```json
{
  "express": "^4.18.2",        // Framework web
  "firebase-admin": "^12.0.0", // SDK Firebase Admin
  "cors": "^2.8.5",            // CORS middleware
  "dotenv": "^16.3.1"          // Variáveis de ambiente
}
```

---

## 🎓 Requisitos do Professor - Checklist

- [x] Sistema estruturado em orientação a objetos
- [x] Padrão Repository implementado
- [x] Todas as funcionalidades funcionando
- [x] Singleton aplicado exclusivamente para conexão com o banco
- [x] Pelo menos 3 outros padrões GoF implementados e justificados:
  - [x] Factory Method
  - [x] Strategy
  - [x] Observer
- [x] Código em repositório GitHub público
- [x] README.md completo com:
  - [x] Nome do projeto
  - [x] Integrantes e matrículas
  - [x] Lista de funcionalidades
  - [x] Instruções de como rodar
  - [x] Explicação dos padrões GoF aplicados

---

## 📚 Referências

- [Design Patterns - Gang of Four](https://refactoring.guru/design-patterns)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 📄 Licença

Este projeto é licenciado sob a licença MIT.

---

## 👨‍💻 Desenvolvido por

Equipe Aurora - 2025

**Repositório:** https://github.com/Gabriellindo110807/Aurora_Update0.1
