import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';

export const HeroSection = () => {
    // Características principales destacadas en el Hero
    const features = [
        'Alertas de temperatura en tiempo real',
        'Informes de cumplimiento HACCP automatizados',
        'Soporte multi-ubicación',
        'Optimizado para móviles en cocina'
    ];

    return (
        <section className="min-h-screen flex items-center pt-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">

            {/* Elementos decorativos de fondo (blobs) */}
            <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Columna Izquierda - Contenido */}
                    <div className="space-y-8">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Monitorea Temperaturas.{' '}
                            <span className="text-blue-600">Mantén el Cumplimiento.</span>{' '}
                            Evita Multas.
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            La solución inteligente para restaurantes para rastrear temperaturas de equipos,
                            generar informes HACCP y pasar inspecciones de salud con confianza.
                        </p>

                        {/* Lista de verificación de características */}
                        <ul className="space-y-3">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <span className="text-lg text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Botones de CTA (Llamada a la Acción) */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Comenzar Prueba Gratis de 14 Días
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                <Play className="h-5 w-5 mr-2" />
                                Ver Demo
                            </Button>
                        </div>

                        {/* Insignia de Confianza */}
                        <p className="text-sm text-gray-500 pt-2">
                            No se requiere tarjeta de crédito • Cancela cuando quieras
                        </p>
                    </div>

                    {/* Columna Derecha - Maqueta del Dashboard */}
                    <div className="relative lg:h-[600px] flex items-center justify-center">
                        <div className="relative z-10 rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500 bg-white p-6">
                            {/* Vista Previa del Dashboard - Marcador de posición */}
                            <div className="space-y-4">
                                <div className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-32 bg-green-100 rounded-lg"></div>
                                    <div className="h-32 bg-blue-100 rounded-lg"></div>
                                    <div className="h-32 bg-yellow-100 rounded-lg"></div>
                                    <div className="h-32 bg-red-100 rounded-lg"></div>
                                </div>
                                <div className="h-48 bg-gray-100 rounded-lg"></div>
                            </div>
                        </div>

                        {/* Elementos decorativos flotantes */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                        <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-400 rounded-full blur-xl opacity-40 animate-pulse delay-1000"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};
