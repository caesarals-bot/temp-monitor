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
*   **Supabase Auth Integrado:** Login y registro funcional conectado a PostgreSQL.
*   **Protección de Rutas:**
    *   `/dashboard` requiere autenticación viva.
    *   `/admin` está restringido exclusivamente a miembros `is_platform_admin`.
*   **Recuperación de Contraseña:** Capacidad de forzar reinicio de contraseñas de forma nativa.

### 🏢 Gestión Multi-Tenant (SaaS)
*   **Onboarding:** Flujo automático de creación de organizaciones para usuarios recién registrados.
*   **Gestión de Sedes:** Soporte inicial para múltiples sedes con límites (`max_restaurants`) parametrizables.

### 🛡️ Panel Super Admin (Plataforma)
*   Vista maestra aislada del usuario común para gestionar Tenants.
*   **Métricas Globales:** Cantidad de clientes, sedes y usuarios operando.
*   **Visor y Gestor:** Capacidad de pausar/suspender organizaciones, bloqueando efectivamente el acceso de sus usuarios.

### 📱 Dashboard Operativo
*   **Diseño PWA:** Enfocado en la utilidad y rapidez, sin distracciones de marketing.
*   **Layout Responsivo:** Sidebar colapsable y adaptada a móviles.

## 🛠️ Instalación y Uso

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno (.env.local):**
    Asegúrate de tener un proyecto en Supabase y poner las llaves:
    ```env
    VITE_SUPABASE_URL=tu_url
    VITE_SUPABASE_ANON_KEY=tu_llave
    ```

4.  **Iniciar servidor (Modo Desarrollo):**
    ```bash
    npm run dev
    ```

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

*   [ ] Integración Anti-Spam: Cloudflare Turnstile en Login/Registro.
*   [ ] Integración Rate Limits en Supabase.
*   [ ] Revalidar y documentar en profundo estrategia RLS en Supabase.
