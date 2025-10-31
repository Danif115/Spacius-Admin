import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    console.log('API reservas: Iniciando obtención de reservas');
    
    // Obtener reservas de Firestore
    const reservasSnapshot = await adminDb.collection('reservas')
      .orderBy('fechaCreacion', 'desc')
      .get();
    
    const reservas = reservasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaCreacion: doc.data().fechaCreacion?.toDate?.() || new Date(),
    }));
    
    console.log(`API reservas: ${reservas.length} reservas obtenidas`);
    
    return NextResponse.json({
      success: true,
      data: reservas,
      count: reservas.length
    });
    
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    
    // Datos mock como fallback
    const mockReservas = [
      {
        id: "1",
        lugarId: "1",
        lugarNombre: "Canchas del Parque Samanes",
        usuarioId: "user1",
        usuarioEmail: "juan.perez@email.com",
        usuarioNombre: "Juan Pérez",
        fecha: "2025-10-27",
        horaInicio: "14:00",
        horaFin: "16:00",
        estado: "activa",
        notas: "Partido de fútbol con amigos",
        fechaCreacion: new Date()
      },
      {
        id: "2",
        lugarId: "2",
        lugarNombre: "Área de picnic del Parque Samanes",
        usuarioId: "user2",
        usuarioEmail: "maria.lopez@email.com",
        usuarioNombre: "María López",
        fecha: "2025-10-28",
        horaInicio: "10:00",
        horaFin: "14:00",
        estado: "activa",
        notas: "Cumpleaños familiar",
        fechaCreacion: new Date()
      },
      {
        id: "3",
        lugarId: "1",
        lugarNombre: "Canchas del Parque Samanes",
        usuarioId: "user3",
        usuarioEmail: "carlos.martinez@email.com",
        usuarioNombre: "Carlos Martínez",
        fecha: "2025-10-24",
        horaInicio: "09:00",
        horaFin: "11:00",
        estado: "cancelada",
        notas: "",
        fechaCreacion: new Date()
      }
    ];
    
    return NextResponse.json({
      success: false,
      data: mockReservas,
      count: mockReservas.length,
      error: error instanceof Error ? error.message : 'Error desconocido',
      usingMockData: true
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, estado } = await request.json();
    
    if (!id || !estado) {
      return NextResponse.json(
        { success: false, error: 'ID y estado son requeridos' },
        { status: 400 }
      );
    }
    
    console.log(`API reservas: Actualizando reserva ${id} a estado ${estado}`);
    
    // Actualizar en Firestore
    await adminDb.collection('reservas').doc(id).update({
      estado: estado,
      fechaActualizacion: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: `Reserva ${estado} exitosamente`
    });
    
  } catch (error) {
    console.error('Error actualizando reserva:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error actualizando reserva'
    }, { status: 500 });
  }
}