'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TopBar() {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spacius-green focus:border-transparent shadow-sm"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-green-50 text-gray-600">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-spacius-green rounded-full"></span>
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
