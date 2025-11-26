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

const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
const { getAuth, connectAuthEmulator } = require('firebase/auth');

class FirebaseSingleton {
  constructor() {
    if (FirebaseSingleton.instance) {
      return FirebaseSingleton.instance;
    }

    // Inicializa o Firebase Client SDK
    try {
      // Configuração do Firebase a partir das variáveis de ambiente
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      };

      // Inicializa o app Firebase
      this.app = initializeApp(firebaseConfig);

      // Inicializa Firestore e Auth
      this.db = getFirestore(this.app);
      this.auth = getAuth(this.app);

      // Se estiver em modo desenvolvimento, pode usar emuladores
      if (process.env.USE_FIREBASE_EMULATOR === 'true') {
        connectFirestoreEmulator(this.db, 'localhost', 8080);
        connectAuthEmulator(this.auth, 'http://localhost:9099');
        console.log('⚠️  Firebase rodando com emuladores locais');
      }

      console.log('✅ Firebase Singleton inicializado com sucesso');
      console.log(`   Projeto: ${firebaseConfig.projectId || 'não configurado'}`);

    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase:', error.message);
      console.error('   Verifique se as variáveis de ambiente estão configuradas no arquivo .env');
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
