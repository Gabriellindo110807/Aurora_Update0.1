# 🎯 Documentação Detalhada dos Padrões GoF

Este documento explica em detalhes como cada padrão GoF foi implementado no projeto Aurora.

---

## 📚 Índice

1. [Singleton Pattern](#1-singleton-pattern)
2. [Repository Pattern](#2-repository-pattern)
3. [Factory Method Pattern](#3-factory-method-pattern)
4. [Strategy Pattern](#4-strategy-pattern)
5. [Observer Pattern](#5-observer-pattern)

---

## 1. 🔒 Singleton Pattern

### Localização
- **Arquivo:** `src/config/firebase.js`
- **Classe:** `FirebaseSingleton`

### Problema Resolvido
Sem o Singleton, cada vez que precisássemos acessar o Firebase, poderíamos criar múltiplas conexões, desperdiçando recursos e causando inconsistências.

### Solução
O Singleton garante que apenas UMA instância da conexão Firebase exista durante toda a execução da aplicação.

### Implementação

```javascript
class FirebaseSingleton {
  constructor() {
    // Se já existe uma instância, retorna ela
    if (FirebaseSingleton.instance) {
      return FirebaseSingleton.instance;
    }

    // Inicializa o Firebase apenas uma vez
    this.app = admin.initializeApp({...});
    this.db = admin.firestore();
    this.auth = admin.auth();

    // Guarda a instância
    FirebaseSingleton.instance = this;
  }

  getFirestore() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }
}

// Exporta a instância única
module.exports = new FirebaseSingleton();
```

### Uso no Código

```javascript
// Em qualquer arquivo
const firebaseSingleton = require('./config/firebase');

// Sempre retorna a MESMA instância
const db1 = firebaseSingleton.getFirestore();
const db2 = firebaseSingleton.getFirestore();

// db1 === db2 (true)
```

### Benefícios
- ✅ Uma única conexão com o Firebase
- ✅ Economia de recursos (memória e conexões)
- ✅ Configuração centralizada
- ✅ Facilita testes e manutenção

---

## 2. 🗄️ Repository Pattern

### Localização
- **Arquivos:** `src/repositories/UserRepository.js`, `src/repositories/PostRepository.js`
- **Classes:** `UserRepository`, `PostRepository`

### Problema Resolvido
Sem o Repository, os Controllers teriam que conhecer todos os detalhes do Firebase (queries, conversões, tratamento de erros). Isso viola o princípio de responsabilidade única.

### Solução
O Repository cria uma camada de abstração entre a lógica de negócio (Controllers) e o acesso aos dados (Firebase).

### Implementação

```javascript
class UserRepository {
  constructor() {
    this.db = firebaseSingleton.getFirestore();
    this.collection = this.db.collection('users');
  }

  // Cria usuário
  async create(user) {
    const docRef = await this.collection.add(user.toObject());
    return user;
  }

  // Busca por ID
  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return new User(doc.id, doc.data().email, ...);
  }

  // Busca por email
  async findByEmail(email) {
    const snapshot = await this.collection
      .where('email', '==', email)
      .limit(1)
      .get();
    // ...
  }

  // Lista todos
  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => new User(...));
  }
}
```

### Uso no Código

```javascript
// No Controller
class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAll(req, res) {
    // Controller não precisa conhecer detalhes do Firebase
    const users = await this.userRepository.findAll();
    res.json({ users });
  }
}
```

### Benefícios
- ✅ Separação de responsabilidades (SOLID)
- ✅ Controllers simples e limpos
- ✅ Facilita testes (pode-se mockar o repository)
- ✅ Fácil trocar de banco de dados no futuro

---

## 3. 🏭 Factory Method Pattern

### Localização
- **Arquivo:** `src/patterns/FactoryPattern.js`
- **Classe:** `ModelFactory`

### Problema Resolvido
Criar objetos complexos (User, Post) diretamente nos Controllers torna o código repetitivo e difícil de manter. Se a estrutura mudar, todos os lugares precisam ser atualizados.

### Solução
A Factory centraliza a criação de objetos em um único lugar.

### Implementação

```javascript
class ModelFactory {
  // Cria um usuário a partir de dados brutos
  static createUser(data) {
    return new User(
      data.id || null,
      data.email,
      data.name,
      data.createdAt || new Date()
    );
  }

  // Cria múltiplos usuários
  static createUsers(dataArray) {
    return dataArray.map(data => this.createUser(data));
  }

  // Cria um post
  static createPost(data) {
    return new Post(
      data.id || null,
      data.title,
      data.content,
      data.userId,
      data.userName,
      data.createdAt || new Date(),
      data.updatedAt || null
    );
  }

  // Factory method genérico
  static create(type, data) {
    switch (type.toLowerCase()) {
      case 'user':
        return this.createUser(data);
      case 'post':
        return this.createPost(data);
      default:
        throw new Error(`Tipo desconhecido: ${type}`);
    }
  }
}
```

### Uso no Código

```javascript
// No Controller
const user = ModelFactory.createUser({
  email: 'teste@example.com',
  name: 'Teste'
});

// Ou genérico
const post = ModelFactory.create('post', {
  title: 'Meu post',
  content: 'Conteúdo...'
});
```

### Benefícios
- ✅ Criação centralizada
- ✅ Fácil manutenção
- ✅ Reduz duplicação de código
- ✅ Permite adicionar validações na criação

---

## 4. 🎭 Strategy Pattern

### Localização
- **Arquivo:** `src/patterns/StrategyPattern.js`
- **Classes:** `EmailPasswordStrategy`, `AnonymousStrategy`, `AuthContext`

### Problema Resolvido
Ter diferentes métodos de autenticação (email/senha, Google, Facebook, anônimo) diretamente no código cria um monte de `if/else` e dificulta adicionar novos métodos.

### Solução
Cada método de autenticação é uma "estratégia" independente que pode ser trocada em tempo de execução.

### Implementação

```javascript
// Interface base
class AuthStrategy {
  async authenticate(credentials) {
    throw new Error('Deve ser implementado');
  }
}

// Estratégia 1: Email/Senha
class EmailPasswordStrategy extends AuthStrategy {
  async authenticate(credentials) {
    const { email, password } = credentials;
    const userRecord = await firebase.auth().createUser({
      email,
      password
    });
    return { success: true, userId: userRecord.uid };
  }
}

// Estratégia 2: Anônimo
class AnonymousStrategy extends AuthStrategy {
  async authenticate(credentials) {
    const userRecord = await firebase.auth().createUser({
      displayName: 'Anônimo'
    });
    return { success: true, userId: userRecord.uid };
  }
}

// Context que usa as estratégias
class AuthContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  // Troca a estratégia em tempo de execução
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  // Executa a estratégia atual
  async authenticate(credentials) {
    return await this.strategy.authenticate(credentials);
  }
}
```

### Uso no Código

```javascript
// Usando email/senha
const auth = new AuthContext(new EmailPasswordStrategy());
await auth.authenticate({ email: '...', password: '...' });

// Trocar para autenticação anônima
auth.setStrategy(new AnonymousStrategy());
await auth.authenticate({ displayName: 'Visitante' });
```

### Como Adicionar Nova Estratégia

```javascript
// Basta criar uma nova classe
class GoogleAuthStrategy extends AuthStrategy {
  async authenticate(credentials) {
    // Lógica do Google OAuth
    return { success: true, userId: '...' };
  }
}

// Usar
auth.setStrategy(new GoogleAuthStrategy());
```

### Benefícios
- ✅ Fácil adicionar novos métodos de autenticação
- ✅ Cada estratégia é independente
- ✅ Sem `if/else` gigantes
- ✅ Princípio Open/Closed (aberto para extensão, fechado para modificação)

---

## 5. 👁️ Observer Pattern

### Localização
- **Arquivo:** `src/patterns/ObserverPattern.js`
- **Classes:** `PostSubject`, `LogObserver`, `StatsObserver`, `NotificationObserver`

### Problema Resolvido
Quando um post é criado, precisamos fazer várias coisas: salvar log, atualizar estatísticas, enviar notificação. Fazer tudo no Controller o deixa complexo.

### Solução
O Observer permite que múltiplos "observadores" sejam notificados automaticamente quando um evento ocorre, sem que o Controller precise conhecê-los.

### Implementação

```javascript
// Subject (quem dispara eventos)
class PostSubject {
  constructor() {
    this.observers = [];
  }

  // Adiciona observador
  attach(observer) {
    this.observers.push(observer);
  }

  // Remove observador
  detach(observer) {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }

  // Notifica todos
  notify(data) {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }

  // Métodos de eventos
  postCreated(post) {
    this.notify({ type: 'POST_CREATED', post, timestamp: new Date() });
  }

  postUpdated(post) {
    this.notify({ type: 'POST_UPDATED', post, timestamp: new Date() });
  }

  postDeleted(postId) {
    this.notify({ type: 'POST_DELETED', postId, timestamp: new Date() });
  }
}

// Observer 1: Log
class LogObserver {
  update(data) {
    console.log(`[LOG] ${data.type}:`, data);
  }
}

// Observer 2: Estatísticas
class StatsObserver {
  constructor() {
    this.stats = { postsCreated: 0, postsUpdated: 0 };
  }

  update(data) {
    if (data.type === 'POST_CREATED') {
      this.stats.postsCreated++;
    }
    console.log('Estatísticas:', this.stats);
  }
}

// Observer 3: Notificações
class NotificationObserver {
  update(data) {
    if (data.type === 'POST_CREATED') {
      console.log(`🔔 Novo post: ${data.post.title}`);
    }
  }
}

// Configura observadores
const postSubject = new PostSubject();
postSubject.attach(new LogObserver());
postSubject.attach(new StatsObserver());
postSubject.attach(new NotificationObserver());
```

### Uso no Código

```javascript
// No Controller
class PostController {
  async create(req, res) {
    // Cria o post
    const post = await this.postRepository.create(postData);

    // Notifica observadores (dispara log, stats, notificação automaticamente)
    postSubject.postCreated(post);

    res.json({ success: true, post });
  }
}
```

### Como Adicionar Novo Observador

```javascript
// Criar nova classe
class EmailObserver {
  update(data) {
    if (data.type === 'POST_CREATED') {
      // Envia email
      sendEmail(data.post.userName, `Seu post foi publicado!`);
    }
  }
}

// Registrar
postSubject.attach(new EmailObserver());
```

### Benefícios
- ✅ Desacopla objetos que se comunicam
- ✅ Fácil adicionar/remover ações
- ✅ Controller não precisa conhecer os observadores
- ✅ Um evento dispara múltiplas ações automaticamente

---

## 🎓 Comparação: Com vs Sem Padrões

### ❌ SEM Padrões

```javascript
// Controller fazendo tudo
class PostController {
  async create(req, res) {
    // Conecta ao banco (várias conexões criadas)
    const db = admin.firestore();

    // Cria objeto manualmente
    const post = {
      id: null,
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId,
      createdAt: new Date()
    };

    // Acessa banco diretamente
    const docRef = await db.collection('posts').add(post);

    // Faz log manualmente
    console.log('[LOG] Post criado:', post.title);

    // Atualiza estatísticas manualmente
    stats.postsCreated++;

    // Envia notificação manualmente
    console.log('🔔 Novo post:', post.title);

    res.json({ post });
  }
}
```

**Problemas:**
- ❌ Controller muito complexo
- ❌ Múltiplas responsabilidades
- ❌ Difícil testar
- ❌ Difícil manter
- ❌ Código duplicado

### ✅ COM Padrões

```javascript
class PostController {
  constructor() {
    this.postRepository = new PostRepository(); // Repository
  }

  async create(req, res) {
    // Factory cria o objeto
    const post = ModelFactory.createPost(req.body);

    // Repository cuida do banco
    const savedPost = await this.postRepository.create(post);

    // Observer cuida de log, stats, notificações
    postSubject.postCreated(savedPost);

    res.json({ post: savedPost });
  }
}
```

**Benefícios:**
- ✅ Controller simples e limpo
- ✅ Cada classe tem uma responsabilidade
- ✅ Fácil testar cada parte separadamente
- ✅ Fácil adicionar novas funcionalidades
- ✅ Código reutilizável

---

## 📊 Resumo dos Padrões

| Padrão | Onde | O que faz | Por que usar |
|--------|------|-----------|--------------|
| **Singleton** | `firebase.js` | Uma única conexão Firebase | Economiza recursos |
| **Repository** | `repositories/` | Isola acesso ao banco | Separa responsabilidades |
| **Factory** | `patterns/FactoryPattern.js` | Cria objetos | Centraliza criação |
| **Strategy** | `patterns/StrategyPattern.js` | Troca algoritmos | Flexibilidade na autenticação |
| **Observer** | `patterns/ObserverPattern.js` | Notifica eventos | Desacopla ações |

---

## 🎯 Conclusão

Os padrões GoF não são apenas "frescura acadêmica" - eles resolvem problemas reais:

1. **Singleton**: Evita múltiplas conexões ao banco
2. **Repository**: Separa lógica de negócio de acesso a dados
3. **Factory**: Centraliza criação de objetos complexos
4. **Strategy**: Permite trocar algoritmos facilmente
5. **Observer**: Desacopla ações que devem ocorrer juntas

O resultado é um código:
- ✅ Mais fácil de entender
- ✅ Mais fácil de testar
- ✅ Mais fácil de manter
- ✅ Mais fácil de estender

---

**Desenvolvido pela Equipe Aurora - 2025**
