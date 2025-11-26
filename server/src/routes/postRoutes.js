/**
 * ROUTES: Post Routes
 *
 * Define as rotas HTTP relacionadas a posts.
 * Conecta os endpoints com os métodos do controller.
 */

const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

const postController = new PostController();

/**
 * GET /api/posts - Lista todos os posts
 */
router.get('/posts', (req, res) => {
  postController.getAll(req, res);
});

/**
 * GET /api/posts/:id - Busca post por ID
 */
router.get('/posts/:id', (req, res) => {
  postController.getById(req, res);
});

/**
 * POST /api/posts - Cria novo post
 */
router.post('/posts', (req, res) => {
  postController.create(req, res);
});

/**
 * PUT /api/posts/:id - Atualiza post
 */
router.put('/posts/:id', (req, res) => {
  postController.update(req, res);
});

/**
 * DELETE /api/posts/:id - Deleta post
 */
router.delete('/posts/:id', (req, res) => {
  postController.delete(req, res);
});

/**
 * GET /api/posts/user/:userId - Busca posts por usuário
 */
router.get('/posts/user/:userId', (req, res) => {
  postController.getByUserId(req, res);
});

module.exports = router;
