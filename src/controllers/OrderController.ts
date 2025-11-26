/**
 * Controller - Lógica de negócio para Orders
 */
import { OrderRepository } from '@/repositories/OrderRepository';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: {
    name: string;
    category: string;
  };
}

export class OrderController {
  private repository: OrderRepository;

  constructor() {
    this.repository = new OrderRepository();
  }

  /**
   * Retorna pedidos do usuário
   */
  async getOrders(userId: string): Promise<Order[]> {
    const orders = await this.repository.findByUserId(userId);
    return orders as Order[];
  }

  /**
   * Cria um novo pedido
   */
  async createOrder(
    userId: string,
    cartItems: Array<{ id: string; price: number; quantity: number }>,
    paymentMethod: string,
    discount: number = 0
  ): Promise<Order> {
    // Calcula totais
    const total_amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const final_amount = total_amount - discount;

    // Cria o pedido
    const order = await this.repository.create(userId, {
      total_amount,
      discount_amount: discount,
      final_amount,
      payment_method: paymentMethod,
      status: 'completed'
    });

    // Adiciona itens ao pedido
    const orderItems = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    await this.repository.addItems(order.id, orderItems);

    return order;
  }

  /**
   * Retorna itens de um pedido
   */
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const items = await this.repository.getOrderItems(orderId);
    return items as OrderItem[];
  }

  /**
   * Formata método de pagamento
   */
  getPaymentMethodLabel(method: string): string {
    const methods: Record<string, string> = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'PIX',
      digital_wallet: 'Carteira Digital',
      cash: 'Dinheiro'
    };
    return methods[method] || method;
  }

  /**
   * Formata status do pedido
   */
  getStatusLabel(status: string): string {
    const statuses: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return statuses[status] || status;
  }
}
