/**
 * MODEL: Post
 *
 * Representa a entidade de post/produto no sistema.
 * Encapsula os dados e validações relacionadas a posts.
 */

class Post {
  constructor(id, title, content, userId, userName, createdAt = new Date(), updatedAt = null) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
    this.userName = userName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Converte o modelo para objeto simples (para salvar no banco)
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      userId: this.userId,
      userName: this.userName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Valida se os dados do post são válidos
   */
  isValid() {
    return (
      this.title &&
      this.title.length >= 3 &&
      this.content &&
      this.content.length >= 10 &&
      this.userId
    );
  }

  /**
   * Atualiza a data de modificação
   */
  markAsUpdated() {
    this.updatedAt = new Date();
  }
}

module.exports = Post;
