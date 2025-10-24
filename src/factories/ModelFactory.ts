/**
 * Factory Method Pattern - Criação de objetos de modelo
 * 
 * Este padrão centraliza a criação de objetos complexos,
 * permitindo flexibilidade e manutenção simplificada.
 */
import { ProductModel, CartItemModel } from '@/models/ProductModel';

export class ModelFactory {
  /**
   * Cria um ProductModel a partir de dados do banco
   */
  static createProduct(data: any): ProductModel {
    return new ProductModel(
      data.id,
      data.name,
      data.category,
      data.price,
      data.description,
      data.barcode,
      data.image_url,
      data.stock,
      data.created_at
    );
  }

  /**
   * Cria um array de ProductModel
   */
  static createProducts(dataArray: any[]): ProductModel[] {
    return dataArray.map(data => this.createProduct(data));
  }

  /**
   * Cria um CartItemModel a partir de dados do banco
   */
  static createCartItem(data: any): CartItemModel {
    const product = this.createProduct(data.products || data);
    return new CartItemModel(product, data.quantity, data.id);
  }

  /**
   * Cria um array de CartItemModel
   */
  static createCartItems(dataArray: any[]): CartItemModel[] {
    return dataArray.map(data => this.createCartItem(data));
  }
}
