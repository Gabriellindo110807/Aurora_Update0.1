/**
 * Repository Pattern - Camada de persistência para Shopping Lists
 */
import { database } from '@/lib/FirebaseClient';
import { ref, get, set, remove, push } from 'firebase/database';
import type { ShoppingList, ShoppingListItem } from '@/lib/FirebaseTypes';
import { ProductRepository } from './ProductRepository';

export class ShoppingListRepository {
  private productRepository = new ProductRepository();

  /**
   * Busca listas do usuário, opcionalmente filtradas por status
   */
  async findByUserId(userId: string, status?: string): Promise<ShoppingList[]> {
    const listsRef = ref(database, `shopping_lists/${userId}`);
    const snapshot = await get(listsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const lists: ShoppingList[] = [];
    snapshot.forEach((child) => {
      const list = { id: child.key, ...child.val() } as ShoppingList;
      if (!status || (list as any).status === status) {
        lists.push(list);
      }
    });

    // Ordena por created_at descendente
    return lists.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Cria uma nova lista
   */
  async create(userId: string, name: string): Promise<ShoppingList> {
    const listsRef = ref(database, `shopping_lists/${userId}`);
    const newListRef = push(listsRef);

    const newList: Omit<ShoppingList, 'id'> = {
      user_id: userId,
      name,
      status: 'previous',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await set(newListRef, newList);
    return { id: newListRef.key!, ...newList };
  }

  /**
   * Atualiza o status de uma lista
   */
  async updateStatus(listId: string, userId: string, status: string) {
    const listRef = ref(database, `shopping_lists/${userId}/${listId}`);
    const snapshot = await get(listRef);

    if (snapshot.exists()) {
      await set(listRef, {
        ...snapshot.val(),
        status,
        updated_at: new Date().toISOString()
      });
    }
  }

  /**
   * Deleta uma lista
   */
  async delete(listId: string, userId: string) {
    const listRef = ref(database, `shopping_lists/${userId}/${listId}`);
    await remove(listRef);

    // Remove também os itens da lista
    const itemsRef = ref(database, `shopping_list_items/${listId}`);
    await remove(itemsRef);
  }

  /**
   * Busca itens de uma lista específica
   */
  async findItemsByListId(listId: string) {
    const itemsRef = ref(database, `shopping_list_items/${listId}`);
    const snapshot = await get(itemsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const items: any[] = [];
    const promises: Promise<void>[] = [];

    snapshot.forEach((child) => {
      const item = child.val() as ShoppingListItem;
      const promise = this.productRepository.findById(item.product_id).then(product => {
        if (product) {
          items.push({
            id: child.key,
            ...item,
            products: product
          });
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
    return items;
  }

  /**
   * Adiciona item à lista
   */
  async addItem(listId: string, productId: string, quantity: number = 1) {
    const itemRef = ref(database, `shopping_list_items/${listId}/${productId}`);
    await set(itemRef, {
      list_id: listId,
      product_id: productId,
      quantity,
      is_completed: false,
      added_at: new Date().toISOString()
    });
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateItemQuantity(listId: string, itemId: string, quantity: number) {
    const itemRef = ref(database, `shopping_list_items/${listId}/${itemId}`);
    const snapshot = await get(itemRef);

    if (snapshot.exists()) {
      await set(itemRef, {
        ...snapshot.val(),
        quantity
      });
    }
  }

  /**
   * Remove item da lista
   */
  async removeItem(listId: string, itemId: string) {
    const itemRef = ref(database, `shopping_list_items/${listId}/${itemId}`);
    await remove(itemRef);
  }
}
