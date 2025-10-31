/**
 * PADRÃO SINGLETON - Conexão única com Firebase
 *
 * Este padrão garante que apenas uma instância da conexão com o Firebase
 * seja criada durante toda a execução da aplicação, evitando desperdício
 * de recursos e múltiplas conexões desnecessárias ao banco de dados.
 *
 * Benefícios:
 * - Economia de recursos (memória e conexões)
 * - Consistência no acesso aos dados
 * - Controle centralizado da configuração
 */

const admin = require('firebase-admin');

class FirebaseSingleton {
  constructor() {
    if (FirebaseSingleton.instance) {
      return FirebaseSingleton.instance;
    }

    // Inicializa o Firebase Admin SDK
    try {
      // Para produção, use credenciais reais do arquivo serviceAccountKey.json
      // Para desenvolvimento/teste, pode usar o emulador ou credenciais de ambiente

      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Usar credenciais do arquivo JSON em produção
        const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
        this.app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL
        });
      } else {
        // Para desenvolvimento: usar credenciais padrão ou emulador
        this.app = admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'aurora-demo'
        });

        console.log('⚠️  Firebase inicializado em modo desenvolvimento');
        console.log('   Configure FIREBASE_SERVICE_ACCOUNT para produção');
      }

      this.db = admin.firestore();
      this.auth = admin.auth();

      console.log('✅ Firebase Singleton inicializado com sucesso');

    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase:', error.message);
      throw error;
    }

    FirebaseSingleton.instance = this;
  }

  /**
   * Retorna a instância única do Firestore
   */
  getFirestore() {
    return this.db;
  }

  /**
   * Retorna a instância única do Firebase Auth
   */
  getAuth() {
    return this.auth;
  }

  /**
   * Retorna a instância única da aplicação Firebase
   */
  getApp() {
    return this.app;
  }
}

// Congela a classe para evitar modificações
Object.freeze(FirebaseSingleton);

// Exporta a instância única
module.exports = new FirebaseSingleton();
