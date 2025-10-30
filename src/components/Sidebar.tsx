'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  Settings,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Lugares',
    href: '/dashboard/lugares',
    icon: MapPin,
  },
  {
    name: 'Reservas',
    href: '/dashboard/reservas',
    icon: Calendar,
  },
  {
    name: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: Users,
  },
  {
    name: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
  },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 dark:bg-gray-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="m-4 text-white hover:bg-spacius-green/20"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-700 bg-gray-900 dark:bg-gray-900 px-6">
          <SidebarContent pathname={pathname} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      {/* Logo y título con gradiente verde */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-spacius-gradient rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
            <Sparkles className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Spacius Admin</h1>
            <p className="text-xs text-muted-foreground">Panel de Control</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200",
                        isActive
                          ? "bg-spacius-green text-white shadow-lg shadow-green-500/25"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive 
                            ? "text-white" 
                            : "text-muted-foreground group-hover:text-spacius-green"
                        )}
                      />
                      <span className={isActive ? 'font-semibold' : ''}>
                        {item.name}
                      </span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-white/30" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Estado de conexión */}
          <li className="mt-auto">
            <div className="rounded-xl bg-spacius-green/10 p-4 border border-spacius-green/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-spacius-green animate-pulse" />
                <span className="text-sm font-medium text-spacius-green">Firebase Conectado</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Datos en tiempo real activos
              </p>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}