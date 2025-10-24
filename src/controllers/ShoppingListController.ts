/**
 * Controller - Lógica de negócio para Shopping Lists
 * Utiliza Repository para acesso a dados e Observer para notificações
 */
import { ShoppingListRepository } from '@/repositories/ShoppingListRepository';
import { shoppingListSubject } from '@/observers/DataObserver';

export interface ShoppingList {
  id: string;
  name: string;
  user_id: string;
  status: 'previous' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  list_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
}

export class ShoppingListController {
  private repository: ShoppingListRepository;

  constructor() {
    this.repository = new ShoppingListRepository();
  }

  /**
   * Retorna listas do usuário
   */
  async getLists(userId: string, status?: string): Promise<ShoppingList[]> {
    const data = await this.repository.findByUserId(userId, status);
    const lists = (data || []) as ShoppingList[];
    
    // Notifica observers sobre as listas
    shoppingListSubject.notify(lists);
    
    return lists;
  }

  /**
   * Cria uma nova lista
   */
  async createList(userId: string, name: string): Promise<ShoppingList> {
    const data = await this.repository.create(userId, name);
    const list = data as ShoppingList;
    
    // Notifica sobre nova lista criada
    shoppingListSubject.notify({ action: 'created', list });
    
    return list;
  }

  /**
   * Atualiza status de uma lista
   */
  async updateListStatus(listId: string, status: string): Promise<void> {
    await this.repository.updateStatus(listId, status);
    
    // Notifica sobre atualização
    shoppingListSubject.notify({ action: 'updated', listId, status });
  }

  /**
   * Deleta uma lista
   */
  async deleteList(listId: string): Promise<void> {
    await this.repository.delete(listId);
    
    // Notifica sobre deleção
    shoppingListSubject.notify({ action: 'deleted', listId });
  }

  /**
   * Retorna itens de uma lista
   */
  async getListItems(listId: string): Promise<ShoppingListItem[]> {
    const data = await this.repository.findItemsByListId(listId);
    
    return (data || []).map(item => ({
      id: item.id,
      list_id: item.list_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      products: item.products as any
    }));
  }

  /**
   * Adiciona item à lista
   */
  async addItemToList(listId: string, productId: string, quantity: number = 1): Promise<void> {
    await this.repository.addItem(listId, productId, quantity);
    
    // Notifica sobre item adicionado
    shoppingListSubject.notify({ action: 'item_added', listId, productId });
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    await this.repository.updateItemQuantity(itemId, quantity);
    
    // Notifica sobre atualização
    shoppingListSubject.notify({ action: 'item_updated', itemId, quantity });
  }

  /**
   * Remove item da lista
   */
  async removeItemFromList(itemId: string): Promise<void> {
    await this.repository.removeItem(itemId);
    
    // Notifica sobre remoção
    shoppingListSubject.notify({ action: 'item_removed', itemId });
  }

  /**
   * Calcula total da lista
   */
  calculateTotal(items: ShoppingListItem[]): number {
    return items.reduce((total, item) => {
      const price = item.products?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }
}
