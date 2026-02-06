# 🚀 Railway Deployment - Guía Rápida

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Push a Git
```bash
git add .
git commit -m "feat: optimizaciones para Railway"
git push origin main
```

### 2️⃣ Conectar a Railway
1. Ve a [railway.app](https://railway.app)
2. Click en "New Project"
3. Click en "Deploy from GitHub repo"
4. Selecciona este repositorio

### 3️⃣ Configurar Variables de Entorno
En Railway Dashboard → Variables:
```bash
DATABASE_URL=postgresql://tu-connection-string
SESSION_SECRET=<genera con el comando de abajo>
```

**Generar SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Verificar Deploy
```bash
# Espera que el deploy termine (~2-3 minutos)
# Luego verifica el health check:
curl https://tu-app.railway.app/api/health
```

## ✅ Checklist Post-Deploy

- [ ] Health check responde: `/api/health`
- [ ] Login funciona: `/api/auth/login`
- [ ] App carga en el browser
- [ ] CPU < 5% en Railway metrics
- [ ] No hay errores en logs

## 📊 Métricas Esperadas

| Métrica | Valor |
|---------|-------|
| 🚀 Cold Start | 10-15s |
| ⚡ Requests | <100ms |
| 💻 CPU (idle) | <1% |
| 💾 Memoria | 100-150 MB |
| 💤 Sleep after | 5 min |

## 🆘 Problemas Comunes

### Deploy falla
✅ **Solución**: Verifica que `DATABASE_URL` y `SESSION_SECRET` estén configurados

### App no despierta
✅ **Solución**: Espera 15-20 segundos en el primer request (cold start)

### Health check falla
✅ **Solución**: Verifica logs en Railway Dashboard

### CPU muy alta
✅ **Solución**: Verifica que no hay requests constantes en logs

## 📚 Más Información

- **Guía completa**: `OPTIMIZACIONES_RAILWAY.md`
- **Configuración**: `RAILWAY_CONFIG.md`
- **Changelog**: `CHANGELOG_OPTIMIZACIONES.md`

---

**¿Todo listo?** Tu app está optimizada y lista para producción en Railway! 🎉
