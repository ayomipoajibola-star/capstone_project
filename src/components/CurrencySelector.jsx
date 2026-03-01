import { useState, useRef, useEffect } from 'react'

// Map of currency codes to country flag emojis and full names
const CURRENCY_META = {
  usd: { flag: '🇺🇸', name: 'US Dollar' },
  eur: { flag: '🇪🇺', name: 'Euro' },
  gbp: { flag: '🇬🇧', name: 'British Pound' },
  jpy: { flag: '🇯🇵', name: 'Japanese Yen' },
  cad: { flag: '🇨🇦', name: 'Canadian Dollar' },
  aud: { flag: '🇦🇺', name: 'Australian Dollar' },
  chf: { flag: '🇨🇭', name: 'Swiss Franc' },
  cny: { flag: '🇨🇳', name: 'Chinese Yuan' },
  inr: { flag: '🇮🇳', name: 'Indian Rupee' },
  ngn: { flag: '🇳🇬', name: 'Nigerian Naira' },
  zar: { flag: '🇿🇦', name: 'South African Rand' },
  brl: { flag: '🇧🇷', name: 'Brazilian Real' },
  mxn: { flag: '🇲🇽', name: 'Mexican Peso' },
  krw: { flag: '🇰🇷', name: 'South Korean Won' },
  sgd: { flag: '🇸🇬', name: 'Singapore Dollar' },
  hkd: { flag: '🇭🇰', name: 'Hong Kong Dollar' },
  nok: { flag: '🇳🇴', name: 'Norwegian Krone' },
  sek: { flag: '🇸🇪', name: 'Swedish Krona' },
  dkk: { flag: '🇩🇰', name: 'Danish Krone' },
  nzd: { flag: '🇳🇿', name: 'New Zealand Dollar' },
  aed: { flag: '🇦🇪', name: 'UAE Dirham' },
  sar: { flag: '🇸🇦', name: 'Saudi Riyal' },
  qar: { flag: '🇶🇦', name: 'Qatari Riyal' },
  kwd: { flag: '🇰🇼', name: 'Kuwaiti Dinar' },
  bhd: { flag: '🇧🇭', name: 'Bahraini Dinar' },
  omr: { flag: '🇴🇲', name: 'Omani Rial' },
  egp: { flag: '🇪🇬', name: 'Egyptian Pound' },
  kes: { flag: '🇰🇪', name: 'Kenyan Shilling' },
  ghs: { flag: '🇬🇭', name: 'Ghanaian Cedi' },
  tzs: { flag: '🇹🇿', name: 'Tanzanian Shilling' },
  ugx: { flag: '🇺🇬', name: 'Ugandan Shilling' },
  etb: { flag: '🇪🇹', name: 'Ethiopian Birr' },
  xof: { flag: '🌍', name: 'West African CFA' },
  xaf: { flag: '🌍', name: 'Central African CFA' },
  mad: { flag: '🇲🇦', name: 'Moroccan Dirham' },
  dzd: { flag: '🇩🇿', name: 'Algerian Dinar' },
  tnd: { flag: '🇹🇳', name: 'Tunisian Dinar' },
  pkr: { flag: '🇵🇰', name: 'Pakistani Rupee' },
  bdt: { flag: '🇧🇩', name: 'Bangladeshi Taka' },
  lkr: { flag: '🇱🇰', name: 'Sri Lankan Rupee' },
  npr: { flag: '🇳🇵', name: 'Nepalese Rupee' },
  thb: { flag: '🇹🇭', name: 'Thai Baht' },
  idr: { flag: '🇮🇩', name: 'Indonesian Rupiah' },
  myr: { flag: '🇲🇾', name: 'Malaysian Ringgit' },
  php: { flag: '🇵🇭', name: 'Philippine Peso' },
  vnd: { flag: '🇻🇳', name: 'Vietnamese Dong' },
  twd: { flag: '🇹🇼', name: 'Taiwan Dollar' },
  try: { flag: '🇹🇷', name: 'Turkish Lira' },
  rub: { flag: '🇷🇺', name: 'Russian Ruble' },
  pln: { flag: '🇵🇱', name: 'Polish Zloty' },
  czk: { flag: '🇨🇿', name: 'Czech Koruna' },
  huf: { flag: '🇭🇺', name: 'Hungarian Forint' },
  ron: { flag: '🇷🇴', name: 'Romanian Leu' },
  bgn: { flag: '🇧🇬', name: 'Bulgarian Lev' },
  hrk: { flag: '🇭🇷', name: 'Croatian Kuna' },
  isk: { flag: '🇮🇸', name: 'Icelandic Krona' },
  ars: { flag: '🇦🇷', name: 'Argentine Peso' },
  clp: { flag: '🇨🇱', name: 'Chilean Peso' },
  cop: { flag: '🇨🇴', name: 'Colombian Peso' },
  pen: { flag: '🇵🇪', name: 'Peruvian Sol' },
  uyu: { flag: '🇺🇾', name: 'Uruguayan Peso' },
  pyg: { flag: '🇵🇾', name: 'Paraguayan Guarani' },
  bob: { flag: '🇧🇴', name: 'Bolivian Boliviano' },
  uah: { flag: '🇺🇦', name: 'Ukrainian Hryvnia' },
  ils: { flag: '🇮🇱', name: 'Israeli Shekel' },
  jod: { flag: '🇯🇴', name: 'Jordanian Dinar' },
  lbp: { flag: '🇱🇧', name: 'Lebanese Pound' },
  iqd: { flag: '🇮🇶', name: 'Iraqi Dinar' },
  irr: { flag: '🇮🇷', name: 'Iranian Rial' },
  afn: { flag: '🇦🇫', name: 'Afghan Afghani' },
  mmk: { flag: '🇲🇲', name: 'Myanmar Kyat' },
  khr: { flag: '🇰🇭', name: 'Cambodian Riel' },
  mop: { flag: '🇲🇴', name: 'Macanese Pataca' },
  bnd: { flag: '🇧🇳', name: 'Brunei Dollar' },
  fjd: { flag: '🇫🇯', name: 'Fijian Dollar' },
  pgk: { flag: '🇵🇬', name: 'Papua New Guinean Kina' },
  xpf: { flag: '🇵🇫', name: 'CFP Franc' },
  mzn: { flag: '🇲🇿', name: 'Mozambican Metical' },
  zmw: { flag: '🇿🇲', name: 'Zambian Kwacha' },
  bwp: { flag: '🇧🇼', name: 'Botswanan Pula' },
  mur: { flag: '🇲🇺', name: 'Mauritian Rupee' },
  scr: { flag: '🇸🇨', name: 'Seychellois Rupee' },
  mvr: { flag: '🇲🇻', name: 'Maldivian Rufiyaa' },
  btc: { flag: '₿', name: 'Bitcoin' },
  eth: { flag: '⟠', name: 'Ethereum' },
}

