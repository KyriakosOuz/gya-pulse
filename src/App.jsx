import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { buildNav } from './data/nav.js'
import { getContent } from './data/content.js'
import { TYPE_LABEL } from './data/clients.js'
import { clientStore } from './lib/clientStore.js'
import { setConnected } from './lib/connections.js'
import Widget, { Skeleton } from './components/Widget.jsx'
import ChartShowcase from './pages/ChartShowcase.jsx'

const PROVIDER_LABEL = { google: 'Google', meta: 'Meta', shopify: 'Shopify', woocommerce: 'WooCommerce', merchant: 'Google Merchant Center' }
import { FilterContext, DEFAULT_FILTERS, RANGES, rangeInfo, filterSig, transformContent, TODAY_ISO, daysAgoISO } from './lib/filters.js'

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

// Static map: active source key → blurb + 2-3 key metrics for that section.
// Used by aiResponse to produce tab-aware mock narratives.
const SOURCE_CONTEXT = {
  overview:  { blurb: 'blended performance across all channels',          metrics: 'blended ROAS, total spend, and cross-channel CVR' },
  ga4:       { blurb: 'Google Analytics 4 site behaviour',                metrics: 'Sessions, Engagement Rate, and Goal Completions' },
  ads:       { blurb: 'Google Ads paid search',                           metrics: 'Impressions, CTR, CPC, and Conversion Value' },
  search:    { blurb: 'Search Console organic visibility',                 metrics: 'Total Clicks, Average Position, and organic CTR' },
  meta:      { blurb: 'Meta Ads (Facebook & Instagram)',                   metrics: 'Reach, CPM, Link Clicks, and purchase ROAS' },
  social:    { blurb: 'Meta organic social (IG & FB)',                     metrics: 'Reach, Engagement Rate, and Follower Growth' },
  youtube:   { blurb: 'YouTube channel analytics',                         metrics: 'Views, Watch Time, Avg View Duration, and Subscriber Growth' },
  linkedin:  { blurb: 'LinkedIn campaign performance',                     metrics: 'Impressions, CTR, and Cost Per Lead' },
  awareness: { blurb: 'brand reach and top-of-funnel',                    metrics: 'Total Reach, Frequency, Video Completion Rate, and Share of Voice' },
  leads:     { blurb: 'lead generation pipeline',                          metrics: 'Lead Volume, Cost Per Lead, and Lead Quality Rate' },
  webinar:   { blurb: 'webinar registrations and attendance',              metrics: 'Registrations, Attendance Rate, and Cost Per Attendee' },
  products:  { blurb: 'product catalogue and ecommerce performance',       metrics: 'Revenue by Product, Units Sold, and Add-to-Cart Rate' },
  customers: { blurb: 'customer retention and lifetime value',             metrics: 'LTV, CAC, Retention Rate, and Cohort Revenue' },
  funnels:   { blurb: 'conversion funnels and user journeys',              metrics: 'Drop-off Rate, Step Conversion, and Time-to-Convert' },
}
const DEFAULT_SOURCE_CTX = { blurb: 'this section', metrics: 'key performance indicators, trends, and conversion metrics' }

