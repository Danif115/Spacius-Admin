import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { LugarFirestore } from '@/types/spacius';

export async function GET(request: NextRequest) {
  try {
    // Verificar que Firebase esté configurado
    if (!process.env.FIREBASE_PROJECT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Firebase no configurado'
      }, { status: 500 });
    }

    // Obtener todos los lugares de Firestore
    const lugaresSnapshot = await adminDb.collection('lugares').get();
    
    const lugares: LugarFirestore[] = lugaresSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LugarFirestore[];

    return NextResponse.json({
      success: true,
      data: lugares,
      count: lugares.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error obteniendo lugares desde Firebase:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: 'Error al consultar la colección "lugares" en Firestore'
    }, { status: 500 });
  }
}

// API para crear un nuevo lugar
export async function POST(request: NextRequest) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Firebase no configurado'
      }, { status: 500 });
    }

    const body = await request.json();
    
    // Validar datos requeridos
    const requiredFields = ['nombre', 'descripcion', 'latitud', 'longitud', 'categoria'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Crear el nuevo lugar con timestamps
    const nuevoLugar = {
      ...body,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      activo: body.activo ?? true
    };

    const docRef = await adminDb.collection('lugares').add(nuevoLugar);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...nuevoLugar
      },
      message: 'Lugar creado exitosamente'
    });

  } catch (error) {
    console.error('Error creando lugar:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}