'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Search, 
  History, 
  Settings, 
  Sun, 
  Moon 
} from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analyze', path: '/analyze', icon: Search },
    { name: 'History', path: '/history', icon: History },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-bg-card/80 backdrop-blur-xl border-b border-border px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-blue/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic">
            Fraud<span className="text-accent-blue">Shield</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-bg-secondary/50 p-1 rounded-xl border border-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-bg-primary text-accent-blue shadow-sm' 
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-primary/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-accent-blue' : 'text-text-muted'} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">System Access</p>
            <p className="text-xs font-bold text-text-primary">Darsh Parekh</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple border border-border flex items-center justify-center text-[10px] font-bold text-white">
            DP
          </div>
        </div>
      </div>
    </nav>
  );
}
