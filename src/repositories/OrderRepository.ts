/**
 * Repository Pattern - Camada de persistência para Orders
 */
import { database } from '@/lib/FirebaseClient';
import { ref, get, set, push, query, orderByChild } from 'firebase/database';
import type { Order, OrderItem } from '@/lib/FirebaseTypes';
import { ProductRepository } from './ProductRepository';

export class OrderRepository {
  private productRepository = new ProductRepository();

  /**
   * Busca pedidos do usuário
   */
  async findByUserId(userId: string): Promise<any[]> {
    const ordersRef = ref(database, `orders/${userId}`);
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) {
      return [];
    }

    const orders: any[] = [];
    const promises: Promise<void>[] = [];

    snapshot.forEach((child) => {
      const order = { id: child.key, ...child.val() } as Order;

      const promise = this.getOrderItems(child.key!).then(items => {
        orders.push({
          ...order,
          order_items: items
        });
      });

      promises.push(promise);
    });

    await Promise.all(promises);

    // Ordena por created_at descendente
    return orders.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Cria um novo pedido
   */
  async create(userId: string, orderData: {
    total_amount: number;
    discount_amount: number;
    final_amount: number;
    payment_method: string;
    status: string;
  }): Promise<Order> {
    const ordersRef = ref(database, `orders/${userId}`);
    const newOrderRef = push(ordersRef);

    const newOrder: Omit<Order, 'id'> = {
      user_id: userId,
      ...orderData,
      created_at: new Date().toISOString()
    };

    await set(newOrderRef, newOrder);
    return { id: newOrderRef.key!, ...newOrder };
  }

  /**
   * Adiciona itens ao pedido
   */
  async addItems(orderId: string, items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>): Promise<void> {
    const itemsRef = ref(database, `order_items/${orderId}`);

    const itemsData: any = {};
    items.forEach(item => {
      const itemRef = push(itemsRef);
      itemsData[itemRef.key!] = {
        order_id: orderId,
        ...item
      };
    });

    await set(itemsRef, itemsData);
  }

  /**
   * Busca itens de um pedido
   */
  async getOrderItems(orderId: string): Promise<any[]> {
    const itemsRef = ref(database, `order_items/${orderId}`);
    const snapshot = await get(itemsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const items: any[] = [];
    const promises: Promise<void>[] = [];

    snapshot.forEach((child) => {
      const item = child.val() as OrderItem;
      const promise = this.productRepository.findById(item.product_id).then(product => {
        if (product) {
          items.push({
            id: child.key,
            ...item,
            products: {
              name: product.name,
              category: product.category
            }
          });
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
    return items;
  }
}
