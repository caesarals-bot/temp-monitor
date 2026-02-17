# Documentación Técnica - TempMonitor

## 1. Arquitectura General

TempMonitor es una aplicación **SaaS Multi-Tenant** diseñada para la gestión de temperaturas en cadenas de restaurantes.

*   **Frontend:** React 19 (Vite), TypeScript, Tailwind CSS.
*   **Backend (Planeado):** Supabase (PostgreSQL + Auth + Edge Functions).
*   **Estado:** Context API (`AppContext`) para gestión global y caché optimista.

## 2. Modelos de Datos

### Usuario (`User`)
*   `id`: UUID
*   `email`: Identificador único para login.
*   `role`:
    *   `admin`: Acceso total a todas las sucursales (Dueño).
    *   `manager`: Gestión de una sucursal específica.
    *   `staff`: Solo registro de temperaturas.
*   `restaurant_id`: Restaurante asignado (para roles `manager` y `staff`).

### Restaurante (`Restaurant`)
Representa una sucursal física.
*   `id`: UUID
*   `name`: Nombre comercial.
*   `address`: Ubicación física.

### Equipo (`Equipment`)
Un refrigerador, congelador o zona de almacenamiento.
*   `restaurant_id`: FK a Restaurante.
*   `min_temp` / `max_temp`: Rangos seguros permitidos.

## 3. Flujos de Usuario Críticos

### A. Autenticación y Onboarding
El sistema maneja dos estados iniciales críticos:

1.  **Usuario Existente (con datos):**
    *   Login -> Validación -> Redirección a `/dashboard`.
    *   El contexto carga automáticamente el restaurante asignado o el último visitado.

2.  **Usuario Nuevo (Sin datos / Onboarding):**
    *   Login -> Validación -> Detección de `userRestaurants.length === 0`.
    *   Redirección forzada a `/onboarding`.
    *   **Acción:** El usuario *debe* crear un restaurante para continuar.
    *   **Resultado:** Se crea el restaurante, se asigna al usuario (como `owner`) y se redirige al Dashboard.

### B. Gestión Multi-Sucursal (Planeado)
Para usuarios con acceso a múltiples restaurantes (`admin` o dueños de franquicia):
*   Se implementará un **Selector de Contexto** en el Header.
*   Al cambiar, se recargan los datos (Equipos, Lecturas) filtrados por el nuevo `restaurant_id`.

## 4. Seguridad (Estrategia RLS)

Aunque el frontend filtra datos por UX, la seguridad real reside en la base de datos (Supabase):

*   **Lectura:** Un usuario solo puede hacer `SELECT` de datos donde `restaurant_id` coincida con sus permisos.
*   **Escritura:** Un usuario solo puede hacer `INSERT` de lecturas para equipos de sus restaurantes permitidos.

## 5. Estructura de Carpetas

*   `src/layouts`:
    *   `AuthLayout`: Para Login/Register (público/restringido).
    *   `DashboardLayout`: Estructura principal con Sidebar y Header (protegido).
*   `src/context`:
    *   `AppContext`: "Cerebro" de la aplicación. Maneja usuarios, restaurantes y lógica de negocio síncrona/asíncrona.
*   `src/mocks`:
    *   Contiene datos simulados para desarrollo y modo demo sin backend.

## 6. Análisis de Base de Datos (Supabase)

Para soportar el modelo Multi-Tenant planteado (un cliente = múltiples restaurantes), se propone el siguiente esquema relacional y de seguridad.

### A. Entidades Principales

1.  **`organizations` (Clientes/Tenants)**
    *   Representa al "Cliente" que paga el servicio (ej. "Grupo Gastronómico S.A.").
    *   `id`: UUID (PK).
    *   `name`: Nombre de la empresa.
    *   `plan_type`: Tipo de suscripción (ej. 'basic', 'pro').

2.  **`profiles` (Usuarios)**
    *   Extensión de la tabla `auth.users` de Supabase.
    *   `id`: UUID (FK a auth.users).
    *   `email`: Copia del email de auth.
    *   `full_name`: Nombre completo.
    *   `avatar_url`: Foto de perfil.

3.  **`organization_members` (Relación Usuario-Organización)**
    *   Vincula usuarios a una organización.
    *   `organization_id`: FK a Organizations.
    *   `user_id`: FK a Profiles.
    *   `role`: 'owner' (Dueño de la cuenta), 'admin' (Administrador global), 'member' (Empleado).

4.  **`restaurants` (Sedes)**
    *   `id`: UUID (PK).
    *   `organization_id`: FK a Organizations (Indica a qué cliente pertenece).
    *   `name`: Nombre de la sucursal (ej. "Sede Norte").
    *   `address`: Dirección.

5.  **`restaurant_assignments` (Permisos Granulares)**
    *   Define qué usuarios (Managers/Staff) tienen acceso a qué restaurante específico.
    *   `user_id`: FK a Profiles.
    *   `restaurant_id`: FK a Restaurants.
    *   `role`: 'manager' (Encargado), 'staff' (Operario).

6.  **`equipment` y `temperature_readings`**
    *   Pertenecen a un `restaurant_id`.

### B. Jerarquía de Acceso

1.  **Nivel Organización (Dueño/Admin):**
    *   Tienen entrada en `organization_members` con rol 'owner'.
    *   Acceso a **todos** los restaurantes de esa `organization_id`.
    *   Pueden crear nuevos restaurantes y usuarios.

2.  **Nivel Restaurante (Encargado/Staff):**
    *   Tienen entrada en `restaurant_assignments`.
    *   Solo ven y operan sobre el `restaurant_id` asignado.

### C. Estrategia RLS (Row Level Security)

*   **Política `select_my_org_data`:**
    *   Permite ver datos si `auth.uid()` está en `organization_members` de la organización dueña del dato.

*   **Política `select_my_restaurant_data`:**
    *   Permite ver datos si `auth.uid()` está asignado al restaurante específico en `restaurant_assignments`.

*   **Política `insert_readings`:**
    *   Permite insertar lecturas solo si el usuario tiene asignación activa en el restaurante destino.

## 7. Administración de la Plataforma (Super Admin)

Para la gestión del negocio SaaS, se requiere un rol superior ("Dios" o "Backoffice") que no pertenece a ningún restaurante específico.

### A. Capacidades del Super Admin
*   **Gestión de Cuentas:** Pausar/Suspender organizaciones por falta de pago o violación de términos.
*   **Control de Cuotas:** Definir cuántos restaurantes puede crear cada cliente (`max_restaurants`).
*   **Visión Global:** Ver métricas de uso de toda la plataforma.

### B. Cambios en Modelos de Datos

1.  **Tabla `profiles`:**
    *   Nuevo campo: `is_platform_admin` (boolean). Si es `true`, tiene acceso al panel de Super Admin.

2.  **Tabla `organizations`:**
    *   Nuevo campo: `status` (enum: 'active', 'paused', 'suspended').
    *   Nuevo campo: `max_restaurants` (integer, default: 1).

### C. Reglas de Negocio Globales

*   **Bloqueo de Acceso:** 
    *   Middleware/RLS debe verificar `organizations.status`. 
    *   Si el estado no es `active`, se bloquea el login de *todos* los miembros de esa organización.
*   **Límite de Crecimiento:** 
    *   Al intentar crear un restaurante, el backend valida:
    *   `(SELECT count(*) FROM restaurants WHERE organization_id = X) < organizations.max_restaurants`
