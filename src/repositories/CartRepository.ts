/**
 * Repository Pattern - Camada de persistência para Cart
 */
import { supabase } from '@/lib/SupabaseClient';

export class CartRepository {
  /**
   * Busca itens do carrinho do usuário
   */
  async findByUserId(userId: string) {
    const { data, error } = await supabase
      .from('cart')
      .select(`
        id,
        quantity,
        added_at,
        products (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Adiciona ou atualiza item no carrinho
   */
  async upsert(userId: string, productId: string, quantity: number = 1) {
    const { error } = await supabase
      .from('cart')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity
      }, {
        onConflict: 'user_id,product_id'
      });
    
    if (error) throw error;
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateQuantity(userId: string, productId: string, quantity: number) {
    const { error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
  }

  /**
   * Remove item do carrinho
   */
  async remove(userId: string, productId: string) {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) throw error;
  }

  /**
   * Limpa todo o carrinho do usuário
   */
  async clear(userId: string) {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }
}
