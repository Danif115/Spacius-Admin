import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Eliminar un lugar específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Firebase no configurado'
      }, { status: 500 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID del lugar requerido'
      }, { status: 400 });
    }

    // Verificar que el lugar existe
    const lugarDoc = await adminDb.collection('lugares').doc(id).get();
    
    if (!lugarDoc.exists) {
      return NextResponse.json({
        success: false,
        error: 'Lugar no encontrado'
      }, { status: 404 });
    }

    // Eliminar el lugar
    await adminDb.collection('lugares').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Lugar eliminado exitosamente',
      deletedId: id
    });

  } catch (error) {
    console.error('Error eliminando lugar:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// Actualizar un lugar específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Firebase no configurado'
      }, { status: 500 });
    }

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID del lugar requerido'
      }, { status: 400 });
    }

    // Verificar que el lugar existe
    const lugarDoc = await adminDb.collection('lugares').doc(id).get();
    
    if (!lugarDoc.exists) {
      return NextResponse.json({
        success: false,
        error: 'Lugar no encontrado'
      }, { status: 404 });
    }

    // Actualizar el lugar
    const datosActualizados = {
      ...body,
      fechaActualizacion: new Date()
    };

    await adminDb.collection('lugares').doc(id).update(datosActualizados);

    return NextResponse.json({
      success: true,
      message: 'Lugar actualizado exitosamente',
      data: {
        id,
        ...datosActualizados
      }
    });

  } catch (error) {
    console.error('Error actualizando lugar:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}