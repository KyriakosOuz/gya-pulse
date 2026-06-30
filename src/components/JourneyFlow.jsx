import { useState } from 'react'

const FONT = 'Montserrat, "Noto Sans", sans-serif'
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const fmt = n => (typeof n === 'number' ? n.toLocaleString() : n)

/* Data-driven conversion journey.
 * - Node = thin progress ring; PURPLE arc = % that continues to the next stage
 *   (centred toward it, so the flow grows out of it).
 * - Ribbon WIDTH ∝ that conversion %.
 * - Inner text is padded inside the circle (never overflows); the SVG fits its
 *   own content height and fills the container width, so it stays readable.
 *
 * Props: stages:[{label,value}] (2–6) · stats?:[{label,value}] */

const DEFAULT_STAGES = [
  { label: 'Site Visit', value: 186811 },
  { label: 'Blog View', value: 47266 },
  { label: 'Subscribe', value: 25061 },
  { label: 'Purchase Product', value: 509 },
]
const VB_W = 1000, MIN_R = 44, MAX_R = 86, TIP_PAD = 96

function layout(stages) {
  const n = stages.length
  const vMax = Math.max(...stages.map(s => s.value))
  const leftM = 132, rightM = 112
  const span = n > 1 ? (VB_W - leftM - rightM) / (n - 1) : 0
  const baseTop = 250, dip = 188
  const nodes = stages.map((s, i) => {
    const r = MIN_R + (MAX_R - MIN_R) * Math.sqrt(s.value / vMax)
    const isDip = i % 2 === 1 && i !== n - 1
    return { ...s, idx: i, id: String.fromCharCode(65 + i), x: leftM + i * span, y: baseTop + (isDip ? dip : 0), r }
  })
  return nodes.map((nd, i) => {
    const next = nodes[i + 1]
    const cont = next ? next.value / nd.value : 1
    const ang = next ? Math.atan2(next.y - nd.y, next.x - nd.x) : -Math.PI / 2
    return { ...nd, cont, contAngle: ang, pctOfTotal: nd.value / nodes[0].value, last: i === n - 1 }
  })
}

const ringWOf = r => Math.max(8, r * 0.12)
// anchor the endpoint at the ring's INNER edge (a full ring-width under the node, not just the
// centre-line) so the ribbon tucks well behind the circle with no seam
const attachR = node => node.r - ringWOf(node.r)

/* slim flowing band; width ∝ conversion %. Each end tucks under the ring where a matching purple
 * ring-arc sits on top — so the flow reads as a continuous purple stream from circle to circle. */
function ribbonPath(s, t, w) {
  const a = Math.atan2(t.y - s.y, t.x - s.x), ca = Math.cos(a), sa = Math.sin(a)
  const ars = attachR(s), art = attachR(t)
  const sx = s.x + ars * ca, sy = s.y + ars * sa
  const tx = t.x - art * ca, ty = t.y - art * sa
  // offset the width PERPENDICULAR to the radius (along the tangent) so each end cap sits flush
  // along the circle edge instead of a fixed vertical line that seams on diagonal links
  const ox = -sa * (w / 2), oy = ca * (w / 2)
  const h = Math.max(46, Math.abs(tx - sx) * 0.5)
  const n = v => v.toFixed(1)
  return `M ${n(sx + ox)} ${n(sy + oy)}
          C ${n(sx + ox + h)} ${n(sy + oy)}, ${n(tx + ox - h)} ${n(ty + oy)}, ${n(tx + ox)} ${n(ty + oy)}
          L ${n(tx - ox)} ${n(ty - oy)}
          C ${n(tx - ox - h)} ${n(ty - oy)}, ${n(sx - ox + h)} ${n(sy - oy)}, ${n(sx - ox)} ${n(sy - oy)} Z`
}

