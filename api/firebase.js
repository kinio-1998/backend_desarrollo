import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Agrega logs de depuración (solo temporalmente)
console.log("Cargando variables de entorno Firebase...");
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("FIREBASE_PRIVATE_KEY (recortada):", process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30));

const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

// Verifica que ninguna variable esté faltando
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(`⚠️ La variable ${key} no está definida en el entorno`);
  }
}

if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

const db = getFirestore();

export { db, FieldValue };
