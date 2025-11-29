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
  {
    id: "3",
    nombre: "Parque Acuático La Joya",
    descripcion: "Piscinas y toboganes para toda la familia",
    latitud: -2.1854523,
    longitud: -79.8976285,
    imagenUrl: "https://example.com/acuatico.jpg",
    fechaDisponible: "Martes a Domingo",
    horaDisponible: "09h00 a 17h00",
    categoria: "recreativo",
    capacidadMaxima: 500,
    activo: true
  },
  {
    id: "4",
    nombre: "Centro Cultural Libertad",
    descripcion: "Espacios para eventos culturales y exposiciones",
    latitud: -2.1969543,
    longitud: -79.8862142,
    imagenUrl: "https://example.com/cultural.jpg",
    fechaDisponible: "Lunes a Sábado",
    horaDisponible: "08h00 a 22h00",
    categoria: "cultural",
    capacidadMaxima: 300,
    activo: true
  },
  {
    id: "5",
    nombre: "Canchas de Vóley Playa Norte",
    descripcion: "Canchas de voleibol en la costa de Guayaquil",
    latitud: -2.1234567,
    longitud: -79.9123456,
    imagenUrl: "https://example.com/voley.jpg",
    fechaDisponible: "Lunes a Domingo",
    horaDisponible: "06h00 a 18h00",
    categoria: "deportivo",
    capacidadMaxima: 12,
    activo: true
  },
  {
    id: "6",
    nombre: "Skate Park Malecón 2000",
    descripcion: "Pista de skateboard y BMX en el malecón",
    latitud: -2.1987654,
    longitud: -79.8765432,
    imagenUrl: "https://example.com/skate.jpg",
    fechaDisponible: "Lunes a Domingo",
    horaDisponible: "14h00 a 20h00",
    categoria: "deportivo",
    capacidadMaxima: 30,
    activo: true
  },
  {
    id: "7",
    nombre: "Jardín Botánico de Guayaquil",
    descripcion: "Recorridos educativos y espacios de contemplación",
    latitud: -2.1567890,
    longitud: -79.9012345,
    imagenUrl: "https://example.com/botanico.jpg",
    fechaDisponible: "Miércoles a Domingo",
    horaDisponible: "09h00 a 16h00",
    categoria: "cultural",
    capacidadMaxima: 150,
    activo: true
  },
  {
    id: "8",
    nombre: "Canchas de Fútbol La Pradera",
    descripcion: "Canchas sintéticas para fútbol 7 y fútbol 11",
    latitud: -2.1345678,
    longitud: -79.8901234,
    imagenUrl: "https://example.com/futbol.jpg",
    fechaDisponible: "Lunes a Domingo",
    horaDisponible: "06h00 a 22h00",
    categoria: "deportivo",
    capacidadMaxima: 22,
    activo: false
  },
  {
    id: "9",
    nombre: "Plaza de las Artes",
    descripcion: "Espacio al aire libre para presentaciones artísticas",
    latitud: -2.1876543,
    longitud: -79.8654321,
    imagenUrl: "https://example.com/plaza.jpg",
    fechaDisponible: "Viernes a Domingo",
    horaDisponible: "18h00 a 23h00",
    categoria: "cultural",
    capacidadMaxima: 400,
    activo: true
  },
  {
    id: "10",
    nombre: "Piscina Olímpica Municipal",
    descripcion: "Piscina de 50 metros para entrenamiento y competencias",
    latitud: -2.1654321,
    longitud: -79.8543210,
    imagenUrl: "https://example.com/piscina.jpg",
    fechaDisponible: "Lunes a Sábado",
    horaDisponible: "05h00 a 21h00",
    categoria: "deportivo",
    capacidadMaxima: 100,
    activo: true
  }
];

export default function LugaresPage() {
  const [lugares, setLugares] = useState<LugarFirestore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Cargar lugares desde Firebase
  const loadLugares = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/lugares');
      const result = await response.json();
      
      if (result.success) {
        setLugares(result.data);
        setUsingMockData(false);
      } else {
        // Si Firebase no está configurado o hay error, usar datos mock como fallback
        console.warn('Error cargando lugares de Firebase:', result.error);
        setLugares(mockLugares);
        setUsingMockData(true);
        setError(result.error);
      }
    } catch (error) {
      console.error('Error conectando con la API:', error);
      setLugares(mockLugares);
      setUsingMockData(true);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLugares();
  }, []);

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
    <div className="space-y-6 p-6 bg-gradient-to-br from-background via-slate-50 to-green-50 min-h-screen">
      <div className="flex justify-between items-center">
        <Header 
          title="Gestión de Lugares" 
          subtitle="Administra los espacios públicos disponibles para reserva" 
        />
        <Button onClick={() => setShowCreateModal(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lugar
        </Button>
      </div>

      {/* Estado de la fuente de datos */}
      {(error || usingMockData) && (
        <Card className={`${usingMockData ? 'border-yellow-500' : 'border-red-500'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${usingMockData ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <div>
                <p className={`text-sm font-medium ${usingMockData ? 'text-yellow-700' : 'text-red-700'}`}>
                  {usingMockData ? '⚠️ Mostrando datos de ejemplo' : '❌ Error conectando con Firebase'}
                </p>
                <p className="text-xs text-gray-600">
                  {error || 'Conecta Firebase para ver lugares reales'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadLugares}
                disabled={loading}
                className="ml-auto"
              >
                {loading ? '🔄 Cargando...' : '🔄 Reintentar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            {loading 
              ? 'Cargando lugares...' 
              : usingMockData 
                ? 'Lista de ejemplo de espacios públicos (configura Firebase para ver datos reales)'
                : `${lugares.length} espacios públicos encontrados en Firebase`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Cargando lugares desde Firebase...</p>
              </div>
            </div>
          ) : lugares.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay lugares registrados</h3>
              <p className="text-gray-500 mb-4">
                {usingMockData 
                  ? 'Configura Firebase para ver lugares reales o agrega algunos lugares de ejemplo.'
                  : 'Agrega el primer lugar para comenzar a gestionar espacios públicos.'
                }
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Lugar
              </Button>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}