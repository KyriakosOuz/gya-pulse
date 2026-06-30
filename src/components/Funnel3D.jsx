const FONT = 'Montserrat, "Noto Sans", sans-serif'

/* Data-driven 3D segmented funnel with perspective caps + glow, flanked by
 * descriptive label cards and icons. Each segment shows its value + % of top.
 *
 * Props: stages: [{ key, value, color?, light?, icon?, left?, right? }]
 */

const DEFAULT_STAGES = [
  { key: 'Reach', value: 120000, color: '#4B2FC4', light: '#6B4FE0', icon: 'campaign', left: 'Attract the right audience through targeted campaigns and digital channels.', right: 'Increase brand visibility through data-driven campaigns and audience segmentation.' },
  { key: 'Act', value: 38400, color: '#5A3FD6', light: '#7E63EC', icon: 'play_arrow', left: 'Drive meaningful interactions and capture qualified leads.', right: 'Track user behavior and encourage interactions across key touchpoints.' },
  { key: 'Convert', value: 9600, color: '#7C5CE6', light: '#9B82F2', icon: 'shopping_cart', left: 'Turn prospects into paying customers and reduce buying friction.', right: 'Optimize the customer journey using insights to improve conversion rates.' },
  { key: 'Engage', value: 2840, color: '#A38FF0', light: '#C4B6F7', icon: 'star', left: 'Strengthen relationships and deliver ongoing personalized value.', right: 'Leverage analytics and personalization to strengthen loyalty and lifetime value.' },
]
const PALETTE = [['#4B2FC4', '#6B4FE0'], ['#5A3FD6', '#7E63EC'], ['#7C5CE6', '#9B82F2'], ['#A38FF0', '#C4B6F7'], ['#B9A6F5', '#D6CBFA']]

const VW = 400, TOP_W = 320, BOT_W = 86, Y0 = 34, SEG_H = 92, GAP = 12, CAP = 11

function Segment({ i, s, n, pct }) {
  const total = n * (SEG_H + GAP)
  const widthAt = y => TOP_W - (TOP_W - BOT_W) * ((y - Y0) / total)
  const y0 = Y0 + i * (SEG_H + GAP), y1 = y0 + SEG_H
  const wt = widthAt(y0), wb = widthAt(y1), cx = VW / 2
  const body = `M ${cx - wt / 2} ${y0} L ${cx + wt / 2} ${y0} L ${cx + wb / 2} ${y1} L ${cx - wb / 2} ${y1} Z`
  const dark = i >= n - 1
  const tx = dark ? '#2A2350' : 'rgba(255,255,255,.95)'
  const sub = dark ? 'rgba(42,35,80,.85)' : 'rgba(255,255,255,.78)'
  return (
    <g filter="url(#f3d-glow)">
      <path d={body} fill={`url(#f3d-grad-${i})`} stroke="rgba(180,162,255,.55)" strokeWidth="1.5" />
      <ellipse cx={cx} cy={y1} rx={wb / 2} ry={CAP * 0.7} fill="rgba(0,0,0,.28)" />
      <ellipse cx={cx} cy={y0} rx={wt / 2} ry={CAP} fill={s.light} stroke="rgba(196,182,255,.7)" strokeWidth="1.2" />
      <text x={cx} y={y0 + SEG_H / 2 - 5} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={16} fill={tx}>{s.key}</text>
      <text x={cx} y={y0 + SEG_H / 2 + 16} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={17} fill={tx} style={{ fontFeatureSettings: '"tnum" 1' }}>{s.value.toLocaleString()}</text>
      <text x={cx} y={y0 + SEG_H / 2 + 31} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={10.5} fill={sub}>{pct}</text>
    </g>
  )
}

export default function Funnel3D({ stages = DEFAULT_STAGES }) {
  const n = stages.length
  const top = stages[0]?.value || 1
  const data = stages.map((s, i) => ({
    ...s,
    color: s.color || PALETTE[Math.min(i, PALETTE.length - 1)][0],
    light: s.light || PALETTE[Math.min(i, PALETTE.length - 1)][1],
    pct: (Math.round((s.value / top) * 1000) / 10) + '%',
  }))
  const totalH = Y0 + n * (SEG_H + GAP) + 20
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px 1fr', gap: 14, alignItems: 'center' }}>
      <div>{data.map((s, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <span style={{ display: 'inline-block', background: s.color, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 13, padding: '4px 12px', borderRadius: 4, marginBottom: 5 }}>{s.key}</span>
          <div style={{ color: 'var(--muted)', fontSize: 11.5, lineHeight: 1.45, maxWidth: 230 }}>{s.left}</div>
        </div>
      ))}</div>

      <svg viewBox={`0 0 ${VW} ${totalH}`} width="100%" style={{ display: 'block' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="f3d-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#7C5CE6" floodOpacity="0.55" />
          </filter>
          {data.map((s, i) => (
            <linearGradient key={i} id={`f3d-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.light} />
              <stop offset="100%" stopColor={s.color} />
            </linearGradient>
          ))}
        </defs>
        {data.map((s, i) => <Segment key={i} i={i} s={s} n={n} pct={s.pct} />)}
      </svg>

      <div>{data.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', marginBottom: 18 }}>
          <div style={{ color: 'var(--muted)', fontSize: 11.5, lineHeight: 1.45, maxWidth: 200, textAlign: 'right' }}>{s.right}</div>
          <span style={{ flex: '0 0 auto', width: 40, height: 40, borderRadius: 8, background: s.color, display: 'grid', placeItems: 'center' }}>
            <span className="ms" style={{ color: '#fff', fontSize: 20 }}>{s.icon}</span>
          </span>
        </div>
      ))}</div>
    </div>
  )
}
