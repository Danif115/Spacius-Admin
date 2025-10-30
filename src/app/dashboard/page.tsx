'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DashboardCharts from '@/components/DashboardCharts';
import FirebaseStatus from '@/components/FirebaseStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/types/spacius';
import { RefreshCw, Users, MapPin, Calendar, TrendingUp } from 'lucide-react';

// Mock data mientras configuramos Firebase
const mockStats: DashboardStats = {
  totalUsuarios: 142,
  totalLugares: 8,
  reservasActivas: 23,
  reservasMes: 89,
  lugaresPopulares: [
    { nombre: "Parque Samanes", reservas: 45 },
    { nombre: "Canchas Vóley", reservas: 32 },
    { nombre: "Área Picnic", reservas: 28 },
    { nombre: "Parque Acuático", reservas: 19 },
    { nombre: "Centro Cultural", reservas: 12 }
  ],
  reservasPorDia: [
    { fecha: "2025-10-21", reservas: 12 },
    { fecha: "2025-10-22", reservas: 8 },
    { fecha: "2025-10-23", reservas: 15 },
    { fecha: "2025-10-24", reservas: 11 },
    { fecha: "2025-10-25", reservas: 18 },
    { fecha: "2025-10-26", reservas: 14 },
    { fecha: "2025-10-27", reservas: 9 }
  ],
  categoriaPopular: [
    { categoria: "deportivo", count: 4 },
    { categoria: "recreativo", count: 3 },
    { categoria: "cultural", count: 1 }
  ]
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Agregar timestamp para evitar cache
      const response = await fetch(`/api/dashboard?t=${Date.now()}`);
      const result = await response.json();
      
      console.log('Dashboard API response:', result); // Debug log
      
      if (result.success) {
        setStats(result.data);
        setUsingMockData(false);
        console.log('Datos cargados exitosamente:', result.data); // Debug log
      } else {
        // Si Firebase no está configurado, usar datos mock
        console.warn('Usando datos mock, error:', result.error);
        setStats(mockStats);
        setUsingMockData(true);
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setStats(mockStats);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-background via-slate-50 to-green-50">
      <div className="flex justify-between items-center">
        <Header 
          title="Dashboard" 
          subtitle="Resumen general de la plataforma Spacius" 
        />
        <Button 
          onClick={loadDashboardData} 
          disabled={loading} 
          variant="outline"
          className="flex items-center gap-2 hover:bg-spacius-green hover:text-white transition-colors border-spacius-green text-spacius-green"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Cargando...' : 'Actualizar Datos'}
        </Button>
      </div>

      {/* Estado de Firebase */}
      <div className="grid gap-6 md:grid-cols-4">
        <FirebaseStatus className="md:col-span-1" />
        <div className="md:col-span-3">
          <Card className={`relative overflow-hidden shadow-md ${usingMockData ? 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100' : 'border-l-4 border-l-spacius-green bg-gradient-to-r from-green-50 to-green-100'}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm font-medium flex items-center gap-2 ${usingMockData ? 'text-yellow-700' : 'text-green-700'}`}>
                {usingMockData ? '⚠️ Datos de Ejemplo' : '✅ Datos en Tiempo Real'}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                {usingMockData 
                  ? 'Para ver datos reales, configura las credenciales de Firebase' 
                  : 'Mostrando estadísticas actualizadas desde Firebase'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-gray-500">
              <p>
                {usingMockData 
                  ? 'Actualmente se muestran datos de ejemplo. Una vez configurado Firebase, este dashboard mostrará estadísticas en tiempo real.'
                  : `Última actualización: ${new Date().toLocaleTimeString('es-ES')} - Usuarios: ${stats.totalUsuarios}, Lugares: ${stats.totalLugares}`
                }
              </p>
            </CardContent>
            <div className={`absolute top-0 right-0 w-16 h-16 ${usingMockData ? 'bg-yellow-500/10' : 'bg-spacius-green/10'} rounded-full -translate-y-8 translate-x-8`} />
          </Card>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-spacius-green bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Usuarios
            </CardTitle>
            <Users className="h-5 w-5 text-spacius-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsuarios}</div>
            <p className="text-xs text-gray-500 mt-1">
              Usuarios registrados en la plataforma
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-spacius-green/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-spacius-green-light bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Lugares
            </CardTitle>
            <MapPin className="h-5 w-5 text-spacius-green-light" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalLugares}</div>
            <p className="text-xs text-gray-500 mt-1">
              Espacios disponibles
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-spacius-green-light/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Reservas Activas
            </CardTitle>
            <Calendar className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.reservasActivas}</div>
            <p className="text-xs text-gray-500 mt-1">
              En curso actualmente
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-600 bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Reservas del Mes
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.reservasMes}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total este mes
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>
      </div>

      {/* Gráficos y analytics */}
      <DashboardCharts stats={stats} loading={loading} />

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas acciones realizadas en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Nueva reserva creada",
                user: "juan.perez@email.com",
                lugar: "Parque Samanes",
                time: "Hace 2 minutos"
              },
              {
                action: "Reserva cancelada",
                user: "maria.lopez@email.com", 
                lugar: "Canchas de Vóley",
                time: "Hace 15 minutos"
              },
              {
                action: "Nuevo usuario registrado",
                user: "carlos.martinez@email.com",
                lugar: "-",
                time: "Hace 1 hora"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    {activity.user} {activity.lugar !== "-" && `- ${activity.lugar}`}
                  </p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}