/**
 * PADRÃO REPOSITORY - Camada de Persistência para Posts
 *
 * O Repository Pattern isola a lógica de acesso aos dados da lógica de negócio.
 * Todos os acessos ao banco relacionados a posts passam por aqui.
 */

const firebaseSingleton = require('../config/firebase');
const { collection, addDoc, getDoc, doc, getDocs, query, where, orderBy, updateDoc, deleteDoc } = require('firebase/firestore');
const Post = require('../models/Post');

class PostRepository {
  constructor() {
    this.db = firebaseSingleton.getFirestore();
    this.collectionName = 'posts';
  }

  /**
   * Cria um novo post no banco
   */
  async create(post) {
    try {
      const collectionRef = collection(this.db, this.collectionName);
      const docRef = await addDoc(collectionRef, post.toObject());
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
      const docRef = doc(this.db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return new Post(
        docSnap.id,
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
      const collectionRef = collection(this.db, this.collectionName);
      const q = query(collectionRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const posts = [];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        posts.push(
          new Post(
            docSnap.id,
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
      const collectionRef = collection(this.db, this.collectionName);
      const q = query(
        collectionRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      const posts = [];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        posts.push(
          new Post(
            docSnap.id,
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
      const docRef = doc(this.db, this.collectionName, id);
      await updateDoc(docRef, postData);
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
      const docRef = doc(this.db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar post: ${error.message}`);
    }
  }
}

module.exports = PostRepository;
