/**
 * PADRÃO REPOSITORY - Camada de Persistência para Users
 *
 * O Repository Pattern isola a lógica de acesso aos dados da lógica de negócio.
 * Benefícios:
 * - Separação de responsabilidades (MVC)
 * - Facilita testes (pode-se mockar o repositório)
 * - Centraliza queries ao banco de dados
 * - Facilita troca de banco de dados no futuro
 */

const firebaseSingleton = require('../config/firebase');
const { collection, addDoc, getDoc, doc, getDocs, query, where, limit, updateDoc, deleteDoc } = require('firebase/firestore');
const User = require('../models/User');

class UserRepository {
  constructor() {
    this.db = firebaseSingleton.getFirestore();
    this.collectionName = 'users';
  }

  /**
   * Cria um novo usuário no banco
   */
  async create(user) {
    try {
      const collectionRef = collection(this.db, this.collectionName);
      const docRef = await addDoc(collectionRef, user.toObject());
      user.id = docRef.id;
      return user;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Busca usuário por ID
   */
  async findById(id) {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return new User(docSnap.id, data.email, data.name, data.createdAt);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Busca usuário por email
   */
  async findByEmail(email) {
    try {
      const collectionRef = collection(this.db, this.collectionName);
      const q = query(collectionRef, where('email', '==', email), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      return new User(docSnap.id, data.email, data.name, data.createdAt);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  /**
   * Lista todos os usuários
   */
  async findAll() {
    try {
      const collectionRef = collection(this.db, this.collectionName);
      const snapshot = await getDocs(collectionRef);
      const users = [];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        users.push(new User(docSnap.id, data.email, data.name, data.createdAt));
      });

      return users;
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error.message}`);
    }
  }

  /**
   * Atualiza um usuário
   */
  async update(id, userData) {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      await updateDoc(docRef, userData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  /**
   * Deleta um usuário
   */
  async delete(id) {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
