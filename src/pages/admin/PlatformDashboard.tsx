import { useEffect } from 'react';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Store, Loader2 } from 'lucide-react';

export const PlatformDashboard = () => {
    const { stats, isLoadingStats, fetchGlobalStats } = useSuperAdmin();

    useEffect(() => {
        fetchGlobalStats();
    }, []);

    const metricCards = [
        {
            title: "Total Organizaciones",
            value: stats.totalOrganizations,
            icon: Building2,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            title: "Total Sucursales",
            value: stats.totalRestaurants,
            icon: Store,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100"
        },
        {
            title: "Total Usuarios",
            value: stats.totalUsers,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard de Plataforma</h1>
                <p className="text-slate-500 mt-1">Vista general interactiva de todos los clientes y usuarios de TempMonitor.</p>
            </div>

            {isLoadingStats ? (
                <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {metricCards.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <Card key={index} className="border-none shadow-md bg-white">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500">
                                        {metric.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-full ${metric.bgColor}`}>
                                        <Icon className={`h-4 w-4 ${metric.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900">{metric.value}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
