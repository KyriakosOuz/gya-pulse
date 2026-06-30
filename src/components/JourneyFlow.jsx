import * as d3 from 'd3'

const FONT = 'Montserrat, "Noto Sans", sans-serif'

/* Data-driven node-link conversion journey: donut-ring nodes joined by smooth,
 * tapered flow ribbons with step conversion %. Pure SVG (viewBox-scaled).
 *
 * Props:
 *   stages: [{ label, value }]            (2–6 stages; node size scales by value)
 *   stats:  { conversionRate, conversionTime, paid }   (optional; auto-derived)
 *   segments: [{ v, c }]                  (optional ring channel-mix)
 */

const DEFAULT_STAGES = [
  { label: 'Site Visit', value: 186811 },
  { label: 'Blog View', value: 47266 },
  { label: 'Subscribe', value: 25061 },
  { label: 'Purchase Product', value: 509 },
]
const DEFAULT_SEGMENTS = [
  { v: 60, c: '#7C5CD6' }, { v: 30, c: '#3FC09E' },
  { v: 4, c: '#F2A65A' }, { v: 3, c: '#2B8FEA' }, { v: 3, c: '#F2D45A' },
]
const VB_W = 1000, VB_H = 600, MIN_R = 40, MAX_R = 86

function layout(stages) {
  const n = stages.length
  const vMax = Math.max(...stages.map(s => s.value))
  const leftM = 130, rightM = 110
  const span = n > 1 ? (VB_W - leftM - rightM) / (n - 1) : 0
  const baseTop = 252, dip = 196
  return stages.map((s, i) => {
    const r = MIN_R + (MAX_R - MIN_R) * Math.sqrt(s.value / vMax)
    const isDip = i % 2 === 1 && i !== n - 1
    return { ...s, id: String.fromCharCode(65 + i), x: leftM + i * span, y: baseTop + (isDip ? dip : 0), r }
  })
}

function Ring({ node, big, segments }) {
  const { x, y, r } = node
  const ringW = Math.max(11, r * 0.22)
  const innerR = r - ringW - 4
  const pie = d3.pie().sort(null).startAngle(-0.12 * Math.PI).value(d => d.v)(segments)
  const arc = d3.arc().innerRadius(r - ringW).outerRadius(r).padAngle(0.022).cornerRadius(ringW / 2)
  const vfont = big ? 30 : r > 52 ? 23 : 17
  return (
    <g transform={`translate(${x},${y})`} filter="url(#jf-shadow)">
      {big && <circle r={r + 5} fill="none" stroke="#F2A65A" strokeWidth={3} strokeLinecap="round" opacity={0.92} />}
      {pie.map((p, i) => <path key={i} d={arc(p)} fill={segments[i].c} />)}
      <circle r={innerR + 3} fill="#0E1C35" opacity={0.6} />
      <circle r={innerR} fill="#fff" />
      <circle cy={-innerR * 0.52} r={big ? 14 : 12} fill="#8A93A6" />
      <text y={-innerR * 0.52 + 4} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={big ? 14 : 12} fill="#fff">{node.id}</text>
      <text y={vfont * 0.34} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={vfont} fill="#1C2333" style={{ fontFeatureSettings: '"tnum" 1' }}>{node.value.toLocaleString()}</text>
      <text y={vfont * 0.34 + 17} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={big ? 12 : 10.5} fill="#8A93A6">users</text>
    </g>
  )
}

/* smooth tapered ribbon: width applied vertically, HORIZONTAL bezier handles
 * so vertically-offset nodes get a clean S-curve instead of a flat bar. */
function ribbonPath(s, t, ws, wt) {
  const ang = Math.atan2(t.y - s.y, t.x - s.x)
  const sx = s.x + s.r * Math.cos(ang), sy = s.y + s.r * Math.sin(ang)
  const tx = t.x - t.r * Math.cos(ang), ty = t.y - t.r * Math.sin(ang)
  const h = Math.max(40, Math.abs(tx - sx) * 0.55)
  const sTop = sy - ws / 2, sBot = sy + ws / 2
  const tTop = ty - wt / 2, tBot = ty + wt / 2
  return `M ${sx} ${sTop} C ${sx + h} ${sTop}, ${tx - h} ${tTop}, ${tx} ${tTop}
          L ${tx} ${tBot} C ${tx - h} ${tBot}, ${sx + h} ${sBot}, ${sx} ${sBot} Z`
}

function Stat({ label, value, unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingRight: 18, borderRight: '1px solid var(--line)' }}>
      <span style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.15, maxWidth: 84, textAlign: 'right' }}>{label}</span>
      <b style={{ fontFamily: FONT, fontSize: 24, color: 'var(--white)', fontFeatureSettings: '"tnum" 1' }}>{value}</b>
      <span style={{ color: 'var(--muted)', fontSize: 11 }}>{unit}</span>
    </div>
  )
}

export default function JourneyFlow({ stages = DEFAULT_STAGES, stats, segments = DEFAULT_SEGMENTS }) {
  const nodes = layout(stages)
  const links = nodes.slice(0, -1).map((s, i) => ({
    s, t: nodes[i + 1],
    pct: (Math.round((nodes[i + 1].value / s.value) * 10000) / 100) + '%',
  }))
  const st = {
    conversionRate: (Math.round((nodes[nodes.length - 1].value / nodes[0].value) * 10000) / 100).toFixed(2),
    conversionTime: '6.59', paid: '0.27', ...stats,
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 6 }}>
        <Stat label="Total Conversion Rate" value={st.conversionRate} unit="%" />
        <Stat label="Average Conversion Time" value={st.conversionTime} unit="days" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#7C5CD6', display: 'inline-block' }} />
          <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>Paid</span>
          <b style={{ fontFamily: FONT, fontSize: 20, color: 'var(--white)' }}>{st.paid}</b>
          <span style={{ color: 'var(--muted)', fontSize: 11 }}>%</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" style={{ height: 470, display: 'block' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="jf-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9B82F0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6B4FD0" stopOpacity="0.5" />
          </linearGradient>
          <filter id="jf-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.38" />
          </filter>
        </defs>

        {links.map((l, i) => {
          const ws = l.t.r * 1.35, wt = l.t.r * 1.15
          const mx = (l.s.x + l.t.x) / 2, my = (l.s.y + l.t.y) / 2
          return (
            <g key={i}>
              <path d={ribbonPath(l.s, l.t, ws, wt)} fill="url(#jf-flow)" />
              <g transform={`translate(${mx},${my})`}>
                <rect x={-32} y={-13} width={64} height={22} rx={11} fill="#0B1628" opacity={0.72} />
                <text textAnchor="middle" y={3} fontFamily={FONT} fontWeight={700} fontSize={14} fill="#E7ECF6">{l.pct}</text>
              </g>
            </g>
          )
        })}

        {nodes.map((n, i) => <Ring key={n.id} node={n} big={i === 0} segments={segments} />)}

        {nodes.map(n => (
          <text key={'lbl' + n.id} x={n.x} y={n.y + n.r + 28} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={14} fill="var(--text)">{n.label}</text>
        ))}
      </svg>
    </div>
  )
}
