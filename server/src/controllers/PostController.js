/**
 * CONTROLLER: PostController (camada MVC)
 *
 * Responsável por lidar com requisições HTTP relacionadas a posts.
 * Conecta as rotas com a lógica de negócio (Repositories/Patterns).
 */

const PostRepository = require('../repositories/PostRepository');
const UserRepository = require('../repositories/UserRepository');
const ModelFactory = require('../patterns/FactoryPattern');
const { postSubject } = require('../patterns/ObserverPattern');

class PostController {
  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * GET /posts - Lista todos os posts
   */
  async getAll(req, res) {
    try {
      const posts = await this.postRepository.findAll();

      return res.status(200).json({
        success: true,
        count: posts.length,
        posts: posts.map(post => post.toObject())
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /posts/:id - Busca post por ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const post = await this.postRepository.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        post: post.toObject()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /posts - Cria um novo post
   */
  async create(req, res) {
    try {
      const { title, content, userId } = req.body;

      // Validação básica
      if (!title || !content || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Título, conteúdo e userId são obrigatórios'
        });
      }

      // Busca usuário
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Cria post usando Factory Pattern
      const post = ModelFactory.createPost({
        title,
        content,
        userId,
        userName: user.name
      });

      // Valida
      if (!post.isValid()) {
        return res.status(400).json({
          success: false,
          message: 'Dados de post inválidos'
        });
      }

      // Salva no banco
      const savedPost = await this.postRepository.create(post);

      // Notifica observadores (Observer Pattern)
      postSubject.postCreated(savedPost);

      return res.status(201).json({
        success: true,
        message: 'Post criado com sucesso',
        post: savedPost.toObject()
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /posts/:id - Atualiza um post
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      // Busca post existente
      const existingPost = await this.postRepository.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      // Atualiza dados
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;

      const updatedPost = await this.postRepository.update(id, updateData);

      // Notifica observadores (Observer Pattern)
      postSubject.postUpdated(updatedPost);

      return res.status(200).json({
        success: true,
        message: 'Post atualizado com sucesso',
        post: updatedPost.toObject()
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * DELETE /posts/:id - Deleta um post
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Busca post existente
      const existingPost = await this.postRepository.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      // Deleta
      await this.postRepository.delete(id);

      // Notifica observadores (Observer Pattern)
      postSubject.postDeleted(id);

      return res.status(200).json({
        success: true,
        message: 'Post deletado com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /posts/user/:userId - Busca posts por usuário
   */
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const posts = await this.postRepository.findByUserId(userId);

      return res.status(200).json({
        success: true,
        count: posts.length,
        posts: posts.map(post => post.toObject())
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PostController;
