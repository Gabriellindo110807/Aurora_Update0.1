/**
 * Singleton Pattern - Garantir uma única instância da conexão Supabase
 * 
 * Este padrão é usado para evitar múltiplas conexões com o banco de dados,
 * economizando recursos e garantindo consistência na aplicação.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export class SupabaseSingleton {
  private static instance: SupabaseSingleton;
  private client: SupabaseClient<Database>;

  private constructor() {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    this.client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }

  public static getInstance(): SupabaseSingleton {
    if (!SupabaseSingleton.instance) {
      SupabaseSingleton.instance = new SupabaseSingleton();
    }
    return SupabaseSingleton.instance;
  }

  public getClient(): SupabaseClient<Database> {
    return this.client;
  }
}

// Export da instância única para uso na aplicação
export const supabase = SupabaseSingleton.getInstance().getClient();
