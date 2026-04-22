'use client';
import { useState } from 'react';
import { Shield, AlertTriangle, Zap, Clock, Globe, CreditCard, Settings, CheckCircle } from 'lucide-react';

const rules = [
  { id: 1, name: 'High Amount Threshold', icon: CreditCard, enabled: true, severity: 'HIGH', description: 'Flag transactions above ₹50,000 as high risk', color: '#ef4444', value: '₹50,000' },
  { id: 2, name: 'Round Number Detection', icon: Zap, enabled: true, severity: 'LOW', description: 'Flag exact round number transactions (e.g. ₹1000, ₹5000)', color: '#3b82f6', value: 'Any round ₹1000+' },
  { id: 3, name: 'Unusual Time Detection', icon: Clock, enabled: true, severity: 'HIGH', description: 'Flag transactions between 2AM - 5AM IST', color: '#ef4444', value: '2:00 AM – 5:00 AM' },
  { id: 4, name: 'High-Risk Merchant Check', icon: AlertTriangle, enabled: true, severity: 'HIGH', description: 'Block crypto, casino, wire transfer merchants by default', color: '#ef4444', value: '8 categories' },
  { id: 5, name: 'Geographic Risk Analysis', icon: Globe, enabled: true, severity: 'HIGH', description: 'Flag transactions from high-risk countries (NG, RO, RU, CN)', color: '#f59e0b', value: '7 countries' },
  { id: 6, name: 'Velocity Check', icon: Zap, enabled: true, severity: 'MEDIUM', description: 'Flag cards with more than 5 transactions in a single day', color: '#f59e0b', value: '>5 per day' },
  { id: 7, name: 'Card-Not-Present High Value', icon: CreditCard, enabled: true, severity: 'MEDIUM', description: 'Flag online CNP transactions above ₹15,000', color: '#f59e0b', value: '₹15,000 online' },
  { id: 8, name: 'New Merchant Flag', icon: Shield, enabled: true, severity: 'LOW', description: 'Flag first-time transactions with new merchants', color: '#3b82f6', value: 'First transaction' },
  { id: 9, name: 'Cross-Border Online', icon: Globe, enabled: true, severity: 'MEDIUM', description: 'Flag international online transactions', color: '#f59e0b', value: 'Non-IN + online' },
];

const metrics = [
  { label: 'True Positives', value: '186', desc: 'Fraud correctly caught', color: '#10b981' },
  { label: 'False Positives', value: '11', desc: 'Legit flagged as fraud', color: '#f59e0b' },
  { label: 'True Negatives', value: '492', desc: 'Legit correctly passed', color: '#3b82f6' },
  { label: 'False Negatives', value: '16', desc: 'Fraud missed', color: '#ef4444' },
];

