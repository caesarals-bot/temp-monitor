import { Card } from '@/components/ui/card';
import {
    Thermometer,
    FileCheck,
    Building,
    Smartphone,
    TrendingUp,
    Users,
    Bell,
    Mail,
    Shield
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
}

interface SmallFeature {
    icon: LucideIcon;
    text: string;
}

export const FeaturesSection = () => {
    // Características principales destacadas
    const mainFeatures: Feature[] = [
        {
            icon: Thermometer,
            title: 'Alertas Instantáneas de Temperatura',
            description: 'Recibe notificaciones inmediatas cuando las temperaturas de los equipos salgan del rango. Nunca más pierdas productos por fallos no detectados.',
            color: 'text-blue-600',
        },
        {
            icon: FileCheck,
            title: 'Informes HACCP en Un Clic',
            description: 'Genera informes PDF profesionales para inspectores de salud en segundos. Completos con gráficos, firmas y registros de auditoría.',
            color: 'text-green-600',
        },
        {
            icon: Building,
            title: 'Gestiona Todas las Ubicaciones',
            description: 'Monitorea las temperaturas en múltiples restaurantes desde un solo panel. Perfecto para cadenas y franquicias.',
            color: 'text-purple-600',
        },
    ];

    // Características adicionales en lista compacta
    const additionalFeatures: SmallFeature[] = [
        { icon: Smartphone, text: 'Diseño Mobile-First' },
        { icon: TrendingUp, text: 'Analítica de Tendencias de Temperatura' },
        { icon: Users, text: 'Colaboración de Equipo y Roles' },
        { icon: Bell, text: 'Reglas de Alerta Personalizables' },
        { icon: Mail, text: 'Informes por Correo Automáticos' },
        { icon: Shield, text: 'Seguridad de Nivel Bancario' },
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4">

                {/* Encabezado de la Sección */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        Todo lo que Necesitas para el Cumplimiento de Temperatura
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Funciones potentes diseñadas específicamente para operaciones de servicio de alimentos
                    </p>
                </div>

                {/* Cuadrícula de Características Principales */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {mainFeatures.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.title}
                                className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200"
                            >
                                <div className="mb-4">
                                    <Icon className={`h-12 w-12 ${feature.color}`} />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* Características Adicionales */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {additionalFeatures.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.text}
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                <span className="font-medium text-gray-700">{feature.text}</span>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};
