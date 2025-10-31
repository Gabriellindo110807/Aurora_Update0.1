/**
 * SERVICE: AuthService
 *
 * Camada de serviço para operações de autenticação.
 * Utiliza Strategy Pattern para diferentes métodos de autenticação.
 */

const { AuthContext, EmailPasswordStrategy, AnonymousStrategy } = require('../patterns/StrategyPattern');
const UserRepository = require('../repositories/UserRepository');
const ModelFactory = require('../patterns/FactoryPattern');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.authContext = new AuthContext(new EmailPasswordStrategy());
  }

  /**
   * Registra um novo usuário
   */
  async register(userData) {
    try {
      // Verifica se usuário já existe
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Autentica no Firebase Auth (usando Strategy Pattern)
      await this.authContext.authenticate({
        email: userData.email,
        password: userData.password
      });

      // Cria modelo usando Factory Pattern
      const user = ModelFactory.createUser({
        email: userData.email,
        name: userData.name
      });

      // Valida
      if (!user.isValid()) {
        throw new Error('Dados de usuário inválidos');
      }

      // Salva no banco usando Repository Pattern
      const savedUser = await this.userRepository.create(user);

      return {
        success: true,
        user: savedUser
      };
    } catch (error) {
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    }
  }

  /**
   * Realiza login de um usuário
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Busca usuário no banco
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Autentica no Firebase (usando Strategy Pattern)
      const authResult = await this.authContext.authenticate({
        email,
        password
      });

      return {
        success: true,
        user: user,
        authResult: authResult
      };
    } catch (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }

  /**
   * Troca para autenticação anônima
   */
  useAnonymousAuth() {
    this.authContext.setStrategy(new AnonymousStrategy());
  }

  /**
   * Troca para autenticação email/senha
   */
  useEmailPasswordAuth() {
    this.authContext.setStrategy(new EmailPasswordStrategy());
  }
}

module.exports = AuthService;
