# Deployment en Railway

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en Railway:

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_EVgsBi91wCxR@ep-blue-poetry-ad6edf9b-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. SESSION_SECRET
Genera una clave secreta aleatoria. Puedes usar:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
O usa cualquier string aleatorio y seguro.

### 3. PORT (Opcional)
Railway lo configura automáticamente, pero puedes especificar:
```
3000
```

### 4. NODE_ENV
```
production
```

## Pasos para configurar en Railway

1. Ve a tu proyecto en Railway
2. Haz clic en tu servicio
3. Ve a la pestaña "Variables"
4. Agrega cada variable mencionada arriba
5. Haz un nuevo deploy o Railway lo hará automáticamente

## Verificación

Después de configurar las variables:
- El endpoint `/api/itinerary` debería responder con código 200
- Las etiquetas y eventos deberían guardarse correctamente
- No deberías ver errores 500 en la consola del navegador
