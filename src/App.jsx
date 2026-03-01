import { useState } from 'react'
import InputBox from './components/InputBox'
import CurrencySelector, { getCurrencyMeta } from './components/CurrencySelector'
import useCurrencyInfo from './hooks/useCurrencyInfo'

function App() {
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("gbp")
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [sparkle, setSparkle] = useState(false)

  const currencyInfo = useCurrencyInfo(from)
  const options = Object.keys(currencyInfo)

  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(null)
    setAmount(convertedAmount || '')
  }

  const convert = () => {
    setIsConverting(true)
    setTimeout(() => {
      setConvertedAmount((amount * currencyInfo[to]).toFixed(2))
      setIsConverting(false)
      setSparkle(true)
      setTimeout(() => setSparkle(false), 600)
    }, 600)
  }

  const rate = currencyInfo[to] ? currencyInfo[to].toFixed(4) : '—'
  const fromMeta = getCurrencyMeta(from)
  const toMeta = getCurrencyMeta(to)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #D4A843;
          --gold-light: #F0C866;
          --dark: #0D0D0D;
          --card: #141414;
          --card2: #1C1C1C;
          --border: rgba(212,168,67,0.25);
          --text: #F5F0E8;
          --muted: rgba(245,240,232,0.45);
        }

        body {
          font-family: 'Syne', sans-serif;
          background: var(--dark);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .bg-scene {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(212,168,67,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 85% 10%, rgba(212,168,67,0.05) 0%, transparent 55%),
            #0D0D0D;
        }

        .grid-lines {
          position: fixed; inset: 0; z-index: 0; opacity: 0.04;
          background-image:
            linear-gradient(rgba(212,168,67,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,168,67,0.8) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .wrapper {
          position: relative; z-index: 1;
          width: 100%; max-width: 440px;
          padding: 16px;
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .header {
          text-align: center;
          margin-bottom: 28px;
        }
        .header-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .header h1 {
          font-size: 36px;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .header h1 span { color: var(--gold); }

        .rate-ticker {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          margin-top: 10px;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .rate-ticker b { color: var(--gold-light); }
        .rate-flags { font-size: 14px; }

        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.5),
            0 24px 60px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .input-block {
          background: var(--card2);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 16px 18px;
          transition: border-color 0.2s;
        }
        .input-block:focus-within {
          border-color: rgba(212,168,67,0.4);
        }
        .input-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--muted);
          text-transform: uppercase;
          display: block;
          margin-bottom: 10px;
        }
        .input-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .amount-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: 'DM Mono', monospace;
          font-size: 28px;
          font-weight: 500;
          color: var(--text);
          width: 100%;
          min-width: 0;
        }
        .amount-input::placeholder { color: rgba(245,240,232,0.2); }
        .amount-input:disabled { color: var(--gold-light); }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 14px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .swap-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--gold);
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: var(--dark);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s;
          box-shadow: 0 4px 20px rgba(212,168,67,0.35);
          flex-shrink: 0;
        }
        .swap-btn:hover {
          transform: rotate(180deg) scale(1.1);
          background: var(--gold-light);
        }

        .result-area {
          text-align: center;
          padding: 20px 0 8px;
          min-height: 72px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px;
        }
        .result-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .result-value {
          font-family: 'DM Mono', monospace;
          font-size: 42px;
          font-weight: 500;
          color: var(--gold-light);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .result-currency {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .result-placeholder {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: rgba(245,240,232,0.2);
          letter-spacing: 0.1em;
        }

        @keyframes sparkleAnim {
          0%   { text-shadow: 0 0 0px var(--gold); }
          50%  { text-shadow: 0 0 30px var(--gold-light), 0 0 60px var(--gold); }
          100% { text-shadow: 0 0 0px var(--gold); }
        }
        .sparkle { animation: sparkleAnim 0.6s ease; }

        .convert-btn {
          width: 100%;
          margin-top: 20px;
          padding: 16px;
          background: var(--gold);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--dark);
          box-shadow: 0 6px 30px rgba(212,168,67,0.3);
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
          position: relative;
          overflow: hidden;
        }
        .convert-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%);
          transition: transform 0.4s;
        }
        .convert-btn:hover::after { transform: translateX(100%); }
        .convert-btn:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(212,168,67,0.45);
        }
        .convert-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(13,13,13,0.3);
          border-top-color: var(--dark);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-note {
          text-align: center;
          margin-top: 18px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(245,240,232,0.2);
          letter-spacing: 0.08em;
        }
      `}</style>

      <div className="bg-scene" />
      <div className="grid-lines" />

      <div className="wrapper">
        {/* Header */}
        <div className="header">
          <p className="header-eyebrow">✦ Live Exchange Rates</p>
          <h1>Currency<br /><span>Exchange</span></h1>
          <p className="rate-ticker">
            <span className="rate-flags">{fromMeta.flag}</span>
            <span>1 <b>{from.toUpperCase()}</b> = <b>{rate}</b> {to.toUpperCase()}</span>
            <span className="rate-flags">{toMeta.flag}</span>
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={(e) => { e.preventDefault(); convert() }}>

            {/* FROM */}
            <div className="input-block">
              <span className="input-label">You Send</span>
              <div className="input-row">
                <input
                  className="amount-input"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setConvertedAmount(null) }}
                  min="0"
                />
                <CurrencySelector
                  value={from}
                  onChange={(curr) => { setFrom(curr); setConvertedAmount(null) }}
                  options={options}
                />
              </div>
            </div>

            {/* SWAP */}
            <div className="divider">
              <div className="divider-line" />
              <button type="button" className="swap-btn" onClick={swap} title="Swap currencies">⇅</button>
              <div className="divider-line" />
            </div>

            {/* TO */}
            <div className="input-block">
              <span className="input-label">You Receive</span>
              <div className="input-row">
                <input
                  className="amount-input"
                  type="number"
                  placeholder="0.00"
                  value={convertedAmount !== null ? convertedAmount : ''}
                  disabled
                  readOnly
                />
                <CurrencySelector
                  value={to}
                  onChange={(curr) => { setTo(curr); setConvertedAmount(null) }}
                  options={options}
                />
              </div>
            </div>

            {/* RESULT */}
            <div className="result-area">
              {isConverting ? (
                <p className="result-placeholder">Converting…</p>
              ) : convertedAmount !== null ? (
                <>
                  <p className="result-label">Converted Amount</p>
                  <p className={`result-value ${sparkle ? 'sparkle' : ''}`}>{convertedAmount}</p>
                  <p className="result-currency">
                    <span>{toMeta.flag}</span>
                    <span>{toMeta.name}</span>
                  </p>
                </>
              ) : (
                <p className="result-placeholder">Enter an amount to convert</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="convert-btn"
              disabled={!amount || isConverting}
            >
              {isConverting
                ? <><span className="spinner" />Converting…</>
                : `Convert ${from.toUpperCase()} → ${to.toUpperCase()}`
              }
            </button>
          </form>
        </div>

        <p className="footer-note">Powered by @fawazahmed0/currency-api · Live rates</p>
      </div>
    </>
  )
}

export default App
