import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import EChart from './EChart.jsx'
import GeoMap from './GeoMap.jsx'
import { lineOpt, barOpt, donutOpt, funnelOpt, sankeyOpt, heatOpt, scatterOpt, gaugeOpt, stackBarOpt, ringOpt, C } from '../lib/charts.js'
import { CHANNELS, parseMetric, fmtMetric, useFilters } from '../lib/filters.js'
import { funnelStore } from '../lib/funnelStore.js'
import { targetsStore } from '../lib/targetsStore.js'
import { isConnected, getResource, saveResource } from '../lib/connections.js'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Animated count-up for KPI values (counts from 0 → value on mount / data change)
function CountUp({ text }) {
  const parsed = useMemo(() => parseMetric(text), [text])
  const [disp, setDisp] = useState(() => parsed && !reduceMotion() ? fmtMetric(0, parsed.pre, parsed.unit) : text)
  useEffect(() => {
    if (!parsed || reduceMotion()) { setDisp(text); return }
    let raf, start
    const dur = 750
    const step = t => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setDisp(fmtMetric(parsed.n * e, parsed.pre, parsed.unit))
      if (p < 1) raf = requestAnimationFrame(step)
      else setDisp(text)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [text, parsed])
  return <>{disp}</>
}

function Sparkline({ data, color }) {
  const w = 120, h = 30, min = Math.min(...data), max = Math.max(...data), r = (max - min) || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1) * w).toFixed(1)},${(h - ((v - min) / r) * (h - 4) - 2).toFixed(1)}`).join(' ')
  return <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function KpiCard({ l, v, delta, up, good, sp, i }) {
  const fil = useFilters()
  const color = good ? 'var(--green)' : good === false ? 'var(--red)' : 'var(--white)'
  const tag = good ? 'good' : good === false ? 'bad' : 'neutral'
  const tagText = good ? 'On target' : good === false ? 'Off target' : '—'
  let prev = null
  if (fil?.filters?.compare && delta && String(delta).includes('%')) {
    const p = parseMetric(v), d = parseFloat(String(delta).replace(/[^0-9.]/g, ''))
    if (p && !isNaN(d)) prev = fmtMetric(p.n / (1 + (up ? d : -d) / 100), p.pre, p.unit)
  }
  return (
    <div className="card kpi" style={{ '--d': `${(i || 0) * 45}ms` }}>
      <div className="klabel">{l}</div>
      <div className="kval num" style={{ color }}><CountUp text={v} /></div>
      <div className="krow">
        <span className={`tag ${tag}`}>{tagText}</span>
        {delta && <span className={`delta ${up ? 'up' : 'down'}`}>{delta}</span>}
      </div>
      {prev && <div className="kprev">vs prev · {prev}</div>}
      {sp && <Sparkline data={sp} color={good === false ? C.red : C.green} />}
    </div>
  )
}

function ChartCard({ spec, delay, onSelect }) {
  const { title, src, kind, height, ...rest } = spec
  const opt = useMemo(() => {
    if (kind === 'line') return lineOpt(rest)
    if (kind === 'bar') return barOpt(rest)
    if (kind === 'hbar') return barOpt({ ...rest, horizontal: true })
    if (kind === 'donut') return donutOpt(rest)
    if (kind === 'funnel') return funnelOpt(rest)
    if (kind === 'sankey') return sankeyOpt(rest)
    if (kind === 'heat') return heatOpt(rest)
    if (kind === 'scatter') return scatterOpt(rest)
    if (kind === 'gauge') return gaugeOpt(rest)
    if (kind === 'stack') return stackBarOpt(rest)
    return {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec])
  return (
    <div className="card">
      <div className="cardhead"><h3>{title}</h3>{src && <span className="tag-src">{src}</span>}</div>
      {kind === 'donut' && rest.legend
        ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 130 }}><EChart option={opt} height={height || 150} delay={delay} onSelect={onSelect} /></div>
            <div style={{ flex: 1, fontSize: 12.5 }}>
              {rest.data.map(d => <div key={d.name} className={onSelect ? 'leg-row' : ''} onClick={() => onSelect && onSelect(d.name)} style={{ display: 'flex', justifyContent: 'space-between', margin: '9px 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i style={{ width: 9, height: 9, borderRadius: 3, background: d.color, display: 'inline-block' }} />{d.name}</span>
                <b style={{ color: '#fff' }}>{d.value}%</b></div>)}
            </div>
          </div>
        : <EChart option={opt} height={height || 220} delay={delay} onSelect={onSelect} />}
    </div>
  )
}

function DataTable({ title, columns, rows, src, onSelect }) {
  return (
    <div>
      {title && <div className="cardhead" style={{ marginBottom: 10 }}><h3>{title}</h3>{src && <span className="tag-src">{src}</span>}</div>}
      <table>
        <thead><tr>{columns.map(c => <th key={c.k} className={c.r ? 'r' : ''}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, i) => {
            const clickable = onSelect && CHANNELS.includes(row.name)
            return (
            <tr key={i} className={clickable ? 'clickrow' : ''} onClick={clickable ? () => onSelect(row.name) : undefined}>{columns.map(c => {
              const val = row[c.k]
              if (c.k === 'name') return <td key={c.k}><span className="cname">{val}</span></td>
              if (c.k === 'status') return <td key={c.k}><span className={`status ${val.toLowerCase()}`}>{val}</span></td>
              const cls = row[c.k + '_s']
              return <td key={c.k} className={c.r ? 'r' : ''}><span className={cls ? `v ${cls}` : (c.strong ? 'v plain' : 'muted')}>{val}</span></td>
            })}</tr>
          ) })}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Products: sortable table with category thumbnails + trend ---------- */
const CAT = {
  Footwear: ['#22FF88', 'footprint'], Apparel: ['#2B8FEA', 'apparel'],
  Gear: ['#8A9BBB', 'backpack'], Tech: ['#5AAFF2', 'watch'], default: ['#5AAFF2', 'inventory_2'],
}
const numOf = v => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0

function ProductTable({ title, columns, rows, src }) {
  const [sort, setSort] = useState('rev_n')
  const [dir, setDir] = useState(-1)
  const sorted = useMemo(() => {
    const arr = [...rows]
    arr.sort((a, b) => {
      if (sort === 'name' || sort === 'cat') return (a[sort] > b[sort] ? 1 : -1) * dir
      return (numOf(a[sort]) - numOf(b[sort])) * dir
    })
    return arr
  }, [rows, sort, dir])
  const click = c => {
    const key = c.n || c.k
    if (key === sort) setDir(d => -d)
    else { setSort(key); setDir(c.k === 'name' || c.k === 'cat' ? 1 : -1) }
  }
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {title && <div className="cardhead" style={{ padding: '16px 18px 4px' }}><h3>{title}</h3>{src && <span className="tag-src">{src}</span>}</div>}
      <table className="ptable">
        <thead><tr>{columns.map(c => {
          const key = c.n || c.k, active = key === sort
          return <th key={c.k} className={`sortable ${c.r ? 'r' : ''} ${active ? 'on' : ''}`} onClick={() => click(c)}>
            {c.label}{active && <span className="sortarrow">{dir < 0 ? '▾' : '▴'}</span>}
          </th>
        })}</tr></thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} style={{ '--d': `${i * 28}ms` }}>{columns.map(c => {
              if (c.k === 'name') {
                const [col] = CAT[row.cat] || CAT.default
                const initials = row.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
                return <td key={c.k}><div className="prod">
                  <span className="thumb" style={{ background: `linear-gradient(150deg,${col}, #0B1628)` }}>{initials}</span>
                  <span className="cname">{row.name}</span></div></td>
              }
              if (c.k === 'cat') return <td key={c.k}><span className="catpill">{row.cat}</span></td>
              if (c.k === 'trend') return <td key={c.k} className="r"><span className={`trend ${row.up ? 'up' : 'down'}`}>{row.up ? '▲' : '▼'} {row.trend.replace(/^[+-]/, '')}</span></td>
              const cls = row[c.k + '_s']
              return <td key={c.k} className={c.r ? 'r' : ''}><span className={cls ? `v ${cls}` : (c.strong ? 'v plain' : 'muted')}>{row[c.k]}</span></td>
            })}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Expandable campaign tree: Campaign → Ad set → Ad ---------- */
