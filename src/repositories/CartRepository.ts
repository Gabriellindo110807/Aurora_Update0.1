/**
 * Repository Pattern - Camada de persistência para Cart
 */
import { database } from '@/lib/FirebaseClient';
import { ref, get, set, remove, query, orderByChild, equalTo } from 'firebase/database';
import type { Cart, Product } from '@/lib/FirebaseTypes';
import { ProductRepository } from './ProductRepository';

export class CartRepository {
  private productRepository = new ProductRepository();

  /**
   * Busca itens do carrinho do usuário
   */
  async findByUserId(userId: string) {
    const cartRef = ref(database, `cart/${userId}`);
    const snapshot = await get(cartRef);

    if (!snapshot.exists()) {
      return [];
    }

    const cartItems: any[] = [];
    const promises: Promise<void>[] = [];

    snapshot.forEach((child) => {
      const cartItem = child.val() as Cart;
      const promise = this.productRepository.findById(cartItem.product_id).then(product => {
        if (product) {
          cartItems.push({
            id: child.key,
            quantity: cartItem.quantity,
            added_at: cartItem.added_at,
            products: product
          });
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
    return cartItems;
  }

  /**
   * Adiciona ou atualiza item no carrinho
   */
  async upsert(userId: string, productId: string, quantity: number = 1) {
    const cartItemRef = ref(database, `cart/${userId}/${productId}`);
    await set(cartItemRef, {
      user_id: userId,
      product_id: productId,
      quantity,
      added_at: new Date().toISOString()
    });
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cartItemRef = ref(database, `cart/${userId}/${productId}`);
    const snapshot = await get(cartItemRef);

    if (snapshot.exists()) {
      await set(cartItemRef, {
        ...snapshot.val(),
        quantity
      });
    }
  }

  /**
   * Remove item do carrinho
   */
  async remove(userId: string, productId: string) {
    const cartItemRef = ref(database, `cart/${userId}/${productId}`);
    await remove(cartItemRef);
  }

  /**
   * Limpa todo o carrinho do usuário
   */
  async clear(userId: string) {
    const cartRef = ref(database, `cart/${userId}`);
    await remove(cartRef);
  }
}
