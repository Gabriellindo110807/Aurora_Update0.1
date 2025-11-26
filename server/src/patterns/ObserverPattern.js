/**
 * PADRÃO OBSERVER - Sistema de notificação de eventos
 *
 * O Observer Pattern define uma dependência um-para-muitos entre objetos,
 * de modo que quando um objeto muda de estado, todos os seus dependentes
 * são notificados e atualizados automaticamente.
 *
 * Benefícios:
 * - Desacopla objetos que precisam se comunicar
 * - Permite adicionar/remover observadores dinamicamente
 * - Facilita logging, auditoria e notificações em tempo real
 * - Segue o princípio da responsabilidade única
 *
 * Exemplo de uso:
 * const subject = new PostSubject();
 * subject.attach(new LogObserver());
 * subject.attach(new EmailObserver());
 * subject.notify({ type: 'POST_CREATED', data: post });
 */

/**
 * Interface Observer
 */
class Observer {
  update(data) {
    throw new Error('Método update() deve ser implementado');
  }
}

/**
 * Interface Subject
 */
class Subject {
  constructor() {
    this.observers = [];
  }

  /**
   * Adiciona um observador
   */
  attach(observer) {
    if (this.observers.includes(observer)) {
      console.log('Observer já está cadastrado');
      return;
    }
    this.observers.push(observer);
  }

  /**
   * Remove um observador
   */
  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log('Observer não encontrado');
      return;
    }
    this.observers.splice(index, 1);
  }

  /**
   * Notifica todos os observadores
   */
  notify(data) {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

/**
 * Subject concreto para Posts
 */
class PostSubject extends Subject {
  constructor() {
    super();
  }

  postCreated(post) {
    console.log(`📢 Evento: Post criado - "${post.title}"`);
    this.notify({
      type: 'POST_CREATED',
      post: post,
      timestamp: new Date()
    });
  }

  postUpdated(post) {
    console.log(`📢 Evento: Post atualizado - "${post.title}"`);
    this.notify({
      type: 'POST_UPDATED',
      post: post,
      timestamp: new Date()
    });
  }

  postDeleted(postId) {
    console.log(`📢 Evento: Post deletado - ID: ${postId}`);
    this.notify({
      type: 'POST_DELETED',
      postId: postId,
      timestamp: new Date()
    });
  }
}

/**
 * Observer concreto - Log de ações
 */
class LogObserver extends Observer {
  update(data) {
    const timestamp = new Date().toISOString();
    console.log(`[LOG ${timestamp}] ${data.type}:`, JSON.stringify(data, null, 2));
  }
}

/**
 * Observer concreto - Contador de estatísticas
 */
class StatsObserver extends Observer {
  constructor() {
    super();
    this.stats = {
      postsCreated: 0,
      postsUpdated: 0,
      postsDeleted: 0
    };
  }

  update(data) {
    switch (data.type) {
      case 'POST_CREATED':
        this.stats.postsCreated++;
        break;
      case 'POST_UPDATED':
        this.stats.postsUpdated++;
        break;
      case 'POST_DELETED':
        this.stats.postsDeleted++;
        break;
    }

    console.log('📊 Estatísticas atualizadas:', this.stats);
  }

  getStats() {
    return this.stats;
  }
}

/**
 * Observer concreto - Notificações (simulado)
 */
class NotificationObserver extends Observer {
  update(data) {
    switch (data.type) {
      case 'POST_CREATED':
        console.log(`🔔 Notificação: Novo post publicado - "${data.post.title}"`);
        break;
      case 'POST_UPDATED':
        console.log(`🔔 Notificação: Post atualizado - "${data.post.title}"`);
        break;
      case 'POST_DELETED':
        console.log(`🔔 Notificação: Post deletado - ID: ${data.postId}`);
        break;
    }
  }
}

// Instância global do subject (pode ser injetada via DI em produção)
const postSubject = new PostSubject();

// Registra observadores padrão
postSubject.attach(new LogObserver());
postSubject.attach(new StatsObserver());
postSubject.attach(new NotificationObserver());

module.exports = {
  Observer,
  Subject,
  PostSubject,
  LogObserver,
  StatsObserver,
  NotificationObserver,
  postSubject
};