export function getCurrencyMeta(code) {
  return CURRENCY_META[code?.toLowerCase()] || { flag: '🌐', name: code?.toUpperCase() }
}

function CurrencySelector({ value, onChange, options, disabled }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  const meta = getCurrencyMeta(value)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const filtered = options.filter((curr) => {
    const m = getCurrencyMeta(curr)
    const q = search.toLowerCase()
    return (
      curr.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q)
    )
  })

  const handleSelect = (curr) => {
    onChange(curr)
    setOpen(false)
    setSearch('')
  }

  return (
    <>
      <style>{`
        .cs-wrapper { position: relative; flex-shrink: 0; }

        .cs-trigger {
          display: flex; align-items: center; gap: 6px;
          background: rgba(212,168,67,0.1);
          border: 1px solid rgba(212,168,67,0.2);
          border-radius: 10px;
          padding: 7px 10px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          user-select: none;
          min-width: 90px;
        }
        .cs-trigger:hover {
          background: rgba(212,168,67,0.18);
          border-color: rgba(212,168,67,0.4);
        }
        .cs-trigger.open {
          background: rgba(212,168,67,0.2);
          border-color: rgba(212,168,67,0.5);
        }
        .cs-flag { font-size: 18px; line-height: 1; }
        .cs-code {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #F0C866;
          letter-spacing: 0.06em;
          flex: 1;
        }
        .cs-arrow {
          font-size: 9px;
          color: rgba(212,168,67,0.7);
          transition: transform 0.2s;
        }
        .cs-arrow.open { transform: rotate(180deg); }

        /* Dropdown */
        .cs-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px;
          background: #1A1A1A;
          border: 1px solid rgba(212,168,67,0.25);
          border-radius: 14px;
          overflow: hidden;
          z-index: 999;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
          animation: dropIn 0.18s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cs-search-wrap {
          padding: 10px 10px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cs-search {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,168,67,0.2);
          border-radius: 8px;
          padding: 7px 10px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #F5F0E8;
          outline: none;
          transition: border-color 0.2s;
        }
        .cs-search::placeholder { color: rgba(245,240,232,0.3); }
        .cs-search:focus { border-color: rgba(212,168,67,0.5); }

        .cs-list {
          max-height: 220px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(212,168,67,0.3) transparent;
        }
        .cs-list::-webkit-scrollbar { width: 4px; }
        .cs-list::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.3); border-radius: 4px; }

        .cs-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .cs-item:hover { background: rgba(212,168,67,0.1); }
        .cs-item.selected { background: rgba(212,168,67,0.15); }
        .cs-item-flag { font-size: 16px; flex-shrink: 0; }
        .cs-item-info { flex: 1; min-width: 0; }
        .cs-item-code {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #F0C866;
          letter-spacing: 0.06em;
        }
        .cs-item-name {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(245,240,232,0.45);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cs-check {
          font-size: 12px;
          color: #D4A843;
          flex-shrink: 0;
        }

        .cs-empty {
          padding: 16px;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(245,240,232,0.3);
        }
      `}</style>

      <div className="cs-wrapper" ref={ref}>
        {/* Trigger button */}
        <div
          className={`cs-trigger ${open ? 'open' : ''}`}
          onClick={() => !disabled && setOpen((o) => !o)}
        >
          <span className="cs-flag">{meta.flag}</span>
          <span className="cs-code">{value?.toUpperCase()}</span>
          <span className={`cs-arrow ${open ? 'open' : ''}`}>▾</span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="cs-dropdown">
            <div className="cs-search-wrap">
              <input
                ref={inputRef}
                className="cs-search"
                type="text"
                placeholder="Search currency or country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="cs-list">
              {filtered.length === 0 ? (
                <div className="cs-empty">No currencies found</div>
              ) : (
                filtered.map((curr) => {
                  const m = getCurrencyMeta(curr)
                  return (
                    <div
                      key={curr}
                      className={`cs-item ${curr === value ? 'selected' : ''}`}
                      onClick={() => handleSelect(curr)}
                    >
                      <span className="cs-item-flag">{m.flag}</span>
                      <div className="cs-item-info">
                        <div className="cs-item-code">{curr.toUpperCase()}</div>
                        <div className="cs-item-name">{m.name}</div>
                      </div>
                      {curr === value && <span className="cs-check">✓</span>}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CurrencySelector
