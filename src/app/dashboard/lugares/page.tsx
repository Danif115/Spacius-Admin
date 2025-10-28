'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LugarFirestore } from '@/types/spacius';
import { Plus, MapPin, Users, Eye, Edit, Trash2 } from 'lucide-react';

// Mock data de lugares
const mockLugares: LugarFirestore[] = [
  {
    id: "1",
    nombre: "Canchas del Parque Samanes",
    descripcion: "Más de 50 canchas modernas para deportes",
    latitud: -2.1022530106411046,
    longitud: -79.90182885626803,
    imagenUrl: "https://example.com/samanes.jpg",
    fechaDisponible: "Lunes a Domingo",
    horaDisponible: "06h00 a 20h00",
    categoria: "deportivo",
    capacidadMaxima: 22,
    activo: true
  },
  {
    id: "2",
    nombre: "Área de picnic del Parque Samanes",
    descripcion: "Espacio ideal para picnics familiares",
    latitud: -2.105220191117523,
    longitud: -79.90329556145007,
    imagenUrl: "https://example.com/picnic.jpg",
    fechaDisponible: "Lunes a Domingo",
    horaDisponible: "10h00 a 18h00",
    categoria: "recreativo",
    capacidadMaxima: 200,
    activo: true
  },
  // ... más lugares
];

export default function LugaresPage() {
  const [lugares, setLugares] = useState<LugarFirestore[]>(mockLugares);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleToggleActive = async (id: string) => {
    setLugares(prev => 
      prev.map(lugar => 
        lugar.id === id ? { ...lugar, activo: !lugar.activo } : lugar
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
      setLugares(prev => prev.filter(lugar => lugar.id !== id));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Header 
          title="Gestión de Lugares" 
          subtitle="Administra los espacios públicos disponibles para reserva" 
        />
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lugar
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Lugares</p>
                <p className="text-2xl font-bold">{lugares.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Activos</p>
                <p className="text-2xl font-bold">{lugares.filter(l => l.activo).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Capacidad Total</p>
                <p className="text-2xl font-bold">{lugares.reduce((sum, l) => sum + l.capacidadMaxima, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Categorías</p>
                <p className="text-2xl font-bold">{new Set(lugares.map(l => l.categoria)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de lugares */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Lugares</CardTitle>
          <CardDescription>
            Lista completa de espacios públicos en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lugares.map((lugar) => (
              <div key={lugar.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{lugar.nombre}</h3>
                    <p className="text-sm text-gray-500">{lugar.descripcion}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lugar.categoria === 'deportivo' ? 'bg-blue-100 text-blue-800' :
                        lugar.categoria === 'recreativo' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {lugar.categoria}
                      </span>
                      <span className="text-sm text-gray-500">
                        Capacidad: {lugar.capacidadMaxima}
                      </span>
                      <span className={`text-sm ${lugar.activo ? 'text-green-600' : 'text-red-600'}`}>
                        {lugar.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleToggleActive(lugar.id)}
                  >
                    <div className={`h-4 w-4 rounded-full ${lugar.activo ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(lugar.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}