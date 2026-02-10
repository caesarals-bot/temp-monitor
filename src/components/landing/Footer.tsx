import { Thermometer } from 'lucide-react';

export const Footer = () => {
    // Definición de secciones del pie de página
    const footerSections = {
        product: [
            { label: 'Características', href: '#features' },
            { label: 'Precios', href: '#pricing' },
            { label: 'Demo', href: '#' },
            { label: 'Documentación', href: '#' },
        ],
        company: [
            { label: 'Sobre Nosotros', href: '#' },
            { label: 'Contacto', href: '#contact' },
            { label: 'Blog', href: '#' },
            { label: 'Carreras', href: '#' },
        ],
        legal: [
            { label: 'Política de Privacidad', href: '#' },
            { label: 'Términos de Servicio', href: '#' },
            { label: 'Política de Cookies', href: '#' },
        ],
    };

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">

                    {/* Logotipo y Descripción */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Thermometer className="h-8 w-8 text-blue-400" />
                            <span className="text-2xl font-bold">TempMonitor</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            La solución inteligente para el cumplimiento de temperatura en restaurantes e informes HACCP.
                        </p>
                    </div>

                    {/* Enlaces de Producto */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Producto</h4>
                        <ul className="space-y-2">
                            {footerSections.product.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Enlaces de Empresa */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Empresa</h4>
                        <ul className="space-y-2">
                            {footerSections.company.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Enlaces Legales */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Legal</h4>
                        <ul className="space-y-2">
                            {footerSections.legal.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Barra Inferior (Copyright) */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} TempMonitor. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};
