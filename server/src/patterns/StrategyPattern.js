/**
 * PADRÃO STRATEGY - Diferentes estratégias de autenticação
 *
 * O Strategy Pattern define uma família de algoritmos, encapsula cada um deles
 * e os torna intercambiáveis. O padrão permite que o algoritmo varie
 * independentemente dos clientes que o utilizam.
 *
 * Benefícios:
 * - Facilita adicionar novos métodos de autenticação sem modificar código existente
 * - Cada estratégia é independente e testável separadamente
 * - Cliente pode escolher qual estratégia usar em tempo de execução
 * - Segue o princípio Open/Closed (aberto para extensão, fechado para modificação)
 *
 * Exemplo de uso:
 * const auth = new AuthContext(new EmailPasswordStrategy());
 * await auth.authenticate(credentials);
 */

const firebaseSingleton = require('../config/firebase');

/**
 * Interface base para estratégias de autenticação
 */
class AuthStrategy {
  async authenticate(credentials) {
    throw new Error('Método authenticate() deve ser implementado');
  }

  async validateToken(token) {
    throw new Error('Método validateToken() deve ser implementado');
  }
}

/**
 * Estratégia de autenticação via Email/Password
 */
class EmailPasswordStrategy extends AuthStrategy {
  constructor() {
    super();
    this.auth = firebaseSingleton.getAuth();
  }

  async authenticate(credentials) {
    const { email, password } = credentials;

    try {
      // Cria usuário no Firebase Auth
      const userRecord = await this.auth.createUser({
        email: email,
        password: password
      });

      return {
        success: true,
        userId: userRecord.uid,
        email: userRecord.email,
        method: 'email-password'
      };
    } catch (error) {
      // Se usuário já existe, tenta fazer login
      if (error.code === 'auth/email-already-exists') {
        return {
          success: true,
          message: 'Usuário já existe',
          method: 'email-password'
        };
      }

      throw new Error(`Erro na autenticação: ${error.message}`);
    }
  }

  async validateToken(token) {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return {
        valid: true,
        userId: decodedToken.uid,
        email: decodedToken.email
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

/**
 * Estratégia de autenticação anônima (para testes/demo)
 */
class AnonymousStrategy extends AuthStrategy {
  constructor() {
    super();
    this.auth = firebaseSingleton.getAuth();
  }

  async authenticate(credentials) {
    try {
      const userRecord = await this.auth.createUser({
        displayName: credentials.displayName || 'Anônimo'
      });

      return {
        success: true,
        userId: userRecord.uid,
        method: 'anonymous'
      };
    } catch (error) {
      throw new Error(`Erro na autenticação anônima: ${error.message}`);
    }
  }

  async validateToken(token) {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return {
        valid: true,
        userId: decodedToken.uid
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

/**
 * Context que utiliza as estratégias
 */
class AuthContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  /**
   * Permite trocar a estratégia em tempo de execução
   */
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  /**
   * Executa autenticação usando a estratégia atual
   */
  async authenticate(credentials) {
    return await this.strategy.authenticate(credentials);
  }

  /**
   * Valida token usando a estratégia atual
   */
  async validateToken(token) {
    return await this.strategy.validateToken(token);
  }
}

module.exports = {
  AuthStrategy,
  EmailPasswordStrategy,
  AnonymousStrategy,
  AuthContext
};
