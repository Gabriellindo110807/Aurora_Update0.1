/**
 * Strategy Pattern - Diferentes estratégias de autenticação
 * 
 * Este padrão permite trocar o algoritmo de autenticação em tempo de execução,
 * facilitando a adição de novos métodos (Google, Facebook, etc).
 */
import { supabase } from '@/lib/SupabaseClient';

export interface IAuthStrategy {
  login(credentials: any): Promise<any>;
  logout(): Promise<void>;
}

/**
 * Estratégia de autenticação com Email/Senha
 */
export class EmailPasswordStrategy implements IAuthStrategy {
  async login(credentials: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}

/**
 * Estratégia de autenticação com Google OAuth
 */
export class GoogleAuthStrategy implements IAuthStrategy {
  async login(_credentials: any) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