function Ring({ node, conns, active, onEnter, onLeave }) {
  const { x, y, r } = node
  const ringW = ringWOf(r)
  const rr = r - ringW / 2
  const innerR = rr - ringW / 2 - 4
  const circ = 2 * Math.PI * rr
  const numStr = fmt(node.value)
  // font limited by BOTH the circle height and the number's width, leaving ~20% padding
  const maxByWidth = (innerR * 2 * 0.80) / (numStr.length * 0.60)
  const vfont = clamp(Math.min(innerR * 0.5, maxByWidth), 11, 30)
  const showBadge = innerR >= 36
  const showUsers = innerR >= 28
  const badgeR = clamp(innerR * 0.26, 8, 13)
  const ufont = clamp(vfont * 0.42, 9, 12)
  const numY = showBadge ? innerR * 0.16 : showUsers ? -innerR * 0.02 : vfont * 0.34
  const usersY = numY + vfont * 0.36 + ufont
  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, cursor: 'pointer' }}
      filter={active ? 'url(#jf-glow)' : 'url(#jf-shadow)'} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <circle r={rr} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={ringW} />
      {/* purple arc per connection, SIZED BY THE CONVERSION % and centred on the path so the
          ribbon flows out of its middle — purple area scales with the percentage. */}
      {conns.map((cn, k) => {
        const f = clamp(cn.frac, 0.04, 1)
        const rotDeg = (cn.dir * 180) / Math.PI - f * 180
        return <circle key={k} r={rr} fill="none" stroke="url(#jf-ring)" strokeWidth={ringW} strokeLinecap="round"
          strokeDasharray={`${(f * circ).toFixed(1)} ${circ.toFixed(1)}`} transform={`rotate(${rotDeg.toFixed(1)})`} />
      })}
      <circle r={innerR} fill="#fff" />
      {showBadge && <>
        <circle cy={-innerR * 0.5} r={badgeR} fill="#8A93A6" />
        <text y={-innerR * 0.5 + badgeR * 0.34} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={badgeR * 1.05} fill="#fff">{node.id}</text>
      </>}
      <text y={numY} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={vfont} fill="#1C2333" style={{ fontFeatureSettings: '"tnum" 1' }}>{numStr}</text>
      {showUsers && <text y={usersY} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={ufont} fill="#8A93A6">users</text>}
    </g>
  )
}

function Tooltip({ node, nextLabel }) {
  const title = node.label
  const valLine = `${fmt(node.value)} users`
  const det1 = node.last ? `${(node.pctOfTotal * 100).toFixed(2)}% of entry` : `${(node.cont * 100).toFixed(1)}% continue → ${nextLabel}`
  const det2 = node.last ? 'final destination' : `${((1 - node.cont) * 100).toFixed(1)}% drop-off`
  const estW = (s, px) => s.length * px * 0.58
  const w = clamp(Math.max(estW(title, 13), estW(valLine, 13.5), estW(det1, 10.5), estW(det2, 10.5)) + 28, 132, 340)
  const h = 80
  const x = clamp(node.x - w / 2, 6, VB_W - w - 6)
  const y = node.y - node.r - h - 12
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={x} y={y} width={w} height={h} rx={11} fill="#0B1628" stroke="rgba(149,138,235,.6)" strokeWidth={1} filter="url(#jf-glow)" />
      <text x={x + 14} y={y + 21} fontFamily={FONT} fontWeight={700} fontSize={13} fill="#fff">{title}</text>
      <text x={x + 14} y={y + 40} fontFamily={FONT} fontWeight={800} fontSize={14} fill="#fff" style={{ fontFeatureSettings: '"tnum" 1' }}>{valLine}</text>
      <text x={x + 14} y={y + 58} fontFamily={FONT} fontWeight={600} fontSize={10.5} fill="#9C82F2">{det1}</text>
      <text x={x + 14} y={y + 72} fontFamily={FONT} fontWeight={600} fontSize={10.5} fill="#8A93A6">{det2}</text>
    </g>
  )
}

