'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Database, 
  Bell, 
  Shield, 
  Mail, 
  Palette,
  Save,
  RefreshCw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Estados de configuración
  const [config, setConfig] = useState({
    // Configuración General
    nombreSistema: 'Spacius Admin',
    emailContacto: 'admin@spacius.ec',
    horariosReserva: '06:00 - 22:00',
    diasAnticipacion: 30,
    
    // Notificaciones
    notificacionesEmail: true,
    notificacionesReservas: true,
    notificacionesCancelaciones: true,
    
    // Reservas
    tiempoMinimoReserva: 1, // horas
    tiempoMaximoReserva: 4, // horas
    permitirCancelacion: true,
    horasAntesParaCancelar: 24,
    
    // Sistema
    modoMantenimiento: false,
    mostrarDatosMock: false,
  });

  const handleSave = async () => {
    setSaving(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aquí guardarías en Firebase o localStorage
    localStorage.setItem('spacius-config', JSON.stringify(config));
    
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-background via-slate-50 to-green-50">
      <div className="flex justify-between items-center">
        <Header 
          title="Configuración" 
          subtitle="Ajustes y parámetros del sistema" 
        />
        <Button 
          onClick={handleSave} 
          disabled={saving || saved}
          className="flex items-center gap-2 bg-spacius-green hover:bg-spacius-green-dark text-white"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configuración General */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Settings className="h-5 w-5 text-spacius-green" />
              General
            </CardTitle>
            <CardDescription>Configuración básica del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre del Sistema</label>
              <input
                type="text"
                value={config.nombreSistema}
                onChange={(e) => handleChange('nombreSistema', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email de Contacto</label>
              <input
                type="email"
                value={config.emailContacto}
                onChange={(e) => handleChange('emailContacto', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Horarios de Reserva</label>
              <input
                type="text"
                value={config.horariosReserva}
                onChange={(e) => handleChange('horariosReserva', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                placeholder="06:00 - 22:00"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Días de Anticipación</label>
              <input
                type="number"
                value={config.diasAnticipacion}
                onChange={(e) => handleChange('diasAnticipacion', parseInt(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                min="1"
                max="90"
              />
              <p className="text-xs text-gray-500 mt-1">Días máximos para hacer una reserva</p>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Reservas */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Database className="h-5 w-5 text-blue-600" />
              Reservas
            </CardTitle>
            <CardDescription>Parámetros de reservación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Tiempo Mínimo (horas)</label>
              <input
                type="number"
                value={config.tiempoMinimoReserva}
                onChange={(e) => handleChange('tiempoMinimoReserva', parseInt(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                min="1"
                max="24"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tiempo Máximo (horas)</label>
              <input
                type="number"
                value={config.tiempoMaximoReserva}
                onChange={(e) => handleChange('tiempoMaximoReserva', parseInt(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                min="1"
                max="24"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Permitir Cancelación</p>
                <p className="text-xs text-gray-500">Los usuarios pueden cancelar reservas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.permitirCancelacion}
                  onChange={(e) => handleChange('permitirCancelacion', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spacius-green"></div>
              </label>
            </div>

            {config.permitirCancelacion && (
              <div>
                <label className="text-sm font-medium text-gray-700">Horas antes para cancelar</label>
                <input
                  type="number"
                  value={config.horasAntesParaCancelar}
                  onChange={(e) => handleChange('horasAntesParaCancelar', parseInt(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spacius-green"
                  min="1"
                  max="168"
                />
                <p className="text-xs text-gray-500 mt-1">Tiempo mínimo antes de la reserva para cancelar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Bell className="h-5 w-5 text-yellow-600" />
              Notificaciones
            </CardTitle>
            <CardDescription>Configurar alertas y notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Notificaciones por Email</p>
                <p className="text-xs text-gray-500">Enviar notificaciones al email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.notificacionesEmail}
                  onChange={(e) => handleChange('notificacionesEmail', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spacius-green"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Nuevas Reservas</p>
                <p className="text-xs text-gray-500">Notificar cuando hay una nueva reserva</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.notificacionesReservas}
                  onChange={(e) => handleChange('notificacionesReservas', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spacius-green"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Cancelaciones</p>
                <p className="text-xs text-gray-500">Notificar cuando se cancela una reserva</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.notificacionesCancelaciones}
                  onChange={(e) => handleChange('notificacionesCancelaciones', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spacius-green"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Sistema y Seguridad */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Shield className="h-5 w-5 text-red-600" />
              Sistema y Seguridad
            </CardTitle>
            <CardDescription>Configuración avanzada del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-800">Modo Mantenimiento</p>
                <p className="text-xs text-yellow-600">Deshabilita el acceso de usuarios</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.modoMantenimiento}
                  onChange={(e) => handleChange('modoMantenimiento', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Mostrar Datos Mock</p>
                <p className="text-xs text-gray-500">Usar datos de ejemplo en desarrollo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.mostrarDatosMock}
                  onChange={(e) => handleChange('mostrarDatosMock', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spacius-green"></div>
              </label>
            </div>

            <div className="pt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full text-left justify-start"
                onClick={() => window.open('https://console.firebase.google.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Firebase Console
              </Button>

              <Button 
                variant="outline" 
                className="w-full text-left justify-start"
              >
                <Database className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>

              <Button 
                variant="outline" 
                className="w-full text-left justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpiar Caché
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del Sistema */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Settings className="h-5 w-5 text-purple-600" />
            Información del Sistema
          </CardTitle>
          <CardDescription>Detalles técnicos y versión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Versión</p>
              <p className="text-lg font-bold text-gray-900">0.1.0</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Framework</p>
              <p className="text-lg font-bold text-gray-900">Next.js 16</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Base de Datos</p>
              <p className="text-lg font-bold text-gray-900">Firebase</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Estado</p>
              <p className="text-lg font-bold text-green-600">Activo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de guardado */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Configuración guardada exitosamente</span>
        </div>
      )}
    </div>
  );
}
