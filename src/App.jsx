import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { buildNav } from './data/nav.js'
import { getContent } from './data/content.js'
import { TYPE_LABEL } from './data/clients.js'
import { clientStore } from './lib/clientStore.js'
import { setConnected } from './lib/connections.js'
import Widget, { Skeleton } from './components/Widget.jsx'

const PROVIDER_LABEL = { google: 'Google', meta: 'Meta', shopify: 'Shopify', woocommerce: 'WooCommerce', merchant: 'Google Merchant Center' }
import { FilterContext, DEFAULT_FILTERS, RANGES, CHANNELS, filterSig, transformContent } from './lib/filters.js'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      <rect x="2" y="2" width="36" height="36" rx="11" stroke="url(#g)" strokeWidth="1.6" opacity=".5" />
      <polyline points="7,21 13,21 16,12 20,28 24,9 27,21 33,21" fill="none" stroke="url(#g)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#2B8FEA" /><stop offset="1" stopColor="#22FF88" /></linearGradient></defs>
    </svg>
  )
}

function firstTabs(nav) {
  return Object.fromEntries(nav.filter(n => n.tabs).map(n => [n.key, n.tabs[0].key]))
}

function aiResponse(ai, client, page) {
  if (ai.kind === 'campaign') {
    return `Here's my read on "${ai.name}":\n\n• It's pacing ahead of budget — spend is tracking above plan for the period, so expect it to exhaust early.\n• Efficiency is healthy: CTR and ROAS are both above target, so the over-pacing is buying profitable volume, not waste.\n• Watch frequency on the top ad set — returns usually soften past ~3.0.\n\nRecommendation: raise the budget cap 15–20% while ROAS holds above target, and refresh the lowest-CTR creative before fatigue sets in.`
  }
  const ecom = client.type === 'ecommerce'
  if (ecom) {
    return `Performance summary for ${client.name} — ${page}:\n\n• Revenue is up 14% on 8% more spend, so blended ROAS held at 4.76x — you're scaling efficiently.\n• AOV ($43.51) and footwear momentum (+18%) are the growth drivers.\n• The drag is conversion rate (down 2.7%), concentrated on mobile checkout.\n\nTop 3 actions:\n1. Ship a one-page mobile checkout — biggest single lever.\n2. Shift budget toward footwear / retargeting where ROAS is highest.\n3. Build a cart-abandonment flow; 62% of viewers never add to cart.`
  }
  return `Performance summary for ${client.name} — ${page}:\n\n• Lead volume is up 12% while CPL fell 6% to $30 — more leads, cheaper.\n• Quality held at 65% qualified; Paid Search brings the best-qualified leads.\n• Paid Social is cheapest per lead but converts lower downstream.\n\nTop 3 actions:\n1. Reallocate budget toward Paid Search for qualified volume.\n2. Tighten Paid Social targeting to lift lead quality.\n3. Add CRM data so we can optimise to closed revenue, not just leads.`
}

function AIDrawer({ ai, client, page, onClose }) {
  const [shown, setShown] = useState('')
  const full = useMemo(() => ai ? aiResponse(ai, client, page) : '', [ai, client, page])
  useEffect(() => {
    if (!ai) return
    setShown('')
    if (reduceMotion()) { setShown(full); return }
    let i = 0
    const id = setInterval(() => { i += 3; setShown(full.slice(0, i)); if (i >= full.length) clearInterval(id) }, 12)
    return () => clearInterval(id)
  }, [ai, full])
  if (!ai) return null
  const title = ai.kind === 'report' ? 'AI Report' : 'Ask Claude'
  const subtitle = ai.kind === 'campaign' ? ai.name : `${client.name} · ${page}`
  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="ai-drawer">
        <div className="aid-head">
          <div className="aid-title"><span className="ms" style={{ color: 'var(--green)' }}>auto_awesome</span><div><b>{title}</b><small>{subtitle}</small></div></div>
          <button className="aid-close" onClick={onClose}><span className="ms">close</span></button>
        </div>
        <div className="aid-body">
          <div className="aid-msg"><div className="aid-avatar">C</div><div className="aid-bubble">{shown}{shown.length < full.length && <span className="aid-caret" />}</div></div>
        </div>
        <div className="aid-input"><input placeholder="Ask a follow-up…" /><button title="Send"><span className="ms">send</span></button></div>
      </aside>
    </>
  )
}

