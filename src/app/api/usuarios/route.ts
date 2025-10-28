import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { UsuarioStats } from '@/types/spacius';

export async function GET(request: NextRequest) {
  try {
    // Verificar que Firebase esté configurado
    if (!process.env.FIREBASE_PROJECT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Firebase no configurado'
      }, { status: 500 });
    }

    // Obtener usuarios de Firebase Authentication
    const listUsersResult = await adminAuth.listUsers(1000); // máximo 1000 usuarios
    
    // Para cada usuario, obtener estadísticas de reservas
    const usuariosConStats: UsuarioStats[] = await Promise.all(
      listUsersResult.users.map(async (userRecord) => {
        try {
          // Buscar reservas del usuario en Firestore
          const reservasSnapshot = await adminDb
            .collection('reservas')
            .where('usuarioId', '==', userRecord.uid)
            .get();

          const reservas = reservasSnapshot.docs.map(doc => doc.data());
          
          // Calcular estadísticas
          const totalReservas = reservas.length;
          const reservasActivas = reservas.filter(r => r.estado === 'activa').length;
          
          // Última actividad (última reserva o creación de cuenta)
          const ultimaReserva = reservas.length > 0 
            ? Math.max(...reservas.map(r => r.fechaCreacion?.toDate?.()?.getTime() || 0))
            : 0;
          
          const ultimaActividad = ultimaReserva > 0 
            ? new Date(ultimaReserva) 
            : userRecord.metadata.lastSignInTime 
              ? new Date(userRecord.metadata.lastSignInTime)
              : new Date(userRecord.metadata.creationTime);

          return {
            id: userRecord.uid,
            email: userRecord.email || 'Sin email',
            nombre: userRecord.displayName || userRecord.email?.split('@')[0] || 'Usuario sin nombre',
            totalReservas,
            reservasActivas,
            ultimaActividad,
            fechaRegistro: new Date(userRecord.metadata.creationTime),
            activo: !userRecord.disabled
          };
        } catch (error) {
          console.error(`Error procesando usuario ${userRecord.uid}:`, error);
          // Retornar datos básicos si hay error
          return {
            id: userRecord.uid,
            email: userRecord.email || 'Sin email',
            nombre: userRecord.displayName || userRecord.email?.split('@')[0] || 'Usuario sin nombre',
            totalReservas: 0,
            reservasActivas: 0,
            ultimaActividad: new Date(userRecord.metadata.lastSignInTime || userRecord.metadata.creationTime),
            fechaRegistro: new Date(userRecord.metadata.creationTime),
            activo: !userRecord.disabled
          };
        }
      })
    );

    // Ordenar por total de reservas (descendente)
    usuariosConStats.sort((a, b) => b.totalReservas - a.totalReservas);

    return NextResponse.json({
      success: true,
      data: usuariosConStats,
      count: usuariosConStats.length,
      totalUsers: listUsersResult.users.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error obteniendo usuarios desde Firebase:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: 'Error al consultar Firebase Authentication o Firestore'
    }, { status: 500 });
  }
}