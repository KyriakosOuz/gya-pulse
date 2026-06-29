import EChart from './EChart.jsx'
import GeoMap from './GeoMap.jsx'
import { lineOpt, barOpt, donutOpt, funnelOpt, sankeyOpt, heatOpt, scatterOpt, C } from '../lib/charts.js'

function Sparkline({ data, color }) {
  const w = 120, h = 30, min = Math.min(...data), max = Math.max(...data), r = (max - min) || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1) * w).toFixed(1)},${(h - ((v - min) / r) * (h - 4) - 2).toFixed(1)}`).join(' ')
  return <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function KpiCard({ l, v, delta, up, good, sp }) {
  const color = good ? 'var(--green)' : good === false ? 'var(--red)' : 'var(--white)'
  const tag = good ? 'good' : good === false ? 'bad' : 'neutral'
  const tagText = good ? 'On target' : good === false ? 'Off target' : '—'
  return (
    <div className="card kpi">
      <div className="klabel">{l}</div>
      <div className="kval num" style={{ color }}>{v}</div>
      <div className="krow">
        <span className={`tag ${tag}`}>{tagText}</span>
        {delta && <span className={`delta ${up ? 'up' : 'down'}`}>{delta}</span>}
      </div>
      {sp && <Sparkline data={sp} color={good === false ? C.red : C.green} />}
    </div>
  )
}

function ChartCard({ title, src, kind, height, ...rest }) {
  let opt
  if (kind === 'line') opt = lineOpt(rest)
  else if (kind === 'bar') opt = barOpt(rest)
  else if (kind === 'hbar') opt = barOpt({ ...rest, horizontal: true })
  else if (kind === 'donut') opt = donutOpt(rest)
  else if (kind === 'funnel') opt = funnelOpt(rest)
  else if (kind === 'sankey') opt = sankeyOpt(rest)
  else if (kind === 'heat') opt = heatOpt(rest)
  else if (kind === 'scatter') opt = scatterOpt(rest)
  return (
    <div className="card">
      <div className="cardhead"><h3>{title}</h3>{src && <span className="tag-src">{src}</span>}</div>
      {kind === 'donut' && rest.legend
        ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 130 }}><EChart option={opt} height={height || 150} /></div>
            <div style={{ flex: 1, fontSize: 12.5 }}>
              {rest.data.map(d => <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', margin: '9px 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i style={{ width: 9, height: 9, borderRadius: 3, background: d.color, display: 'inline-block' }} />{d.name}</span>
                <b style={{ color: '#fff' }}>{d.value}%</b></div>)}
            </div>
          </div>
        : <EChart option={opt} height={height || 220} />}
    </div>
  )
}

function DataTable({ title, columns, rows, src }) {
  return (
    <div>
      {title && <div className="cardhead" style={{ marginBottom: 10 }}><h3>{title}</h3>{src && <span className="tag-src">{src}</span>}</div>}
      <table>
        <thead><tr>{columns.map(c => <th key={c.k} className={c.r ? 'r' : ''}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{columns.map(c => {
              const val = row[c.k]
              if (c.k === 'name') return <td key={c.k}><span className="cname">{val}</span></td>
              if (c.k === 'status') return <td key={c.k}><span className={`status ${val.toLowerCase()}`}>{val}</span></td>
              const cls = row[c.k + '_s']
              return <td key={c.k} className={c.r ? 'r' : ''}><span className={cls ? `v ${cls}` : (c.strong ? 'v plain' : 'muted')}>{val}</span></td>
            })}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Pills({ items }) {
  return <div className="stat-pills">{items.map((p, i) =>
    <div className="stat-pill" key={i}><span className="ms" style={{ color: p.color || 'var(--blue2)' }}>{p.icon}</span><b>{p.value}</b><span>{p.label}</span></div>)}</div>
}

function FunnelBuilder({ steps }) {
  return (
    <div className="card">
      <div className="builder">
        {steps.map((s, i) => (<span key={i} style={{ display: 'contents' }}>
          <div className="step-chip"><span className="n">{i + 1}</span> {s} <span className="ms">close</span></div>
          {i < steps.length - 1 && <span className="arrow">→</span>}
        </span>))}
        <button className="add-step">+ Add step</button>
        <div style={{ marginLeft: 'auto' }} className="tabset"><button className="active">Open funnel</button><button>Closed</button></div>
      </div>
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

const CONNECTORS = [
  { name: 'Google', sub: 'Analytics (GA4) · Google Ads · Search Console', icon: 'google', bg: 'rgba(43,143,234,.16)', color: '#5AAFF2', done: true },
  { name: 'Meta', sub: 'Facebook & Instagram Ads', icon: 'campaign', bg: 'rgba(34,255,136,.12)', color: '#22FF88', done: true },
]
function Connections() {
  return (
    <div className="card">
      <div className="cardhead"><h3>Connected data sources</h3></div>
      <div style={{ display: 'grid', gap: 12 }}>
        {CONNECTORS.map(c => (
          <div className="connect" key={c.name}>
            <div className="cicon" style={{ background: c.bg }}><span className="ms" style={{ color: c.color }}>{c.icon}</span></div>
            <div><b>Connect {c.name}</b><small>{c.sub}</small></div>
            <button className={`btn-connect ${c.done ? 'done' : 'go'}`}>{c.done ? '✓ Connected' : 'Connect'}</button>
          </div>
        ))}
      </div>
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

export default function Widget({ spec }) {
  const span = { gridColumn: `span ${spec.w || 12}` }
  if (spec.type === 'kpis')
    return <div style={{ ...span, display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(150px,1fr))`, gap: 14 }}>{spec.items.map((k, i) => <KpiCard key={i} {...k} />)}</div>
  if (spec.type === 'pills') return <div style={span}><Pills items={spec.items} /></div>
  if (spec.type === 'chart') return <div style={span}><ChartCard {...spec} /></div>
  if (spec.type === 'geo') return <div style={span}><div className="card"><div className="cardhead"><h3>{spec.title}</h3><span className="tag-src">Google GeoChart</span></div><GeoMap data={spec.data} height={spec.height || 206} /></div></div>
  if (spec.type === 'table') return <div style={span}><div className="card"><DataTable {...spec} /></div></div>
  if (spec.type === 'builder') return <div style={span}><FunnelBuilder steps={spec.steps} /></div>
  if (spec.type === 'leak') return <div style={span}><LeakCard {...spec} /></div>
  if (spec.type === 'kbreak') return <div style={span}><KBreak {...spec} /></div>
  if (spec.type === 'connections') return <div style={span}><Connections /></div>
  if (spec.type === 'note') return <div style={span}><Note {...spec} /></div>
  return null
}
