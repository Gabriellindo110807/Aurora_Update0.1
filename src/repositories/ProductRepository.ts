/**
 * Repository Pattern - Camada de persistência para Products
 * 
 * Responsável por toda comunicação com o banco de dados relacionada a produtos.
 * Isola a lógica de acesso a dados dos controllers.
 */
import { supabase } from '@/lib/SupabaseClient';

export class ProductRepository {
  /**
   * Busca todos os produtos
   */
  async findAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Busca produtos por termo de pesquisa
   */
  async search(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,barcode.ilike.%${query}%`)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Busca um produto por ID
   */
  async findById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Busca todas as categorias únicas
   */
  async findAllCategories() {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');
    
    if (error) throw error;
    const unique = [...new Set(data?.map(p => p.category) || [])];
    return unique;
  }
}
