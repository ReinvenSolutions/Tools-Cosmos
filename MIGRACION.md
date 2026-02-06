# Guía de Migración - Proyectos Fusionados

## ¿Qué se hizo?

Los proyectos **Calculadora-de-Millas** y **Contador-de-dias** han sido fusionados en una sola aplicación llamada **Cosmos Tools**.

## Cambios Realizados

### 1. Estructura de la Aplicación

La aplicación ahora tiene un **sidebar de navegación** que permite cambiar entre herramientas:

- **Contador de Días** (ruta: `/` o `/contador`)
- **Cotizador de Millas** (ruta: `/cotizador`)

### 2. Archivos Modificados

#### `client/src/App.tsx`
- Agregado `SidebarProvider` y componentes de sidebar
- Integrado sistema de navegación con wouter
- Creado componente `AppSidebar` con menú de navegación
- Movido el `ThemeToggle` al footer del sidebar

#### `client/src/pages/home.tsx`
- Removido `ThemeToggle` del header (ahora está en el sidebar)
- Mantenida toda la funcionalidad del contador de días

#### `client/src/pages/dashboard.tsx`
- Copiado desde el proyecto Calculadora-de-Millas
- Removido el header principal (el logo ahora está en el sidebar)
- Convertido el header en una sección informativa dentro del contenido
- Mantenida toda la funcionalidad del cotizador

#### `client/index.html`
- Actualizado título a "Cosmos Tools - Módulo de Herramientas"
- Actualizada descripción meta

#### `package.json`
- Cambiado nombre de "rest-express" a "cosmos-tools"
- Agregada descripción del proyecto

### 3. Componentes Nuevos

No se requirieron componentes adicionales. Todos los componentes de UI necesarios ya existían en el proyecto base.

## Ubicación del Proyecto

El proyecto fusionado está en:
```
Modulo de Herramientas/Contador-de-dias/
```

### Opcional: Renombrar Carpeta

Si deseas renombrar la carpeta del proyecto fusionado:

```bash
cd "Modulo de Herramientas"
mv "Contador-de-dias" "Cosmos-Tools"
```

## Proyecto Original: Calculadora-de-Millas

El proyecto original de la Calculadora de Millas sigue intacto en:
```
Modulo de Herramientas/Calculadora-de-Millas/
```

Puedes:
- **Conservarlo** como backup
- **Eliminarlo** si ya no lo necesitas (el código está ahora en Cosmos Tools)

## Cómo Usar la Nueva Aplicación

### Iniciar el Servidor

```bash
cd Contador-de-dias  # o Cosmos-Tools si renombraste
npm run dev
```

### Navegar en la Aplicación

1. Abre http://localhost:3000
2. Usa el sidebar para cambiar entre herramientas:
   - Click en **Contador de Días** (icono calendario)
   - Click en **Cotizador de Millas** (icono avión)
3. El sidebar se puede colapsar con `Cmd/Ctrl + B`

## Funcionalidades Conservadas

### Contador de Días ✅
- ✅ Selección de fecha de inicio
- ✅ Calendario interactivo
- ✅ Timeline de 25 días
- ✅ Gestión de eventos
- ✅ Guardado en base de datos
- ✅ Tema claro/oscuro

### Cotizador de Millas ✅
- ✅ Cálculo de millas a COP
- ✅ Vuelos de ida y ida-vuelta
- ✅ Múltiples pasajeros (1-9)
- ✅ Gestión de CLB
- ✅ 7 clientes con precios personalizados
- ✅ Generación de mensajes
- ✅ Copiar al portapapeles

## Mejoras Adicionales

### Ventajas del Proyecto Fusionado

1. **Un solo servidor** - Ahora solo necesitas correr un proceso
2. **Una sola base de datos** - Todas las herramientas comparten la misma DB
3. **Navegación fluida** - Cambiar entre herramientas es instantáneo
4. **Tema unificado** - Un solo toggle controla el tema en toda la app
5. **Código compartido** - Componentes UI reutilizados entre herramientas
6. **Más fácil de mantener** - Un solo proyecto para actualizar

### Próximos Pasos Sugeridos

Si quieres agregar más herramientas en el futuro:

1. Crear nuevo archivo en `client/src/pages/` (ej: `nueva-herramienta.tsx`)
2. Agregar ruta en `App.tsx`:
   ```tsx
   <Route path="/nueva-herramienta" component={NuevaHerramienta} />
   ```
3. Agregar item al sidebar en `AppSidebar`:
   ```tsx
   <SidebarMenuItem>
     <SidebarMenuButton onClick={() => setLocation("/nueva-herramienta")}>
       <Icon className="h-4 w-4" />
       <span>Nueva Herramienta</span>
     </SidebarMenuButton>
   </SidebarMenuItem>
   ```

## Problemas Conocidos

Ninguno detectado. La aplicación funciona correctamente.

## Soporte

Para cualquier problema o pregunta sobre la migración, consulta el archivo `README.md` del proyecto.

---

**Fecha de Migración:** 6 de Febrero, 2026
**Proyecto Base:** Contador-de-dias
**Proyecto Integrado:** Calculadora-de-Millas
