'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';

interface FirebaseStatusProps {
  className?: string;
}

export default function FirebaseStatus({ className }: FirebaseStatusProps) {
  const [status, setStatus] = useState<{
    isConfigured: boolean;
    isConnected: boolean;
    error: string | null;
    projectId: string | null;
    loading: boolean;
  }>({
    isConfigured: false,
    isConnected: false,
    error: null,
    projectId: null,
    loading: true,
  });

  const checkFirebaseStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch('/api/firebase-test');
      const result = await response.json();
      
      setStatus({
        isConfigured: response.ok,
        isConnected: result.success,
        error: result.error || null,
        projectId: result.projectId || null,
        loading: false,
      });
    } catch (error) {
      setStatus({
        isConfigured: false,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
        projectId: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const getStatusIcon = () => {
    if (status.loading) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
    if (status.isConnected) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (status.loading) return 'border-blue-200';
    if (status.isConnected) return 'border-green-200';
    return 'border-red-200';
  };

  const getStatusText = () => {
    if (status.loading) return 'Verificando conexión...';
    if (status.isConnected) return 'Firebase conectado correctamente';
    return 'Firebase no configurado';
  };

  return (
    <Card className={`${className} ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {getStatusIcon()}
          Estado de Firebase
        </CardTitle>
        <CardDescription className="text-xs">
          {getStatusText()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {status.projectId && (
          <div className="text-xs">
            <span className="text-gray-500">Project ID:</span>
            <span className="ml-1 font-mono">{status.projectId}</span>
          </div>
        )}
        
        {status.error && (
          <div className="text-xs p-2 bg-red-50 border border-red-200 rounded text-red-700">
            <strong>Error:</strong> {status.error}
          </div>
        )}
        
        {!status.isConnected && !status.loading && (
          <div className="space-y-2">
            <div className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
              <strong>Configuración requerida:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Crea un archivo <code className="bg-white px-1">.env.local</code></li>
                <li>Agrega las credenciales de Firebase</li>
                <li>Reinicia el servidor de desarrollo</li>
              </ol>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://console.firebase.google.com', '_blank')}
              className="w-full text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Ir a Firebase Console
            </Button>
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={checkFirebaseStatus}
          disabled={status.loading}
          className="w-full text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${status.loading ? 'animate-spin' : ''}`} />
          Verificar conexión
        </Button>
      </CardContent>
    </Card>
  );
}