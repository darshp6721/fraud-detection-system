'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Globe, 
  ArrowUpRight, 
  User,
  ExternalLink,
  Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, transRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions?limit=6`)
        ]);
        const statsData = await statsRes.json();
        const transData = await transRes.json();
        setStats(statsData.data || statsData);
        setTransactions(transData.data || transData.transactions || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header & Personal Architect Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="status-pill safe flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              Engine Live
            </span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Last Sync: Just Now
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            System <span className="text-accent-blue">Intelligence</span>
          </h1>
          <p className="text-text-secondary font-medium max-w-md">
            Real-time fraud detection metrics and predictive monitoring console architected for high-velocity transaction streams.
          </p>
        </div>
        
        <div className="architect-card shadow-xl shadow-accent-blue/10 flex items-center gap-5 stagger-1">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
            <User className="text-white" size={32} />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-white font-bold text-lg leading-tight">Darsh Parekh</h3>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-2">System Architect</p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase">GTU Senior</span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase">v1.0.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Analyzed', value: stats?.totalTransactions || stats?.total || '...', icon: Activity, color: 'blue', change: '+12.5%' },
          { label: 'Fraud Detected', value: stats?.fraudCount || stats?.fraud || '...', icon: AlertTriangle, color: 'red', change: '+4.2%' },
          { label: 'Avg Risk Score', value: stats?.avgRiskScore || stats?.accuracy ? `${stats.avgRiskScore || stats.accuracy}%` : '...', icon: TrendingUp, color: 'orange', change: '-2.1%' },
          { label: 'System Accuracy', value: '96.8%', icon: ShieldCheck, color: 'cyan', change: 'Stable' }
        ].map((stat, i) => (
          <div key={i} className={`glass-panel p-6 stagger-${i+1}`}>
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl bg-accent-blue/5 text-accent-${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded bg-bg-secondary ${stat.change.includes('-') ? 'text-accent-green' : 'text-accent-red'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
              <h2 className="text-2xl font-black mt-1">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-accent-blue" />
              Transaction Velocity (7d)
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
                <div className="w-2 h-2 rounded-full bg-accent-blue" /> Volume
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trends || stats?.trend || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Heatmap Feature */}
        <div className="glass-panel p-6 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Globe size={18} className="text-accent-cyan" />
              Risk Heatmap
            </h3>
            <Info size={14} className="text-text-muted cursor-help" />
          </div>
          <div className="relative flex-grow flex items-center justify-center p-4 bg-bg-secondary/50 rounded-2xl border border-border overflow-hidden">
            <svg viewBox="0 0 200 100" className="w-full h-auto opacity-40">
              <path d="M20,40 Q40,10 80,30 T150,20 T180,50" fill="none" stroke="var(--accent-blue)" strokeWidth="0.5" />
              <circle cx="50" cy="40" r="1.5" fill="#ef4444" className="animate-pulse" />
              <circle cx="120" cy="30" r="1.5" fill="#ef4444" className="animate-pulse" />
              <circle cx="80" cy="70" r="1.5" fill="#f59e0b" className="animate-pulse" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-3">
              {[
                { country: 'Nigeria', risk: 'High', color: 'red' },
                { country: 'Russia', risk: 'High', color: 'red' },
                { country: 'Romania', risk: 'Med', color: 'orange' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-text-secondary">{item.country}</span>
                  <span className={`text-accent-${item.color}`}>{item.risk} Risk</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={18} className="text-accent-red" />
            Priority Investigations
          </h3>
          <Link href="/history" className="text-[10px] font-bold text-accent-blue flex items-center gap-1 hover:underline uppercase tracking-widest">
            View Full Stream <ExternalLink size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Entity</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={tx.id || i} className={`stagger-${(i%3)+1}`}>
                  <td>
                    <p className="font-bold text-sm text-text-primary">{tx.cardHolderName}</p>
                    <p className="mono text-[10px] text-text-muted uppercase tracking-tighter">{tx.cardNumber}</p>
                  </td>
                  <td>
                    <p className="font-bold text-sm">{tx.merchantName}</p>
                    <p className="text-[10px] text-text-muted">{tx.country}</p>
                  </td>
                  <td className="font-black text-sm">₹{tx.amount?.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-bg-primary overflow-hidden">
                        <div 
                          className="h-full" 
                          style={{ 
                            width: `${tx.score}%`, 
                            backgroundColor: tx.score > 60 ? '#ef4444' : tx.score > 30 ? '#f59e0b' : '#10b981' 
                          }} 
                        />
                      </div>
                      <span className="mono text-[10px] font-bold">{tx.score}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${tx.status}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <ArrowUpRight size={14} className="text-text-muted cursor-pointer hover:text-accent-blue transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
