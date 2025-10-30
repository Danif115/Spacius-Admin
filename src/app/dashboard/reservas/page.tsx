'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReservaFirestore } from '@/types/spacius';
import { Calendar, Clock, MapPin, User, Filter, X, RefreshCw } from 'lucide-react';

// Mock data como fallback
const mockReservas: ReservaFirestore[] = [
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

export default function ReservasPage() {
  const [reservas, setReservas] = useState<ReservaFirestore[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadReservas = async () => {
    setLoading(true);
    try {
      console.log('Cargando reservas desde API...');
      const response = await fetch(`/api/reservas?t=${Date.now()}`);
      const result = await response.json();
      
      console.log('Reservas API response:', result);
      
      if (result.success) {
        setReservas(result.data || []);
        setUsingMockData(result.usingMockData || false);
        console.log('Reservas cargadas exitosamente:', result.data?.length || 0);
      } else {
        console.warn('Usando datos mock para reservas, error:', result.error);
        setReservas(mockReservas);
        setUsingMockData(true);
      }
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setReservas(mockReservas);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtroEstado === 'todas') return true;
    return reserva.estado === filtroEstado;
  });

  const handleCancelarReserva = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      try {
        const response = await fetch('/api/reservas', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, estado: 'cancelada' }),
        });

        const result = await response.json();
        
        if (result.success) {
          // Actualizar localmente
          setReservas(prev =>
            prev.map(reserva =>
              reserva.id === id ? { ...reserva, estado: 'cancelada' as const } : reserva
            )
          );
        } else {
          alert('Error al cancelar la reserva: ' + result.error);
        }
      } catch (error) {
        console.error('Error cancelando reserva:', error);
        alert('Error al cancelar la reserva');
      }
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
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-background via-slate-50 to-green-50">
      <div className="flex justify-between items-center">
        <Header 
          title="Gestión de Reservas" 
          subtitle="Supervisa y modera todas las reservas de la plataforma" 
        />
        <Button 
          onClick={loadReservas} 
          disabled={loading} 
          variant="outline"
          className="flex items-center gap-2 hover:bg-spacius-green hover:text-white transition-colors border-spacius-green text-spacius-green"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Cargando...' : 'Actualizar Datos'}
        </Button>
      </div>

      {/* Estado de datos y Estadísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`${usingMockData ? 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100' : 'border-l-4 border-l-spacius-green bg-gradient-to-r from-green-50 to-green-100'} shadow-md`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${usingMockData ? 'text-yellow-700' : 'text-green-700'}`}>
              {usingMockData ? '⚠️ Datos de Ejemplo' : '✅ Datos Reales'}
            </CardTitle>
            <CardDescription className="text-xs text-gray-600">
              {usingMockData 
                ? 'Usando datos mock' 
                : 'Conectado a Firebase'
              }
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                <p className="text-2xl font-bold text-gray-900">{reservas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{reservas.filter(r => r.estado === 'activa').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-red-600 rounded-full flex items-center justify-center">
                <X className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{reservas.filter(r => r.estado === 'cancelada').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-gray-900">Filtros</CardTitle>
              <CardDescription className="text-gray-600">Filtra las reservas por estado</CardDescription>
            </div>
            {filtroEstado !== 'todas' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFiltroEstado('todas')}
                className="hover:bg-gray-100 text-gray-600"
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
                className={filtroEstado === estado 
                  ? 'bg-spacius-green hover:bg-spacius-green-dark text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de reservas */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">Reservas ({reservasFiltradas.length})</CardTitle>
          <CardDescription className="text-gray-600">
            Lista de todas las reservas filtradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-spacius-green mb-2" />
              <p className="text-gray-600">Cargando reservas...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservasFiltradas.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reserva.lugarNombre}</h3>
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
                          <span className="text-xs text-gray-500 italic">"{reserva.notas}"</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Ver Detalles
                    </Button>
                    {reserva.estado === 'activa' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleCancelarReserva(reserva.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {reservasFiltradas.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No se encontraron reservas con los filtros aplicados</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}