const FMT_ICON = { Reel: 'movie', Video: 'movie', Carousel: 'view_carousel', Image: 'image', Static: 'image', DPA: 'shopping_bag', Catalog: 'shopping_bag', Shopping: 'shopping_bag', RSA: 'text_fields', 'Asset group': 'dashboard', Display: 'wallpaper', 'Instant Form': 'assignment', LSA: 'verified_user' }
const treeCell = (row, c) => {
  const v = row[c.k], s = row[c.k + '_s']
  return <td key={c.k} className="r"><span className={s ? `v ${s}` : 'muted'}>{v ?? '—'}</span></td>
}

const TREND_PREF = ['cpc', 'ctr', 'roas', 'cpl', 'leads', 'conv']
const SPARK_PATS = [
  [0.92, 0.97, 1.0, 1.06, 0.99, 1.03, 1.0],
  [1.09, 1.03, 0.98, 1.01, 0.95, 0.98, 1.0],
  [0.95, 1.02, 0.97, 1.05, 1.07, 0.98, 1.0],
  [1.06, 0.98, 1.04, 0.96, 1.0, 1.05, 1.0],
]
const PACE = [1.08, 0.82, 0.72, 0.66, 0.95, 1.14]
const money = n => '$' + Math.round(n).toLocaleString()

