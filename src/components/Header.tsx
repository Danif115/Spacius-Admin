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
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-spacius-green to-spacius-green-light bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-spacius-green focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-spacius-green/10">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-spacius-green rounded-full"></span>
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="icon" className="hover:bg-spacius-green/10">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}