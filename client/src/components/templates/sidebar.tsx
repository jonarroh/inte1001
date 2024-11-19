'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '../hooks/useSideBar';
import { Link } from 'react-router-dom';
import { DashboardNav } from './dashboard-nav';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          to={'https://github.com/Kiranism/next-shadcn-dashboard-starter'}
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={[
              {
                title: 'Estadísticas',
                href: '/stats',
                description: 'Información general',
                icon: 'dashboard',
                label: 'chart'
              },
              {
                title: 'Insignias',
                href: '/badges',
                description: 'Insignias de usuario',
                icon: 'badges'
              },
              {
                title: 'Ofertas',
                href: '/ofertas',
                description: 'Ofertas de trabajo',
                icon: 'ofertas'
              },
              {
                title: 'Personalizadas',
                href: '/personalizadas',
                description: 'Ofertas personalizadas',
                icon: 'personalizas'
              },
              {
                title: 'Correos',
                href: '/emails',
                description: 'Correos electrónicos',
                icon: 'mail'
              },
              {
                title: 'Chat',
                href: '/chat',
                description: 'Historial de chat',
                icon: 'chat'
              }
            ]} />
          </div>
        </div>
      </div>
    </aside>
  );
}