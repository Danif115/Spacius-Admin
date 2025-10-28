'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsuarioStats } from '@/types/spacius';
import { User, Calendar, Clock, Mail } from 'lucide-react';

// Mock data de usuarios
const mockUsuarios: UsuarioStats[] = [
  {
    id: "user1",
    email: "juan.perez@email.com",
    nombre: "Juan Pérez",
    totalReservas: 15,
    reservasActivas: 2,
    ultimaActividad: new Date('2025-10-27'),
    fechaRegistro: new Date('2025-08-15'),
    activo: true
  },
  {
    id: "user2",
    email: "maria.lopez@email.com",
    nombre: "María López",
    totalReservas: 12,
    reservasActivas: 1,
    ultimaActividad: new Date('2025-10-25'),
    fechaRegistro: new Date('2025-07-20'),
    activo: true
  },
  {
    id: "user3",
    email: "carlos.martinez@email.com",
    nombre: "Carlos Martínez",
    totalReservas: 8,
    reservasActivas: 0,
    ultimaActividad: new Date('2025-10-20'),
    fechaRegistro: new Date('2025-09-01'),
    activo: true
  },
  {
    id: "user4",
    email: "ana.garcia@email.com",
    nombre: "Ana García",
    totalReservas: 20,
    reservasActivas: 3,
    ultimaActividad: new Date('2025-10-27'),
    fechaRegistro: new Date('2025-06-10'),
    activo: true
  }
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioStats[]>(mockUsuarios);
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Ayer';
    return `Hace ${diff} días`;
  };

  return (
    <div className="space-y-6 p-6">
      <Header 
        title="Gestión de Usuarios" 
        subtitle="Supervisa la actividad y estadísticas de los usuarios" 
      />

      {/* Estadísticas generales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Usuarios</p>
                <p className="text-2xl font-bold">{usuarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Usuarios Activos</p>
                <p className="text-2xl font-bold">{usuarios.filter(u => u.activo).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total Reservas</p>
                <p className="text-2xl font-bold">{usuarios.reduce((sum, u) => sum + u.totalReservas, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Reservas Activas</p>
                <p className="text-2xl font-bold">{usuarios.reduce((sum, u) => sum + u.reservasActivas, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Más Activos</CardTitle>
          <CardDescription>
            Top 10 usuarios con más reservas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios
              .sort((a, b) => b.totalReservas - a.totalReservas)
              .slice(0, 10)
              .map((usuario, index) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{usuario.nombre}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{usuario.email}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Registro: {formatDate(usuario.fechaRegistro)}</span>
                        <span>Última actividad: {getDaysAgo(usuario.ultimaActividad)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{usuario.totalReservas}</p>
                        <p className="text-xs text-gray-500">Total reservas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{usuario.reservasActivas}</p>
                        <p className="text-xs text-gray-500">Activas</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full ${usuario.activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-xs text-gray-500 mt-1">
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Usuarios recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Recientes</CardTitle>
          <CardDescription>
            Usuarios que se han registrado en los últimos 30 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios
              .filter(usuario => {
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return new Date(usuario.fechaRegistro) >= thirtyDaysAgo;
              })
              .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
              .map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{usuario.nombre}</h4>
                      <p className="text-sm text-gray-500">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{formatDate(usuario.fechaRegistro)}</p>
                    <p className="text-gray-500">{getDaysAgo(usuario.fechaRegistro)}</p>
                  </div>
                </div>
              ))}
            
            {usuarios.filter(u => {
              const now = new Date();
              const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              return new Date(u.fechaRegistro) >= thirtyDaysAgo;
            }).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay registros recientes en los últimos 30 días
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}