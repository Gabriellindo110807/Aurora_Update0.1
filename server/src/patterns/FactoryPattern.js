/**
 * PADRÃO FACTORY METHOD - Criação de objetos de forma centralizada
 *
 * O Factory Method Pattern define uma interface para criar objetos,
 * mas permite que as subclasses decidam qual classe instanciar.
 *
 * Benefícios:
 * - Encapsula a lógica de criação de objetos complexos
 * - Facilita a manutenção e extensão do código
 * - Permite criar diferentes tipos de objetos sem alterar código cliente
 * - Centraliza a construção, facilitando mudanças futuras
 *
 * Exemplo de uso:
 * const user = ModelFactory.createUser(data);
 * const post = ModelFactory.createPost(data);
 */

const User = require('../models/User');
const Post = require('../models/Post');

class ModelFactory {
  /**
   * Cria uma instância de User a partir de dados brutos
   */
  static createUser(data) {
    if (!data) {
      throw new Error('Dados do usuário são obrigatórios');
    }

    return new User(
      data.id || null,
      data.email,
      data.name,
      data.createdAt || new Date()
    );
  }

  /**
   * Cria múltiplos usuários a partir de um array
   */
  static createUsers(dataArray) {
    if (!Array.isArray(dataArray)) {
      throw new Error('Esperado um array de dados de usuários');
    }

    return dataArray.map(data => this.createUser(data));
  }

  /**
   * Cria uma instância de Post a partir de dados brutos
   */
  static createPost(data) {
    if (!data) {
      throw new Error('Dados do post são obrigatórios');
    }

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

  /**
   * Cria múltiplos posts a partir de um array
   */
  static createPosts(dataArray) {
    if (!Array.isArray(dataArray)) {
      throw new Error('Esperado um array de dados de posts');
    }

    return dataArray.map(data => this.createPost(data));
  }

  /**
   * Factory Method genérico - cria objeto baseado no tipo
   */
  static create(type, data) {
    switch (type.toLowerCase()) {
      case 'user':
        return this.createUser(data);
      case 'post':
        return this.createPost(data);
      default:
        throw new Error(`Tipo de modelo desconhecido: ${type}`);
    }
  }
}

module.exports = ModelFactory;
