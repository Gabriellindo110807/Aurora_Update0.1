/**
 * Repository Pattern - Camada de persistência para Products
 *
 * Responsável por toda comunicação com o banco de dados relacionada a produtos.
 * Isola a lógica de acesso a dados dos controllers.
 */
import { database } from '@/lib/FirebaseClient';
import { ref, get, query, orderByChild } from 'firebase/database';
import type { Product } from '@/lib/FirebaseTypes';

export class ProductRepository {
  /**
   * Busca todos os produtos
   */
  async findAll(): Promise<Product[]> {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const products: Product[] = [];
    snapshot.forEach((child) => {
      products.push({ id: child.key, ...child.val() } as Product);
    });

    // Ordena por nome
    return products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  /**
   * Busca produtos por termo de pesquisa
   */
  async search(searchQuery: string): Promise<Product[]> {
    const allProducts = await this.findAll();
    const lowerQuery = searchQuery.toLowerCase();

    return allProducts.filter(product =>
      product.name?.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.barcode?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(category: string): Promise<Product[]> {
    const allProducts = await this.findAll();
    return allProducts.filter(product => product.category === category);
  }

  /**
   * Busca um produto por ID
   */
  async findById(id: string): Promise<Product | null> {
    const productRef = ref(database, `products/${id}`);
    const snapshot = await get(productRef);

    if (!snapshot.exists()) {
      return null;
    }

    return { id: snapshot.key, ...snapshot.val() } as Product;
  }

  /**
   * Busca todas as categorias únicas
   */
  async findAllCategories(): Promise<string[]> {
    const allProducts = await this.findAll();
    const categories = allProducts
      .map(p => p.category)
      .filter(c => c !== null && c !== undefined) as string[];

    const unique = [...new Set(categories)];
    return unique.sort();
  }
}
