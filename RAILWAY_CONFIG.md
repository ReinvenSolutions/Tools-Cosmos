# Configuración de Railway para Cosmos Tools

## Variables de Entorno Esenciales

### Variables Obligatorias
```
DATABASE_URL=postgresql://...
SESSION_SECRET=<genera-uno-aleatorio-seguro>
NODE_ENV=production
```

### Variables Opcionales (Railway las configura automáticamente)
```
PORT=<Railway-lo-asigna-automáticamente>
```

## Configuración del Servicio en Railway

### 1. Settings Generales
- **Region**: Selecciona la región más cercana a tus usuarios
- **Watch Paths**: `/` (default)

### 2. Deploy Settings
- **Build Command**: `npm run build` (configurado en railway.json)
- **Start Command**: `npm start` (configurado en railway.json)
- **Healthcheck Path**: `/api/health`
- **Healthcheck Timeout**: 100ms
- **Restart Policy**: ON_FAILURE
- **Max Retries**: 3

### 3. Resource Limits (Recomendado para optimizar costos)
Para plan gratuito/hobby:
- **Memory**: 512 MB (suficiente para esta app)
- **CPU**: Compartido (la app está optimizada para bajo uso)

## Cómo Funciona el "Sleep Mode"

### Plan Gratuito
- **Inactividad**: Después de 5 minutos sin requests
- **Estado**: El servicio se detiene completamente (CPU = 0%)
- **Wake-up**: 10-15 segundos en el primer request
- **Benefit**: $0 de costo cuando no está en uso

### Plan Hobby/Pro
- Puedes mantener la app siempre activa si lo prefieres
- Pero con las optimizaciones, el modo sleep puede ahorrar recursos

## Optimizaciones Implementadas

### 1. Tiempos de Respuesta
```
Cold Start (primera request después de sleep): ~10-15 segundos
Requests normales: <100ms
Health check: <10ms
```

### 2. Uso de Recursos
```
CPU en idle (sin usuarios): <1%
CPU con 1 usuario activo: 2-5%
CPU con 10 usuarios: 10-20%
Memoria base: ~100-150 MB
Memoria con usuarios: ~200-300 MB
```

### 3. Conexiones HTTP
```
Keep-Alive: 65 segundos
Request Timeout: 30 segundos
Headers Timeout: 66 segundos
Max Connections: 1000
```

## Comandos Útiles de Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Ver logs en tiempo real
railway logs

# Ver variables de entorno
railway variables

# Hacer deploy manual
railway up

# Conectar a la base de datos
railway connect
```

## Monitoreo y Debugging

### Ver Logs
1. Ve a tu proyecto en Railway
2. Click en el servicio
3. Tab "Deployments" → Click en el deployment activo → "View Logs"

### Métricas Importantes
- **CPU Usage**: Debería ser <5% en idle
- **Memory Usage**: Debería ser estable ~100-200 MB
- **Request Duration**: P95 debería ser <500ms
- **Error Rate**: Debería ser <1%

### Señales de que algo está mal
- ❌ CPU >20% cuando no hay usuarios
- ❌ Memory subiendo constantemente (memory leak)
- ❌ Requests tomando >5 segundos
- ❌ Health checks fallando

### Señales de que todo está bien
- ✅ CPU <2% en idle
- ✅ Memory estable
- ✅ Health checks respondiendo en <100ms
- ✅ App entrando en sleep después de 5 min sin actividad

## Troubleshooting

### La app no despierta después de sleep
1. Verifica que el health check esté configurado en `/api/health`
2. Verifica que NODE_ENV=production
3. Revisa los logs para ver si hay errores en el startup

### La app consume mucha CPU en idle
1. Verifica que no haya polling innecesario en el frontend
2. Verifica que no haya setInterval o setTimeout que se ejecuten constantemente
3. Revisa los logs para ver qué está generando actividad

### La app se cae frecuentemente
1. Verifica la memoria (puede estar quedándose sin RAM)
2. Verifica los errores uncaught exceptions en los logs
3. Considera aumentar el límite de memoria en Railway

### Cold starts muy lentos (>30 segundos)
1. Verifica el tamaño del bundle (debería ser <50 MB)
2. Verifica que npm ci esté funcionando en el build
3. Considera usar una región más cercana

## Mejores Prácticas

### DO ✅
- Mantén las dependencias actualizadas
- Monitorea las métricas regularmente
- Usa el health check para verificar que todo funciona
- Configura alertas en Railway para errores críticos
- Haz backups regulares de la base de datos

### DON'T ❌
- No hagas polling constante desde el frontend
- No uses setInterval sin limpiarlos
- No guardes archivos grandes en el filesystem (usa S3/CloudFlare R2)
- No almacenes secretos en el código (usa variables de entorno)
- No ignores los errores en los logs

## Próximos Pasos de Optimización (Opcional)

Si necesitas optimizar más en el futuro:

1. **Implementar Cache**:
   - Redis para sesiones (en lugar de memory store)
   - CDN para assets estáticos

2. **Optimizar el Frontend**:
   - Code splitting
   - Lazy loading de componentes
   - Comprimir assets

3. **Base de Datos**:
   - Connection pooling optimizado
   - Índices en queries frecuentes

4. **Monitoring Avanzado**:
   - Sentry para error tracking
   - Datadog/New Relic para métricas detalladas
