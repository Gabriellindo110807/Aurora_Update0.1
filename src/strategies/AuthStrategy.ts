/**
 * Strategy Pattern - Diferentes estratégias de autenticação
 *
 * Este padrão permite trocar o algoritmo de autenticação em tempo de execução,
 * facilitando a adição de novos métodos (Google, Facebook, etc).
 */
import { auth } from '@/lib/FirebaseClient';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  UserCredential
} from 'firebase/auth';

export interface IAuthStrategy {
  login(credentials: any): Promise<any>;
  logout(): Promise<void>;
}

/**
 * Estratégia de autenticação com Email/Senha
 */
export class EmailPasswordStrategy implements IAuthStrategy {
  async login(credentials: { email: string; password: string }): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Estratégia de autenticação com Google OAuth
 */
export class GoogleAuthStrategy implements IAuthStrategy {
  async login(_credentials: any): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Context que utiliza as estratégias
 */
export class AuthContext {
  private strategy: IAuthStrategy;

  constructor(strategy: IAuthStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IAuthStrategy) {
    this.strategy = strategy;
  }

  async executeLogin(credentials: any) {
    return await this.strategy.login(credentials);
  }

  async executeLogout() {
    return await this.strategy.logout();
  }
}
