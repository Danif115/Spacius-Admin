'use client';

import { useEffect, useState } from 'react';
import { adminDb } from '@/lib/firebase-admin';

interface FirebaseStatus {
  isConfigured: boolean;
  isConnected: boolean;
  error: string | null;
  projectId: string | null;
}

export function useFirebaseStatus(): FirebaseStatus {
  const [status, setStatus] = useState<FirebaseStatus>({
    isConfigured: false,
    isConnected: false,
    error: null,
    projectId: null,
  });

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        // Verificar si las variables de entorno están configuradas
        const requiredEnvVars = [
          'FIREBASE_PROJECT_ID',
          'FIREBASE_CLIENT_EMAIL',
          'FIREBASE_PRIVATE_KEY',
        ];

        const missingVars = requiredEnvVars.filter(
          varName => !process.env[varName]
        );

        if (missingVars.length > 0) {
          setStatus({
            isConfigured: false,
            isConnected: false,
            error: `Variables de entorno faltantes: ${missingVars.join(', ')}`,
            projectId: process.env.FIREBASE_PROJECT_ID || null,
          });
          return;
        }

        // Intentar hacer una consulta simple para verificar conexión
        const testQuery = await fetch('/api/firebase-test');
        const result = await testQuery.json();

        if (result.success) {
          setStatus({
            isConfigured: true,
            isConnected: true,
            error: null,
            projectId: result.projectId,
          });
        } else {
          setStatus({
            isConfigured: true,
            isConnected: false,
            error: result.error,
            projectId: result.projectId || null,
          });
        }
      } catch (error) {
        setStatus({
          isConfigured: false,
          isConnected: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
          projectId: null,
        });
      }
    };

    checkFirebaseStatus();
  }, []);

  return status;
}