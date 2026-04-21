'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Search, History, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyze', icon: Search },
  { href: '/history', label: 'History', icon: History },
  { href: '/admin', label: 'Admin', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <Shield size={22} style={{ stroke: 'url(#grad)', fill: 'none' }} />
        <svg width="0" height="0">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <span>FraudShield</span>
        <span style={{
          fontSize: '10px', fontWeight: 600, color: '#10b981',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          padding: '2px 8px', borderRadius: '100px', marginLeft: 4
        }}>LIVE</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link ${pathname === href ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
        <span className="pulse-dot green"></span>
        <span>System Online</span>
      </div>
    </nav>
  );
}
