/**
 * CONTROLLER: UserController (camada MVC)
 *
 * Responsável por lidar com requisições HTTP relacionadas a usuários.
 * Conecta as rotas com a lógica de negócio (Services/Repositories).
 */

const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');

class UserController {
  constructor() {
    this.authService = new AuthService();
    this.userRepository = new UserRepository();
  }

  /**
   * POST /register - Registra novo usuário
   */
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Validação básica
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, senha e nome são obrigatórios'
        });
      }

      const result = await this.authService.register({ email, password, name });

      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /login - Realiza login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const result = await this.authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /users - Lista todos os usuários
   */
  async getAll(req, res) {
    try {
      const users = await this.userRepository.findAll();

      return res.status(200).json({
        success: true,
        count: users.length,
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }))
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /users/:id - Busca usuário por ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UserController;
