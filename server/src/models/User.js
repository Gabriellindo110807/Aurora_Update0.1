/**
 * MODEL: User
 *
 * Representa a entidade de usuário no sistema.
 * Encapsula os dados e validações relacionadas ao usuário.
 */

class User {
  constructor(id, email, name, createdAt = new Date()) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
  }

  /**
   * Converte o modelo para objeto simples (para salvar no banco)
   */
  toObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt
    };
  }

  /**
   * Valida se os dados do usuário são válidos
   */
  isValid() {
    return (
      this.email &&
      this.email.includes('@') &&
      this.name &&
      this.name.length >= 2
    );
  }
}

module.exports = User;
