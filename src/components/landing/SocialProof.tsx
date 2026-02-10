import { Card } from '@/components/ui/card';

export const SocialProof = () => {
    // Estadísticas para mostrar credibilidad
    const stats = [
        { value: '5,000+', label: 'Restaurantes' },
        { value: '150,000+', label: 'Lecturas Diarias' },
        { value: '99.8%', label: 'Tiempo de Actividad' },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">

                {/* Título de la sección */}
                <p className="text-center text-sm uppercase tracking-wider text-gray-500 mb-12 font-semibold">
                    CON LA CONFIANZA DE RESTAURANTES EN TODO EL MUNDO
                </p>

                {/* Cuadrícula de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="text-center p-8 hover:shadow-lg transition-shadow">
                            <h3 className="text-5xl font-bold text-blue-600 mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-gray-600 text-lg">{stat.label}</p>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
};
