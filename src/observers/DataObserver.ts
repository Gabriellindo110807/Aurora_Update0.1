/**
 * Observer Pattern - Sistema de notificação para mudanças de dados
 * 
 * Este padrão permite que múltiplos componentes sejam notificados automaticamente
 * quando dados são alterados no banco, mantendo a UI sincronizada.
 */

export interface IObserver {
  update(data: any): void;
}

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(data: any): void;
}

/**
 * Subject concreto para observar mudanças em dados
 */
export class DataSubject implements ISubject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Observer already attached');
    }
    this.observers.push(observer);
  }

  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Observer not found');
    }
    this.observers.splice(observerIndex, 1);
  }

  notify(data: any): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

/**
 * Observer específico para carrinho de compras
 */
export class CartObserver implements IObserver {
  private callback: (data: any) => void;

  constructor(callback: (data: any) => void) {
    this.callback = callback;
  }

  update(data: any): void {
    this.callback(data);
  }
}

/**
 * Observer específico para listas de compras
 */
export class ShoppingListObserver implements IObserver {
  private callback: (data: any) => void;

  constructor(callback: (data: any) => void) {
    this.callback = callback;
  }

  update(data: any): void {
    this.callback(data);
  }
}

// Instâncias globais dos subjects
export const cartSubject = new DataSubject();
export const shoppingListSubject = new DataSubject();
