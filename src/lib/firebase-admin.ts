import admin from 'firebase-admin';

// Configuración del Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Verificar si un usuario es admin
export async function verifyAdminUser(uid: string): Promise<boolean> {
  try {
    const user = await adminAuth.getUser(uid);
    const customClaims = user.customClaims;
    return customClaims?.admin === true;
  } catch (error) {
    console.error('Error verifying admin user:', error);
    return false;
  }
}

// Establecer claims de admin para un usuario
export async function setAdminClaims(uid: string, isAdmin: boolean = true) {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: isAdmin });
    return true;
  } catch (error) {
    console.error('Error setting admin claims:', error);
    return false;
  }
}

export default admin;