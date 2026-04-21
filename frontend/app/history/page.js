'use client';
import { useEffect, useState } from 'react';
import { RefreshCw, Filter, Download, Search } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/api/transactions`);
      const data = await res.json();
      setTransactions(data.data);
      setFiltered(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  useEffect(() => {
    let result = transactions;
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.merchantName?.toLowerCase().includes(q) ||
        t.cardHolderName?.toLowerCase().includes(q) ||
        t.cardNumber?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [statusFilter, search, transactions]);

  const downloadCSV = () => {
    const headers = ['ID', 'Cardholder', 'Card', 'Merchant', 'Category', 'Amount', 'Country', 'Type', 'Score', 'Status', 'Risk Level', 'Timestamp'];
    const rows = filtered.map(t => [
      t.id, t.cardHolderName, t.cardNumber, t.merchantName, t.merchantCategory,
      t.amount, t.country, t.transactionType, t.score, t.status, t.riskLevel,
      new Date(t.timestamp).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
  };

  const counts = {
    all: transactions.length,
    fraud: transactions.filter(t => t.status === 'fraud').length,
    suspicious: transactions.filter(t => t.status === 'suspicious').length,
    safe: transactions.filter(t => t.status === 'safe').length,
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Transaction History</h1>
          <p className="page-subtitle">All analyzed transactions with fraud classification</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchTransactions} style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter', fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={downloadCSV} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'fraud', 'suspicious', 'safe'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '8px 18px', borderRadius: 100, border: '1px solid',
            fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            textTransform: 'capitalize', transition: 'all 0.2s',
            borderColor: statusFilter === s
              ? (s === 'fraud' ? '#ef4444' : s === 'suspicious' ? '#f59e0b' : s === 'safe' ? '#10b981' : '#3b82f6')
              : 'var(--border)',
            background: statusFilter === s
              ? (s === 'fraud' ? 'rgba(239,68,68,0.1)' : s === 'suspicious' ? 'rgba(245,158,11,0.1)' : s === 'safe' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)')
              : 'transparent',
            color: statusFilter === s
              ? (s === 'fraud' ? '#ef4444' : s === 'suspicious' ? '#f59e0b' : s === 'safe' ? '#10b981' : '#3b82f6')
              : 'var(--text-secondary)'
          }}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}

        {/* Search */}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 36, width: 220, height: 38 }}
            placeholder="Search merchant, cardholder..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading transactions...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cardholder</th>
                  <th>Merchant</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Country</th>
                  <th>Type</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No transactions found</td></tr>
                )}
                {filtered.map(txn => (
                  <tr key={txn.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{txn.cardHolderName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{txn.cardNumber}</div>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {txn.merchantName}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{txn.merchantCategory?.replace(/_/g, ' ')}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{txn.amount?.toLocaleString()}</td>
                    <td>{txn.country}</td>
                    <td style={{ textTransform: 'capitalize' }}>{txn.transactionType}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', minWidth: 48 }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${txn.score}%`,
                            background: txn.score >= 70 ? '#ef4444' : txn.score >= 40 ? '#f59e0b' : '#10b981'
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: txn.score >= 70 ? '#ef4444' : txn.score >= 40 ? '#f59e0b' : '#10b981', minWidth: 24 }}>
                          {txn.score}
                        </span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${txn.status}`}>{txn.status}</span></td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                      {txn.timestamp ? new Date(txn.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>
    </div>
  );
}
