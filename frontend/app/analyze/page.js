'use client';
import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, AlertCircle, Shield, ChevronRight, RotateCcw } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SEVERITY_COLORS = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#3b82f6'
};

function ScoreGauge({ score }) {
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle cx="70" cy="70" r="54" fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: 34, fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Risk Score</span>
      </div>
    </div>
  );
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Download,
  Terminal,
  Activity
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze`, {
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


  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Transaction Analyzer</h1>
        <p className="page-subtitle">Enter transaction details to get an instant fraud risk assessment</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24, maxWidth: result ? '100%' : 720, margin: result ? '0' : '0 auto' }}>
        {/* FORM */}
        <div className="glass-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={18} style={{ color: 'var(--accent-blue)' }} />
            Transaction Details
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label">Cardholder Name</label>
                <input className="form-input" name="cardHolderName" value={form.cardHolderName} onChange={handleChange} placeholder="Rahul Sharma" required />
              </div>
              <div>
                <label className="form-label">Card Number (masked)</label>
                <input className="form-input" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="4532****1234" required />
              </div>
              <div>
                <label className="form-label">Transaction Amount (₹)</label>
                <input className="form-input" type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="5000" required min="1" />
              </div>
              <div>
                <label className="form-label">Merchant Name</label>
                <input className="form-input" list="merchants" name="merchantName" value={form.merchantName} onChange={handleChange} placeholder="Amazon India" required />
                <datalist id="merchants">
                  {MERCHANTS.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>
              <div>
                <label className="form-label">Merchant Category</label>
                <select className="form-input" name="merchantCategory" value={form.merchantCategory} onChange={handleChange}>
                  <option value="electronics">Electronics</option>
                  <option value="grocery">Grocery</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="travel">Travel</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="cryptocurrency">Cryptocurrency</option>
                  <option value="gambling">Gambling / Casino</option>
                  <option value="wire_transfer">Wire Transfer</option>
                  <option value="gift_card">Gift Cards</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="transport">Transport</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>
              <div>
                <label className="form-label">Country</label>
                <select className="form-input" name="country" value={form.country} onChange={handleChange}>
                  <option value="IN">🇮🇳 India (IN)</option>
                  <option value="US">🇺🇸 United States (US)</option>
                  <option value="GB">🇬🇧 United Kingdom (GB)</option>
                  <option value="NG">🇳🇬 Nigeria (NG)</option>
                  <option value="RO">🇷🇴 Romania (RO)</option>
                  <option value="CN">🇨🇳 China (CN)</option>
                  <option value="RU">🇷🇺 Russia (RU)</option>
                  <option value="DE">🇩🇪 Germany (DE)</option>
                  <option value="SG">🇸🇬 Singapore (SG)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Transaction Type</label>
                <select className="form-input" name="transactionType" value={form.transactionType} onChange={handleChange}>
                  <option value="online">Online (Card Not Present)</option>
                  <option value="offline">In-Store / POS</option>
                  <option value="atm">ATM Withdrawal</option>
                  <option value="contactless">Contactless / NFC</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" name="isNewMerchant" checked={form.isNewMerchant} onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: 'var(--accent-blue)' }} />
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>First-time merchant</span>
                </label>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Analyzing...
                  </>
                ) : (
                  <><Shield size={16} /> Analyze Transaction</>
                )}
              </button>
              {result && (
                <button type="button" onClick={reset} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* RESULT */}
        {result && statusConfig && (
          <div className="animate-fade-in">
            {/* Status Banner */}
            <div className="glass-card" style={{
              padding: 24, marginBottom: 16,
              background: statusConfig.bg,
              border: `1px solid ${statusConfig.border}`
            }}>
              <div style={{ textAlign: 'center' }}>
                <ScoreGauge score={result.score} />
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: statusConfig.color }}>{statusConfig.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{statusConfig.desc}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>Risk Level: <strong style={{ color: statusConfig.color }}>{result.riskLevel}</strong></span>
                  <span>·</span>
                  <span>Score: <strong style={{ color: statusConfig.color }}>{result.score}/100</strong></span>
                </div>
              </div>
            </div>

            {/* Flags */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
                {result.flags.length > 0 ? `${result.flags.length} Risk Factor${result.flags.length > 1 ? 's' : ''} Detected` : '✅ No Risk Factors Detected'}
              </h3>
              {result.flags.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  This transaction passed all fraud detection checks.
                </p>
              )}
              {result.flags.map((flag, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
                  borderBottom: i < result.flags.length - 1 ? '1px solid rgba(31,45,69,0.5)' : 'none'
                }}>
                  <div style={{
                    minWidth: 28, height: 28, borderRadius: 8,
                    background: `rgba(${flag.severity === 'HIGH' ? '239,68,68' : flag.severity === 'MEDIUM' ? '245,158,11' : '59,130,246'}, 0.1)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: SEVERITY_COLORS[flag.severity]
                  }}>
                    {flag.severity[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {flag.rule.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{flag.detail}</div>
                  </div>
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '3px 8px',
                    borderRadius: 100, textTransform: 'uppercase',
                    color: SEVERITY_COLORS[flag.severity],
                    background: `rgba(${flag.severity === 'HIGH' ? '239,68,68' : flag.severity === 'MEDIUM' ? '245,158,11' : '59,130,246'}, 0.1)`,
                    border: `1px solid rgba(${flag.severity === 'HIGH' ? '239,68,68' : flag.severity === 'MEDIUM' ? '245,158,11' : '59,130,246'}, 0.3)`,
                    whiteSpace: 'nowrap'
                  }}>
                    {flag.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
