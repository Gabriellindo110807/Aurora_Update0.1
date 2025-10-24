export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  barcode: string | null;
  image_url: string | null;
  stock: number;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
  cart_id?: string;
}

// Helper function para converter ProductModel para Product
export function toProduct(model: any): Product {
  return {
    id: model.id || model._id,
    name: model.name || model._name,
    description: model.description || model._description,
    category: model.category || model._category,
    price: model.price || model._price,
    barcode: model.barcode || model._barcode,
    image_url: model.imageUrl || model.image_url || model._imageUrl,
    stock: model.stock || model._stock,
    created_at: model.createdAt || model.created_at || model._createdAt
  };
}

// Helper function para converter CartItemModel para CartItem
export function toCartItem(model: any): CartItem {
  const product = toProduct(model);
  return {
    ...product,
    quantity: model.quantity || model._quantity,
    cart_id: model.cartId || model.cart_id || model._cartId
  };
}
