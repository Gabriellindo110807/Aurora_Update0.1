/**
 * Repository Pattern - Camada de persistência para Shopping Lists
 */
import { supabase } from '@/lib/SupabaseClient';

export class ShoppingListRepository {
  /**
   * Busca listas do usuário, opcionalmente filtradas por status
   */
  async findByUserId(userId: string, status?: string) {
    let query = supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', userId);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Cria uma nova lista
   */
  async create(userId: string, name: string) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: userId,
        name,
        status: 'previous'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Atualiza o status de uma lista
   */
  async updateStatus(listId: string, status: string) {
    const { error } = await supabase
      .from('shopping_lists')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', listId);
    
    if (error) throw error;
  }

  /**
   * Deleta uma lista
   */
  async delete(listId: string) {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', listId);
    
    if (error) throw error;
  }

  /**
   * Busca itens de uma lista específica
   */
  async findItemsByListId(listId: string) {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .select(`
        *,
        products (*)
      `)
      .eq('list_id', listId);
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Adiciona item à lista
   */
  async addItem(listId: string, productId: string, quantity: number = 1) {
    const { error } = await supabase
      .from('shopping_list_items')
      .upsert({
        list_id: listId,
        product_id: productId,
        quantity
      }, {
        onConflict: 'list_id,product_id'
      });
    
    if (error) throw error;
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateItemQuantity(itemId: string, quantity: number) {
    const { error } = await supabase
      .from('shopping_list_items')
      .update({ quantity })
      .eq('id', itemId);
    
    if (error) throw error;
  }

  /**
   * Remove item da lista
   */
  async removeItem(itemId: string) {
    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
  }
}
