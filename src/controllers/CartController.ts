/**
 * Controller - Lógica de negócio para Cart
 * Utiliza Repository para acesso a dados, Factory para criação e Observer para notificações
 */
import { CartRepository } from '@/repositories/CartRepository';
import { ModelFactory } from '@/factories/ModelFactory';
import { CartItemModel } from '@/models/ProductModel';
import { cartSubject } from '@/observers/DataObserver';

export class CartController {
  private repository: CartRepository;

  constructor() {
    this.repository = new CartRepository();
  }

  /**
   * Retorna itens do carrinho
   */
  async getCartItems(userId: string): Promise<CartItemModel[]> {
    const data = await this.repository.findByUserId(userId);
    const items = ModelFactory.createCartItems(data);
    
    // Notifica observers sobre os itens do carrinho
    cartSubject.notify(items);
    
    return items;
  }

  /**
   * Adiciona produto ao carrinho
   */
  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
    await this.repository.upsert(userId, productId, quantity);
    
    // Recarrega e notifica sobre atualização
    const items = await this.getCartItems(userId);
    cartSubject.notify(items);
  }

  /**
   * Atualiza quantidade de um item
   */
  async updateQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    await this.repository.updateQuantity(userId, productId, quantity);
    
    // Recarrega e notifica sobre atualização
    const items = await this.getCartItems(userId);
    cartSubject.notify(items);
  }

  /**
   * Remove item do carrinho
   */
  async removeFromCart(userId: string, productId: string): Promise<void> {
    await this.repository.remove(userId, productId);
    
    // Recarrega e notifica sobre atualização
    const items = await this.getCartItems(userId);
    cartSubject.notify(items);
  }

  /**
   * Limpa todo o carrinho
   */
  async clearCart(userId: string): Promise<void> {
    await this.repository.clear(userId);
    
    // Notifica que carrinho foi limpo
    cartSubject.notify([]);
  }

  /**
   * Calcula total do carrinho
   */
  calculateTotal(items: any[]): number {
    return items.reduce((total, item) => {
      const price = item.price || 0;
      const qty = item.quantity || 1;
      return total + (price * qty);
    }, 0);
  }
}
