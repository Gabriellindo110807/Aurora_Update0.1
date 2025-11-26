/**
 * Exportação centralizada de instâncias dos controllers (Singleton Pattern)
 *
 * Garante que apenas uma instância de cada controller existe na aplicação
 */
import { ProductController } from './ProductController';
import { CartController } from './CartController';
import { ShoppingListController } from './ShoppingListController';
import { OrderController } from './OrderController';

// Instâncias únicas dos controllers
export const productController = new ProductController();
export const cartController = new CartController();
export const shoppingListController = new ShoppingListController();
export const orderController = new OrderController();

// Re-export dos tipos
export type { ShoppingList, ShoppingListItem } from './ShoppingListController';
export type { Order, OrderItem } from './OrderController';
