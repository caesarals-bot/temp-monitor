import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
}

export const PricingSection = () => {
    // Definición de planes de precios
    const plans: Plan[] = [
        {
            name: 'Inicial',
            price: '$29',
            period: '/mes',
            description: 'Perfecto para ubicaciones individuales',
            features: [
                '1 Restaurante',
                'Hasta 10 equipos',
                'Lecturas ilimitadas',
                'Informes básicos (PDF)',
                'Soporte por correo',
            ],
            popular: false,
        },
        {
            name: 'Profesional',
            price: '$79',
            period: '/mes',
            description: 'Para negocios en crecimiento',
            features: [
                'Hasta 5 Restaurantes',
                'Equipos ilimitados',
                'Lecturas ilimitadas',
                'Informes avanzados + analítica',
                'Soporte prioritario',
                'Marca personalizada',
            ],
            popular: true,
        },
        {
            name: 'Empresarial',
            price: 'A medida',
            period: '',
            description: 'Para grandes cadenas',
            features: [
                'Restaurantes ilimitados',
                'Equipos ilimitados',
                'Lecturas ilimitadas',
                'Acceso a API',
                'Gerente de cuenta dedicado',
                'Integraciones personalizadas',
                'Garantía SLA',
            ],
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="container mx-auto px-4">

                {/* Encabezado */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        Precios Simples y Transparentes
                    </h2>
                    <p className="text-xl text-gray-600">Elige el plan que se adapte a tus necesidades</p>
                </div>

                {/* Tarjetas de Precios */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={cn(
                                "p-8 relative transition-all duration-300",
                                plan.popular && "border-2 border-blue-600 shadow-2xl md:scale-105"
                            )}
                        >
                            {/* Etiqueta de Popular */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Más Popular
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-gray-600">{plan.description}</p>
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                                {plan.period && <span className="text-gray-600 text-lg">{plan.period}</span>}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                size="lg"
                                variant={plan.popular ? "default" : "outline"}
                            >
                                {plan.name === 'Empresarial' ? 'Contactar Ventas' : 'Comenzar Prueba Gratis'}
                            </Button>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
};
