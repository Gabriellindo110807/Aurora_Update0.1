/**
 * Model - Classe Product com encapsulamento real (OO)
 */
export class ProductModel {
  private _id: string;
  private _name: string;
  private _description: string | null;
  private _category: string;
  private _price: number;
  private _barcode: string | null;
  private _imageUrl: string | null;
  private _stock: number;
  private _createdAt: string;

  constructor(
    id: string,
    name: string,
    category: string,
    price: number,
    description: string | null = null,
    barcode: string | null = null,
    imageUrl: string | null = null,
    stock: number = 0,
    createdAt: string = new Date().toISOString()
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._category = category;
    this._price = price;
    this._barcode = barcode;
    this._imageUrl = imageUrl;
    this._stock = stock;
    this._createdAt = createdAt;
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get category(): string { return this._category; }
  get price(): number { return this._price; }
  get barcode(): string | null { return this._barcode; }
  get imageUrl(): string | null { return this._imageUrl; }
  get stock(): number { return this._stock; }
  get createdAt(): string { return this._createdAt; }

  // Setters
  set name(value: string) { this._name = value; }
  set description(value: string | null) { this._description = value; }
  set category(value: string) { this._category = value; }
  set price(value: number) { 
    if (value < 0) throw new Error("Price cannot be negative");
    this._price = value; 
  }
  set stock(value: number) { 
    if (value < 0) throw new Error("Stock cannot be negative");
    this._stock = value; 
  }

  // Método de negócio
  public isInStock(): boolean {
    return this._stock > 0;
  }

  // Converter para formato do banco
  public toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      category: this._category,
      price: this._price,
      barcode: this._barcode,
      image_url: this._imageUrl,
      stock: this._stock,
      created_at: this._createdAt
    };
  }
}

export class CartItemModel extends ProductModel {
  private _quantity: number;
  private _cartId?: string;

  constructor(
    product: ProductModel,
    quantity: number = 1,
    cartId?: string
  ) {
    super(
      product.id,
      product.name,
      product.category,
      product.price,
      product.description,
      product.barcode,
      product.imageUrl,
      product.stock,
      product.createdAt
    );
    this._quantity = quantity;
    this._cartId = cartId;
  }

  get quantity(): number { return this._quantity; }
  get cartId(): string | undefined { return this._cartId; }

  set quantity(value: number) {
    if (value < 1) throw new Error("Quantity must be at least 1");
    this._quantity = value;
  }

  public getTotalPrice(): number {
    return this.price * this._quantity;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      quantity: this._quantity,
      cart_id: this._cartId
    };
  }
}