function aiResponse(ai, client, page, source) {
  if (ai.kind === 'campaign') {
    return `Here's my read on "${ai.name}":\n\n• It's pacing ahead of budget — spend is tracking above plan for the period, so expect it to exhaust early.\n• Efficiency is healthy: CTR and ROAS are both above target, so the over-pacing is buying profitable volume, not waste.\n• Watch frequency on the top ad set — returns usually soften past ~3.0.\n\nRecommendation: raise the budget cap 15–20% while ROAS holds above target, and refresh the lowest-CTR creative before fatigue sets in.`
  }
  const ctx = SOURCE_CONTEXT[source] || DEFAULT_SOURCE_CTX
  const ecom = client.type === 'ecommerce'
  const leadgen = client.type === 'leadgen'
  if (ecom) {
    return `Performance summary for ${client.name} — ${ctx.blurb}:\n\n• Revenue is up 14% on 8% more spend; blended ROAS held at 4.76× — you're scaling efficiently. Key signals here: ${ctx.metrics}.\n• AOV ($43.51) and footwear momentum (+18%) are the growth drivers.\n• The drag is conversion rate (down 2.7%), concentrated on mobile checkout.\n\nTop 3 actions:\n1. Ship a one-page mobile checkout — biggest single lever.\n2. Shift budget toward footwear / retargeting where ROAS is highest.\n3. Build a cart-abandonment flow; 62% of viewers never add to cart.`
  }
  if (leadgen) {
    return `Performance summary for ${client.name} — ${ctx.blurb}:\n\n• Lead volume is up 12% while CPL fell 6% to $30. Watching ${ctx.metrics} here confirms the efficiency gain is real.\n• Quality held at 65% qualified; Paid Search brings the best-qualified leads.\n• Paid Social is cheapest per lead but converts lower downstream.\n\nTop 3 actions:\n1. Reallocate budget toward Paid Search for qualified volume.\n2. Tighten Paid Social targeting to lift lead quality.\n3. Add CRM data so we can optimise to closed revenue, not just leads.`
  }
  // awareness default
  return `Performance summary for ${client.name} — ${ctx.blurb}:\n\n• Brand reach is expanding: ${ctx.metrics} are all trending positively over the period.\n• Frequency is within the 2–4× sweet spot, and Video Completion Rate (68%) is above the 55% industry benchmark.\n• Organic and paid reach are complementing each other with no significant audience overlap eating into efficiency.\n\nTop 3 actions:\n1. Double down on the top-performing creative format — video completions are driving the highest brand recall.\n2. Expand geo targeting to the two secondary markets showing organic traction.\n3. Set up a brand lift study to tie reach metrics to downstream search intent.`
}

