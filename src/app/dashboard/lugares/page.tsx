'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LugarFirestore } from '@/types/spacius';
import { Plus, MapPin, Users, Eye, Edit, Trash2, X, Save } from 'lucide-react';

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
  const [saving, setSaving] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLugar, setSelectedLugar] = useState<LugarFirestore | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Estado del formulario de nuevo lugar
  const [nuevoLugar, setNuevoLugar] = useState({
    nombre: '',
    descripcion: '',
    latitud: -2.1896,
    longitud: -79.8878,
    imagenUrl: '',
    fechaDisponible: 'Lunes a Domingo',
    horaDisponible: '06:00 - 20:00',
    categoria: 'deportivo' as 'deportivo' | 'recreativo' | 'cultural',
    capacidadMaxima: 50,
    activo: true
  });

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

  // Función para crear un nuevo lugar
  const handleCreateLugar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/lugares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoLugar),
      });

      const result = await response.json();

      if (result.success) {
        // Agregar el nuevo lugar a la lista local
        setLugares(prev => [...prev, result.data]);
        
        // Resetear formulario
        setNuevoLugar({
          nombre: '',
          descripcion: '',
          latitud: -2.1896,
          longitud: -79.8878,
          imagenUrl: '',
          fechaDisponible: 'Lunes a Domingo',
          horaDisponible: '06:00 - 20:00',
          categoria: 'deportivo',
          capacidadMaxima: 50,
          activo: true
        });
        
        // Cerrar modal
        setShowCreateModal(false);
        
        // Recargar lista
        loadLugares();
        
        alert('Lugar creado exitosamente!');
      } else {
        alert('Error al crear lugar: ' + result.error);
      }
    } catch (error) {
      console.error('Error creando lugar:', error);
      alert('Error al crear el lugar. Por favor intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // Ver detalles de un lugar
  const handleViewLugar = (lugar: LugarFirestore) => {
    setSelectedLugar(lugar);
    setShowViewModal(true);
  };

  // Editar lugar
  const handleEditLugar = (lugar: LugarFirestore) => {
    setSelectedLugar(lugar);
    setNuevoLugar({
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      latitud: lugar.latitud,
      longitud: lugar.longitud,
      imagenUrl: lugar.imagenUrl || '',
      fechaDisponible: lugar.fechaDisponible,
      horaDisponible: lugar.horaDisponible,
      categoria: lugar.categoria,
      capacidadMaxima: lugar.capacidadMaxima,
      activo: lugar.activo
    });
    setShowEditModal(true);
  };

  // Actualizar lugar
  const handleUpdateLugar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLugar) return;
    
    setSaving(true);

    try {
      const response = await fetch(`/api/lugares/${selectedLugar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoLugar),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar en la lista local
        setLugares(prev => prev.map(lugar => 
          lugar.id === selectedLugar.id ? { ...lugar, ...nuevoLugar } : lugar
        ));
        
        setShowEditModal(false);
        setSelectedLugar(null);
        
        // Recargar lista
        loadLugares();
        
        alert('Lugar actualizado exitosamente!');
      } else {
        alert('Error al actualizar lugar: ' + result.error);
      }
    } catch (error) {
      console.error('Error actualizando lugar:', error);
      alert('Error al actualizar el lugar. Por favor intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // Activar/Desactivar lugar
  const handleToggleActive = async (lugar: LugarFirestore) => {
    const nuevoEstado = !lugar.activo;
    
    try {
      const response = await fetch(`/api/lugares/${lugar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar localmente
        setLugares(prev => prev.map(l => 
          l.id === lugar.id ? { ...l, activo: nuevoEstado } : l
        ));
        
        alert(`Lugar ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente!`);
      } else {
        alert('Error al cambiar estado: ' + result.error);
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      // Fallback para datos mock
      setLugares(prev => prev.map(l => 
        l.id === lugar.id ? { ...l, activo: nuevoEstado } : l
      ));
    }
  };

  // Eliminar lugar
  const handleDelete = async (id: string) => {
    // Solo mostrar el modal, no eliminar todavía
    const lugar = lugares.find(l => l.id === id);
    if (lugar) {
      setSelectedLugar(lugar);
      setShowDeleteModal(true);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedLugar) return;
    
    setDeleting(true);

    try {
      const response = await fetch(`/api/lugares/${selectedLugar.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Eliminar de la lista local
        setLugares(prev => prev.filter(lugar => lugar.id !== selectedLugar.id));
        setShowDeleteModal(false);
        setSelectedLugar(null);
        alert('✅ Lugar eliminado exitosamente!');
      } else {
        alert('❌ Error al eliminar lugar: ' + result.error);
      }
    } catch (error) {
      console.error('Error eliminando lugar:', error);
      // Fallback para datos mock
      setLugares(prev => prev.filter(lugar => lugar.id !== selectedLugar.id));
      setShowDeleteModal(false);
      setSelectedLugar(null);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadLugares();
  }, []);

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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewLugar(lugar)}
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditLugar(lugar)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleToggleActive(lugar)}
                    title={lugar.activo ? 'Desactivar' : 'Activar'}
                  >
                    <div className={`h-4 w-4 rounded-full ${lugar.activo ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(lugar.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar"
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

      {/* Modal de Crear Nuevo Lugar */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Nuevo Lugar</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateModal(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateLugar} className="p-6 space-y-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Lugar *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoLugar.nombre}
                    onChange={(e) => setNuevoLugar(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    placeholder="Ej: Canchas de Fútbol del Parque"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={nuevoLugar.descripcion}
                    onChange={(e) => setNuevoLugar(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    rows={3}
                    placeholder="Describe el lugar y sus facilidades..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      required
                      value={nuevoLugar.categoria}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, categoria: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    >
                      <option value="deportivo">Deportivo</option>
                      <option value="recreativo">Recreativo</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidad Máxima *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={nuevoLugar.capacidadMaxima}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, capacidadMaxima: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitud *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.000001"
                      value={nuevoLugar.latitud}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, latitud: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                      placeholder="-2.1896"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.000001"
                      value={nuevoLugar.longitud}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, longitud: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                      placeholder="-79.8878"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en el mapa.
                  </p>
                </div>
              </div>

              {/* Horarios */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Horarios y Disponibilidad</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Días Disponibles
                    </label>
                    <input
                      type="text"
                      value={nuevoLugar.fechaDisponible}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, fechaDisponible: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                      placeholder="Lunes a Domingo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horario
                    </label>
                    <input
                      type="text"
                      value={nuevoLugar.horaDisponible}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, horaDisponible: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                      placeholder="06:00 - 20:00"
                    />
                  </div>
                </div>
              </div>

              {/* Imagen URL (opcional) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Imagen (Opcional)</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de la Imagen
                  </label>
                  <input
                    type="url"
                    value={nuevoLugar.imagenUrl}
                    onChange={(e) => setNuevoLugar(prev => ({ ...prev, imagenUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Estado del Lugar</p>
                  <p className="text-xs text-gray-500">El lugar estará disponible para reservas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nuevoLugar.activo}
                    onChange={(e) => setNuevoLugar(prev => ({ ...prev, activo: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spacius-green"></div>
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-spacius-green hover:bg-spacius-green-dark text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Lugar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Ver Detalles */}
      {showViewModal && selectedLugar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Detalles del Lugar</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowViewModal(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Nombre y Estado */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedLugar.nombre}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                    selectedLugar.categoria === 'deportivo' ? 'bg-blue-100 text-blue-800' :
                    selectedLugar.categoria === 'recreativo' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedLugar.categoria}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedLugar.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedLugar.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Descripción */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Descripción</h4>
                <p className="text-gray-700">{selectedLugar.descripcion}</p>
              </div>

              {/* Información en grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Capacidad Máxima</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedLugar.capacidadMaxima}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Categoría</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{selectedLugar.categoria}</p>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Ubicación</h4>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Coordenadas</span>
                  </div>
                  <p className="text-sm text-gray-700">Latitud: {selectedLugar.latitud}</p>
                  <p className="text-sm text-gray-700">Longitud: {selectedLugar.longitud}</p>
                  <a 
                    href={`https://www.google.com/maps?q=${selectedLugar.latitud},${selectedLugar.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>

              {/* Horarios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Días Disponibles</h4>
                  <p className="text-gray-700">{selectedLugar.fechaDisponible}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Horario</h4>
                  <p className="text-gray-700">{selectedLugar.horaDisponible}</p>
                </div>
              </div>

              {/* Imagen si existe */}
              {selectedLugar.imagenUrl && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Imagen</h4>
                  <img 
                    src={selectedLugar.imagenUrl} 
                    alt={selectedLugar.nombre}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <Button
                onClick={() => setShowViewModal(false)}
                className="w-full bg-spacius-green hover:bg-spacius-green-dark text-white"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar (igual al de crear pero con título diferente y función de actualizar) */}
      {showEditModal && selectedLugar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Editar Lugar</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedLugar(null);
                }}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleUpdateLugar} className="p-6 space-y-6">
              {/* Mismo formulario que crear */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Lugar *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoLugar.nombre}
                    onChange={(e) => setNuevoLugar(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={nuevoLugar.descripcion}
                    onChange={(e) => setNuevoLugar(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      required
                      value={nuevoLugar.categoria}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, categoria: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    >
                      <option value="deportivo">Deportivo</option>
                      <option value="recreativo">Recreativo</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidad Máxima *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={nuevoLugar.capacidadMaxima}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, capacidadMaxima: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitud *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.000001"
                      value={nuevoLugar.latitud}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, latitud: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.000001"
                      value={nuevoLugar.longitud}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, longitud: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Horarios</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Días Disponibles
                    </label>
                    <input
                      type="text"
                      value={nuevoLugar.fechaDisponible}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, fechaDisponible: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horario
                    </label>
                    <input
                      type="text"
                      value={nuevoLugar.horaDisponible}
                      onChange={(e) => setNuevoLugar(prev => ({ ...prev, horaDisponible: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Estado del Lugar</p>
                  <p className="text-xs text-gray-500">El lugar estará disponible para reservas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nuevoLugar.activo}
                    onChange={(e) => setNuevoLugar(prev => ({ ...prev, activo: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spacius-green"></div>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedLugar(null);
                  }}
                  className="flex-1"
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-spacius-green hover:bg-spacius-green-dark text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Actualizar Lugar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && selectedLugar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              {/* Icono de advertencia */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              {/* Título */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                ¿Eliminar lugar?
              </h3>

              {/* Mensaje */}
              <p className="text-sm text-gray-600 text-center mb-4">
                ¿Estás seguro de que quieres eliminar <strong>{selectedLugar.nombre}</strong>? Esta acción no se puede deshacer.
              </p>

              {/* Información adicional */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-red-800">
                  <strong>⚠️ Advertencia:</strong> Al eliminar este lugar, se perderán todos los datos asociados y las reservas relacionadas podrían verse afectadas.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedLugar(null);
                  }}
                  className="flex-1"
                  disabled={deleting}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}