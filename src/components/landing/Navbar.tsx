import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Thermometer, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
    // Estado para controlar si el usuario ha hecho scroll
    const [isScrolled, setIsScrolled] = useState(false);
    // Estado para controlar la apertura del menú móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Función para manejar el evento de scroll
        const handleScroll = () => {
            // Cambiar estado si el scroll es mayor a 50px
            setIsScrolled(window.scrollY > 50);
        };

        // Agregar event listener
        window.addEventListener('scroll', handleScroll);

        // Limpiar event listener al desmontar el componente
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Enlaces de navegación
    const navLinks = [
        { href: '#features', label: 'Características' },
        { href: '#how-it-works', label: 'Cómo Funciona' },
        { href: '#pricing', label: 'Precios' },
        { href: '#contact', label: 'Contacto' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            isScrolled
                ? "bg-white shadow-md"
                : "bg-transparent"
        )}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-18 py-4">

                    {/* Logotipo */}
                    <div className="flex items-center gap-2">
                        <Thermometer className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">TempMonitor</span>
                    </div>

                    {/* Navegación de Escritorio */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                        {/* Enlace temporal para desarrollo */}
                        <a href="/dashboard" className="text-blue-600 font-bold hover:text-blue-800">
                            Dashboard (Dev)
                        </a>
                    </div>

                    {/* Botones de CTA (Call to Action) en Escritorio */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>Iniciar Sesión</Button>
                        <Button>Prueba Gratis</Button>
                    </div>

                    {/* Botón de Menú Móvil */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>

                {/* Menú Móvil Desplegable */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t bg-white">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                            <Button className="w-full">Prueba Gratis</Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
