/**
 * Tipos do Firebase Database
 * Define a estrutura dos dados no Realtime Database
 */

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  barcode: string | null;
  stock: number | null;
  created_at: string | null;
}

export interface Cart {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  discount_amount: number | null;
  final_amount: number;
  payment_method: string;
  status: string;
  created_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ShoppingListItem {
  id: string;
  list_id: string;
  product_id: string;
  quantity: number;
  is_completed: boolean | null;
  added_at: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  cpf: string | null;
  created_at: string | null;
  updated_at: string | null;
}
