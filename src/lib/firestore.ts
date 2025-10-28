import { adminDb } from './firebase-admin';
import { LugarFirestore, ReservaFirestore, DashboardStats, UsuarioStats } from '@/types/spacius';

const COLLECTIONS = {
  LUGARES: 'lugares',
  RESERVAS: 'reservas',
  USERS: 'users'
};

// ============================================
// GESTIÓN DE LUGARES
// ============================================

export async function obtenerTodosLosLugares(): Promise<LugarFirestore[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.LUGARES).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LugarFirestore[];
  } catch (error) {
    console.error('Error obteniendo lugares:', error);
    return [];
  }
}

export async function crearLugar(lugar: Omit<LugarFirestore, 'id'>): Promise<string | null> {
  try {
    const docRef = await adminDb.collection(COLLECTIONS.LUGARES).add({
      ...lugar,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creando lugar:', error);
    return null;
  }
}

export async function actualizarLugar(id: string, datos: Partial<LugarFirestore>): Promise<boolean> {
  try {
    await adminDb.collection(COLLECTIONS.LUGARES).doc(id).update({
      ...datos,
      fechaActualizacion: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error actualizando lugar:', error);
    return false;
  }
}

export async function eliminarLugar(id: string): Promise<boolean> {
  try {
    await adminDb.collection(COLLECTIONS.LUGARES).doc(id).delete();
    return true;
  } catch (error) {
    console.error('Error eliminando lugar:', error);
    return false;
  }
}

// ============================================
// GESTIÓN DE RESERVAS
// ============================================

export async function obtenerTodasLasReservas(): Promise<ReservaFirestore[]> {
  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.RESERVAS)
      .orderBy('fechaCreacion', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReservaFirestore[];
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return [];
  }
}

export async function cancelarReserva(id: string): Promise<boolean> {
  try {
    await adminDb.collection(COLLECTIONS.RESERVAS).doc(id).update({
      estado: 'cancelada',
      fechaActualizacion: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    return false;
  }
}

export async function obtenerReservasPorFecha(fechaInicio: string, fechaFin: string): Promise<ReservaFirestore[]> {
  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.RESERVAS)
      .where('fecha', '>=', fechaInicio)
      .where('fecha', '<=', fechaFin)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReservaFirestore[];
  } catch (error) {
    console.error('Error obteniendo reservas por fecha:', error);
    return [];
  }
}

// ============================================
// ESTADÍSTICAS Y ANALYTICS
// ============================================

export async function obtenerEstadisticasDashboard(): Promise<DashboardStats> {
  try {
    // Obtener conteos básicos
    const [lugaresSnapshot, reservasSnapshot] = await Promise.all([
      adminDb.collection(COLLECTIONS.LUGARES).get(),
      adminDb.collection(COLLECTIONS.RESERVAS).get()
    ]);

    const lugares = lugaresSnapshot.docs.map(doc => doc.data()) as LugarFirestore[];
    const reservas = reservasSnapshot.docs.map(doc => doc.data()) as ReservaFirestore[];

    // Calcular estadísticas
    const reservasActivas = reservas.filter(r => r.estado === 'activa').length;
    
    // Reservas del mes actual
    const fechaActual = new Date();
    const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const reservasMes = reservas.filter(r => {
      const fechaReserva = new Date(r.fecha);
      return fechaReserva >= inicioMes;
    }).length;

    // Lugares más populares
    const conteoLugares: { [key: string]: number } = {};
    reservas.forEach(r => {
      conteoLugares[r.lugarNombre] = (conteoLugares[r.lugarNombre] || 0) + 1;
    });

    const lugaresPopulares = Object.entries(conteoLugares)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nombre, reservas]) => ({ nombre, reservas }));

    // Reservas por día (últimos 7 días)
    const reservasPorDia = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const reservasDelDia = reservas.filter(r => r.fecha === fechaStr).length;
      reservasPorDia.push({
        fecha: fechaStr,
        reservas: reservasDelDia
      });
    }

    // Categorías populares
    const conteoCategorias: { [key: string]: number } = {};
    lugares.forEach(l => {
      conteoCategorias[l.categoria] = (conteoCategorias[l.categoria] || 0) + 1;
    });

    const categoriaPopular = Object.entries(conteoCategorias)
      .map(([categoria, count]) => ({ categoria, count }));

    return {
      totalUsuarios: new Set(reservas.map(r => r.usuarioId)).size,
      totalLugares: lugares.length,
      reservasActivas,
      reservasMes,
      lugaresPopulares,
      reservasPorDia,
      categoriaPopular
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      totalUsuarios: 0,
      totalLugares: 0,
      reservasActivas: 0,
      reservasMes: 0,
      lugaresPopulares: [],
      reservasPorDia: [],
      categoriaPopular: []
    };
  }
}

export async function obtenerEstadisticasUsuarios(): Promise<UsuarioStats[]> {
  try {
    const reservasSnapshot = await adminDb.collection(COLLECTIONS.RESERVAS).get();
    const reservas = reservasSnapshot.docs.map(doc => doc.data()) as ReservaFirestore[];

    // Agrupar por usuario
    const usuariosMap: { [key: string]: UsuarioStats } = {};

    reservas.forEach(reserva => {
      if (!usuariosMap[reserva.usuarioId]) {
        usuariosMap[reserva.usuarioId] = {
          id: reserva.usuarioId,
          email: reserva.usuarioEmail,
          nombre: reserva.usuarioNombre,
          totalReservas: 0,
          reservasActivas: 0,
          ultimaActividad: new Date(0),
          fechaRegistro: new Date(0),
          activo: true
        };
      }

      const usuario = usuariosMap[reserva.usuarioId];
      usuario.totalReservas++;
      
      if (reserva.estado === 'activa') {
        usuario.reservasActivas++;
      }

      const fechaReserva = reserva.fechaCreacion ? new Date(reserva.fechaCreacion) : new Date();
      if (fechaReserva > usuario.ultimaActividad) {
        usuario.ultimaActividad = fechaReserva;
      }
      
      if (usuario.fechaRegistro.getTime() === 0) {
        usuario.fechaRegistro = fechaReserva;
      }
    });

    return Object.values(usuariosMap).sort((a, b) => b.totalReservas - a.totalReservas);
  } catch (error) {
    console.error('Error obteniendo estadísticas de usuarios:', error);
    return [];
  }
}