'use client';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  AlertTriangle, Shield, TrendingUp, TrendingDown,
  Activity, Eye, DollarSign, Zap, RefreshCw
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const PIE_COLORS = ['#ef4444', '#f59e0b', '#10b981'];

function StatCard({ title, value, subtitle, icon: Icon, color, trend, glow }) {
  return (
    <div className={`glass-card stat-card ${glow ? `glow-${glow}` : ''}`}
      style={{ '--accent-color': color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {title}
          </p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `rgba(${hexToRgb(color)}, 0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid rgba(${hexToRgb(color)}, 0.2)`
        }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {trend !== undefined && (
          trend > 0
            ? <TrendingUp size={14} style={{ color: '#ef4444' }} />
            : <TrendingDown size={14} style={{ color: '#10b981' }} />
        )}
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{subtitle}</span>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246';
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#111827', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 16px', fontSize: 13
      }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      const [statsRes, txnsRes] = await Promise.all([
        fetch(`${API}/api/stats`),
        fetch(`${API}/api/transactions?limit=8`)
      ]);
      const statsData = await statsRes.json();
      const txnsData = await txnsRes.json();
      setStats(statsData.data);
      setRecentTxns(txnsData.data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('API error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="loading-shimmer" style={{ height: 32, width: 280, marginBottom: 8 }} />
          <div className="loading-shimmer" style={{ height: 18, width: 200 }} />
        </div>
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-shimmer" style={{ height: 120, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  const pieData = stats ? [
    { name: 'Fraud', value: stats.fraud },
    { name: 'Suspicious', value: stats.suspicious },
    { name: 'Safe', value: stats.safe }
  ] : [];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">
            Fraud Detection Dashboard
          </h1>
          <p className="page-subtitle">
            Real-time transaction monitoring · {stats?.total || 0} transactions analyzed
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {lastUpdated && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchData} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div className="stats-grid">
          <StatCard
            title="Total Transactions"
            value={stats.total.toLocaleString()}
            subtitle="All time records"
            icon={Activity}
            color="#3b82f6"
            glow="blue"
          />
          <StatCard
            title="Fraud Detected"
            value={stats.fraud.toLocaleString()}
            subtitle={`${stats.fraudRate}% fraud rate`}
            icon={AlertTriangle}
            color="#ef4444"
            glow="red"
            trend={1}
          />
          <StatCard
            title="Total Volume"
            value={`₹${(stats.totalAmount / 100000).toFixed(1)}L`}
            subtitle={`₹${(stats.fraudAmount / 100000).toFixed(1)}L fraud value`}
            icon={DollarSign}
            color="#f59e0b"
          />
          <StatCard
            title="Model Accuracy"
            value={`${stats.accuracy}%`}
            subtitle={`F1 Score: ${stats.f1Score}%`}
            icon={Zap}
            color="#10b981"
            glow="green"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Area Chart - Transaction Trend */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Transaction Trend (7 days)</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Daily fraud vs safe transaction volume</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats?.trend || []}>
              <defs>
                <linearGradient id="gradFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#4a5568" tick={{ fontSize: 11 }} />
              <YAxis stroke="#4a5568" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, paddingTop: 16 }} />
              <Area type="monotone" dataKey="fraud" name="Fraud" stroke="#ef4444" fill="url(#gradFraud)" strokeWidth={2} />
              <Area type="monotone" dataKey="safe" name="Safe" stroke="#10b981" fill="url(#gradSafe)" strokeWidth={2} />
              <Area type="monotone" dataKey="suspicious" name="Suspicious" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Transaction Distribution</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>By fraud classification</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" paddingAngle={3}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Mini stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
            {[
              { label: 'Fraud', value: stats?.fraud, color: '#ef4444' },
              { label: 'Suspicious', value: stats?.suspicious, color: '#f59e0b' },
              { label: 'Safe', value: stats?.safe, color: '#10b981' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: 8, background: `rgba(${hexToRgb(item.color)}, 0.08)`, borderRadius: 8, border: `1px solid rgba(${hexToRgb(item.color)}, 0.2)` }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-grid">
        {/* Recent Alerts */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pulse-dot red"></span>
            Live Fraud Alerts
          </h3>
          {recentTxns.filter(t => t.status !== 'safe').slice(0, 5).map(txn => (
            <div key={txn.id} className="alert-item">
              <div style={{
                minWidth: 36, height: 36, borderRadius: 10,
                background: txn.status === 'fraud' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <AlertTriangle size={16} style={{ color: txn.status === 'fraud' ? '#ef4444' : '#f59e0b' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {txn.merchantName}
                  </span>
                  <span className={`badge badge-${txn.status}`}>{txn.status}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  ₹{txn.amount.toLocaleString()} · Score: {txn.score}/100 · {txn.cardHolderName}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Rules Triggered */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            Top Fraud Rules Triggered
          </h3>
          {(stats?.topRules || []).map((rule, i) => {
            const maxCount = stats?.topRules?.[0]?.count || 1;
            const pct = Math.round((rule.count / maxCount) * 100);
            return (
              <div key={rule.rule} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                    {rule.rule.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{rule.count}x</span>
                </div>
                <div className="risk-meter">
                  <div className="risk-meter-fill" style={{
                    width: `${pct}%`,
                    background: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : i === 2 ? '#3b82f6' : '#8b5cf6'
                  }} />
                </div>
              </div>
            );
          })}
          {/* Model Performance */}
          <div style={{
            marginTop: 24, padding: 16,
            background: 'rgba(16,185,129,0.05)', borderRadius: 12,
            border: '1px solid rgba(16,185,129,0.15)'
          }}>
            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={12} /> MODEL PERFORMANCE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Precision', value: `${stats?.precision}%` },
                { label: 'Recall', value: `${stats?.recall}%` },
                { label: 'F1 Score', value: `${stats?.f1Score}%` },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
