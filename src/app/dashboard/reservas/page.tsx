'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReservaFirestore } from '@/types/spacius';
import { Calendar, Clock, MapPin, User, Filter, X } from 'lucide-react';

// Mock data de reservas
const mockReservas: ReservaFirestore[] = [
  {
    id: "1",
    lugarId: "1",
    lugarNombre: "Canchas del Parque Samanes",
    usuarioId: "user1",
    usuarioEmail: "juan.perez@email.com",
    usuarioNombre: "Juan Pérez",
    fecha: "2025-10-28",
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
    fecha: "2025-10-29",
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
    fecha: "2025-10-25",
    horaInicio: "09:00",
    horaFin: "11:00",
    estado: "cancelada",
    notas: "",
    fechaCreacion: new Date()
  }
];

export default function ReservasPage() {
  const [reservas, setReservas] = useState<ReservaFirestore[]>(mockReservas);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [loading, setLoading] = useState(false);

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtroEstado === 'todas') return true;
    return reserva.estado === filtroEstado;
  });

  const handleCancelarReserva = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      setReservas(prev =>
        prev.map(reserva =>
          reserva.id === id ? { ...reserva, estado: 'cancelada' as const } : reserva
        )
      );
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Header 
        title="Gestión de Reservas" 
        subtitle="Supervisa y modera todas las reservas de la plataforma" 
      />

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Reservas</p>
                <p className="text-2xl font-bold">{reservas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Activas</p>
                <p className="text-2xl font-bold">{reservas.filter(r => r.estado === 'activa').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Canceladas</p>
                <p className="text-2xl font-bold">{reservas.filter(r => r.estado === 'cancelada').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Hoy</p>
                <p className="text-2xl font-bold">
                  {reservas.filter(r => r.fecha === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Filtra las reservas por estado</CardDescription>
            </div>
            {filtroEstado !== 'todas' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFiltroEstado('todas')}
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {['todas', 'activa', 'cancelada', 'completada'].map((estado) => (
              <Button
                key={estado}
                variant={filtroEstado === estado ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltroEstado(estado)}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas ({reservasFiltradas.length})</CardTitle>
          <CardDescription>
            Lista de todas las reservas filtradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservasFiltradas.map((reserva) => (
              <div key={reserva.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{reserva.lugarNombre}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{reserva.usuarioNombre}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(reserva.fecha).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{reserva.horaInicio} - {reserva.horaFin}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(reserva.estado)}`}>
                        {reserva.estado}
                      </span>
                      {reserva.notas && (
                        <span className="text-xs text-gray-400">"{reserva.notas}"</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                  {reserva.estado === 'activa' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelarReserva(reserva.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {reservasFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron reservas con los filtros aplicados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}