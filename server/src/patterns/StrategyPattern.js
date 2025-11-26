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
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } = require('firebase/auth');

/**
 * Interface base para estratégias de autenticação
 */
class AuthStrategy {
  async authenticate(credentials) {
    throw new Error('Método authenticate() deve ser implementado');
  }

  async login(credentials) {
    throw new Error('Método login() deve ser implementado');
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
      // Cria usuário no Firebase Auth (Client SDK)
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      return {
        success: true,
        userId: userCredential.user.uid,
        email: userCredential.user.email,
        method: 'email-password'
      };
    } catch (error) {
      // Se usuário já existe, retorna sucesso (será tratado no service)
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: true,
          message: 'Usuário já existe',
          method: 'email-password',
          shouldLogin: true
        };
      }

      throw new Error(`Erro na autenticação: ${error.message}`);
    }
  }

  async login(credentials) {
    const { email, password } = credentials;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      return {
        success: true,
        userId: userCredential.user.uid,
        email: userCredential.user.email,
        method: 'email-password'
      };
    } catch (error) {
      throw new Error(`Erro no login: ${error.message}`);
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
      const userCredential = await signInAnonymously(this.auth);

      return {
        success: true,
        userId: userCredential.user.uid,
        method: 'anonymous'
      };
    } catch (error) {
      throw new Error(`Erro na autenticação anônima: ${error.message}`);
    }
  }

  async login(credentials) {
    // Para anônimo, login é igual a authenticate
    return this.authenticate(credentials);
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
   * Executa autenticação (registro) usando a estratégia atual
   */
  async authenticate(credentials) {
    return await this.strategy.authenticate(credentials);
  }

  /**
   * Executa login usando a estratégia atual
   */
  async login(credentials) {
    return await this.strategy.login(credentials);
  }
}

module.exports = {
  AuthStrategy,
  EmailPasswordStrategy,
  AnonymousStrategy,
  AuthContext
};
