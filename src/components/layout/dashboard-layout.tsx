'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-[#06090E] bg-grid-pattern text-slate-100 flex flex-col">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'pl-64' : 'pl-20'
        )}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