export default function JourneyFlow({ stages = DEFAULT_STAGES, stats }) {
  const [hov, setHov] = useState(null)
  const nodes = layout(stages)
  const links = nodes.slice(0, -1).map((s, i) => {
    const minR = Math.min(s.r, nodes[i + 1].r)
    const w = Math.min(minR, clamp(s.cont, 0.05, 1) * minR * 1.25)
    return { s, t: nodes[i + 1], pct: (Math.round(s.cont * 1000) / 10) + '%', w }
  })
  // viewBox fits the content (+ room above for tooltips) so nothing is letterboxed/shrunk
  const vbTop = Math.min(...nodes.map(n => n.y - n.r)) - TIP_PAD
  const vbBot = Math.max(...nodes.map(n => n.y + n.r)) + 34
  const vbH = vbBot - vbTop

  const derived = [
    { label: 'Conversion Rate', value: (Math.round((nodes[nodes.length - 1].value / nodes[0].value) * 10000) / 100).toFixed(2) + '%' },
    { label: 'Entry', value: fmt(nodes[0].value) },
    { label: 'Converted', value: fmt(nodes[nodes.length - 1].value) },
  ]
  const statList = stats && stats.length ? stats : derived
  const hoverNode = hov?.type === 'node' ? nodes[hov.i] : null

  return (
    <div>
      <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', marginBottom: 8 }}>
        {statList.map((s, i) => (
          <div key={i} style={{ paddingRight: 26, borderRight: i < statList.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <div style={{ color: 'var(--muted)', fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: 'var(--white)', marginTop: 3, fontFeatureSettings: '"tnum" 1' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <svg viewBox={`0 ${vbTop.toFixed(0)} ${VB_W} ${vbH.toFixed(0)}`}
        style={{ display: 'block', width: '100%', height: 'auto' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* ribbon ends match the ring arc colour (#A78BF5) so the flow blends out of the circle */}
          <linearGradient id="jf-flow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A78BF5" stopOpacity="0.92" /><stop offset="50%" stopColor="#7B5CD9" stopOpacity="0.85" /><stop offset="100%" stopColor="#A78BF5" stopOpacity="0.92" /></linearGradient>
          <linearGradient id="jf-flow-hot" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#C4B0FF" stopOpacity="1" /><stop offset="50%" stopColor="#9B82F0" stopOpacity="0.95" /><stop offset="100%" stopColor="#C4B0FF" stopOpacity="1" /></linearGradient>
          <linearGradient id="jf-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#A78BF5" /><stop offset="100%" stopColor="#6B4FD0" /></linearGradient>
          <filter id="jf-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2" /></filter>
          <filter id="jf-glow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#9B82F0" floodOpacity="0.8" /></filter>
        </defs>

        {/* a node's outgoing ribbon is link i; hovering the node (its purple arc) lights that path too */}
        {links.map((l, i) => {
          const activeLink = hov?.type === 'link' ? hov.i : hov?.type === 'node' ? hov.i : -1
          const mx = (l.s.x + l.t.x) / 2, my = (l.s.y + l.t.y) / 2
          const on = activeLink === i
          const dim = activeLink >= 0 && activeLink !== i
          return (
            <g key={i} onMouseEnter={() => setHov({ type: 'link', i })} onMouseLeave={() => setHov(null)} style={{ cursor: 'pointer' }}>
              <path d={ribbonPath(l.s, l.t, l.w)} fill={on ? 'url(#jf-flow-hot)' : 'url(#jf-flow)'} opacity={dim ? 0.4 : 1} style={{ transition: 'opacity .18s' }} />
              <g transform={`translate(${mx},${my})`}>
                <rect x={-30} y={on ? -14 : -12} width={60} height={on ? 24 : 20} rx={11} fill="#0B1628" opacity={0.82} stroke={on ? 'rgba(155,130,240,.7)' : 'transparent'} />
                <text textAnchor="middle" y={on ? 4 : 3} fontFamily={FONT} fontWeight={700} fontSize={on ? 14 : 12.5} fill="#E7ECF6">{l.pct}</text>
              </g>
            </g>
          )
        })}

        {nodes.map((n, i) => {
          const conns = []
          if (i > 0) conns.push({ dir: Math.atan2(nodes[i - 1].y - n.y, nodes[i - 1].x - n.x), frac: nodes[i - 1].cont })
          if (i < nodes.length - 1) conns.push({ dir: Math.atan2(nodes[i + 1].y - n.y, nodes[i + 1].x - n.x), frac: nodes[i].cont })
          return (
            <Ring key={n.id} node={n} conns={conns} active={hov?.type === 'node' && hov.i === i}
              onEnter={() => setHov({ type: 'node', i })} onLeave={() => setHov(null)} />
          )
        })}

        {nodes.map(n => (
          <text key={'lbl' + n.id} x={n.x} y={n.y + n.r + 26} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={14} fill="var(--text)">{n.label}</text>
        ))}

        {hoverNode && <Tooltip node={hoverNode} nextLabel={nodes[hoverNode.idx + 1]?.label || ''} />}
      </svg>
    </div>
  )
}
