# TempMonitor

TempMonitor es una plataforma SaaS moderna diseñada para ayudar a los restaurantes a monitorear temperaturas, automatizar informes HACCP y asegurar el cumplimiento de las normativas de salud.

## 🚀 Tecnologías

Este proyecto está construido con un stack moderno y robusto:

- **Core:** [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Enrutamiento:** [React Router 7](https://reactrouter.com/)

## 🛠️ Instalación y Uso

1.  **Clonar el repositorio** (si aún no lo tienes):
    ```bash
    git clone <url-del-repo>
    cd TempMonitor
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── landing/     # Componentes de la página de inicio (Hero, Features, etc.)
│   └── ui/          # Componentes base de Shadcn (Button, Card, etc.)
├── pages/           # Páginas principales (LandingPage, Auth, Dashboard)
├── lib/             # Utilidades y funciones auxiliares
├── TempMonitorApp.tsx # Componente raíz con configuración de Rutas
└── main.tsx         # Punto de entrada de la aplicación
```

## ✨ Características Actuales

- **Landing Page Completa:**
    - Navbar responsivo con menú móvil.
    - Hero section con propuesta de valor.
    - Prueba social (estadísticas).
    - Grid de características y beneficios.
    - Explicación "Cómo funciona".
    - Tabla de precios.
    - Footer con enlaces.

## 📝 Próximos Pasos

- [ ] Implementar Autenticación (Login/Registro).
- [ ] Crear Layout del Dashboard.
- [ ] Desarrollar gestión de restaurantes y equipos.

---

Desarrollado con ❤️ para el sector gastronómico.
