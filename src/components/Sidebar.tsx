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
  X
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
          className="m-4 text-white hover:bg-gray-800"
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
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold text-white">Spacius Admin</h1>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 shrink-0",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}