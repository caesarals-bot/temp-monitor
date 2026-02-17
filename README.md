# TempMonitor 🌡️

Plataforma SaaS para el monitoreo de temperaturas y gestión HACCP en restaurantes. Diseñada como una Progressive Web App (PWA) para uso operativo rápido y seguro.

## 🚀 Tecnologías

*   **Core:** React 19 + TypeScript
*   **Build:** Vite
*   **Estilos:** Tailwind CSS 4
*   **UI:** Shadcn/ui + Lucide React
*   **State:** React Context (AppContext)
*   **Routing:** React Router 7

## 🌟 Características Actuales

### 🔐 Autenticación y Seguridad
*   **Login/Registro:** Interfaz completa para inicio de sesión.
*   **Protección de Rutas:**
    *   `/dashboard` requiere autenticación.
    *   Redirección automática a `/login` si no hay sesión.
*   **Modo Demo:** Sistema de autenticación simulado (Mock) para pruebas inmediatas.

### 🚀 Onboarding de Usuarios
*   **Flujo de Primer Uso:**
    *   Si un usuario nuevo se registra y no tiene restaurantes, es redirigido forzosamente a `/onboarding`.
    *   Formulario para crear la primera sucursal antes de acceder al sistema.
*   **Gestión de Contexto:** El sistema identifica automáticamente los restaurantes del usuario.

### 📱 Dashboard Operativo
*   **Diseño PWA:** Enfocado en la utilidad y rapidez, sin distracciones de marketing.
*   **Layout Responsivo:** Sidebar colapsable y adaptada a móviles.

## 🛠️ Instalación y Uso

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar servidor (Modo Desarrollo):**
    ```bash
    npm run dev
    ```

3.  **Probar el Modo Demo:**
    *   Al abrir la app, serás redirigido a `/login`.
    *   **Usuario Existente (con datos):** Usa `mario@example.com` (o cualquier correo de `src/mocks/index.ts`). Entrarás directo al Dashboard.
    *   **Usuario Nuevo (Onboarding):** Usa cualquier correo *nuevo* (ej. `nuevo@demo.com`). Serás redirigido a crear tu primer restaurante.

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── admin/       # Formularios de gestión (Usuarios, Restaurantes)
│   ├── dashboard/   # Layout y widgets del panel principal
│   └── ui/          # Componentes base (Shadcn)
├── context/         # Estado global (AppContext)
├── layouts/         # Layouts principales (AuthLayout, DashboardLayout)
├── mocks/           # Datos de prueba para el Modo Demo
├── pages/
│   ├── admin/       # Páginas de configuración
│   ├── auth/        # Login, Register, Onboarding
│   └── dashboard/   # Vistas operativas
├── types/           # Definiciones TypeScript
└── TempMonitorApp.tsx # Enrutamiento principal
```

## 📝 Próximos Pasos

*   [ ] Implementar **Selector de Contexto** (Cambio de sucursal en el header).
*   [ ] Integrar **Supabase** para autenticación real y base de datos.
*   [ ] Definir políticas **RLS (Row Level Security)** en backend.
