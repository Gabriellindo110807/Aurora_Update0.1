/**
 * PADRÃO REPOSITORY - Camada de Persistência para Posts
 *
 * O Repository Pattern isola a lógica de acesso aos dados da lógica de negócio.
 * Todos os acessos ao banco relacionados a posts passam por aqui.
 */

const firebaseSingleton = require('../config/firebase');
const Post = require('../models/Post');

class PostRepository {
  constructor() {
    this.db = firebaseSingleton.getFirestore();
    this.collection = this.db.collection('posts');
  }

  /**
   * Cria um novo post no banco
   */
  async create(post) {
    try {
      const docRef = await this.collection.add(post.toObject());
      post.id = docRef.id;
      return post;
    } catch (error) {
      throw new Error(`Erro ao criar post: ${error.message}`);
    }
  }

  /**
   * Busca post por ID
   */
  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return new Post(
        doc.id,
        data.title,
        data.content,
        data.userId,
        data.userName,
        data.createdAt,
        data.updatedAt
      );
    } catch (error) {
      throw new Error(`Erro ao buscar post: ${error.message}`);
    }
  }

  /**
   * Lista todos os posts (ordenados por data de criação)
   */
  async findAll() {
    try {
      const snapshot = await this.collection
        .orderBy('createdAt', 'desc')
        .get();

      const posts = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        posts.push(
          new Post(
            doc.id,
            data.title,
            data.content,
            data.userId,
            data.userName,
            data.createdAt,
            data.updatedAt
          )
        );
      });

      return posts;
    } catch (error) {
      throw new Error(`Erro ao listar posts: ${error.message}`);
    }
  }

  /**
   * Busca posts por usuário
   */
  async findByUserId(userId) {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const posts = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        posts.push(
          new Post(
            doc.id,
            data.title,
            data.content,
            data.userId,
            data.userName,
            data.createdAt,
            data.updatedAt
          )
        );
      });

      return posts;
    } catch (error) {
      throw new Error(`Erro ao buscar posts do usuário: ${error.message}`);
    }
  }

  /**
   * Atualiza um post
   */
  async update(id, postData) {
    try {
      postData.updatedAt = new Date();
      await this.collection.doc(id).update(postData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar post: ${error.message}`);
    }
  }

  /**
   * Deleta um post
   */
  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar post: ${error.message}`);
    }
  }
}

module.exports = PostRepository;
