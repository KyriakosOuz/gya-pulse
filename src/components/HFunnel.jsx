import { useEffect, useRef, useState } from 'react'
import { ResponsiveFunnel } from '@nivo/funnel'
import { nivoTheme, FUNNEL_COLORS } from '../lib/nivoTheme.js'
import { C } from '../lib/charts.js'

const FONT = 'Montserrat, "Noto Sans", sans-serif'
const COLORS = FUNNEL_COLORS // GYA brand: blue → teal → green

function useWidth() {
  const ref = useRef(null)
  const [w, setW] = useState(320)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

const fmtNum = v => (typeof v === 'number' ? v.toLocaleString() : v)
const pctOf = (v, base) => (Math.round((v / base) * 1000) / 10) + '%'

/**
 * Smooth horizontal funnel with top stage labels (value / name / %) and
 * thin separators — the reference "marketing funnel" look.
 * @param steps  [{ name, value, p? }]  (p optional; computed from first step)
 */
export default function HFunnel({ steps = [], height = 300 }) {
  const [ref, w] = useWidth()
  const N = steps.length
  const ml = 8, mr = 8
  const plot = Math.max(0, w - ml - mr)
  const bandLeft = i => ml + i * (plot / Math.max(1, N))
  const base = steps[0]?.value || 1
  const data = steps.map(s => ({ id: s.name, value: s.value }))
  const colors = steps.map((_, i) => COLORS[Math.min(i, COLORS.length - 1)])

  return (
    <div ref={ref} style={{ position: 'relative', height }}>
      <ResponsiveFunnel
        data={data}
        direction="horizontal"
        interpolation="smooth"
        shapeBlending={0.7}
        spacing={0}
        margin={{ top: 92, right: mr, bottom: 16, left: ml }}
        theme={nivoTheme}
        colors={colors}
        fillOpacity={0.92}
        borderWidth={0}
        enableLabel={false}
        beforeSeparatorLength={0}
        afterSeparatorLength={0}
        currentPartSizeExtension={0}
        currentBorderWidth={0}
        motionConfig="gentle"
        valueFormat={fmtNum}
      />
      {steps.map((_, i) => i > 0 && (
        <div key={'sep' + i} style={{
          position: 'absolute', left: bandLeft(i), top: 70, bottom: 14,
          width: 1, background: 'rgba(90,175,242,.35)',
        }} />
      ))}
      {steps.map((s, i) => (
        <div key={s.name + i} style={{ position: 'absolute', left: bandLeft(i) + (i ? 12 : 0), top: 14, lineHeight: 1.25, maxWidth: plot / N - 14 }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: '#fff', fontFeatureSettings: '"tnum" 1' }}>{fmtNum(s.value)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 12, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
          {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 12, color: C.blue2 }}>{s.p || pctOf(s.value, base)}</div>}
        </div>
      ))}
    </div>
  )
}
