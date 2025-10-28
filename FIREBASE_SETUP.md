# 🔥 Configuración de Firebase para Spacius Admin

Este documento explica cómo configurar Firebase para que el panel de administración pueda conectarse a tu base de datos y mostrar datos reales.

## 📋 Prerequisitos

1. Una cuenta de Google/Firebase
2. Un proyecto de Firebase creado
3. Firestore habilitado en el proyecto

## 🚀 Configuración Paso a Paso

### 1. Obtener Credenciales del Firebase Admin SDK

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** (ícono de engranaje)
4. Pestaña **Cuentas de servicio**
5. Haz clic en **Generar nueva clave privada**
6. Descarga el archivo JSON

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```

2. Abre el archivo `.env.local` y completa las credenciales:

   ```env
   # Firebase Admin SDK Configuration
   FIREBASE_PROJECT_ID=tu-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"

   # Configuración del cliente Firebase (para autenticación)
   NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

### 3. Obtener las Credenciales

#### Desde el archivo JSON descargado:
```json
{
  "type": "service_account",
  "project_id": "tu-project-id",           // → FIREBASE_PROJECT_ID
  "client_email": "firebase-adminsdk-...", // → FIREBASE_CLIENT_EMAIL  
  "private_key": "-----BEGIN PRIVATE...",  // → FIREBASE_PRIVATE_KEY
  // ... otros campos
}
```

#### Para las variables públicas:
1. Ve a **Configuración del proyecto** → **General**
2. En **Tus apps** → **SDK setup and configuration**
3. Selecciona **Config** para obtener:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4. Verificar la Configuración

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve al dashboard en `http://localhost:3000/dashboard`

3. Verifica el estado en la tarjeta **Estado de Firebase**:
   - ✅ Verde: Conectado correctamente
   - ❌ Rojo: Error de configuración

## 🗂 Estructura de Datos Esperada

El sistema espera las siguientes colecciones en Firestore:

### Colección `lugares`
```javascript
{
  nombre: string,
  descripcion: string,
  latitud: number,
  longitud: number,
  imagenUrl: string,
  fechaDisponible: string,
  horaDisponible: string,
  categoria: 'deportivo' | 'recreativo' | 'cultural',
  capacidadMaxima: number,
  activo: boolean,
  fechaCreacion: timestamp,
  fechaActualizacion: timestamp
}
```

### Colección `reservas`
```javascript
{
  lugarId: string,
  lugarNombre: string,
  usuarioId: string,
  usuarioEmail: string,
  usuarioNombre: string,
  fecha: string, // YYYY-MM-DD
  horaInicio: string, // HH:mm
  horaFin: string, // HH:mm
  estado: 'activa' | 'cancelada' | 'completada',
  notas: string,
  fechaCreacion: timestamp,
  fechaActualizacion: timestamp
}
```

### Colección `users`
```javascript
{
  email: string,
  nombre: string,
  fechaRegistro: timestamp,
  activo: boolean
}
```

## 🔧 Solución de Problemas

### Error: "Variables de entorno faltantes"
- Verifica que el archivo `.env.local` existe
- Asegúrate de que todas las variables estén definidas
- Reinicia el servidor después de crear/modificar `.env.local`

### Error: "Permission denied"
- Verifica que las reglas de Firestore permitan lectura desde el servidor
- Asegúrate de que el Admin SDK tiene permisos completos

### Error: "Invalid private key"
- Asegúrate de incluir las comillas dobles en `FIREBASE_PRIVATE_KEY`
- Verifica que los saltos de línea estén como `\\n`

## 📞 Soporte

Si tienes problemas con la configuración:

1. Verifica el estado en el dashboard
2. Revisa la consola del navegador para errores
3. Verifica los logs del servidor
4. Consulta la [documentación de Firebase](https://firebase.google.com/docs)

---

Una vez configurado correctamente, el dashboard mostrará datos reales en lugar de los datos de ejemplo. 🎉