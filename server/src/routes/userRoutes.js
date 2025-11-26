/**
 * ROUTES: User Routes
 *
 * Define as rotas HTTP relacionadas a usuários.
 * Conecta os endpoints com os métodos do controller.
 */

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

const userController = new UserController();

/**
 * POST /api/register - Registra novo usuário
 */
router.post('/register', (req, res) => {
  userController.register(req, res);
});

/**
 * POST /api/login - Realiza login
 */
router.post('/login', (req, res) => {
  userController.login(req, res);
});

/**
 * GET /api/users - Lista todos os usuários
 */
router.get('/users', (req, res) => {
  userController.getAll(req, res);
});

/**
 * GET /api/users/:id - Busca usuário por ID
 */
router.get('/users/:id', (req, res) => {
  userController.getById(req, res);
});

module.exports = router;