export default function App() {
  const clients = useSyncExternalStore(clientStore.subscribe, clientStore.get)
  const [client, setClient] = useState(() => clientStore.get()[0])
  const [source, setSource] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)      // client switcher
  const [openCtl, setOpenCtl] = useState(null)         // 'date' | 'filters' | null
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(false)
  const [ai, setAi] = useState(null)   // AI drawer: null | { kind, name }
  const [toast, setToast] = useState(null)

  // handle the OAuth round-trip return (?connected=google&ok=1 / &demo=1 / &error=…)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const provider = sp.get('connected')
    if (!provider) return
    const label = PROVIDER_LABEL[provider] || provider
    const err = sp.get('error')
    const cid = sp.get('client') || clientStore.get()[0].id
    if (err) setToast({ ok: false, text: `Couldn't connect ${label} — ${err}` })
    else { setConnected(cid, provider, true); setToast({ ok: true, text: `${label} connected${sp.get('demo') ? ' (demo)' : ''}` }) }
    window.history.replaceState({}, '', window.location.pathname)
    const t = setTimeout(() => setToast(null), 4500)
    return () => clearTimeout(t)
  }, [])

  const nav = useMemo(() => buildNav(client.type), [client.type])
  const [tabs, setTabs] = useState(() => firstTabs(buildNav(clientStore.get()[0].type)))

  const item = nav.find(n => n.key === source) || nav[0]
  const tab = item?.tabs ? (tabs[item.key] || item.tabs[0].key) : null
  const baseContent = useMemo(() => getContent(item.key, tab, client.type), [item.key, tab, client.type])
  const content = useMemo(() => transformContent(baseContent, filters), [baseContent, filters])

  const pageKey = item.key === 'overview' ? `overview-${client.type}` : `${item.key}/${tab}`
  const sig = filterSig(filters)
  // Compare only makes sense where there are trend lines or KPI scorecards
  const canCompare = useMemo(() => (baseContent.blocks || []).some(b => b.type === 'kpis' || (b.type === 'chart' && b.kind === 'line')), [baseContent])

  // loading gate — flash skeletons, then mount charts fresh so they replay draw-on
  useEffect(() => {
    if (reduceMotion()) { setLoading(false); return }
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 420)
    return () => clearTimeout(t)
  }, [pageKey, sig])

  function pick(key) { setSource(key); window.scrollTo({ top: 0 }) }
  function pickTab(t) { setTabs(prev => ({ ...prev, [item.key]: t })); window.scrollTo({ top: 0 }) }
  function switchClient(c) {
    setClient(c); setSource('overview'); setTabs(firstTabs(buildNav(c.type)))
    setMenuOpen(false); setFilters(DEFAULT_FILTERS); window.scrollTo({ top: 0 })
  }

  // filter actions exposed via context
  const fil = {
    filters,
    setRange: r => { setFilters(f => ({ ...f, range: r })); setOpenCtl(null) },
    toggleChannel: c => setFilters(f => ({ ...f, channels: f.channels.includes(c) ? f.channels.filter(x => x !== c) : [...f.channels, c] })),
    setChannelsOnly: c => setFilters(f => ({ ...f, channels: f.channels.length === 1 && f.channels[0] === c ? [] : [c] })),
    removeChannel: c => setFilters(f => ({ ...f, channels: f.channels.filter(x => x !== c) })),
    toggleCompare: () => setFilters(f => ({ ...f, compare: !f.compare })),
    clear: () => setFilters(DEFAULT_FILTERS),
    openAI: ctx => setAi(ctx || { kind: 'report' }),
    createClient: c => { clientStore.add(c); switchClient(c) },
    clientId: client.id,
  }
  const active = filters.range !== '28d' || filters.channels.length > 0 || filters.compare

  const eyebrow = item?.eyebrow || item?.title || ''
  const tabLabel = item?.tabs?.find(t => t.key === tab)?.label
  const title = item.key === 'overview' ? 'Overview' : (tabLabel || item?.label)

  return (
    <FilterContext.Provider value={fil}>
    <div className="app">
      <nav className="rail">
        <div className="logo"><Logo /></div>
        <div className="rail-nav">
          {nav.map((n, i) => n.key === 'sep'
            ? <div className="rail-sep" key={'sep' + i} />
            : <button key={n.key} className={`rail-btn ${source === n.key ? 'active' : ''}`} onClick={() => pick(n.key)} title={n.label}>
                <span className="ms">{n.icon}</span><small>{n.label}</small>
              </button>)}
        </div>
        <div className="spacer" />
        <div className="rail-nav">
          <button className="rail-btn" title="AI Report" onClick={() => setAi({ kind: 'report' })}><span className="ms" style={{ color: 'var(--green)' }}>auto_awesome</span><small>Report</small></button>
          <button className="rail-btn" title="Ask AI" onClick={() => setAi({ kind: 'ask' })}><span className="ms">forum</span><small>Ask AI</small></button>
        </div>
      </nav>

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

      <main className="main">
        <div className="glow" /><div className="dots" />
        <div className="wrap">
          <div className="topbar">
            <div className="client-wrap">
              <div className="client" onClick={() => setMenuOpen(o => !o)}>
                <div className="avatar">{client.initial}</div>
                <div><b>{client.name}</b><small>{client.sub}</small></div>
                <span className={`type-badge ${client.type}`}>{TYPE_LABEL[client.type]}</span>
                <span className="ms">unfold_more</span>
              </div>
              {menuOpen && (
                <div className="client-menu">
                  <div className="cm-label">Switch client</div>
                  {clients.map(c => (
                    <button key={c.id} className={`cm-item ${c.id === client.id ? 'on' : ''}`} onClick={() => switchClient(c)}>
                      <div className="avatar sm">{c.initial}</div>
                      <div className="cm-text"><b>{c.name}</b><small>{c.sub}</small></div>
                      <span className={`type-badge ${c.type}`}>{TYPE_LABEL[c.type]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="spreader" />

            {/* date range */}
            <div className="ctl-wrap">
              <button className={`pill-btn ${openCtl === 'date' ? 'on' : ''}`} onClick={() => setOpenCtl(o => o === 'date' ? null : 'date')}>
                <span className="ms">calendar_today</span> {RANGES[filters.range].label} <span className="ms" style={{ fontSize: 16 }}>expand_more</span>
              </button>
              {openCtl === 'date' && (
                <div className="ctl-menu">
                  {Object.entries(RANGES).map(([k, r]) => (
                    <button key={k} className={`ctl-item ${filters.range === k ? 'on' : ''}`} onClick={() => fil.setRange(k)}>
                      <span className="ms" style={{ fontSize: 17 }}>{filters.range === k ? 'radio_button_checked' : 'radio_button_unchecked'}</span>{r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* channel filter */}
            <div className="ctl-wrap">
              <button className={`pill-btn ${openCtl === 'filters' || filters.channels.length ? 'on' : ''}`} onClick={() => setOpenCtl(o => o === 'filters' ? null : 'filters')}>
                <span className="ms">filter_list</span> Channels{filters.channels.length ? <span className="ctl-count">{filters.channels.length}</span> : ''} <span className="ms" style={{ fontSize: 16 }}>expand_more</span>
              </button>
              {openCtl === 'filters' && (
                <div className="ctl-menu wide">
                  <div className="cm-label">Filter by channel</div>
                  {CHANNELS.map(c => (
                    <button key={c} className={`ctl-item ${filters.channels.includes(c) ? 'on' : ''}`} onClick={() => fil.toggleChannel(c)}>
                      <span className="ms" style={{ fontSize: 17 }}>{filters.channels.includes(c) ? 'check_box' : 'check_box_outline_blank'}</span>{c}
                    </button>
                  ))}
                  {filters.channels.length > 0 && <button className="ctl-clear" onClick={() => setFilters(f => ({ ...f, channels: [] }))}>Clear channels</button>}
                </div>
              )}
            </div>

            {/* compare toggle — only where it has something to compare */}
            {canCompare && (
              <button className={`pill-btn ${filters.compare ? 'on' : ''}`} onClick={fil.toggleCompare} title="Compare to previous period">
                <span className="ms">compare_arrows</span> Compare
              </button>
            )}

            <button className="cta" onClick={() => setAi({ kind: 'report' })}><span className="ms">auto_awesome</span> Generate AI Report</button>
          </div>

          <div className="ph">
            <div>
              <div className="eyebrow"><span className="dot" /> {eyebrow}</div>
              <h1>{title}</h1>
              {content.sub && <div className="psub">{content.sub}</div>}
            </div>
          </div>

          {/* active filter chips */}
          {active && (
            <div className="chips">
              {filters.range !== '28d' && <span className="chip" onClick={() => fil.setRange('28d')}><span className="ms">calendar_today</span>{RANGES[filters.range].label}<span className="ms x">close</span></span>}
              {filters.channels.map(c => <span className="chip" key={c} onClick={() => fil.removeChannel(c)}><span className="ms">filter_list</span>{c}<span className="ms x">close</span></span>)}
              {filters.compare && <span className="chip" onClick={fil.toggleCompare}><span className="ms">compare_arrows</span>vs previous period<span className="ms x">close</span></span>}
              <button className="chip-clear" onClick={fil.clear}>Clear all</button>
            </div>
          )}

          {content.pills && (
            <div style={{ marginBottom: 16 }}>
              <Widget spec={{ type: 'pills', items: content.pills.map(p => ({ icon: p[0], value: p[1], label: p[2], color: p[3] })) }} />
            </div>
          )}

          <div className="rowgrid" key={pageKey + '|' + sig + (loading ? '|l' : '')}>
            {content.blocks.map((b, i) => loading ? <Skeleton key={i} spec={b} /> : <Widget key={i} spec={b} idx={i} />)}
          </div>

          <div className="foot-note">GYA Pulse · prototype with sample data · {nav.filter(n => n.key !== 'sep').length} sections · {TYPE_LABEL[client.type]} view</div>
        </div>
      </main>
      <AIDrawer ai={ai} client={client} page={title} onClose={() => setAi(null)} />
      {toast && <div className={`toast ${toast.ok ? 'ok' : 'err'}`}><span className="ms">{toast.ok ? 'check_circle' : 'error'}</span>{toast.text}</div>}
    </div>
    </FilterContext.Provider>
  )
}
