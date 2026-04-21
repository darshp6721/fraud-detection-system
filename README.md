# 🛡️ FraudShield — End-to-End Fraud Detection System

> A production-grade, real-time fraud detection and transaction monitoring system built with Next.js and Node.js — GTU Project Based Learning

![FraudShield Dashboard](./screenshots/dashboard.png)

## 🌐 Live Demo
- **Frontend**: [Deployed on Vercel] *(URL after deployment)*
- **Backend API**: [Deployed on Render] *(URL after deployment)*

---

## 🎯 Features

| Feature | Description |
|---|---|
| 📊 Live Dashboard | Real-time fraud stats, charts, and live alert feed |
| 🔍 Transaction Analyzer | Enter any transaction → instant AI-powered risk score |
| 📋 Transaction History | Full table with filters, search, and CSV export |
| ⚙️ Admin Panel | Configure detection rules, view model performance |
| 🔄 Auto Refresh | Dashboard auto-updates every 15 seconds |

---

## 🧠 Fraud Detection Engine — 9 Real-World Rules

| Rule | Severity | Logic |
|---|---|---|
| High Amount Threshold | 🔴 HIGH | Flags transactions > ₹50,000 |
| Round Number Detection | 🔵 LOW | Flags exact ₹1000, ₹5000, etc. |
| Unusual Time Detection | 🔴 HIGH | Flags 2AM–5AM transactions |
| High-Risk Merchant | 🔴 HIGH | Crypto, casino, wire transfers |
| Geographic Risk | 🔴 HIGH | Nigeria, Romania, Russia, China |
| Transaction Velocity | 🟡 MEDIUM | >5 transactions/day on same card |
| CNP High Value | 🟡 MEDIUM | Online transaction > ₹15,000 |
| New Merchant Flag | 🔵 LOW | First-ever transaction with merchant |
| Cross-Border Online | 🟡 MEDIUM | International + online combination |

**Composite risk scoring:** Each rule adds weighted points → Total 0–100 score  
- **0–19**: ✅ Safe  
- **20–39**: ⚠️ Suspicious (Low)  
- **40–69**: ⚠️ Suspicious (High)  
- **70–100**: 🚨 FRAUD

---

## 🏗️ Architecture

```
User Browser
    │
    ▼
[Frontend — Next.js 15 on Vercel]
    │  REST API calls
    ▼
[Backend — Node.js + Express on Render]
    │
    ▼
[Fraud Detection Engine — fraudEngine.js]
    │
    ▼
[In-memory Transaction Store]
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Fraud Engine | Custom rule-based JavaScript engine |
| Frontend Hosting | Vercel (free) |
| Backend Hosting | Render (free) |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/darshp6721/fraud-detection-system.git
cd fraud-detection-system
```

### 2. Start Backend
```bash
cd backend
npm install
node server.js
# API running at http://localhost:5000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health check |
| POST | `/api/analyze` | Analyze a transaction for fraud |
| GET | `/api/transactions` | Get all transactions (filter by status) |
| GET | `/api/stats` | Get dashboard statistics |

### Example: Analyze Transaction
```json
POST /api/analyze
{
  "cardHolderName": "Rahul Sharma",
  "cardNumber": "4532****1234",
  "amount": 75000,
  "merchantName": "CryptoExchange",
  "merchantCategory": "cryptocurrency",
  "country": "NG",
  "transactionType": "online",
  "isNewMerchant": true
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "score": 95,
    "status": "fraud",
    "riskLevel": "CRITICAL",
    "flags": [
      { "rule": "HIGH_AMOUNT", "severity": "HIGH", "detail": "..." },
      { "rule": "HIGH_RISK_MERCHANT", "severity": "HIGH", "detail": "..." },
      { "rule": "RISKY_LOCATION", "severity": "HIGH", "detail": "..." }
    ]
  }
}
```

---

## 📸 Screenshots

| Dashboard | Analyzer | History | Admin |
|---|---|---|---|
| Real-time stats | Risk scoring | Full transaction log | Rule configuration |

---

## 👨‍💻 Author
**Darsh Patel** — GTU Project Based Learning  
GitHub: [@darshp6721](https://github.com/darshp6721)

---

## 📄 License
MIT License
