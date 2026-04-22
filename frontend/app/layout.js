'use client';

import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import { Activity, ShieldCheck } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark');
  const [latency, setLatency] = useState(12);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Simulate latency heartbeat
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * (18 - 8 + 1)) + 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <html lang="en" data-theme={theme} className={inter.className}>
      <body>
        <div className="min-h-screen flex flex-col">
          {/* System Heartbeat Bar */}
          <div className="bg-bg-secondary border-b border-border h-8 flex items-center justify-between px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                System Engine: v1.0.4-Stable
              </span>
              <span className="flex items-center gap-1.5">
                <Activity size={10} className="text-accent-blue" />
                API Latency: <span className="text-text-primary mono">{latency}ms</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={10} className="text-accent-cyan" />
              Secure Environment Protocol Active
            </div>
          </div>

          <Navbar theme={theme} toggleTheme={toggleTheme} />
          
          <main className="flex-grow">
            {children}
          </main>

          {/* Persistent Footer */}
          <footer className="border-t border-border py-8 px-6 bg-bg-secondary">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center">
                  <ShieldCheck className="text-white" size={18} />
                </div>
                <span className="font-bold tracking-tight">FraudShield <span className="text-accent-blue">Pro</span></span>
              </div>
              <p className="text-xs text-text-muted font-medium">
                © 2026 Architected by <span className="text-text-primary font-bold">Darsh Parekh</span> • GTU Senior Design Project
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
