import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Verificar variables de entorno
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL', 
      'FIREBASE_PRIVATE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Variables de entorno faltantes: ${missingVars.join(', ')}`,
        projectId: process.env.FIREBASE_PROJECT_ID || null,
        details: 'Crea un archivo .env.local con las credenciales de Firebase'
      }, { status: 500 });
    }

    // Intentar hacer una consulta simple
    const testCollection = adminDb.collection('test');
    await testCollection.limit(1).get();

    return NextResponse.json({
      success: true,
      message: 'Conexión a Firebase exitosa',
      projectId: process.env.FIREBASE_PROJECT_ID,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error testing Firebase connection:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      projectId: process.env.FIREBASE_PROJECT_ID || null,
      details: 'Verifica las credenciales de Firebase en el archivo .env.local'
    }, { status: 500 });
  }
}