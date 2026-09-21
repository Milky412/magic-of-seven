import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

export const firebaseApp = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
let firestore: Firestore | null = null;

if (firebaseApp) {
  try {
    // 直前に受信したpublic/private snapshotをIndexedDBへ保持する。
    // 再読込・画面復帰時はキャッシュを先に表示し、その後サーバーの最新値へ更新される。
    firestore = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    // すでにFirestoreが初期化済み、または永続キャッシュを使えない環境では
    // 通常のメモリキャッシュへ安全にフォールバックする。
    firestore = getFirestore(firebaseApp);
  }
}

export const db = firestore;
