'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DashboardCharts from '@/components/DashboardCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/spacius';

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

  useEffect(() => {
    // Aquí cargarías los datos reales de Firebase
    // obtenerEstadisticasDashboard().then(setStats);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Header 
        title="Dashboard" 
        subtitle="Resumen general de la plataforma Spacius" 
      />

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lugares</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLugares}</div>
            <p className="text-xs text-muted-foreground">
              Espacios disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservasActivas}</div>
            <p className="text-xs text-muted-foreground">
              En curso actualmente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas del Mes</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservasMes}</div>
            <p className="text-xs text-muted-foreground">
              +18% vs mes anterior
            </p>
          </CardContent>
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