export default function AdminPage() {
  const [ruleStates, setRuleStates] = useState(Object.fromEntries(rules.map(r => [r.id, r.enabled])));
  const [saved, setSaved] = useState(false);

  const toggle = (id) => {
    setRuleStates(prev => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Configure fraud detection rules and monitor system performance</p>
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Settings size={16} /> Save Configuration</>}
        </button>
      </div>

      {saved && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#10b981', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={16} /> Configuration saved successfully. Rules will take effect on next transaction.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Rules Configuration */}
        <div>
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} style={{ color: 'var(--accent-blue)' }} />
              Detection Rules
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Enable or disable individual fraud detection rules. {Object.values(ruleStates).filter(Boolean).length}/{rules.length} rules active.
            </p>

            {rules.map((rule) => (
              <div key={rule.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 0',
                borderBottom: '1px solid rgba(31,45,69,0.5)',
                opacity: ruleStates[rule.id] ? 1 : 0.45,
                transition: 'opacity 0.2s'
              }}>
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: `rgba(${rule.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.1)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid rgba(${rule.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.2)`
                }}>
                  <rule.icon size={18} style={{ color: rule.color }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{rule.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: rule.severity === 'HIGH' ? '#ef4444' : rule.severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6',
                      background: rule.severity === 'HIGH' ? 'rgba(239,68,68,0.1)' : rule.severity === 'MEDIUM' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)'
                    }}>
                      {rule.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rule.description}</div>
                </div>

                {/* Threshold */}
                <div style={{ textAlign: 'right', marginRight: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{rule.value}</div>
                </div>

                {/* Toggle */}
                <div
                  onClick={() => toggle(rule.id)}
                  style={{
                    width: 44, height: 24, borderRadius: 100,
                    background: ruleStates[rule.id] ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                    border: `1px solid ${ruleStates[rule.id] ? '#3b82f6' : 'var(--border)'}`
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3,
                    left: ruleStates[rule.id] ? 22 : 3,
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'white', transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* System Status */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>System Health</h3>
            {[
              { label: 'API Status', value: 'Online', color: '#10b981' },
              { label: 'Engine Version', value: 'v1.0.0', color: 'var(--text-secondary)' },
              { label: 'Rules Active', value: `${Object.values(ruleStates).filter(Boolean).length}/${rules.length}`, color: '#3b82f6' },
              { label: 'Avg. Response', value: '12ms', color: '#10b981' },
              { label: 'Uptime', value: '99.98%', color: '#10b981' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(31,45,69,0.5)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Confusion Matrix */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Model Performance</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Confusion matrix — last 30 days</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {metrics.map(m => (
                <div key={m.label} style={{
                  padding: 16, borderRadius: 12, textAlign: 'center',
                  background: `rgba(${m.color.replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(',')}, 0.08)`,
                  border: `1px solid rgba(${m.color.replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(',')}, 0.2)`
                }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detection Rules Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-8 uppercase tracking-widest">
              <Shield size={18} className="text-accent-blue" />
              Active Detection Heuristics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl bg-bg-secondary border border-border flex items-start justify-between group hover:border-accent-blue/30 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-text-primary">{rule.name}</p>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${rule.severity === 'HIGH' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-blue/10 text-accent-blue'}`}>
                        {rule.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted leading-tight">{rule.desc}</p>
                  </div>
                  <button onClick={() => toggleRule(rule.id)} className="text-accent-blue">
                    {rule.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-text-muted" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Rule Simulator Feature */}
          <div className="glass-panel p-8 bg-gradient-to-br from-bg-card to-bg-secondary">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-6 uppercase tracking-widest">
              <Cpu size={18} className="text-accent-cyan" />
              Neural Weight Simulator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-text-muted uppercase">Base Sensitivity</label>
                <input type="range" className="w-full accent-accent-blue" defaultValue={75} />
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Relaxed</span>
                  <span>Strict</span>
                </div>
              </div>
              <div className="md:col-span-2 p-4 rounded-xl bg-bg-primary/50 border border-border">
                <p className="text-xs font-medium text-text-secondary leading-relaxed">
                  Adjusting the **Neural Weight** affects how individual heuristics aggregate into the final risk score. Higher sensitivity will reduce False Negatives but may increase False Positives.
                </p>
                <div className="mt-4 flex items-center gap-2 text-accent-cyan text-xs font-bold cursor-pointer hover:underline">
                  View Probability Distribution <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-8 flex flex-col gap-8">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
              <BarChart3 size={18} className="text-accent-purple" />
              Engine Performance
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Precision', value: '94.4%', sub: 'True Positive Rate', color: 'blue' },
                { label: 'Recall', value: '92.1%', sub: 'False Negative avoidance', color: 'purple' },
                { label: 'F1 Score', value: '93.2%', sub: 'Combined Efficiency', color: 'cyan' }
              ].map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase">{metric.label}</p>
                      <p className="text-[10px] text-text-muted/60">{metric.sub}</p>
                    </div>
                    <p className={`text-xl font-black text-accent-${metric.color}`}>{metric.value}</p>
                  </div>
                  <div className="h-1 bg-bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full bg-accent-${metric.color}`} style={{ width: metric.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-6 uppercase tracking-widest">
              <Database size={18} className="text-accent-green" />
              Database Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-medium">Uptime</span>
                <span className="text-text-primary font-bold mono">99.98%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-medium">Active Workers</span>
                <span className="text-text-primary font-bold mono">12 Nodes</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-medium">Daily Queries</span>
                <span className="text-text-primary font-bold mono">1.2M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
