/**
 * ========================================
 * AURORA - BACK-END APPLICATION
 * ========================================
 *
 * Servidor Express com arquitetura MVC
 * Implementa padrões de projeto GoF:
 * - Singleton: Conexão única com Firebase
 * - Repository: Camada de persistência isolada
 * - Factory: Criação centralizada de objetos
 * - Strategy: Diferentes estratégias de autenticação
 * - Observer: Sistema de notificações de eventos
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');

// Inicializa Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (middleware simples)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Aurora API - Backend funcionando!',
    version: '1.0.0',
    patterns: [
      'Singleton (Firebase Connection)',
      'Repository (Data Layer)',
      'Factory (Object Creation)',
      'Strategy (Authentication)',
      'Observer (Event Notifications)'
    ],
    endpoints: {
      auth: [
        'POST /api/register - Registrar usuário',
        'POST /api/login - Fazer login'
      ],
      users: [
        'GET /api/users - Listar usuários',
        'GET /api/users/:id - Buscar usuário'
      ],
      posts: [
        'GET /api/posts - Listar posts',
        'GET /api/posts/:id - Buscar post',
        'POST /api/posts - Criar post',
        'PUT /api/posts/:id - Atualizar post',
        'DELETE /api/posts/:id - Deletar post',
        'GET /api/posts/user/:userId - Posts por usuário'
      ]
    }
  });
});

// Rotas da API
app.use('/api', userRoutes);
app.use('/api', postRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('🚀 AURORA - Back-end inicializado!');
  console.log('========================================');
  console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('📋 Padrões GoF implementados:');
  console.log('   ✅ Singleton - Conexão Firebase');
  console.log('   ✅ Repository - Camada de dados');
  console.log('   ✅ Factory - Criação de objetos');
  console.log('   ✅ Strategy - Autenticação');
  console.log('   ✅ Observer - Notificações');
  console.log('========================================');
  console.log('');
});

module.exports = app;
