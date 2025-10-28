// Tipos compartidos con la app móvil Spacius
export interface LugarFirestore {
  id: string;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  imagenUrl: string;
  fechaDisponible: string;
  horaDisponible: string;
  categoria: 'deportivo' | 'recreativo' | 'cultural';
  capacidadMaxima: number;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface ReservaFirestore {
  id: string;
  lugarId: string;
  lugarNombre: string;
  usuarioId: string;
  usuarioEmail: string;
  usuarioNombre: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  estado: 'activa' | 'cancelada' | 'completada';
  notas: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface UsuarioStats {
  id: string;
  email: string;
  nombre: string;
  totalReservas: number;
  reservasActivas: number;
  ultimaActividad: Date;
  fechaRegistro: Date;
  activo: boolean;
}

export interface DashboardStats {
  totalUsuarios: number;
  totalLugares: number;
  reservasActivas: number;
  reservasMes: number;
  lugaresPopulares: {
    nombre: string;
    reservas: number;
  }[];
  reservasPorDia: {
    fecha: string;
    reservas: number;
  }[];
  categoriaPopular: {
    categoria: string;
    count: number;
  }[];
}

export interface AdminUser {
  uid: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'super_admin';
  permisos: string[];
}