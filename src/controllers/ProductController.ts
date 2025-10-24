/**
 * Controller - Lógica de negócio para Products
 * Utiliza Repository para acesso a dados e Factory para criação de objetos
 */
import { ProductRepository } from '@/repositories/ProductRepository';
import { ModelFactory } from '@/factories/ModelFactory';
import { ProductModel } from '@/models/ProductModel';

export class ProductController {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  /**
   * Retorna todos os produtos
   */
  async getAllProducts(): Promise<ProductModel[]> {
    const data = await this.repository.findAll();
    return ModelFactory.createProducts(data);
  }

  /**
   * Busca produtos por termo
   */
  async searchProducts(query: string): Promise<ProductModel[]> {
    const data = await this.repository.search(query);
    return ModelFactory.createProducts(data);
  }

  /**
   * Retorna produtos de uma categoria específica
   */
  async getProductsByCategory(category: string): Promise<ProductModel[]> {
    const data = await this.repository.findByCategory(category);
    return ModelFactory.createProducts(data);
  }

  /**
   * Retorna todas as categorias disponíveis
   */
  async getCategories(): Promise<string[]> {
    return await this.repository.findAllCategories();
  }

  /**
   * Busca um produto específico por ID
   */
  async getProductById(id: string): Promise<ProductModel> {
    const data = await this.repository.findById(id);
    return ModelFactory.createProduct(data);
  }
}