// Rich per-campaign detail panel: 7-day trends, KPI breakdown vs target,
// budget pacing, Ask Claude — plus the ad set / ad drill-down kept inside.
function CampaignPanel({ camp, columns, setLabel, seed }) {
  const fil = useFilters()
  const MET = useSyncExternalStore(targetsStore.subscribe, targetsStore.get)
  const [openSet, setOpenSet] = useState({})
  const keys = TREND_PREF.filter(key => camp[key] != null).slice(0, 4)
  const spent = numOf(camp.spend)
  const frac = PACE[seed % PACE.length]
  const budget = spent / frac
  const pct = Math.min(100, Math.round(frac * 100))
  const [pLabel, pTone] = frac > 1 ? ['OVERPACING', 'bad'] : frac >= 0.7 ? ['ON PACE', 'good'] : ['UNDERPACING', 'amber']
  const paceColor = pTone === 'good' ? 'var(--green)' : pTone === 'bad' ? 'var(--red)' : 'var(--amber)'
  return (
    <div className="expanel">
      <div>
        <div className="ex-col-h">7-day trends</div>
        <div className="trend-grid">
          {keys.map((key, i) => {
            const m = MET[key], v = numOf(camp[key])
            const pat = SPARK_PATS[(seed + i) % SPARK_PATS.length]
            const data = pat.map(x => +(v * x).toFixed(2))
            const up = data[data.length - 1] >= data[0]
            const delta = Math.abs(Math.round((data[data.length - 1] - data[0]) / (Math.abs(data[0]) || 1) * 100))
            const improve = m.dir === 'low' ? !up : up
            return (
              <div className="trend-card" key={key}>
                <div className="tc-top">
                  <span className="tc-label">{m.label}</span>
                  <span className="tc-delta" style={{ color: improve ? 'var(--green)' : 'var(--red)' }}>{up ? '▲' : '▼'} {delta}%</span>
                </div>
                <div className="tc-val">{camp[key]}</div>
                <Sparkline data={data} color={improve ? C.green : C.red} />
                <div className="tc-foot"><span>7 days ago</span><span>today</span></div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="ex-col-h">KPI breakdown</div>
        {keys.filter(key => MET[key].value != null).map(key => {
          const m = MET[key], ok = m.dir === 'low' ? numOf(camp[key]) < m.value : numOf(camp[key]) > m.value
          return (
            <div className="kbd-row" key={key}>
              <span className="kbd-l">{m.label}</span>
              <span className="kbd-r"><span className="kbd-v" style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>{camp[key]}</span><span className="kbd-t">{m.t}</span></span>
            </div>
          )
        })}
        <div className="kbd-row"><span className="kbd-l">Total spend</span><span className="kbd-r"><span className="kbd-v">{camp.spend}</span></span></div>
        {camp.leads != null
          ? <div className="kbd-row"><span className="kbd-l">Leads</span><span className="kbd-r"><span className="kbd-v">{camp.leads}</span></span></div>
          : camp.conv != null && <div className="kbd-row"><span className="kbd-l">Conversions</span><span className="kbd-r"><span className="kbd-v">{camp.conv}</span></span></div>}
      </div>

      <div className="pacing">
        <div className="ex-col-h">Budget pacing</div>
        <div className="pl"><span>Spent</span><b>{camp.spend}</b></div>
        <div className="pl"><span>Budget est.</span><b>{money(budget)}</b></div>
        <div className="pace-bar"><div className="pace-fill" style={{ width: pct + '%', background: paceColor }} /></div>
        <div className="pace-status" style={{ color: paceColor }}>{pLabel}</div>
        <button className="ask-claude" onClick={() => fil && fil.openAI({ kind: 'campaign', name: camp.name })}><span className="ms">auto_awesome</span> Ask Claude about this campaign</button>
      </div>

      <div className="ex-sets">
        <div className="ex-col-h">{setLabel} &amp; ads</div>
        {camp.sets.map((set, si) => {
          const so = openSet[si]
          return (
            <div className="ex-set" key={si}>
              <div className="ex-set-head" onClick={() => setOpenSet(p => ({ ...p, [si]: !p[si] }))}>
                <span className={`chev ms ${so ? 'open' : ''}`}>chevron_right</span>
                <span className="sname">{set.name}</span>
                <span className="cmeta">{set.ads.length} ads</span>
                <span className="ex-metrics">{columns.map(c => set[c.k] != null && (
                  <span className="ex-metric" key={c.k}><span>{c.label}</span><b className={set[c.k + '_s'] ? `v ${set[c.k + '_s']}` : ''}>{set[c.k]}</b></span>
                ))}</span>
              </div>
              {so && set.ads.map((ad, ai) => (
                <div className="ex-ad" key={ai}>
                  <span className="adthumb"><span className="ms">{FMT_ICON[ad.fmt] || 'image'}</span></span>
                  <span className="adname">{ad.name}</span>
                  <span className="fmtbadge">{ad.fmt}</span>
                  <span className="ex-metrics">{columns.map(c => ad[c.k] != null && (
                    <span className="ex-metric" key={c.k}><span>{c.label}</span><b className={ad[c.k + '_s'] ? `v ${ad[c.k + '_s']}` : ''}>{ad[c.k]}</b></span>
                  ))}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CampaignTree({ columns, rows, setLabel = 'Ad sets' }) {
  const [open, setOpen] = useState({})
  const colspan = 2 + columns.length
  const setName = setLabel.toLowerCase()
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="ctree">
        <thead><tr>
          <th>Campaign</th>
          <th>Status</th>
          {columns.map(c => <th key={c.k} className="r">{c.label}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((camp, ci) => {
            const co = open[ci]
            return (
              <Fragment key={ci}>
                <tr className={`crow lvl0 ${co ? 'open' : ''}`} onClick={() => setOpen(p => ({ ...p, [ci]: !p[ci] }))}>
                  <td><div className="tname">
                    <span className={`chev ms ${co ? 'open' : ''}`}>chevron_right</span>
                    <span className="cname">{camp.name}</span>
                    <span className="cmeta">{camp.sets.length} {setName}</span>
                  </div></td>
                  <td>{camp.status && <span className={`status ${camp.status.toLowerCase()}`}>{camp.status}</span>}</td>
                  {columns.map(c => treeCell(camp, c))}
                </tr>
                {co && <tr className="exrow"><td colSpan={colspan} style={{ padding: 0 }}><CampaignPanel camp={camp} columns={columns} setLabel={setLabel} seed={ci} /></td></tr>}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Pills({ items }) {
  return <div className="stat-pills">{items.map((p, i) =>
    <div className="stat-pill" key={i}><span className="ms" style={{ color: p.color || 'var(--blue2)' }}>{p.icon}</span><b>{p.value}</b><span>{p.label}</span></div>)}</div>
}

const GA4_EVENTS = ['session_start', 'page_view', 'view_item', 'view_item_list', 'add_to_cart', 'add_to_wishlist', 'view_cart', 'begin_checkout', 'add_payment_info', 'purchase', 'sign_up', 'generate_lead', 'search', 'scroll']
const EV_RET = { session_start: 1, page_view: .88, view_item: .62, view_item_list: .7, add_to_cart: .42, add_to_wishlist: .5, view_cart: .65, begin_checkout: .45, add_payment_info: .72, purchase: .6, sign_up: .5, generate_lead: .4, search: .55, scroll: .8 }
const FUNNEL_BASE = 128440
function computeFunnel(steps, mode) {
  let v = FUNNEL_BASE
  return steps.map((ev, i) => {
    if (i > 0) v = Math.round(v * (EV_RET[ev] ?? .5) * (mode === 'closed' ? 0.88 : 1))
    const pct = FUNNEL_BASE ? v / FUNNEL_BASE * 100 : 0
    return { name: ev, value: v, p: (pct >= 10 ? pct.toFixed(0) : pct.toFixed(1)) + '%' }
  })
}

// Interactive funnel builder — add/remove GA4 event steps, live funnel preview, save
function FunnelBuilder({ steps: initial }) {
  const [steps, setSteps] = useState(initial)
  const [mode, setMode] = useState('open')
  const [adding, setAdding] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const data = useMemo(() => computeFunnel(steps, mode), [steps, mode])
  const opt = useMemo(() => funnelOpt({ steps: data, big: true }), [data])
  const avail = GA4_EVENTS.filter(e => !steps.includes(e))

  let leak = null
  for (let i = 1; i < data.length; i++) {
    const drop = data[i - 1].value - data[i].value
    if (!leak || drop > leak.drop) leak = { drop, from: data[i - 1].name, to: data[i].name, pct: Math.round(drop / (data[i - 1].value || 1) * 100) }
  }
  function save() {
    const last = data[data.length - 1]
    const type = steps.includes('purchase') ? 'Ecommerce' : (steps.includes('generate_lead') || steps.includes('sign_up')) ? 'Leads' : 'Custom'
    funnelStore.add({ name: `${steps[0]} → ${steps[steps.length - 1]}`, type, steps: steps.length, cr: last ? last.p : '—', updated: 'just now' })
    setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2200)
  }
  return (
    <div className="card">
      <div className="builder">
        {steps.map((s, i) => (<span key={s} style={{ display: 'contents' }}>
          <div className="step-chip"><span className="n">{i + 1}</span>{s}<span className="ms x" onClick={() => setSteps(steps.filter((_, j) => j !== i))}>close</span></div>
          {i < steps.length - 1 && <span className="arrow">→</span>}
        </span>))}
        <div className="addwrap">
          <button className="add-step" onClick={() => setAdding(a => !a)} disabled={!avail.length}>+ Add step</button>
          {adding && avail.length > 0 && (
            <div className="step-menu">{avail.map(e => <button key={e} onClick={() => { setSteps([...steps, e]); setAdding(false) }}>{e}</button>)}</div>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="tabset"><button className={mode === 'open' ? 'active' : ''} onClick={() => setMode('open')}>Open funnel</button><button className={mode === 'closed' ? 'active' : ''} onClick={() => setMode('closed')}>Closed</button></div>
          <button className="save-funnel" onClick={save}><span className="ms">bookmark_add</span>{savedMsg ? 'Saved ✓' : 'Save funnel'}</button>
        </div>
      </div>
      {data.length >= 2
        ? <div style={{ marginTop: 14 }}><EChart option={opt} height={300} /></div>
        : <div className="empty-funnel">Add at least two steps to preview the funnel.</div>}
      {leak && data.length >= 2 && (
        <div className="leak-inline"><span className="ms" style={{ color: 'var(--red)' }}>trending_down</span><span><b>Biggest drop:</b> {leak.from} → {leak.to} loses <b style={{ color: 'var(--red)' }}>{leak.pct}%</b> ({leak.drop.toLocaleString()} users).</span></div>
      )}
    </div>
  )
}

function SavedFunnels() {
  const rows = useSyncExternalStore(funnelStore.subscribe, funnelStore.get)
  const saved = rows.filter(r => !r.template).length, tpl = rows.filter(r => r.template).length
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="cardhead" style={{ padding: '16px 18px 4px' }}><h3>Saved funnels</h3><span className="tag-src">{saved} saved · {tpl} templates</span></div>
      <table>
        <thead><tr><th>Funnel</th><th>Type</th><th className="r">Steps</th><th className="r">Completion</th><th className="r">Updated</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><span className="cname">{r.name}</span> {r.template ? <span className="fnl-badge tpl">Template</span> : <span className="fnl-badge saved">Saved</span>}</td>
              <td><span className="muted">{r.type}</span></td>
              <td className="r"><span className="muted">{r.steps}</span></td>
              <td className="r"><span className={`v ${parseFloat(r.cr) >= 10 ? 'good' : 'plain'}`}>{r.cr}</span></td>
              <td className="r"><span className="muted">{r.updated}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const EXP_DIMS = {
  Country: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia', 'France'],
  Channel: ['Paid Search', 'Paid Social', 'Organic', 'Email', 'Direct', 'Referral'],
  Device: ['Desktop', 'Mobile', 'Tablet'],
  'Landing page': ['/', '/products/trail-boots', '/collections/new', '/cart', '/blog/best-hikes'],
  Browser: ['Chrome', 'Safari', 'Edge', 'Firefox', 'Other'],
}
const EXP_METRICS = { Users: 1, Sessions: 1.36, Conversions: 0.09, 'Revenue ($)': 4.3 }
const EXP_BASE = [42000, 31000, 24000, 18000, 12000, 8000]

// Interactive GA4 free-form explore — pick a dimension & metric, chart + table update
function Explore() {
  const [dim, setDim] = useState('Country')
  const [metric, setMetric] = useState('Users')
  const cats = EXP_DIMS[dim]
  const mult = EXP_METRICS[metric]
  const vals = cats.map((_, i) => Math.round((EXP_BASE[i] ?? 6000) * mult * (1 - i * 0.05)))
  const opt = useMemo(() => barOpt({ x: cats, data: vals, horizontal: true, color: C.green }), [dim, metric])
  const isRev = metric.startsWith('Revenue')
  const fmt = n => (isRev ? '$' : '') + n.toLocaleString()
  return (
    <div className="card">
      <div className="cardhead"><h3>Free-form explore</h3><span className="tag-src">GA4 Data API</span></div>
      <div className="explore-bar">
        <div className="exp-field"><label>Dimension</label>
          <select value={dim} onChange={e => setDim(e.target.value)}>{Object.keys(EXP_DIMS).map(d => <option key={d}>{d}</option>)}</select>
        </div>
        <span className="ms" style={{ color: 'var(--dim)' }}>drag_indicator</span>
        <div className="exp-field"><label>Metric</label>
          <select value={metric} onChange={e => setMetric(e.target.value)}>{Object.keys(EXP_METRICS).map(m => <option key={m}>{m}</option>)}</select>
        </div>
      </div>
      <EChart option={opt} height={250} />
      <table style={{ marginTop: 14 }}>
        <thead><tr><th>{dim}</th><th className="r">{metric}</th></tr></thead>
        <tbody>{cats.map((c, i) => <tr key={c}><td><span className="cname">{c}</span></td><td className="r"><span className="v plain">{fmt(vals[i])}</span></td></tr>)}</tbody>
      </table>
    </div>
  )
}

function LeakCard({ big, pct, text }) {
  return (
    <div className="card leak-card">
      <div className="mono-label" style={{ fontSize: 10, color: 'var(--red)' }}>Biggest leak</div>
      <div className="biglk">{big}</div>
      <p style={{ margin: '6px 0 0', color: 'var(--text)', fontSize: 13 }}>{text}</p>
      <button className="ask"><span className="ms">auto_awesome</span> Ask AI why they drop here</button>
    </div>
  )
}

function KBreak({ title, rows }) {
  return (
    <div className="card">
      <div className="cardhead"><h3>{title}</h3></div>
      <div className="kbreak">
        {rows.map((r, i) => <div key={i}><span className="muted">{r.k}</span><span className={`v ${r.s || 'plain'}`}>{r.v}</span></div>)}
      </div>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-label="Google">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.75 24 9.75z" />
    </svg>
  )
}
function MetaLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 287.56 191" aria-label="Meta">
      <defs>
        <linearGradient id="meta-a" x1="62.34" y1="101.45" x2="260.34" y2="91.45" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0064e1" /><stop offset=".4" stopColor="#0064e1" /><stop offset=".83" stopColor="#0073ee" /><stop offset="1" stopColor="#0082fb" /></linearGradient>
        <linearGradient id="meta-b" x1="41.42" y1="53" x2="41.42" y2="160" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0082fb" /><stop offset="1" stopColor="#0064e0" /></linearGradient>
      </defs>
      <path fill="#0081fb" d="M31.06 126c0 11 2.41 19.41 5.56 24.51A19 19 0 0 0 53.19 160c8.1 0 15.51-2 29.79-21.76 11.44-15.83 24.92-38 34-52l15.36-23.6c10.67-16.39 23-34.61 37.18-47C181.07 5.6 193.54 0 206.09 0v31c-12.55 0-25 5.6-37.95 16.62-14.15 12.42-26.5 30.64-37.18 47l-15.36 23.6c-9.06 14-22.54 36.17-34 52C67.15 189 59.75 191 51.65 191a19 19 0 0 1-16.57-9.49C28.43 173.31 26 161.07 26 150z" transform="translate(0)" />
      <path fill="url(#meta-b)" d="M24.49 37.3C38.73 15.35 59.28 0 82.85 0c13.65 0 27.22 4 41.39 15.61 15.5 12.65 32 33.48 52.63 67.81l7.39 12.32c17.84 29.72 28 45 33.93 52.22 7.64 9.26 13 12 19.94 12 17.63 0 22-16.2 22-34.74L287.46 125c0 19.38-3.82 33.62-10.32 44.87C271 180.13 258.72 191 238.13 191c-12.8 0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71l-25.79-43.08c-12.94-21.62-24.81-37.74-31.68-45C107 40.71 97.51 31.23 82.35 31.23c-12.26 0-22.67 8.61-31.39 21.78z" />
      <path fill="url(#meta-a)" d="M82.35 31.23c-12.26 0-22.67 8.61-31.39 21.78C38.61 71.62 31.06 99.34 31.06 126c0 11 2.41 19.41 5.56 24.51L10.14 167.91C3.34 156.6 0 141.76 0 124.85 0 94.1 8.44 62.05 24.49 37.3 38.73 15.35 59.28 0 82.85 0z" />
    </svg>
  )
}
function ShopifyLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-label="Shopify">
      <defs><linearGradient id="shop-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#95BF47" /><stop offset="1" stopColor="#5E8E3E" /></linearGradient></defs>
      <path fill="url(#shop-g)" d="M18.7 7.6H5.3c-.5 0-.9.37-1 .86l-1.2 11.2c-.06.6.4 1.14 1 1.14h15.8c.6 0 1.06-.54 1-1.14l-1.2-11.2c-.05-.49-.46-.86-1-.86z" />
      <path fill="none" stroke="#fff" strokeWidth="1.7" d="M8.4 9.4V6.6a3.6 3.6 0 0 1 7.2 0v2.8" />
    </svg>
  )
}
function WooLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-label="WooCommerce">
      <rect width="24" height="24" rx="6" fill="#7F54B3" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7.4" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">Woo</text>
    </svg>
  )
}
function MerchantLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-label="Google Merchant Center">
      <path fill="#4285F4" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21.16 5H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44C5.52 16.37 6.48 18 7.16 18z" />
    </svg>
  )
}
const LOGOS = { google: GoogleLogo, meta: MetaLogo, shopify: ShopifyLogo, woo: WooLogo, merchant: MerchantLogo }
const BrandLogo = ({ brand }) => { const L = LOGOS[brand] || GoogleLogo; return <L /> }

const CONNECT_GROUPS = [
  { title: 'Ads & analytics', items: [
    { name: 'Google', sub: 'Analytics (GA4) · Google Ads · Search Console', logo: 'google', provider: 'google' },
    { name: 'Meta', sub: 'Facebook & Instagram Ads', logo: 'meta', provider: 'meta' },
  ] },
  { title: 'Ecommerce store · optional', note: 'Only needed for product inventory, stock, lifetime-value and Shopping feeds. Connect what applies.', items: [
    { name: 'Shopify', sub: 'Orders, products, inventory & customers', logo: 'shopify', provider: 'shopify' },
    { name: 'WooCommerce', sub: 'Orders, products, inventory & customers', logo: 'woo', provider: 'woocommerce' },
    { name: 'Google Merchant Center', sub: 'Product feed, prices & availability for Shopping', logo: 'merchant', provider: 'merchant' },
  ] },
]
// After a provider connects, choose which property / ad account / merchant to report on
function ResourcePicker({ clientId, provider }) {
  const [data, setData] = useState(null)
  const [sel, setSel] = useState(() => getResource(clientId, provider))
  useEffect(() => {
    let on = true
    fetch(`/api/resources/${provider}?client=${encodeURIComponent(clientId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!on || !d || !d.items?.length) return
        setData(d)
        if (!getResource(clientId, provider)) { setSel(d.items[0]); saveResource(clientId, provider, d.items[0]) }
      }).catch(() => {})
    return () => { on = false }
  }, [provider, clientId])
  if (!data) return null
  return (
    <div className="res-pick">
      <span className="res-label">{data.label}</span>
      <select value={sel?.id || ''} onChange={e => {
        const it = data.items.find(i => i.id === e.target.value)
        setSel(it); saveResource(clientId, provider, it)
        fetch('/api/select-resource', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client: clientId, provider, id: it.id, name: it.name }) }).catch(() => {})
      }}>
        {data.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
      </select>
    </div>
  )
}

function Connections() {
  const fil = useFilters()
  const clientId = fil?.clientId || 'default'
  return (
    <div className="card">
      <div className="cardhead"><h3>Connected data sources</h3></div>
      {CONNECT_GROUPS.map(g => (
        <div key={g.title} style={{ marginBottom: 18 }}>
          <div className="connect-group">{g.title}</div>
          {g.note && <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>{g.note}</p>}
          <div style={{ display: 'grid', gap: 12 }}>
            {g.items.map(c => {
              const done = isConnected(clientId, c.provider)
              return (
                <div className="connect" key={c.name}>
                  <div className="cicon brand"><BrandLogo brand={c.logo} /></div>
                  <div className="connect-mid"><b>{c.name}</b><small>{c.sub}</small>
                    {done && <ResourcePicker clientId={clientId} provider={c.provider} />}
                  </div>
                  {done
                    ? <span className="btn-connect done">✓ Connected</span>
                    : <a className="btn-connect go" href={`/api/connect/${c.provider}?client=${encodeURIComponent(clientId)}`}>Connect</a>}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>One-time OAuth per provider. Google grants GA4 + Ads + Search Console together; Meta is separate. Tokens are stored securely and refreshed automatically.</p>
    </div>
  )
}

function Note({ icon, title, text }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 44 }}>
      <span className="ms" style={{ fontSize: 32, color: 'var(--blue2)' }}>{icon || 'dashboard_customize'}</span>
      <h3 style={{ fontWeight: 600 }}>{title}</h3>
      <p className="muted" style={{ margin: 0, textAlign: 'center', maxWidth: 460 }}>{text}</p>
    </div>
  )
}

// Geo panel — compact map + ranked country leaderboard (replaces the wide empty map)
function GeoPanel({ title, data, unit = '' }) {
  const rows = data.slice(1).map(r => ({ name: r[0], v: r[1] })).sort((a, b) => b.v - a.v)
  const total = rows.reduce((a, r) => a + r.v, 0) || 1
  const max = rows[0]?.v || 1
  const top = rows.slice(0, 6)
  const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : Math.round(n).toLocaleString()
  return (
    <div className="card">
      <div className="cardhead"><h3>{title}</h3><span className="tag-src">GA4 · by country</span></div>
      <div className="geo-wrap">
        <div className="geo-map"><GeoMap data={data} height={188} /></div>
        <div className="geo-rank">
          {top.map((r, i) => (
            <div className="geo-row" key={r.name}>
              <span className="geo-rk">{i + 1}</span>
              <span className="geo-name">{r.name}</span>
              <div className="geo-bartrack"><div className="geo-bar" style={{ width: (r.v / max * 100) + '%' }} /></div>
              <span className="geo-val">{unit}{fmt(r.v)}</span>
              <span className="geo-share">{Math.round(r.v / total * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Insight({ icon, tone = 'good', title, text }) {
  return (
    <div className={`card insight ${tone}`}>
      <span className="ms ins-icon">{icon || 'lightbulb'}</span>
      <div><div className="ins-title">{title}</div><p className="ins-text">{text}</p></div>
    </div>
  )
}

// Skeleton placeholders shown during the "loading gate" so charts mount fresh
export function Skeleton({ spec }) {
  const span = { gridColumn: `span ${spec.w || 12}` }
  if (spec.type === 'kpis')
    return <div className="kgrid" style={{ ...span, display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(150px,1fr))`, gap: 14 }}>{spec.items.map((_, i) => <div key={i} className="card sk" style={{ height: 118 }}><div className="sk-bar" style={{ width: '55%' }} /><div className="sk-bar lg" style={{ width: '72%' }} /><div className="sk-bar" style={{ width: '40%' }} /></div>)}</div>
  const h = spec.type === 'note' ? 150 : spec.kind === 'funnel' || spec.big ? 320 : spec.type === 'table' || spec.type === 'producttable' || spec.type === 'campaignTree' ? 260 : 230
  return <div style={span}><div className="card sk" style={{ height: h }}><div className="sk-bar" style={{ width: '40%' }} /><div className="sk-fill" /></div></div>
}

// ---- Settings: editable KPI targets (writes to the shared targets store) ----
function KpiTargets() {
  const t = useSyncExternalStore(targetsStore.subscribe, targetsStore.get)
  const CUR = { cpc: ['$0.74', 'good'], ctr: ['1.84%', 'good'], roas: ['4.8x', 'good'], cpl: ['$96', 'good'], cvr: ['5.6%', 'bad'] }
  const keys = Object.keys(t).filter(k => t[k].value != null)
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="cardhead" style={{ padding: '16px 18px 4px' }}><h3>KPI targets</h3><span className="tag-src">edits apply live everywhere</span></div>
      <table>
        <thead><tr><th>Metric</th><th>Source</th><th>Target</th><th className="r">Current</th><th>Status</th></tr></thead>
        <tbody>
          {keys.map(k => { const m = t[k]; return (
            <tr key={k}>
              <td><span className="cname">{m.label}</span></td>
              <td><span className="muted">{m.src}</span></td>
              <td><div className="t-edit"><span className="t-op">{m.dir === 'low' ? '<' : '>'}</span>{m.kind === 'currency' && <span className="t-unit">$</span>}<input type="number" value={m.value} onChange={e => targetsStore.setValue(k, e.target.value)} />{m.kind === 'percent' && <span className="t-unit">%</span>}{m.kind === 'multiple' && <span className="t-unit">x</span>}</div></td>
              <td className="r">{CUR[k] ? <span className={`v ${CUR[k][1]}`}>{CUR[k][0]}</span> : <span className="muted">—</span>}</td>
              <td><span className="status active">Active</span></td>
            </tr>
          ) })}
        </tbody>
      </table>
    </div>
  )
}

function AddClient() {
  const fil = useFilters()
  const [name, setName] = useState('')
  const [type, setType] = useState('ecommerce')
  function create() {
    const n = name.trim(); if (!n || !fil) return
    const id = n.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + n.length
    fil.createClient({ id, name: n, type, initial: n[0].toUpperCase(), sub: type === 'ecommerce' ? 'Ecommerce client' : type === 'awareness' ? 'Awareness client' : 'Lead-gen client' })
  }
  return (
    <div className="card form-card">
      <h3 style={{ marginBottom: 6 }}>Add a new client</h3>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>Create a workspace and pick the client type — it appears in the client switcher (top-left) immediately and opens its dashboard.</p>
      <div className="fld"><label>Client name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Co" onKeyDown={e => e.key === 'Enter' && create()} /></div>
      <div className="fld"><label>Client type</label>
        <div className="seg"><button className={type === 'ecommerce' ? 'on' : ''} onClick={() => setType('ecommerce')}>Ecommerce</button><button className={type === 'leadgen' ? 'on' : ''} onClick={() => setType('leadgen')}>Lead-gen</button><button className={type === 'awareness' ? 'on' : ''} onClick={() => setType('awareness')}>Awareness</button></div>
      </div>
      <button className="btn-primary" disabled={!name.trim()} onClick={create}><span className="ms">add</span> Create client</button>
    </div>
  )
}

const ALERT_SEED = [{ name: 'ROAS below 3x', channel: 'Email + Slack', active: true }, { name: 'CPL above $120', channel: 'Email', active: true }, { name: 'Spend pacing > 110%', channel: 'Slack', active: false }]
function AlertsManager() {
  const [rules, setRules] = useState(ALERT_SEED)
  const [name, setName] = useState(''); const [ch, setCh] = useState('Email')
  const add = () => { const n = name.trim(); if (!n) return; setRules([...rules, { name: n, channel: ch, active: true }]); setName('') }
  return (
    <div className="card">
      <div className="cardhead"><h3>Alert rules</h3><span className="tag-src">{rules.filter(r => r.active).length} active</span></div>
      <div className="rulebar">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New rule, e.g. CTR below 1%" onKeyDown={e => e.key === 'Enter' && add()} />
        <select value={ch} onChange={e => setCh(e.target.value)}><option>Email</option><option>Slack</option><option>Email + Slack</option></select>
        <button className="btn-primary sm" onClick={add}><span className="ms">add</span> Add</button>
      </div>
      <div className="rules">
        {rules.map((r, i) => (
          <div className="rule" key={i}>
            <button className={`switch ${r.active ? 'on' : ''}`} onClick={() => setRules(rules.map((x, j) => j === i ? { ...x, active: !x.active } : x))}><span /></button>
            <div className="rule-txt"><b className={r.active ? '' : 'off'}>{r.name}</b><small>{r.channel}</small></div>
            <button className="row-del" onClick={() => setRules(rules.filter((_, j) => j !== i))}><span className="ms">delete</span></button>
          </div>
        ))}
      </div>
    </div>
  )
}

const TEAM_SEED = [{ name: 'Apollo (you)', role: 'Agency admin', access: 'All clients' }, { name: 'Maria K.', role: 'Analyst', access: 'All clients' }]
function TeamManager() {
  const [team, setTeam] = useState(TEAM_SEED)
  const [name, setName] = useState(''); const [role, setRole] = useState('Analyst')
  const add = () => { const n = name.trim(); if (!n) return; setTeam([...team, { name: n, role, access: role === 'Client' ? 'Own workspace' : 'All clients' }]); setName('') }
  return (
    <div className="card">
      <div className="cardhead"><h3>Team & access</h3><span className="tag-src">{team.length} members</span></div>
      <div className="rulebar">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Invite by name / email" onKeyDown={e => e.key === 'Enter' && add()} />
        <select value={role} onChange={e => setRole(e.target.value)}><option>Agency admin</option><option>Analyst</option><option>Client</option></select>
        <button className="btn-primary sm" onClick={add}><span className="ms">person_add</span> Invite</button>
      </div>
      <table style={{ marginTop: 4 }}>
        <thead><tr><th>User</th><th>Role</th><th>Access</th><th></th></tr></thead>
        <tbody>{team.map((m, i) => (
          <tr key={i}><td><span className="cname">{m.name}</span></td><td><span className="muted">{m.role}</span></td><td><span className="muted">{m.access}</span></td>
            <td className="r">{i > 0 && <button className="row-del" onClick={() => setTeam(team.filter((_, j) => j !== i))}><span className="ms">delete</span></button>}</td></tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function Branding() {
  const [c1, setC1] = useState('#2B8FEA'); const [c2, setC2] = useState('#22FF88'); const [brand, setBrand] = useState('GYA Media')
  const [saved, setSaved] = useState(false)
  return (
    <div className="card form-card">
      <h3 style={{ marginBottom: 6 }}>White-label branding</h3>
      <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>Set the client-facing brand name and accent colors. The preview updates live.</p>
      <div className="fld"><label>Brand name</label><input value={brand} onChange={e => setBrand(e.target.value)} /></div>
      <div className="brand-colors">
        <div className="fld"><label>Primary</label><div className="color-row"><input type="color" value={c1} onChange={e => setC1(e.target.value)} /><span>{c1}</span></div></div>
        <div className="fld"><label>Accent</label><div className="color-row"><input type="color" value={c2} onChange={e => setC2(e.target.value)} /><span>{c2}</span></div></div>
      </div>
      <div className="brand-preview">
        <div className="bp-label">Live preview</div>
        <div className="bp-row">
          <div className="bp-logo" style={{ background: `linear-gradient(150deg,${c1},${c2})` }}>{(brand[0] || 'G').toUpperCase()}</div>
          <b style={{ color: '#fff', flex: 1 }}>{brand || 'Brand name'}</b>
          <button className="bp-btn" style={{ background: `linear-gradient(120deg,${c1},${c2})` }}>Generate AI Report</button>
        </div>
      </div>
      <button className="btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}><span className="ms">save</span>{saved ? 'Saved ✓' : 'Save branding'}</button>
    </div>
  )
}

function HealthScore({ title, score, max = 100, items = [] }) {
  const pct = Math.round((score / max) * 100)
  const col = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--blue2)' : 'var(--red)'
  const dot = s => s === 'ok' ? 'var(--green)' : s === 'warn' ? '#F2B84B' : 'var(--red)'
  return (
    <div className="card">
      <div className="cardhead"><h3>{title}</h3></div>
      <div style={{ display:'flex', alignItems:'center', gap:18, padding:'4px 2px 12px' }}>
        <div style={{ fontFamily:'var(--font-title)', fontWeight:800, fontSize:42, color:col, lineHeight:1 }}>{score}<span style={{ fontSize:18, color:'var(--muted)' }}>/{max}</span></div>
        <div style={{ flex:1 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:9, margin:'5px 0' }}>
              <span style={{ width:9, height:9, borderRadius:'50%', background:dot(it.status), boxShadow:`0 0 6px ${dot(it.status)}66` }} />
              <span style={{ color:'var(--text)' }}>{it.label}</span>
              <small style={{ marginLeft:'auto', color:'var(--muted)' }}>{it.note}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Leaderboard({ title, rows = [] }) {
  return (
    <div className="card" style={{ padding:0, overflow:'hidden' }}>
      <div className="cardhead" style={{ padding:'16px 18px 4px' }}><h3>{title}</h3></div>
      <div style={{ padding:'4px 8px 10px' }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 10px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
            <span style={{ width:22, color:'var(--muted)', fontFamily:'var(--font-title)', fontWeight:700 }}>{i + 1}</span>
            <div style={{ flex:1 }}><b style={{ color:'#fff' }}>{r.name}</b>{r.sub && <small style={{ display:'block', color:'var(--muted)' }}>{r.sub}</small>}</div>
            {r.trend && <small style={{ color: r.trend.startsWith('-') ? 'var(--red)' : 'var(--green)' }}>{r.trend}</small>}
            <span className={`v ${r.status || 'plain'}`} style={{ fontFamily:'var(--font-title)', fontWeight:700 }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Changelog({ title, rows = [] }) {
  return (
    <div className="card" style={{ padding:0, overflow:'hidden' }}>
      <div className="cardhead" style={{ padding:'16px 18px 4px' }}><h3>{title}</h3><span className="tag-src">{rows.length} entries</span></div>
      <table>
        <thead><tr><th>Week of</th><th>Campaign updates</th><th>Trends seen</th><th>What we changed &amp; result</th></tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i}><td><span className="muted">{r.date}</span></td><td>{r.update}</td><td className="muted">{r.trend}</td><td className="muted">{r.change}</td></tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function TrackingHealth({ title, rows = [] }) {
  const badge = s => s === 'firing'
    ? { t:'Firing', c:'var(--green)' } : s === 'stale'
    ? { t:'Stale', c:'#F2B84B' } : { t:'Not firing', c:'var(--red)' }
  return (
    <div className="card" style={{ padding:0, overflow:'hidden' }}>
      <div className="cardhead" style={{ padding:'16px 18px 4px' }}><h3>{title}</h3><span className="tag-src">Pixel / GTM health</span></div>
      <table>
        <thead><tr><th>Tag / event</th><th>Source</th><th>Status</th><th className="r">Last seen</th></tr></thead>
        <tbody>{rows.map((r, i) => { const b = badge(r.status); return (
          <tr key={i}><td><span className="cname">{r.name}</span></td><td className="muted">{r.source}</td>
            <td><span style={{ display:'inline-flex', alignItems:'center', gap:7 }}><span style={{ width:9, height:9, borderRadius:'50%', background:b.c, boxShadow:`0 0 6px ${b.c}66` }} /><b style={{ color:b.c }}>{b.t}</b></span></td>
            <td className="r muted">{r.last}</td></tr>
        ) })}</tbody>
      </table>
    </div>
  )
}

function SignatureFunnel({ title = 'Funnel overview', spend, steps = [], side = [], footer }) {
  const opt = useMemo(() => funnelOpt({ steps, big: true }), [steps])
  return (
    <div className="card">
      <div className="cardhead"><h3>{title}</h3>{spend && <span className="tag-src">Ad spend {spend}</span>}</div>
      <div style={{ display:'flex', gap:14, alignItems:'stretch' }}>
        <div style={{ flex:'1 1 64%', minHeight:320 }}><EChart option={opt} height={320} /></div>
        <div style={{ flex:'1 1 36%', display:'flex', flexDirection:'column', justifyContent:'center', gap:12 }}>
          {side.map((s, i) => (
            <div key={i} style={{ borderLeft:'2px solid var(--line)', paddingLeft:12 }}>
              <small style={{ color:'var(--muted)', display:'block' }}>{s.label}</small>
              <b style={{ fontFamily:'var(--font-title)', fontSize:20, color:'#fff' }}>{s.value}</b>
              {s.delta && <small style={{ marginLeft:8, color: s.up ? 'var(--green)' : 'var(--red)' }}>{s.up ? '▲' : '▼'} {s.delta}</small>}
            </div>
          ))}
        </div>
      </div>
      {footer && <div style={{ marginTop:10, color:'var(--green)', fontFamily:'var(--font-title)', fontWeight:600 }}>{footer}</div>}
    </div>
  )
}

function PerformanceFunnel({ title, src, stages = [] }) {
  const nodes = stages.flatMap((s, i) => {
    const arr = []
    if (i > 0) arr.push(
      <div key={'c' + i} style={{ flex:'0 0 auto', minWidth:70, textAlign:'center' }}>
        <span className="ms" style={{ color:'var(--muted)', fontSize:20 }}>trending_flat</span>
        <div style={{ fontFamily:'var(--font-title)', fontWeight:700, fontSize:13, color:'var(--green)' }}>{s.conv}</div>
      </div>
    )
    arr.push(
      <div key={'s' + i} style={{ flex:'1 1 0', textAlign:'center', minWidth:120 }}>
        <EChart option={ringOpt({ pct: s.pct, color: s.color, label: s.value })} height={150} />
        <div style={{ color:'var(--text)', fontWeight:600, marginTop:2 }}>{s.name}</div>
      </div>
    )
    return arr
  })
  return (
    <div className="card">
      <div className="cardhead"><h3>{title}</h3>{src && <span className="tag-src">{src}</span>}</div>
      <div style={{ display:'flex', alignItems:'center', gap:4, padding:'8px 0 6px' }}>{nodes}</div>
    </div>
  )
}

export default function Widget({ spec, idx = 0 }) {
  const fil = useFilters()
  const span = { gridColumn: `span ${spec.w || 12}` }
  const delay = idx * 70
  const onSelect = fil ? (name => { if (CHANNELS.includes(name)) fil.setChannelsOnly(name) }) : undefined
  if (spec.type === 'kpis')
    return <div className="kgrid" style={{ ...span, display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(150px,1fr))`, gap: 14 }}>{spec.items.map((k, i) => <KpiCard key={i} {...k} i={i} />)}</div>
  if (spec.type === 'pills') return <div style={span}><Pills items={spec.items} /></div>
  if (spec.type === 'chart') return <div style={span}><ChartCard spec={spec} delay={delay} onSelect={onSelect} /></div>
  if (spec.type === 'geo') return <div style={span}><GeoPanel {...spec} /></div>
  if (spec.type === 'table') return <div style={span}><div className="card"><DataTable {...spec} onSelect={onSelect} /></div></div>
  if (spec.type === 'producttable') return <div style={span}><ProductTable {...spec} /></div>
  if (spec.type === 'campaignTree') return <div style={span}><CampaignTree {...spec} /></div>
  if (spec.type === 'insight') return <div style={span}><Insight {...spec} /></div>
  if (spec.type === 'savedFunnels') return <div style={span}><SavedFunnels /></div>
  if (spec.type === 'explore') return <div style={span}><Explore /></div>
  if (spec.type === 'kpiTargets') return <div style={span}><KpiTargets /></div>
  if (spec.type === 'addClient') return <div style={span}><AddClient /></div>
  if (spec.type === 'alertsManager') return <div style={span}><AlertsManager /></div>
  if (spec.type === 'teamManager') return <div style={span}><TeamManager /></div>
  if (spec.type === 'branding') return <div style={span}><Branding /></div>
  if (spec.type === 'builder') return <div style={span}><FunnelBuilder steps={spec.steps} /></div>
  if (spec.type === 'leak') return <div style={span}><LeakCard {...spec} /></div>
  if (spec.type === 'kbreak') return <div style={span}><KBreak {...spec} /></div>
  if (spec.type === 'connections') return <div style={span}><Connections /></div>
  if (spec.type === 'note') return <div style={span}><Note {...spec} /></div>
  if (spec.type === 'healthScore') return <div style={span}><HealthScore {...spec} /></div>
  if (spec.type === 'leaderboard') return <div style={span}><Leaderboard {...spec} /></div>
  if (spec.type === 'changelog') return <div style={span}><Changelog {...spec} /></div>
  if (spec.type === 'trackingHealth') return <div style={span}><TrackingHealth {...spec} /></div>
  if (spec.type === 'signatureFunnel') return <div style={span}><SignatureFunnel {...spec} /></div>
  if (spec.type === 'perfFunnel') return <div style={span}><PerformanceFunnel {...spec} /></div>
  return null
}
