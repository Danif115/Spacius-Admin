'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-spacius-green to-spacius-green-light bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
          )}
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spacius-green focus:border-transparent shadow-sm"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-green-50 text-gray-600">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-spacius-green rounded-full"></span>
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="icon" className="hover:bg-green-50 text-gray-600">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}