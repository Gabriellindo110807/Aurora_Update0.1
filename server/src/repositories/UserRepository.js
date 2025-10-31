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
const User = require('../models/User');

class UserRepository {
  constructor() {
    this.db = firebaseSingleton.getFirestore();
    this.collection = this.db.collection('users');
  }

  /**
   * Cria um novo usuário no banco
   */
  async create(user) {
    try {
      const docRef = await this.collection.add(user.toObject());
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
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return new User(doc.id, data.email, data.name, data.createdAt);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Busca usuário por email
   */
  async findByEmail(email) {
    try {
      const snapshot = await this.collection
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return new User(doc.id, data.email, data.name, data.createdAt);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  /**
   * Lista todos os usuários
   */
  async findAll() {
    try {
      const snapshot = await this.collection.get();
      const users = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        users.push(new User(doc.id, data.email, data.name, data.createdAt));
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
      await this.collection.doc(id).update(userData);
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
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