function AIDrawer({ ai, client, page, source, onClose }) {
  const [shown, setShown] = useState('')
  const full = useMemo(() => ai ? aiResponse(ai, client, page, source) : '', [ai, client, page, source])
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
  const clientLogo = clients.find(c => c.id === client.id)?.logo || null
  const [source, setSource] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)      // client switcher
  const [openCtl, setOpenCtl] = useState(null)         // 'date' | null
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [cStart, setCStart] = useState(daysAgoISO(27))  // custom range draft — last 28 days ending today
  const [cEnd, setCEnd] = useState(TODAY_ISO)
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
    setCustom: (start, end) => { setFilters(f => ({ ...f, range: 'custom', customStart: start, customEnd: end })); setOpenCtl(null) },
    clear: () => setFilters(DEFAULT_FILTERS),
    openAI: ctx => setAi(ctx || { kind: 'report' }),
    createClient: c => { clientStore.add(c); switchClient(c) },
    clientId: client.id,
  }
  const active = filters.range !== '28d'

  const eyebrow = item?.eyebrow || item?.title || ''
  const tabLabel = item?.tabs?.find(t => t.key === tab)?.label
  const title = item.key === 'overview' ? 'Overview' : (tabLabel || item?.label)

  return (
    <FilterContext.Provider value={fil}>
    <div className="app">
      <nav className="rail">
        <div className="logo"><Logo /><small style={{ display: 'block', marginTop: 6, fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '.08em', fontSize: 13, color: '#fff' }}>MARΣ</small></div>
        <div className="rail-nav">
          {nav.map((n, i) => n.key === 'sep'
            ? <div className="rail-sep" key={'sep' + i} />
            : <button key={n.key} className={`rail-btn ${source === n.key ? 'active' : ''}`} onClick={() => pick(n.key)} title={n.label}>
                <span className="ms">{n.icon}</span><small>{n.label}</small>
              </button>)}
        </div>
        <div className="spacer" />
        <div className="rail-nav">
          <button className={`rail-btn ${source === '__showcase' ? 'active' : ''}`} title="Chart Library Showcase" onClick={() => pick('__showcase')}><span className="ms">palette</span><small>Charts</small></button>
          <button className="rail-btn" title="AI Report" onClick={() => setAi({ kind: 'report' })}><span className="ms" style={{ color: 'var(--green)' }}>auto_awesome</span><small>Report</small></button>
          <button className="rail-btn" title="Ask AI" onClick={() => setAi({ kind: 'ask' })}><span className="ms">forum</span><small>Ask AI</small></button>
        </div>
      </nav>

      {source !== '__showcase' && item?.tabs && item.tabs.length > 1 && (
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
        {source === '__showcase' ? <ChartShowcase /> : (
        <div className="wrap">
          <div className="topbar">
            <div className="client-wrap">
              <div className="client" onClick={() => setMenuOpen(o => !o)}>
                <div className={`avatar${clientLogo ? ' has-logo' : ''}`}>{clientLogo ? <img src={clientLogo} alt="" /> : client.initial}</div>
                <div><b>{client.name}</b><small>{client.sub}</small></div>
                <span className={`type-badge ${client.type}`}>{TYPE_LABEL[client.type]}</span>
                <span className="ms">unfold_more</span>
              </div>
              {menuOpen && (
                <div className="client-menu">
                  <div className="cm-label">Switch client</div>
                  {clients.map(c => (
                    <button key={c.id} className={`cm-item ${c.id === client.id ? 'on' : ''}`} onClick={() => switchClient(c)}>
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
                <span className="ms">calendar_today</span> {rangeInfo(filters).label} <span className="ms" style={{ fontSize: 16 }}>expand_more</span>
              </button>
              {openCtl === 'date' && (
                <div className="ctl-menu">
                  {Object.entries(RANGES).map(([k, r]) => (
                    <button key={k} className={`ctl-item ${filters.range === k ? 'on' : ''}`} onClick={() => fil.setRange(k)}>
                      <span className="ms" style={{ fontSize: 17 }}>{filters.range === k ? 'radio_button_checked' : 'radio_button_unchecked'}</span>{r.label}
                    </button>
                  ))}
                  <div className="ctl-custom">
                    <div className="ctl-custom-head"><span className="ms" style={{ fontSize: 17 }}>{filters.range === 'custom' ? 'radio_button_checked' : 'radio_button_unchecked'}</span>Custom range</div>
                    <div className="ctl-dates">
                      <input type="date" value={cStart} max={cEnd || TODAY_ISO} onChange={e => setCStart(e.target.value)} />
                      <span className="ctl-dash">→</span>
                      <input type="date" value={cEnd} min={cStart} max={TODAY_ISO} onChange={e => setCEnd(e.target.value)} />
                    </div>
                    <button className="ctl-apply" disabled={!cStart || !cEnd || cStart > cEnd || cEnd > TODAY_ISO} onClick={() => fil.setCustom(cStart, cEnd)}>Apply range</button>
                  </div>
                </div>
              )}
            </div>

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
              {filters.range !== '28d' && <span className="chip" onClick={() => fil.setRange('28d')}><span className="ms">calendar_today</span>{rangeInfo(filters).label}<span className="ms x">close</span></span>}
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

          <div className="foot-note">MARΣ · Media-Intelligence &amp; Advanced Reporting System · prototype with sample data · {nav.filter(n => n.key !== 'sep').length} sections · {TYPE_LABEL[client.type]} view</div>
        </div>
        )}
      </main>
      <AIDrawer ai={ai} client={client} page={title} source={source} onClose={() => setAi(null)} />
      {toast && <div className={`toast ${toast.ok ? 'ok' : 'err'}`}><span className="ms">{toast.ok ? 'check_circle' : 'error'}</span>{toast.text}</div>}
    </div>
    </FilterContext.Provider>
  )
}
