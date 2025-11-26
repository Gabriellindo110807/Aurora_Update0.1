/**
 * Singleton Pattern - Garantir uma única instância da conexão Firebase
 *
 * Este padrão é usado para evitar múltiplas inicializações do Firebase,
 * economizando recursos e garantindo consistência na aplicação.
 */
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export class FirebaseSingleton {
  private static instance: FirebaseSingleton;
  private app: FirebaseApp;
  private authInstance: Auth;
  private databaseInstance: Database;
  private storageInstance: FirebaseStorage;

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.authInstance = getAuth(this.app);
    this.databaseInstance = getDatabase(this.app);
    this.storageInstance = getStorage(this.app);
  }

  public static getInstance(): FirebaseSingleton {
    if (!FirebaseSingleton.instance) {
      FirebaseSingleton.instance = new FirebaseSingleton();
    }
    return FirebaseSingleton.instance;
  }

  public getApp(): FirebaseApp {
    return this.app;
  }

  public getAuth(): Auth {
    return this.authInstance;
  }

  public getDatabase(): Database {
    return this.databaseInstance;
  }

  public getStorage(): FirebaseStorage {
    return this.storageInstance;
  }
}

// Export das instâncias para uso na aplicação
export const firebase = FirebaseSingleton.getInstance();
export const auth = firebase.getAuth();
export const database = firebase.getDatabase();
export const storage = firebase.getStorage();
