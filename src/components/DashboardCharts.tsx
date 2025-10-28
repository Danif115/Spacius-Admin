'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/spacius';

interface DashboardChartsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardCharts({ stats, loading }: DashboardChartsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Reservas por día */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Reservas por Día</CardTitle>
          <CardDescription>Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.reservasPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="fecha" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                formatter={(value) => [value, 'Reservas']}
              />
              <Line 
                type="monotone" 
                dataKey="reservas" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lugares más populares */}
      <Card>
        <CardHeader>
          <CardTitle>Lugares Populares</CardTitle>
          <CardDescription>Top 5 lugares más reservados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.lugaresPopulares} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="nombre" 
                type="category" 
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="reservas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribución por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías</CardTitle>
          <CardDescription>Distribución de lugares por categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoriaPopular}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ categoria, percent }: any) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.categoriaPopular.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Métricas adicionales */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Métricas del Sistema</CardTitle>
          <CardDescription>Estadísticas generales de la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsuarios}</div>
              <div className="text-sm text-gray-500">Total Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalLugares}</div>
              <div className="text-sm text-gray-500">Total Lugares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.reservasActivas}</div>
              <div className="text-sm text-gray-500">Reservas Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.reservasMes}</div>
              <div className="text-sm text-gray-500">Reservas este Mes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}