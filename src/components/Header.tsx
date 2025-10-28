'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-gray-900 shadow-sm border-b border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-300">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-gray-800">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-gray-900" />
            </Button>

            {/* Profile menu */}
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
              <User className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}