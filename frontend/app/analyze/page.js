'use client';

import { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Info,
  Download,
  Terminal,
  Activity,
  RotateCcw
} from 'lucide-react';

export default function AnalyzePage() {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    amount: '',
    merchantName: '',
    merchantCategory: 'retail',
    country: 'IN',
    transactionType: 'online',
    isNewMerchant: false
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [playbackStep, setPlaybackStep] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setPlaybackStep(0);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      });
      const data = await res.json();
      
      // Simulate playback steps for UX
      for(let i = 1; i <= 3; i++) {
        await new Promise(r => setTimeout(r, 600));
        setPlaybackStep(i);
      }
      
      setResult(data.data);
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      cardHolderName: '',
      cardNumber: '',
      amount: '',
      merchantName: '',
      merchantCategory: 'retail',
      country: 'IN',
      transactionType: 'online',
      isNewMerchant: false
    });
  };

  return (
    <div className="page-container max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Left Side: Input Form */}
        <div className="w-full md:w-5/12 space-y-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Manual <span className="text-accent-blue">Inquiry</span></h1>
            <p className="text-text-secondary font-medium mt-2">Submit transaction details for deep-packet heuristic analysis.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 block">Cardholder</label>
                <input 
                  className="input-field" 
                  placeholder="Full Legal Name"
                  value={formData.cardHolderName}
                  onChange={(e) => setFormData({...formData, cardHolderName: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 block">Card Number</label>
                  <input 
                    className="input-field mono" 
                    placeholder="**** **** **** ****"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 block">Amount (INR)</label>
                  <input 
                    type="number"
                    className="input-field font-black" 
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 block">Merchant Entity</label>
                <input 
                  className="input-field" 
                  placeholder="e.g. Amazon, CryptoEx"
                  value={formData.merchantName}
                  onChange={(e) => setFormData({...formData, merchantName: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 block">Origin</label>
                  <select 
                    className="input-field"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="IN">India (Domestic)</option>
                    <option value="US">USA</option>
                    <option value="NG">Nigeria (High Risk)</option>
                    <option value="RU">Russia (High Risk)</option>
                    <option value="RO">Romania</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 block">Category</label>
                  <select 
                    className="input-field"
                    value={formData.merchantCategory}
                    onChange={(e) => setFormData({...formData, merchantCategory: e.target.value})}
                  >
                    <option value="retail">Retail</option>
                    <option value="food">Dining</option>
                    <option value="cryptocurrency">Cryptocurrency</option>
                    <option value="gambling">Gambling</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-modern flex-grow h-14 text-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Activity size={20} className="animate-spin" /> 
                    Scanning Data...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap size={20} /> Start Analysis
                  </span>
                )}
              </button>
              {result && (
                <button 
                  type="button"
                  onClick={handleReset}
                  className="w-14 h-14 rounded-xl bg-bg-secondary border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
                >
                  <RotateCcw size={20} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Results & Playback */}
        <div className="w-full md:w-7/12">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center p-12 glass-panel border-dashed opacity-50 text-center">
              <ShieldCheck size={64} className="mb-6 text-text-muted" />
              <h3 className="text-xl font-bold">Ready for Inspection</h3>
              <p className="text-sm text-text-muted mt-2 max-w-xs">Enter transaction details to trigger the rule-based fraud detection engine.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-border border-t-accent-blue animate-spin mb-6" />
                <h3 className="text-lg font-black uppercase tracking-widest">Protocol Sequence Active</h3>
                <div className="w-full max-w-sm mt-8 space-y-4">
                  {[
                    { label: 'Packet Decryption', done: playbackStep >= 1 },
                    { label: 'Cross-Reference Heuristics', done: playbackStep >= 2 },
                    { label: 'Risk Vector Compilation', done: playbackStep >= 3 }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold">
                      <span className={step.done ? 'text-accent-blue' : 'text-text-muted'}>{step.label}</span>
                      {step.done ? <ShieldCheck size={14} className="text-accent-green" /> : <Activity size={14} className="text-border animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in print:p-0">
              {/* Risk Gauge Header */}
              <div className={`glass-panel p-8 border-l-8 ${result.score > 60 ? 'border-accent-red' : result.score > 30 ? 'border-accent-orange' : 'border-accent-green'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-4xl font-black leading-none">
                      {result.score}
                      <span className="text-sm text-text-muted ml-1 uppercase">Risk Units</span>
                    </h2>
                    <p className={`text-sm font-bold mt-1 uppercase tracking-widest ${result.score > 60 ? 'text-accent-red' : result.score > 30 ? 'text-accent-orange' : 'text-accent-green'}`}>
                      {result.status} Classification
                    </p>
                  </div>
                  <div className="flex gap-2 print:hidden">
                    <button 
                      onClick={handlePrint}
                      className="p-3 rounded-xl bg-bg-secondary hover:bg-border transition-colors text-text-secondary hover:text-text-primary"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>

                <div className="h-4 bg-bg-secondary rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${result.score}%`, 
                      backgroundColor: result.score > 60 ? '#ef4444' : result.score > 30 ? '#f59e0b' : '#10b981' 
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                  <span>Safe</span>
                  <span>Moderate</span>
                  <span>Critical</span>
                </div>
              </div>

              {/* Engine Breakdown */}
              <div className="glass-panel p-8">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-6 uppercase tracking-widest">
                  <Terminal size={16} className="text-accent-blue" />
                  Engine Logic Playback
                </h3>
                <div className="space-y-4">
                  {result.flags?.map((flag, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-bg-secondary border border-border group hover:border-accent-blue/30 transition-colors">
                      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${flag.severity === 'HIGH' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-orange/10 text-accent-orange'}`}>
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{flag.rule?.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">{flag.detail}</p>
                      </div>
                    </div>
                  ))}
                  {(!result.flags || result.flags.length === 0) && (
                    <div className="text-center py-6">
                      <ShieldCheck size={40} className="mx-auto mb-3 text-accent-green opacity-30" />
                      <p className="text-sm font-medium text-text-muted">Zero heuristics triggered. Transaction verified.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Print-Only Audit Header */}
              <div className="hidden print:block mt-10 border-t border-border pt-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase mb-1">Official Forensic Audit</p>
                    <h2 className="text-xl font-black">FraudShield System Architecture</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Certified by</p>
                    <p className="text-sm font-bold">Darsh Parekh</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
