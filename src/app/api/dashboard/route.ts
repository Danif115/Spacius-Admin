import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { DashboardStats } from '@/types/spacius';

export async function GET(request: NextRequest) {
  try {
    // Verificar que Firebase esté configurado
    if (!process.env.FIREBASE_PROJECT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Firebase no configurado'
      }, { status: 500 });
    }

    // Obtener estadísticas de las diferentes fuentes
    const [lugaresSnapshot, reservasSnapshot, authUsers] = await Promise.all([
      adminDb.collection('lugares').get(),
      adminDb.collection('reservas').get(),
      adminAuth.listUsers(1000), // Obtener usuarios de Firebase Authentication
    ]);

    // Calcular estadísticas básicas
    const totalLugares = lugaresSnapshot.size;
    const totalUsuarios = authUsers.users.length; // Usuarios reales de Firebase Auth
    const totalReservas = reservasSnapshot.size;

    // Calcular reservas activas
    const reservasActivas = reservasSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.estado === 'activa';
    }).length;

    // Calcular reservas del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const reservasMes = reservasSnapshot.docs.filter(doc => {
      const data = doc.data();
      const fechaCreacion = data.fechaCreacion?.toDate() || new Date(data.fecha);
      return fechaCreacion >= inicioMes;
    }).length;

    // Calcular lugares más populares
    const lugaresPopulares = new Map<string, number>();
    reservasSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const lugarNombre = data.lugarNombre || 'Lugar desconocido';
      lugaresPopulares.set(lugarNombre, (lugaresPopulares.get(lugarNombre) || 0) + 1);
    });

    const lugaresPopularesArray = Array.from(lugaresPopulares.entries())
      .map(([nombre, reservas]) => ({ nombre, reservas }))
      .sort((a, b) => b.reservas - a.reservas)
      .slice(0, 5);

    // Calcular reservas por categoría
    const categoriaCount = new Map<string, number>();
    lugaresSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const categoria = data.categoria || 'sin categoria';
      categoriaCount.set(categoria, (categoriaCount.get(categoria) || 0) + 1);
    });

    const categoriaPopular = Array.from(categoriaCount.entries())
      .map(([categoria, count]) => ({ categoria, count }));

    // Calcular reservas por día (últimos 7 días)
    const reservasPorDia = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const reservasDelDia = reservasSnapshot.docs.filter(doc => {
        const data = doc.data();
        return data.fecha === fechaStr;
      }).length;
      
      reservasPorDia.push({
        fecha: fechaStr,
        reservas: reservasDelDia
      });
    }

    const stats: DashboardStats = {
      totalUsuarios,
      totalLugares,
      reservasActivas,
      reservasMes,
      lugaresPopulares: lugaresPopularesArray,
      reservasPorDia,
      categoriaPopular
    };

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: 'Error al consultar las colecciones de Firebase'
    }, { status: 500 });
  }
}