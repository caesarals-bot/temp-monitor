import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Building2,
    Users,
    LogOut,
    Menu,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const AdminSidebarContent = ({ onClose }: { onClose?: () => void }) => {
    const location = useLocation();
    const { logout, currentUser } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Resumen Global', href: '/admin' },
        { icon: Building2, label: 'Organizaciones', href: '/admin/organizations' },
        { icon: Users, label: 'Usuarios Globales', href: '/admin/users' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-100">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-purple-400" />
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-white tracking-tight">Super Admin</span>
                    <span className="text-xs text-slate-400">TempMonitor Setup</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    // Exact match for '/admin', prefix match for others
                    const isActive = item.href === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                        {currentUser?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-slate-200 truncate">{currentUser?.name || 'Admin'}</p>
                        <p className="text-xs text-purple-400 truncate">Platform Admin - {currentUser?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
};

export const SuperAdminLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <aside className="w-64 hidden lg:block shadow-xl z-20">
                <AdminSidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col">
                {/* Mobile Header */}
                <header className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-purple-400" />
                        <span className="text-lg font-bold text-white">Super Admin</span>
                    </div>

                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r-0 w-72">
                            <AdminSidebarContent onClose={() => setIsMobileOpen(false)} />
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
