'use client';

import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  ToggleRight, 
  ToggleLeft, 
  Activity, 
  BarChart3, 
  Cpu, 
  Database,
  RefreshCw,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function AdminPage() {
  const [rules, setRules] = useState([
    { id: 1, name: 'High Amount Threshold', desc: 'Flag transactions above ₹50,000', severity: 'HIGH', active: true },
    { id: 2, name: 'Round Number Detection', desc: 'Flag exact multiples of ₹1000', severity: 'LOW', active: true },
    { id: 3, name: 'Unusual Time Window', desc: 'Flag activity between 2AM - 5AM', severity: 'HIGH', active: true },
    { id: 4, name: 'Geographic Risk Match', desc: 'Match against known high-risk countries', severity: 'HIGH', active: true },
    { id: 5, name: 'Merchant Category Risk', desc: 'Flag crypto, gambling, and wire transfers', severity: 'HIGH', active: true },
    { id: 6, name: 'Transaction Velocity', desc: 'More than 5 tx per card in 24 hours', severity: 'MED', active: true },
    { id: 7, name: 'CNP High Value', desc: 'Online transactions above ₹15,000', severity: 'MED', active: true },
    { id: 8, name: 'New Merchant Protocol', desc: 'Initial transaction with unrecognized entity', severity: 'LOW', active: true },
    { id: 9, name: 'Cross-Border Online', desc: 'International + Online combination', severity: 'MED', active: true }
  ]);

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="page-container max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System <span className="text-accent-blue">Control</span></h1>
          <p className="text-text-secondary font-medium">Fine-tune detection heuristics and monitor neural engine performance.</p>
        </div>
        <button className="btn-modern px-6 py-3 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue hover:text-white transition-all flex items-center gap-2">
          <RefreshCw size={16} /> Force Engine Sync
        </button>
      </div>

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
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Base Sensitivity</label>
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
                { label: 'Precision', value: '94.4%', sub: 'True Positive Rate', color: 'accent-blue' },
                { label: 'Recall', value: '92.1%', sub: 'False Negative avoidance', color: 'accent-purple' },
                { label: 'F1 Score', value: '93.2%', sub: 'Combined Efficiency', color: 'accent-cyan' }
              ].map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{metric.label}</p>
                      <p className="text-[10px] text-text-muted/60 font-medium">{metric.sub}</p>
                    </div>
                    <p className={`text-xl font-black text-text-primary`}>{metric.value}</p>
                  </div>
                  <div className="h-1 bg-bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full bg-accent-blue`} style={{ width: metric.value }} />
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
                <span className="text-text-muted font-medium">Uptime Status</span>
                <span className="text-accent-green font-bold uppercase tracking-tighter">Healthy</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-medium">Active Nodes</span>
                <span className="text-text-primary font-bold mono">12 Clusters</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-medium">Daily Telemetry</span>
                <span className="text-text-primary font-bold mono">1.2M Hits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
