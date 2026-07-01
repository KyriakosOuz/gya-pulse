import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

// Apply a smooth opening animation (grow / draw / sweep) with an optional
// per-widget stagger delay. Series-level animationDelay (e.g. bars) is preserved.
function animated(option, delay = 0) {
  if (reduceMotion()) return { ...option, animation: false }
  return {
    animation: true,
    animationDuration: 900,
    animationEasing: 'cubicOut',
    animationDelay: delay,
    animationDurationUpdate: 400,
    animationEasingUpdate: 'cubicOut',
    ...option,
  }
}

export default function EChart({ option, height = 240, delay = 0, onSelect, renderer = 'svg' }) {
  const ref = useRef(null)
  const inst = useRef(null)
  const cb = useRef(onSelect)
  cb.current = onSelect

  useEffect(() => {
    if (!ref.current) return
    inst.current = echarts.init(ref.current, null, { renderer })
    inst.current.setOption(animated(option, delay))
    inst.current.on('click', p => { if (cb.current && p && p.name) cb.current(p.name) })
    const ro = new ResizeObserver(() => inst.current && inst.current.resize())
    ro.observe(ref.current)
    let cancelled = false
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!cancelled && inst.current) inst.current.resize() })
    }
    return () => { cancelled = true; ro.disconnect(); inst.current && inst.current.dispose() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (inst.current) inst.current.setOption(animated(option, delay), true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option])

  return <div ref={ref} className="chart" style={{ height, cursor: onSelect ? 'pointer' : 'default' }} />
}
