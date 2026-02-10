import { Card } from '@/components/ui/card';
import { ClipboardList, Thermometer, Download } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    number: string;
    icon: LucideIcon;
    title: string;
    description: string;
}

export const HowItWorks = () => {
    // Pasos del proceso
    const steps: Step[] = [
        {
            number: '1',
            icon: ClipboardList,
            title: 'Registra tu Restaurante',
            description: 'Crea tu cuenta en menos de 2 minutos. Agrega los detalles de tu restaurante y equipos.',
        },
        {
            number: '2',
            icon: Thermometer,
            title: 'Registra Temperaturas',
            description: 'Tu equipo registra temperaturas desde cualquier dispositivo. Alertas visuales muestran cuando las lecturas están fuera de rango.',
        },
        {
            number: '3',
            icon: Download,
            title: 'Exporta Informes de Cumplimiento',
            description: 'Genera informes PDF profesionales con un clic. Siempre listo para inspecciones de salud.',
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4">

                <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
                    Comienza en 3 Simples Pasos
                </h2>
                <p className="text-xl text-gray-600 text-center mb-16">
                    Desde la configuración hasta el cumplimiento en minutos
                </p>

                <div className="max-w-5xl mx-auto space-y-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={step.number}
                                className={cn(
                                    "grid md:grid-cols-2 gap-8 items-center",
                                    !isEven && "md:grid-flow-dense"
                                )}
                            >
                                {/* Contenido (Texto) */}
                                <div className={cn(isEven ? "md:col-start-1" : "md:col-start-2")}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                            {step.number}
                                        </div>
                                        <Icon className="h-10 w-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                                </div>

                                {/* Marcador de posición visual (Imagen/Ilustración) */}
                                <div className={cn(isEven ? "md:col-start-2" : "md:col-start-1")}>
                                    <Card className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="text-center p-8">
                                            <Icon className="h-24 w-24 text-blue-600 mx-auto mb-4 opacity-50" />
                                            <p className="text-blue-600 font-semibold text-lg">Visual del Paso {step.number}</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};
