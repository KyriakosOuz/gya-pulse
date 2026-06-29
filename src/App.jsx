import { useMemo, useState } from 'react'
import { NAV } from './data/nav.js'
import { getContent } from './data/content.js'
import Widget from './components/Widget.jsx'

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      <rect x="2" y="2" width="36" height="36" rx="11" stroke="url(#g)" strokeWidth="1.6" opacity=".5" />
      <polyline points="7,21 13,21 16,12 20,28 24,9 27,21 33,21" fill="none" stroke="url(#g)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#2B8FEA" /><stop offset="1" stopColor="#22FF88" /></linearGradient></defs>
    </svg>
  )
}

const FIRST_TAB = Object.fromEntries(NAV.filter(n => n.tabs).map(n => [n.key, n.tabs[0].key]))

export default function App() {
  const [source, setSource] = useState('overview')
  const [tabs, setTabs] = useState(FIRST_TAB)

  const item = NAV.find(n => n.key === source)
  const tab = item?.tabs ? (tabs[source] || item.tabs[0].key) : null
  const content = useMemo(() => getContent(source, tab), [source, tab])

  function pick(key) {
    setSource(key)
    window.scrollTo({ top: 0 })
  }
  function pickTab(t) {
    setTabs(prev => ({ ...prev, [source]: t }))
    window.scrollTo({ top: 0 })
  }

  const eyebrow = item?.eyebrow || item?.title || ''
  const tabLabel = item?.tabs?.find(t => t.key === tab)?.label
  const title = source === 'overview' ? 'Overview' : (tabLabel || item?.label)

  return (
    <div className="app">
      {/* rail */}
      <nav className="rail">
        <div className="logo"><Logo /></div>
        <div className="rail-nav">
          {NAV.map((n, i) => n.key === 'sep'
            ? <div className="rail-sep" key={'sep' + i} />
            : <button key={n.key} className={`rail-btn ${source === n.key ? 'active' : ''}`} onClick={() => pick(n.key)} title={n.label}>
                <span className="ms">{n.icon}</span><small>{n.label}</small>
              </button>)}
        </div>
        <div className="spacer" />
        <div className="rail-nav">
          <button className="rail-btn" title="AI Report"><span className="ms" style={{ color: 'var(--green)' }}>auto_awesome</span><small>Report</small></button>
          <button className="rail-btn" title="Ask AI"><span className="ms">forum</span><small>Ask AI</small></button>
        </div>
      </nav>

      {/* secondary sidebar */}
      {item?.tabs && (
        <aside className="sub">
          <div className="sub-title">{item.title}</div>
          {item.tabs.map(t => (
            <button key={t.key} className={`sub-link ${tab === t.key ? 'active' : ''} ${t.star ? 'star' : ''}`} onClick={() => pickTab(t.key)}>
              <span className="ms">{t.icon}</span>{t.label}{t.star && <span className="sub-badge">NEW</span>}
            </button>
          ))}
        </aside>
      )}

      {/* main */}
      <main className="main">
        <div className="glow" /><div className="dots" />
        <div className="wrap">
          {/* topbar */}
          <div className="topbar">
            <div className="client">
              <div className="avatar">N</div>
              <div><b>Northwind Outdoors</b><small>Ecommerce client</small></div>
              <span className="ms">unfold_more</span>
            </div>
            <div className="spreader" />
            <button className="pill-btn"><span className="ms">calendar_today</span> Last 28 days <span className="ms" style={{ fontSize: 16 }}>expand_more</span></button>
            <button className="pill-btn"><span className="ms">filter_list</span> Filters</button>
            <button className="pill-btn"><span className="ms">download</span> Export</button>
            <button className="cta"><span className="ms">auto_awesome</span> Generate AI Report</button>
          </div>

          {/* page header */}
          <div className="ph">
            <div>
              <div className="eyebrow"><span className="dot" /> {eyebrow}</div>
              <h1>{title}</h1>
              {content.sub && <div className="psub">{content.sub}</div>}
            </div>
          </div>

          {content.pills && (
            <div style={{ marginBottom: 16 }}>
              <Widget spec={{ type: 'pills', items: content.pills.map(p => ({ icon: p[0], value: p[1], label: p[2], color: p[3] })) }} />
            </div>
          )}

          <div className="rowgrid">
            {content.blocks.map((b, i) => <Widget key={i} spec={b} />)}
          </div>

          <div className="foot-note">GYA Pulse · prototype with sample data · {NAV.filter(n => n.key !== 'sep').length} sections</div>
        </div>
      </main>
    </div>
  )
}
