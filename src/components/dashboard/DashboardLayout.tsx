import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Thermometer,
    Settings,
    LogOut,
    FileText,
    Menu,
    Users,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { RestaurantSwitcher } from './RestaurantSwitcher';

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
    const location = useLocation();
    const { logout, currentUser } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Resumen', href: '/dashboard' },
        { icon: Thermometer, label: 'Equipos', href: '/dashboard/equipment' },
        { icon: Users, label: 'Personal', href: '/dashboard/staff' },
        { icon: FileText, label: 'Reportes', href: '/dashboard/reports' }, // Placeholder
        { icon: Settings, label: 'Configuración', href: '/dashboard/settings' },
    ];

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                <Thermometer className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">TempMonitor</span>
            </div>


            <div className="px-6 py-4">
                <RestaurantSwitcher />
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {currentUser?.is_platform_admin && (
                    <Link
                        to="/admin"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
                    >
                        <ShieldAlert className="h-5 w-5" />
                        Panel de Plataforma
                    </Link>
                )}

                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                        <p className="text-sm font-medium text-gray-900 truncate hover:underline">{currentUser?.name || 'Usuario'}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.role || 'Staff'}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                </Button>
            </div>
        </div >
    );
};

export const DashboardLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-gray-200 hidden md:block">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <Thermometer className="h-6 w-6 text-blue-600" />
                        <span className="text-lg font-bold">TempMonitor</span>
                    </div>

                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r-0 w-72">
                            <SidebarContent onClose={() => setIsMobileOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </header>

                <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
