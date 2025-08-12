'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Home, Mail, Calendar } from 'lucide-react';
import { Button } from '~/components/ui/button';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
      description: 'System overview and features'
    },
    {
      href: '/reminder-preview',
      label: 'Reminders',
      icon: Bell,
      description: 'Task reminder management'
    },
    {
      href: '/email-showcase',
      label: 'Documentation',
      icon: Mail,
      description: 'System specifications and guides'
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Calendar className="h-8 w-8 text-slate-700 mr-3" />
              <span className="text-xl font-semibold text-slate-900">Task Management System</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      isActive 
                        ? 'bg-slate-800 text-white hover:bg-slate-700' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    title={item.description}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
